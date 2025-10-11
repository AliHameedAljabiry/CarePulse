"use client";

import useSWR from 'swr';
import { signOut } from "next-auth/react";
import React, { useState } from "react";
import Image from "next/image";
import { redirect, useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { gitInitials } from '@/lib/utils';
import { mutate } from 'swr';
import GoBack from '@/components/GoBack';


const fetcher = (url: string) => fetch(url).then(res => res.json());

const MyProfile = () => {
    
    
    const { data: currentUser, error, isLoading} = useSWR('/api/auth/authorized-user', fetcher, {
        refreshInterval: 3000,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        
    });
    const [open, setOpen] = useState(false);
 
    const router = useRouter();

    
    
    const handleSignOut = async () => {
        try {
            mutate('/api/auth/authorized-user', null, { revalidate: false });
            await signOut({ redirect: false });
            router.push('/sign-in');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

  return (
    <div className="min-h-screen flex flex-col    p-4">
         <GoBack/>
       
       
        {/* 3D Profile Image */}
      <div className="sign-out  m-auto">
        <div className="flex justify-center">
            <div className="w-32 h-32">
                <Avatar className="w-full h-full border-4 dark:border-gray-700  dark:shadow-[inset_0_0_10px_rgba(255,255,255,0.1),0_0_25px_rgba(0,0,0,0.7)] transform hover:rotate-1 transition-transform duration-500">
                    {currentUser?.image ? (
                        <Image
                        src={currentUser.image}
                        alt={currentUser.fullName ?? "User"}
                        fill
                        priority
                        className="object-cover rounded-full"
                        />
                    ) : (
                        <AvatarFallback className="bg-amber-100 text-black text-6xl font-bold">
                        {gitInitials(currentUser?.fullName)}
                        </AvatarFallback>
                    )}
                </Avatar>
            </div>
        </div>


        {/* Info Section */}
        {!isLoading && currentUser && <div className="text-center space-y-3 dark:text-white ">
          <h2 className="text-2xl font-semibold">Full name: {currentUser?.fullName}</h2>
          {currentUser?.fullName && (
            <p className="text-sm dark:text-gray-200">
              User name: @{
                currentUser?.username
                  ? currentUser.username.toLowerCase()
                  : (currentUser?.fullName ? currentUser.fullName.toLowerCase().replace(/\s+/g, '') : '')
              }
            </p>
          )}
          <p className="text-sm dark:text-gray-300">Email: {currentUser?.email}</p>
            {currentUser?.role && <p className="text-sm text-green-500 font-bold capitalize">
                <span className='text-black dark:text-white'>Role:</span> {currentUser?.role}
            </p>}
            {currentUser?.createdAt && <p className="text-sm dark:text-gray-300">Member since: {new Date(currentUser?.createdAt).toLocaleDateString()}</p>}
            {currentUser?.phoneNumber && <p className="text-sm dark:text-gray-300">Phone: {currentUser?.phoneNumber}</p>}
        </div>}

        {/* Sign Out Button */}
        <div className="flex justify-center items-center mt-6">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <button
                        type="button"
                        className="px-6 py-2 bg-red-600 max-h-fit hover:bg-red-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                        title="Sign Out"
                    >
                        Sign Out
                    </button>
                </DialogTrigger>
                <DialogContent className='dark:bg-inherit bg-[#fafafa]'>
                    <DialogTitle className='dark:text-white'>
                        Are you sure you want to Sign Out?
                    </DialogTitle>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setOpen(false)}
                            className='bg-white hover:bg-gray-100 text-black mr-2'
                        >
                        Cancel
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleSignOut}
                            className='bg-red-600 hover:bg-red-700 text-white'
                        >
                        Sign Out
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>

      </div>
    </div>
  );
};

export default MyProfile;
