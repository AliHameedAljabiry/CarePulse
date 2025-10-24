'use client';
import useSWR from 'swr';
import Image from 'next/image'
import React from 'react'
import { ThemeToggle } from './ThemeToggle'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { cn, gitInitials } from '@/lib/utils';
import { Avatar, AvatarFallback } from './ui/avatar';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const Header = () => {

  const { data: currentUser } = useSWR('/api/auth/authorized-user', fetcher, {
    refreshInterval: 3000,
    revalidateOnFocus: true,
    shouldRetryOnError: false,
  });
  const { data: currentPatient } = useSWR('/api/auth/current-patient', fetcher, {
    refreshInterval: 3000,
    revalidateOnFocus: true,
    shouldRetryOnError: false,
  });

  const pathname = usePathname();


  return (
    <div className="sticky  bg-white dark:bg-[#080808] px-5 xs:px-10 py-4 shadow-md sm:px-10 md:px-16 lg:px-18  xl:px-22 2xl:px-24 z-50 flex items-center justify-between  w-full">
        <div className="flex items-center gap-10">
            <Link href="/" className='flex items-center gap-2'>
                <Image src="/assets/icons/logo-icon.svg" alt="Patient"  width={160} height={160} className=" h-10 w-fit"/>
                <p className="text-2xl hidden sm:block font-bold dark:text-white">CarePulse</p>
            </Link>
             {currentPatient?.id && <Link href={`/patients/${currentPatient?.id}/register/patient-info`} className="font-bold whitespace-nowrap">Patient Info</Link>}
             {currentPatient?.id && <Link href={`/patients/${currentPatient?.id}/appointments`} className="font-bold whitespace-nowrap">My Appointment</Link>}
             {currentUser?.role === 'ADMIN' && <Link href="/admin" className="text-green-500 font-bold">Admin</Link>}
        </div>
        <div className='flex items-center gap-10'>
           {currentUser?.id && (
              <Link href={`/${currentUser?.id}/my-profile`} className={cn(
                'text-lg font-medium hover:text-primary', 
                pathname === '/my-profile' && 'text-primary')}>
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
              </Link>
            )}
            
        </div>
    </div>
  )
}

export default Header