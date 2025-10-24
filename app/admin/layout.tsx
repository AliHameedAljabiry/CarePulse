import { auth } from '@/auth'
import { db } from '@/database/drizzle'
import { users } from '@/database/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'


const Adminlayout = async ({children} : {children: ReactNode}) => {
    const session = await auth() 

    if (!session?.user?.id) redirect("/sign-in")

    const isAdmin = await db
        .select({ isAdmin: users.role })
        .from(users)
        .where(eq(users.id, session?.user?.id))
        .limit(1)
        .then((res) => res[0]?.isAdmin == "ADMIN")
    
    if (!isAdmin) redirect("/")

  return (
    <main className='flex min-h-screen max-h-screen w-full flex-row  overflow-y-auto'>
        <div className="flex w-[calc(100%-264px)] flex-1 flex-col  bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg p-5 xs:p-10 sm:p-6">
            <AdminHeader />
            {children}
        </div>
    </main>
  )
}

export default Adminlayout