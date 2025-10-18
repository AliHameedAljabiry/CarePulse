import DeleteAppointment from '@/components/DeleteAppointment';
import { getStatusIcon } from '@/components/Functions';
import { Avatar } from '@/components/ui/avatar';
import { Doctors } from '@/constants';
import { db } from '@/database/drizzle';
import { appointments } from '@/database/schema';
import { cn, formatDate, getDoctorImage, getStatusColor, isUpcoming} from '@/lib/utils';
import { eq } from 'drizzle-orm';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Appointments = async ({ params }: { params: Promise<{ userId: string }> }) => {
    const patientId = (await params).userId;
    const patientAppointments = await db.select().from(appointments).where(eq(appointments.patientId, patientId));
    console.log("Fetched appointments:", patientAppointments);
    
    if (!patientAppointments || patientAppointments.length === 0) {
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
                    <div className='flex items-center justify-center space-x-4 mt-10'>
                        <Link 
                            href={`new-appointment`} 
                            className="relative bg-blue-50 dark:bg-slate-900 rounded-lg px-4 py-2 group overflow-hidden hover:scale-105 transition-transform duration-900"
                            >
                            <div className="absolute inset-0 rounded-lg overflow-hidden">
                                <div className="absolute w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-border-train opacity-100 transition-opacity duration-900 shadow-lg"></div>
                            </div>
                            <div className="absolute inset-0 rounded-lg overflow-hidden">
                                <div className="absolute w-2 h-2 bg-gradient-to-r from-blue-500 to-lime-500 rounded-full animate-border-train1 opacity-100 transition-opacity duration-900 shadow-lg"></div>
                            </div>
                            <div className="absolute inset-0 rounded-lg overflow-hidden">
                                <div className="absolute w-2 h-2 bg-gradient-to-r from-blue-500 to-amber-400 rounded-full animate-border-train2 opacity-100 transition-opacity duration-900 shadow-lg"></div>
                            </div>
                            
                            <span className="relative text-sm text-blue-600 dark:text-blue-300 font-medium flex items-center">
                                <svg className="w-4 h-4 mr-2 transition-transform group-hover:rotate-180 duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                New Appointment
                            </span>
                        </Link>
                    </div>

                </div>
            </div>
        );
    }


    return (
        <section className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-6 md:p-8 rounded-2xl min-h-[800px] border border-white/20 dark:border-slate-700/20">
            {/* Header */}
            <div className="flex w-full flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-700 bg-clip-text text-transparent ">
                        My Appointments
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 mt-2">
                        Manage and view your scheduled medical appointments
                    </p>
                </div>
                <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg px-4 py-2 transform hover:scale-105 transition-transform duration-200">
                        <span className="text-sm text-blue-600 dark:text-blue-300 font-medium">
                            Total: {patientAppointments.length}
                        </span>
                    </div>
                   <Link 
                        href={`new-appointment`} 
                        className="relative bg-blue-50 dark:bg-blue-900/20 rounded-lg px-4 py-2 group overflow-hidden hover:scale-105 transition-transform duration-900"
                        >
                        <div className="absolute inset-0 rounded-lg overflow-hidden">
                            <div className="absolute w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-border-train opacity-100 transition-opacity duration-900 shadow-lg"></div>
                        </div>
                        <div className="absolute inset-0 rounded-lg overflow-hidden">
                            <div className="absolute w-2 h-2 bg-gradient-to-r from-blue-500 to-lime-500 rounded-full animate-border-train1 opacity-100 transition-opacity duration-900 shadow-lg"></div>
                        </div>
                        <div className="absolute inset-0 rounded-lg overflow-hidden">
                            <div className="absolute w-2 h-2 bg-gradient-to-r from-blue-500 to-amber-400 rounded-full animate-border-train2 opacity-100 transition-opacity duration-900 shadow-lg"></div>
                        </div>
                        
                        <span className="relative text-sm text-blue-600 dark:text-blue-300 font-medium flex items-center">
                            <svg className="w-4 h-4 mr-2 transition-transform group-hover:rotate-180 duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            New Appointment
                        </span>
                    </Link>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block">
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-1 mb-6">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-slate-600 dark:text-slate-300">
                                <th className="pb-4 px-6 font-semibold">Doctor</th>
                                <th className="pb-4 px-6 font-semibold">Schedule</th>
                                <th className="pb-4 px-6 font-semibold">Reason</th>
                                <th className="pb-4 px-6 font-semibold">Notes</th>
                                <th className="pb-4 px-6 font-semibold">Status</th>
                                <th className="pb-4 px-6 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {patientAppointments.map((appointment, index) => (
                                <tr 
                                    key={appointment.id}
                                    className={cn(
                                        "group transform hover:scale-[1.01] transition-all duration-200",
                                        isUpcoming(appointment.schedule) && "bg-white/50 dark:bg-slate-700/50"
                                    )}
                                >
                                    <td className="py-4 px-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="relative">
                                                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center transform group-hover:rotate-3 transition-transform duration-200">
                                                    {getDoctorImage(appointment.doctor, Doctors) ? (
                                                        <Image 
                                                            src={getDoctorImage(appointment.doctor, Doctors)!}
                                                            alt={appointment.doctor}
                                                            width={40}
                                                            height={40}
                                                            className="rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-white font-semibold text-sm">
                                                            {appointment.doctor}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-200"></div>
                                            </div>
                                            <span className="font-medium text-slate-800 dark:text-slate-100">
                                                {appointment.doctor}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-800 dark:text-slate-100 text-sm xl:text-md">
                                                {formatDate(appointment.schedule)}
                                            </span>
                                            <span className={cn(
                                                "text-sm mt-1",
                                                isUpcoming(appointment.schedule) 
                                                    ? "text-green-600 dark:text-green-400" 
                                                    : "text-red-400 dark:text-red-400"
                                            )}>
                                                {isUpcoming(appointment.schedule) ? 'Upcoming' : 'Past'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-slate-700 dark:text-slate-200">
                                            {appointment.reason}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-slate-600 dark:text-slate-300 text-sm">
                                            {appointment.note || 'No notes'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className={cn(
                                            "inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium",
                                            getStatusColor(appointment.status)
                                        )}>
                                            {getStatusIcon(appointment.status)}
                                            <span>{appointment.status}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex space-x-2   transition-opacity duration-200">
                                            <Link href={`update-appointment/${appointment.id}`} >
                                                <button type='button' title='teet' className="p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 transform hover:scale-110">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>       
                                            </Link>
                                            <DeleteAppointment appointmentId={appointment.id}  />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
                {patientAppointments.map((appointment) => (
                    <div 
                        key={appointment.id}
                        className={cn(
                            "bg-white dark:bg-slate-700/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-600",
                            "transform hover:scale-[1.02] transition-all duration-200",
                            "shadow-lg hover:shadow-xl"
                        )}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                                        {getDoctorImage(appointment.doctor, Doctors) ? (
                                            <Image 
                                                src={getDoctorImage(appointment.doctor, Doctors)!}
                                                alt={appointment.doctor}
                                                width={48}
                                                height={48}
                                                className="rounded-lg object-cover"
                                            />
                                        ) : (
                                            <span className="text-white font-semibold">
                                                {appointment.doctor}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                                        {appointment.doctor}
                                    </h3>
                                    <div className={cn(
                                        "inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium mt-1",
                                        getStatusColor(appointment.status)
                                    )}>
                                        {getStatusIcon(appointment.status)}
                                        <span>{appointment.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Schedule</span>
                                <span className="font-medium text-slate-800 dark:text-slate-100 text-right">
                                    {formatDate(appointment.schedule)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Reason</span>
                                <span className="font-medium text-slate-800 dark:text-slate-100 text-right">
                                    {appointment.reason}
                                </span>
                            </div>

                            <div className="flex justify-between items-start">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Notes</span>
                                <span className="font-medium text-slate-800 dark:text-slate-100 text-right text-sm">
                                    {appointment.note || 'No notes'}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                            <Link href={`update-appointment/${appointment.id}`} >
                                <button className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 text-sm font-medium">
                                    Reschedule
                                </button>
                            </Link>
                            <DeleteAppointment appointmentId={appointment.id}  />
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 transform hover:scale-105 transition-all duration-200 border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                {patientAppointments.filter(a => a.status === 'SCHEDULED').length}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-300">Scheduled</p>
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
                                {patientAppointments.filter(a => a.status === 'PENDING').length}
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
                                {patientAppointments.filter(a => isUpcoming(a.schedule)).length}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-300">Upcoming</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Appointments;