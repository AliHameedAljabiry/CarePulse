import { auth } from '@/auth';
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import React from 'react'

const Home = async () => {
  const session = await auth();
  const userId = session?.user?.id

  if (!userId || userId === undefined) {
    redirect('/sign-in');
  } 
  
  const userdb = await db
    .select({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      phoneNumber: users.phoneNumber,
      image: users.image,
      role: users.role,
      createdAt: users.createdAt,
      status: users.status,
      username: users.username,
      
  })
  .from(users)
  .where(eq(users.id, userId))
  .limit(1)

  if(userdb && userdb !== undefined) {
    console.log("home: userdb found, redirecting to database", userdb)
    redirect(`/register`)
  } else if (!userdb && userdb === undefined) {
    console.log("home: userdb not found in database", userdb)
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      
    </div>

  );
}

export default Home;