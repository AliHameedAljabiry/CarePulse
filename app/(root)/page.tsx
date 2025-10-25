import { auth } from '@/auth';
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import React from 'react'

const Home = async () => {
  const session = await auth();
  if (!session?.user?.email) redirect("/sign-in");

  const dbUser = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  if (dbUser.length === 0) redirect("/sign-in");
  
  const user = dbUser[0];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      
    </div>

  );
}

export default Home;