import NextAuth, { type NextAuthConfig } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./database/drizzle";
import { users } from "./database/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";

// <-- NEW: DrizzleAdapter >> npm install @auth/drizzle-adapter drizzle-orm --legacy-peer-deps
import { DrizzleAdapter } from "@auth/drizzle-adapter";

type ProviderEnv = {
  clientId: string;
  clientSecret: string;
};

const readProviderEnv = (idKey: string, secretKey: string, provider: string): ProviderEnv => {
  const altIdKey = `AUTH_${idKey}`;
  const altSecretKey = `AUTH_${secretKey}`;

  const clientId = process.env[idKey] ?? process.env[altIdKey];
  const clientSecret = process.env[secretKey] ?? process.env[altSecretKey];

  if (!clientId || !clientSecret) {
    console.warn(
      `[auth] ${provider} provider is disabled. Missing environment variables: ${
        !clientId && !clientSecret
          ? `${idKey}, ${secretKey}`
          : !clientId
          ? idKey
          : secretKey
      }`
    );
    return { clientId: "", clientSecret: "" };
  }

  return { clientId, clientSecret };
};

const google = readProviderEnv("GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "Google");
const facebook = readProviderEnv("FACEBOOK_CLIENT_ID", "FACEBOOK_CLIENT_SECRET", "Facebook");

export const authOptions: NextAuthConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET,

  // <-- NEW: attach the DrizzleAdapter (uses your `db` instance)
  adapter: DrizzleAdapter(db),

  providers: [
    ...(google.clientId && google.clientSecret
      ? [
          GoogleProvider({
            clientId: google.clientId,
            clientSecret: google.clientSecret,
            authorization: {
              params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code",
                scope: "openid email profile",
              },
            },
          }),
        ]
      : []),
    ...(facebook.clientId && facebook.clientSecret
      ? [
          FacebookProvider({
            clientId: facebook.clientId,
            clientSecret: facebook.clientSecret,
          }),
        ]
      : []),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const userRow = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .limit(1);

        if (userRow.length === 0) return null;

        const user = userRow[0];

        // OAuth-only placeholder password blocking credentials login
        if (!user.password || user.password === "-" || user.password === "OAUTH") {
          return null;
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.fullName,
          role: user.role,
          status: user.status,
          phoneNumber: user.phoneNumber,
        } as any;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/",
  },

  callbacks: {
    // When user signs in with OAuth, create DB user if missing (keeps your custom users table in sync)
    async signIn({ user, account, profile }) {
      try {
        console.log("auth called with", {
          user: user?.email,
          provider: account?.provider,
          accountType: account?.type,
        });

        if (account?.type === "oauth") {
          // try a few places for the email (user and profile)
          const email =
            (user as any)?.email || (profile as any)?.email || (profile as any)?.login || null;

          if (!email) {
            console.error("[auth][signIn] Missing email from OAuth provider; aborting sign-in.");
            return false; // block sign-in if no email present
          }

          // Check your custom users table for existing record
          const existing = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

          if (existing.length === 0) {
            console.log("auth user not found, inserting into custom users table...");
            try {
              await db.insert(users).values({
                email,
                fullName: (user as any)?.name || (profile as any)?.name || "No Name",
                password: "OAUTH", // marker to indicate OAuth created user
                phoneNumber: (user as any)?.phoneNumber || (profile as any)?.phoneNumber || "-",
                role: "USER",
                status: "PENDING",
                image: (user as any)?.image || (profile as any)?.picture || null,
                username: (user as any)?.username || (profile as any)?.username || null,
              });
              console.log("auth user inserted successfully");
            } catch (insertErr) {
              // handle potential race conditions or unique constraint errors gracefully
              console.error("[auth][signIn] insert error (ignored):", insertErr);
            }
          } else {
            console.log("auth user already exists in custom users table");
          }
        } else {
          console.log("auth check: not an oauth account, skipping oauth-create logic");
        }
      } catch (err) {
        console.error("[auth][signIn] error:", err);
        // intentionally allow sign-in to continue even if DB sync fails
      }
      return true;
    },

    // populate token with DB values after initial sign in
    async jwt({ token, user }) {
      try {
        // If a provider user object is available, prefer DB values
        const email = (user as any)?.email ?? token.email;
        if (email) {
          const dbUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

          if (dbUser.length > 0) {
            const u = dbUser[0];
            token.id = u.id.toString();
            token.role = u.role;
            token.status = u.status;
            token.name = u.fullName;
            token.email = u.email;
            token.phoneNumber = u.phoneNumber;
            token.image = u.image;
            token.username = u.username;
          } else {
            // fallback to provider returned user
            token.id = (user as any)?.id ?? token.sub;
            token.role = (user as any)?.role ?? token.role;
          }
        }
      } catch (err) {
        console.error("[auth][jwt] error:", err);
      }
      return token;
    },

    // map token -> session for client
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = (token.name as string) ?? session.user.name;
        session.user.email = (token.email as string) ?? session.user.email;
        (session.user as any).role = (token.role as string) ?? (session.user as any).role;
        (session.user as any).status = (token.status as string) ?? (session.user as any).status;
        (session.user as any).phoneNumber = (token.phoneNumber as string) ?? undefined;
        session.user.image = (token.image as string) ?? session.user.image;
      }
      return session;
    },
  },

  debug: process.env.NODE_ENV === "development",
};

// Initialize NextAuth and re-export handlers + auth helper which conform to v5 API
const nextAuthResult = NextAuth(authOptions);
export const { handlers, auth, signIn, signOut } = nextAuthResult;
export const { GET, POST } = handlers;

// Backwards-compatible alias used elsewhere in the repo
export const getServerAuthSession = auth;
