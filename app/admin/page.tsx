'use client';
import Loading from '@/app/loading';
import { patient } from '@/database/schema';
import React, { useState } from 'react'
import useSWR, { mutate } from 'swr';
import { cn, formatDate, formatDateTime, getDoctorImage,  gitInitials, isUpcoming } from '@/lib/utils';
import Image from 'next/image';
import { Doctors } from '@/constants';
import Link from 'next/link';
import DeleteAppointment from '@/components/DeleteAppointment';
import { get } from 'http';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getStatusColor, getStatusIcon } from '@/components/Functions';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { AppointmentForm } from '@/components/forms/AppointmentForm';




const fetcher = (url: string) => fetch(url).then(res => {
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
}) 

const PatientTable = () => {
    const { data, error, isLoading, mutate } = useSWR('/api/admin/appointments', fetcher, {
        revalidateOnMount: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 3000, 
    });

    const { data: currentUser } = useSWR('/api/auth/authorized-user', fetcher, {
    refreshInterval: 3000,
    revalidateOnFocus: true,
    shouldRetryOnError: false,
  });

    const [openForm, setOpenForm] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [formType, setFormType] = useState('');
    const [formTitle, setFormTitle] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

    if (isLoading) return <div><Loading/></div>;
    if (error) return <div className='dark:text-white'>Error loading users: {error.message}</div>

    console.log("Appointments Data:", data);

    

    if (!data || data.length === 0) {
        return (
            <div className="min-h-[600px] flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 rounded-2xl">
                <div className="text-center p-8">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-slate-400 to-slate-500 rounded-full flex items-center justify-center transform rotate-12">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">No Appointments Found</h3>
                    <p className="text-slate-600 dark:text-slate-300">You don't have any scheduled appointments yet.</p>
                </div>
            </div>
        );
    }


   
    const handleSchedule = (appointment: any, patientId: string, formType: string, formTitle: string) => {
        setSelectedPatientId(patientId);
        setSelectedAppointment(appointment);
        setOpenForm(true);
        setFormType(formType);
        setFormTitle(formTitle)
    }
   
    // Function to handle successful form submission
    const handleFormSuccess = () => {
        setOpenForm(false); 
        mutate(); 
    }
    return (
      <div className=' relative '>
            {/* Dialog for Appointment Form */}
            <Dialog open={openForm} onOpenChange={setOpenForm}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-inherit">
                  <DialogTitle className='dark:text-white'>
                      {formTitle}
                  </DialogTitle>
                    <AppointmentForm
                        type={formType}
                        appointment={selectedAppointment}
                        patientId={selectedPatientId}
                        onSuccess={handleFormSuccess} 
                    />
                </DialogContent>
            </Dialog>
          <section className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-2 sm:px-8 sm:py-4 md:px-6  rounded-2xl min-h-[400px] max-h-[800px]  border border-white/20 dark:border-slate-700/20 ">
             <div className='flex items-center justify-between gap-5 px-3'>
                <h1 className='text-xl font-bold'>All Appointments</h1>
                <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg px-4 py-2 transform hover:scale-105 transition-transform duration-200">
                    <span className="text-sm text-blue-600 dark:text-blue-300 font-medium select-none">
                        Total: {data.length}
                    </span>
                </div>   
            </div>
             </div>
              {/* Summary Stats */}
              <div className="mt-2 p-2 sm:p-16 lg:p-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 select-none'">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 transform hover:scale-105 transition-all duration-200 border border-green-200 dark:border-green-800">
                      <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                          </div>
                          <div>
                              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                  {data.filter((a: any) => a.appointments.status === 'SCHEDULED').length}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-300 select-none">Scheduled</p>
                          </div>
                      </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl p-6 transform hover:scale-105 transition-all duration-200 border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                          </div>
                          <div>
                              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                  {data.filter((a: any) => a.appointments.status  === 'PENDING').length}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-300">Pending</p>
                          </div>
                      </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 transform hover:scale-105 transition-all duration-200 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                          </div>
                          <div>
                              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                  {data.filter((a: any) => isUpcoming(a.appointments.schedule)).length}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-300">Upcoming</p>
                          </div>
                      </div>
                  </div>
            
                  <div className="bg-gradient-to-r from-red-50 to-red-50 dark:from-red-900/20 dark:to-red-400/20 rounded-2xl p-6 transform hover:scale-105 transition-all duration-200 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-red-300 rounded-xl flex items-center justify-center">
                              <Image
                                  src="/assets/icons/cancelled.svg"
                                  alt="Cancelled"
                                  width={24}
                                  height={24}
                                  className="text-white"
                              />
                          </div>
                          <div>
                              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                  {data.filter((a: any) => a.appointments.status  === 'CANCELLED').length}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-300">Cancelled</p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block mt-3 select-none max-h-[500px]  overflow-y-auto remove-scrollbar">
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-1 mb-6">
                      <table className="w-full">
                          <thead className='border-b'>
                              <tr className="text-left text-slate-600 dark:text-slate-300">
                                  <th className="pb-4 px-6 font-semibold">Patient</th>
                                  <th className="pb-4 px-6 font-semibold">Doctor</th>
                                  <th className="pb-4 px-6 font-semibold">Schedule</th>
                                  <th className="pb-4 px-6 font-semibold">Reason</th>
                                  <th className="pb-4 px-6 font-semibold">Notes</th>
                                  <th className="pb-4 px-6 font-semibold">Status</th>
                                  <th className="pb-4 px-6 font-semibold">Actions</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                              {data.map((e: any, index: string) => (
                                  <tr 
                                      key={index}
                                      className={cn(
                                          "group transform hover:scale-[1.01] transition-all duration-200",
                                          isUpcoming(e.appointments.schedule) && "bg-white/50 dark:bg-slate-700/50"
                                      )}
                                  >   
                                      
                                      <td className="py-4 px-4">
                                          <div className="flex items-center space-x-3">
                                              <div className="relative">
                                                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center transform group-hover:rotate-3 transition-transform duration-200">
                                                      {e.users.image ? (
                                                          <Image 
                                                              src={e.users.image}
                                                              alt={e.users.fullName}
                                                              width={40}
                                                              height={40}
                                                              className="rounded-lg object-cover"
                                                          />
                                                      ) : (
                                                          <span className="text-white font-semibold text-sm">
                                                              {gitInitials(e.users.fullName)}
                                                          </span>
                                                      )}
                                                  </div>
                                                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-200"></div>
                                              </div>
                                              <span className="font-medium text-slate-800 dark:text-slate-100 text-sm whitespace-nowrap">
                                                  {e.users.fullName}
                                              </span>
                                          </div>
                                      </td>
                                      <td className="py-4 px-2">
                                          <div className="flex items-center space-x-3">
                                              <div className="relative">
                                                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center transform group-hover:rotate-3 transition-transform duration-200">
                                                      {getDoctorImage(e.appointments.doctor, Doctors) ? (
                                                          <Image 
                                                              src={getDoctorImage(e.appointments.doctor, Doctors)!}
                                                              alt={e.appointments.doctor}
                                                              width={40}
                                                              height={40}
                                                              className="rounded-lg object-cover"
                                                          />
                                                      ) : (
                                                          <span className="text-white font-semibold text-sm">
                                                              {e.appointments.doctor}
                                                          </span>
                                                      )}
                                                  </div>
                                                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-200"></div>
                                              </div>
                                              <span className="font-medium text-slate-800 dark:text-slate-100 text-sm">
                                                  {e.appointments.doctor}
                                              </span>
                                          </div>
                                      </td>
                                      <td className="py-4 px-2">
                                          <div className="flex flex-col">
                                              <span className="font-medium text-slate-800 dark:text-slate-100 text-xs">
                                                  {formatDate(e.appointments?.schedule)}
                                              </span>
                                              <span className={cn(
                                                  "text-sm mt-1",
                                                  isUpcoming(e.appointments.schedule) 
                                                      ? "text-green-600 dark:text-green-400" 
                                                      : "text-red-400 dark:text-red-400"
                                              )}>
                                                  {isUpcoming(e.appointments.schedule) && e.appointments.status === 'SCHEDULED' ? 'Upcoming' 
                                                  :!isUpcoming(e.appointments.schedule)  ? 'Past' :""}
                                              </span>
                                          </div>
                                      </td>
                                      <td className="py-4 px-6">
                                          <span className="text-slate-700 dark:text-slate-200 text-sm">
                                              {e.appointments.reason}
                                          </span>
                                      </td>
                                      <td className="py-4 px-2">
                                          <span className="text-slate-600 dark:text-slate-300 text-sm">
                                              {e.appointments.note || 'No notes'}
                                          </span>
                                      </td>
                                      <td className="py-4 px-2 flex flex-col">
                                          <div className={cn(
                                              "inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium w-fit",
                                              getStatusColor(e.appointments.status)
                                          )}>
                                              {getStatusIcon(e.appointments.status)}
                                              <span>{e.appointments.status}</span>
                                          </div>
                                              <span className='text-left text-xs mt-2'>{e.appointments.cancellationReason}</span>
                                      </td>
                                      <td className="py-4 px-2">
                                          <div className="flex space-x-2   transition-opacity duration-200">    
                                              <button 
                                                  type='button' 
                                                  title='Scheduel' 
                                                  className="p-2 text-sm bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-lg transition-all duration-200 transform hover:scale-110"
                                                  onClick={() => handleSchedule(e.appointments, e.patient.id, "schedule", "Schedule Appointment")}
                                              >
                                                  Scheduel
                                              </button>  

                                              <button 
                                                  type='button' 
                                                  title='Scheduel' 
                                                  className="p-2 text-sm bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-lg transition-all duration-200 transform hover:scale-110"
                                                  onClick={() => handleSchedule(e.appointments, e.patient.id, "cancel", "Cancel Appointment")}
                                              >
                                                  Cancel
                                              </button>       
                                              
                                              
                                          </div>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4 px-2 sm:px-14 mt-10">
                  {data.map((e: any) => (
                      <div 
                          key={e.appointments.id}
                          className={cn(
                              "bg-white dark:bg-slate-700/50 rounded-2xl p-2 sm:p-8 border border-slate-200 dark:border-slate-600",
                              "transform hover:scale-[1.02] transition-all duration-200",
                              "shadow-lg hover:shadow-xl"
                          )}
                      >
                          <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-2">
                                  <div className="relative">
                                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                                          {getDoctorImage(e.appointments.doctor, Doctors) ? (
                                              <Image 
                                                  src={getDoctorImage(e.appointments.doctor, Doctors)!}
                                                  alt={e.appointments.doctor}
                                                  width={48}
                                                  height={48}
                                                  className="rounded-lg object-cover"
                                              />
                                          ) : (
                                              <span className="text-white font-semibold">
                                                  {e.appointments.doctor}
                                              </span>
                                          )}
                                      </div>
                                  </div>
                                  <div>
                                      <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                                          {e.appointments.doctor}
                                      </h3>
                                  </div>
                                  
                              </div>
                              <div className="flex items-center space-x-2">
                                  <div className="relative">
                                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center transform group-hover:rotate-3 transition-transform duration-200">
                                          {e.users.image ? (
                                              <Image 
                                                  src={e.users.image}
                                                  alt={e.users.fullName}
                                                  width={40}
                                                  height={40}
                                                  className="rounded-lg object-cover"
                                              />
                                          ) : (
                                              <span className="text-white font-semibold text-sm">
                                                  {gitInitials(e.users.fullName)}
                                              </span>
                                          )}
                                      </div>
                                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-200"></div>
                                  </div>
                                  <span className="font-medium text-slate-800 dark:text-slate-100 text-sm whitespace-nowrap">
                                      {e.users.fullName}
                                  </span>
                              </div>
                          </div>
                          
                          

                          <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                  <span className="text-sm flex text-slate-600 dark:text-slate-400">Schedule
                                    <p className={cn(
                                                  "text-xs mt-1 ml-1",
                                                  isUpcoming(e.appointments.schedule) 
                                                      ? "text-green-600 dark:text-green-400" 
                                                      : "text-red-400 dark:text-red-400"
                                              )}>
                                        {isUpcoming(e.appointments.schedule) && e.appointments.status === 'SCHEDULED' ? '(Upcoming)' 
                                        :!isUpcoming(e.appointments.schedule)  ? '(Past)' :""}
                                    </p>
                                  </span>
                                  <span className="font-medium text-slate-800 dark:text-slate-100 text-right text-xs">
                                      {formatDate(e.appointments.schedule)}
                                  </span>
                              </div>

                              <div className="flex justify-between items-center">
                                  <span className="text-sm text-slate-600 dark:text-slate-400">Reason</span>
                                  <span className="font-medium text-slate-800 dark:text-slate-100 text-right text-sm">
                                      {e.appointments.reason}
                                  </span>
                              </div>

                              <div className="flex justify-between items-start">
                                  <span className="text-sm text-slate-600 dark:text-slate-400">Notes</span>
                                  <span className="font-medium text-slate-800 dark:text-slate-100 text-right text-sm">
                                      {e.appointments.note || 'No notes'}
                                  </span>
                              </div>
                          </div>

                          <div className="flex justify-between space-x-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                            <div className='flex flex-col gap-2'>
                                <div className={cn(
                                        "inline-flex items-center w-fit space-x-1 px-2 py-1 rounded-full text-xs font-medium mt-1",
                                        getStatusColor(e.appointments.status)
                                    )}>
                                        {getStatusIcon(e.appointments.status)}
                                        <span>{e.appointments.status}</span>
                                </div>
                                <span className='text-left text-xs'>{e.appointments.cancellationReason}</span>
                            </div>
                              <div className='flex justify-between gap-2 h-fit items-center'>
                                <button 
                                    type='button' 
                                    title='Scheduel' 
                                    className="p-2 text-sm bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-lg transition-all duration-200 transform hover:scale-110"
                                    onClick={() => handleSchedule(e.appointments, e.patient.id, "schedule", "Schedule Appointment")}
                                >
                                    Scheduel
                                </button>  

                                <button 
                                    type='button' 
                                    title='Scheduel' 
                                    className="p-2 text-sm bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-lg transition-all duration-200 transform hover:scale-110"
                                    onClick={() => handleSchedule(e.appointments, e.patient.id, "cancel", "Cancel Appointment")}
                                >
                                    Cancel
                                </button>       
                              </div>

                          </div>
                      </div>
                  ))}
              </div>

              
          </section>
      </div>
    );

}

export default PatientTable