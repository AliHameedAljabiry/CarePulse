'use client';

import useSWR from 'swr'
import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { cn, gitInitials } from '@/lib/utils';
import { usePathname } from 'next/navigation';


const fetcher = (url: string) => fetch(url).then(res => res.json())

const AdminHeader = () => {
    const { data: currentUser } = useSWR('/api/auth/authorized-user', fetcher, {
        refreshInterval: 3000,
        revalidateOnFocus: true,
        shouldRetryOnError: false,
    });

    const pathname = usePathname()
   
  return (  
      <header className='flex flex-col items-center'>
        <div className='flex items-center justify-between border-b pb-4 mb-4 select-none w-full'>
          <div className='flex gap-5 items-center font-bold'>
            <Link href="/" className='flex items-center gap-2'>
              <Image src="/assets/icons/logo-icon.svg" alt="Patient"  width={160} height={160} className=" h-10 w-fit"/>
              <p className="text-2xl hidden sm:block  dark:text-white">CarePulse</p>
            </Link>
            <div className='flex gap-5 items-center ml-14 mt-1'>
              <Link 
                href="/admin" 
                className={cn(
                  "link",
                   pathname === "/admin/" ? "text-blue-100 dark:text-[#cfab34] underline underline-offset-8" : ""
                   )}>
                Appointments
              </Link>
              <Link 
                href="/admin/users" 
                className={cn(
                  "link",
                   pathname === "/admin/users/" ? "text-blue-100 dark:text-[#cfab34] underline underline-offset-8" : ""
                   )}>
                Users
              </Link>
              <Link 
                href="/admin/patients" 
                className={cn(
                  "link",
                   pathname === "/admin/patients/" ? "text-blue-100 dark:text-[#cfab34] underline underline-offset-8" : ""
                   )}>
                Patients

              </Link>
              <Link 
                href="/admin/doctors" 
                className={cn(

                  "link",
                   pathname === "/admin/doctors/" ? "text-blue-100 dark:text-[#cfab34] underline underline-offset-8" : ""
                   )}>
                Doctors
              </Link>
            </div>
          </div>

          {currentUser?.id && (
            <Link href='/my-profile' className={cn('text-lg font-medium hover:text-primary flex items-center gap-2')}>
              <div className='w-12 h-12 rounded-full '>
                <Avatar className='w-full h-full border-4 dark:border-gray-700  dark:shadow-[inset_0_0_10px_rgba(255,255,255,0.1),0_0_25px_rgba(0,0,0,0.7)]'>
                  {currentUser?.image ? (
                    <Image 
                      src={currentUser.image} 
                      alt={currentUser.fullName ?? "User"} 
                      fill 
                      priority
                      className='object-cover rounded-full' />
                  ) : (
                    <AvatarFallback className="bg-amber-100 text-black text-xl font-bold">
                      {gitInitials(currentUser?.fullName)}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <h1 className='text-lg text-green-500 font-bold mt-1'>Admin</h1>
            </Link>
          )}
        </div>

        <div className="flex w-full flex-col lg:flex-row lg:items-center lg:justify-between mb-8 '">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-700 bg-clip-text text-transparent select-none">
                    Welcome, Admin
                </h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2 select-none">
                    Manage and view your scheduled medical appointments
                </p>
            </div>
            
        </div>
    </header>
  )
}

export default AdminHeader