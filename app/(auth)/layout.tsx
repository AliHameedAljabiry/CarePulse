import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import Image from "next/image"
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react"



const AuthLayout = async ({ children }: { children: ReactNode }) => {
 const session = await auth();
 
 if (session?.user?.id && session?.user?.id !== undefined) {
  redirect("/")
 } else {
  console.log("no user id found:", session?.user?.id)
 }
   

    return (
        <div className="h-screen flex max-h-screen  ">
              <section className="remove-scrollbar container my-auto ">
                <div className="sub-container max-w-2xl">
                      <Link href="/" className='flex items-center gap-2 mb-10 w-full justify-center'>
                          <Image src="/assets/icons/logo-icon.svg" alt="Patient"  width={160} height={160} className=" h-10 w-fit"/>
                          <p className="text-2xl font-bold dark:text-white">CarePulse</p>
                      </Link>
                     <div className="">{children}</div>
                </div>
              </section>
        
              <Image
                src="/assets/images/onboarding-img.png"
                alt="patient"
                width={1000}
                height={1000}
                priority
                className="side-img max-w-[50%]"
              />
              
            </div>
    )
}

export default AuthLayout;