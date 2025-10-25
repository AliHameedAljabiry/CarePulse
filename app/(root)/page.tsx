import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import React from 'react'

const Home = async () => {
  const session = await auth();
    if (!session?.user?.id || session?.user?.id === undefined) {
      redirect('/sign-in');
    } 

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      
    </div>

  );
}

export default Home;