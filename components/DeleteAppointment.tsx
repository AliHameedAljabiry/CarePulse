'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { toast } from '@/hooks/use-toast';
import { deleteAppointment } from '@/lib/actions/deleteAppointment';
import Image from 'next/image';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';


type DeleteAppointmentProps = {
  appointmentId: string;

};
const DeleteAppointment = ({ appointmentId }: DeleteAppointmentProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleDeleteAppointment  = async () => {
    try {
      await deleteAppointment({ appointmentId });
      toast({
        title: "Success",
        description: "Appointment deleted successfully",
      });
      setOpen(false)
      router.refresh();
    
      
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the Appointment",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type='button'
          className="p-2 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 transform hover:scale-110"
          title="Delete Project"
        >
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
      </DialogTrigger>

      <DialogContent className='dark:bg-inherit bg-slate-300'>
          <DialogTitle className='dark:text-white'>
              Are you sure you want to delete this Appointment?
          </DialogTitle>

          <DialogFooter className='flex flex-row justify-around'>
            <Button className='text-black bg-cyan-500  w-fit' variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAppointment} className='bg-red-800 text-white  w-fit  '>
              Delete
            </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


export default DeleteAppointment;