"use server";

import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { signIn } from "@/auth";
import { headers } from "next/headers";
import ratelimit from "@/lib/ratelimit";
import { redirect } from "next/navigation";
import { workflowClient } from "@/lib/workflow";
import config from "@/lib/config";

interface AuthCredentials {
  fullName: string
  email: string;
  password: string;
  phoneNumber: string;
  
}
export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">,
) => {
  const { email, password } = params;

  // const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  // const { success } = await ratelimit.limit(ip);

  // if (!success) return redirect("/too-fast");

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
      console.error("Signin error:", error);
      return { success: false, error: error instanceof Error ? error.message : "Signin error" };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { fullName, email, password, phoneNumber} = params;

  // const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  // const { success } = await ratelimit.limit(ip);

  // if (!success) return redirect("/too-fast");

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { success: false, error: "User already exists" };
  }

  const hashedPassword = await hash(password, 10);

  try {
    await db.insert(users).values({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,

    });
    // await workflowClient.trigger({
    //   url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
    //   body: {
    //     email,
    //     fullName,
    //   },
    // });
    const signInResult = await signInWithCredentials({ email, password });
    console.log("Sign-in result after registration:", signInResult);
    
    if (!signInResult.success) {
      console.error("Sign-in error after registration:", signInResult.error);
      return { success: false, error: signInResult.error || "Failed to sign in after registration" };
    }

    return { success: true };
  } catch (error) {
    console.error("Signup error:", error); 
    return { success: false, error: "Signup error" };
  }
};

