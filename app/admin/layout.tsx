import { auth } from '@/auth'
import { db } from '@/database/drizzle'
import { users } from '@/database/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'

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
    <div>{children}</div>
  )
}

export default Adminlayout