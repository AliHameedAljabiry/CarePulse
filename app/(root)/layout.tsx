import { auth } from "@/auth";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { db } from "@/database/drizzle";
import { clinics, users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { ReactNode } from "react";

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  
  if (!session?.user?.id || session?.user?.id === undefined) redirect("/sign-in")
  

  after( async () => {
    if (!session?.user?.id) return;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session?.user?.id))
      .limit(1);

    if (user[0].lastActivityDate === new Date().toISOString().slice(0,10)) return;

    await db
      .update(users)
      .set({ lastActivityDate: new Date().toISOString().slice(0,10) })
      .where(eq(users.id, session?.user?.id));
  })


     return (
        <main className="root-container">
            <Header />
            <div className="min-h-screen bg-light-300 dark:bg-[#0d1117]  ">{children}</div>
            <Footer/>
        </main>
  );
}

export default RootLayout ;