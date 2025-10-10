import NextAuth, { User, Session, Profile } from "next-auth";
import Google from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./database/drizzle";
import { users } from "./database/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import FacebookProvider from "next-auth/providers/facebook";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      status: string;
     
    };
  }
  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    phoneNumber: string;
   
  }
}
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,

  session: { strategy: "jwt" },
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    Google({
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,                
          username: profile.given_name || null,
        };
      },
    }),
    
    CredentialsProvider({
      async authorize(credentials) {
        
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email.toString()))
          .limit(1);

        if (user.length === 0) {
          return null;
        }
          
        
        if (user[0].password === "-" || user[0].password === "OAUTH") {
          return null; 
        }

        const isValidPassword = await compare(
          credentials.password.toString(),
          user[0].password
        );

        if (!isValidPassword) return null;

        return {
          id: user[0].id.toString(),
          email: user[0].email,
          name: user[0].fullName,
          role: user[0].role,
          status: user[0].status,
          phoneNumber: user[0].phoneNumber,
        } as User & {role: string; status: string};
      },
    }),
  ],

  pages: {
    signIn: "/sign-in",
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "credentials") {
        const existingUsers = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email as string))
          .limit(1);

        if (existingUsers.length === 0) {
          await db.insert(users).values({
            email: user.email!,
            fullName: user.name || "No Name",
            password: "-", 
            phoneNumber: user.phoneNumber || "-", 
            role: "USER",
            status: "PENDING",
            image: user.image,      
            username: (user as any).username, 
          });
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        const dbUser = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email as string))
          .limit(1);

        if (dbUser.length > 0) {
          token.id = dbUser[0].id;
          token.role = dbUser[0].role;
          token.status = dbUser[0].status;
          token.name = dbUser[0].fullName;
          token.email = dbUser[0].email;
          token.phoneNumber = dbUser[0].phoneNumber;
          token.image = dbUser[0].image;
          token.username = dbUser[0].username;
         
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        session.user.status = token.status as string;
        
      }
      return session;
    },
  }

})