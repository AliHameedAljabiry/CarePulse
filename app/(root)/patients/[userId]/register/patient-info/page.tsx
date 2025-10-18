import React from 'react';
import { db } from '@/database/drizzle';
import { patient, users } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { Doctors } from '@/constants';
import { getDoctorImage, gitInitials } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import IdentificationDocument from '@/components/IdentificationDocument';

const PatientInfo = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const patientId = (await params).userId;

  const currentPatient = await db.select().from(patient).where(eq(patient.id, patientId)).limit(1);
  const pat = currentPatient && currentPatient.length > 0 ? currentPatient[0] : null;
  const currentUser = await db.select().from(users).where(eq(users.id, (pat as any).userId )).limit(1);
  const user = currentUser && currentUser.length > 0 ? currentUser[0] : null;
  console.log("pat", pat);

  if (!pat) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center transform rotate-12 animate-pulse">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">Patient Not Found</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">We couldn't locate the patient record.</p>
        </div>
      </div>
    );
  }

  const doctorImage = getDoctorImage(pat.primaryPhysician, Doctors);

  // Calculate age from birthDate
  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(pat.birthDate);
  console.log(pat.birthDate)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50  dark:bg-[#0d1117] dark:from-[#1b232e] dark:to-[#080b0f] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Patient Information
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Comprehensive medical profile and details
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Info & Emergency Contact */}
          <div className="space-y-8">
            {/* Personal Information Card */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-slate-700/20 transform hover:scale-[1.02] transition-all duration-300 hover:rotate-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Personal Information</h2>
                <div className="min-w-24 min-h-24 max-w-24 max-h-24 w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center transform ">
                   <Avatar className='w-full h-full border-4 dark:border-gray-700  dark:shadow-[inset_0_0_10px_rgba(255,255,255,0.1),0_0_25px_rgba(0,0,0,0.7)]'>
                    {user?.image ? (
                      <Image 
                        src={user.image} 
                        alt={user.fullName ?? "User"} 
                        fill 
                        priority
                        className='object-cover rounded-full' />
                    ) : (
                      <AvatarFallback className="bg-amber-100 text-black text-4xl font-bold">
                        {gitInitials(user?.fullName)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
              </div>
              
              <div className="space-y-4">
                <InfoItem label="Patient Name" value={(user as any).fullName} />
                <InfoItem label="Age" value={`${age} years`} />
                <InfoItem label="Gender" value={pat.gender} />
                <InfoItem label="Occupation" value={pat.occupation} />
                <InfoItem label="Address" value={pat.address} />
              </div>
            </div>

            {/* Emergency Contact Card */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-slate-700/20 transform hover:scale-[1.02] transition-all duration-300 hover:-rotate-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Emergency Contact</h2>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center transform rotate-12">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-4">
                <InfoItem label="Contact Name" value={pat.emergencyContactName} />
                <InfoItem label="Phone Number" value={pat.emergencyContactNumber} />
              </div>
            </div>
          </div>

          {/* Middle Column - Medical Info */}
          <div className="space-y-8">
            {/* Medical History Card */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-slate-700/20 transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Medical History</h2>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center transform -rotate-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-4">
                <InfoItem label="Allergies" value={pat.allergies as string} />
                <InfoItem label="Current Medication" value={pat.currentMedication as string} />
                <InfoItem label="Past Medical History" value={pat.pastMedicalHistory as string} />
                <InfoItem label="Family Medical History" value={pat.familyMedicalHistory as string} />
              </div>
            </div>

            {/* Insurance Information Card */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-slate-700/20 transform hover:scale-[1.02] transition-all duration-300 hover:rotate-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Insurance</h2>
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center transform rotate-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-4">
                <InfoItem label="Provider" value={pat.insuranceProvider} />
                <InfoItem label="Policy Number" value={pat.insurancePolicyNumber} />
              </div>
            </div>
          </div>

          {/* Right Column - Identification & Primary Physician */}
          <div className="space-y-8">
            {/* Identification Card */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-slate-700/20 transform hover:scale-[1.02] transition-all duration-300 hover:-rotate-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Identification</h2>
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center transform rotate-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9a2 2 0 10-4 0v5a2 2 0 01-2 2h6m-6-4h4m8 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-4">
                <InfoItem label="Document Type" value={pat.identificationType as any} />
                <InfoItem label="ID Number" value={pat.identificationNumber as any} />
                {pat.identificationDocument && (
                  <div className="pt-4">
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                      Document Preview
                    </label>
                    <div className="relative group">
                      <div className="w-full h-fit bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-2xl flex items-center justify-center overflow-hidden transform group-hover:scale-105 transition-transform duration-300">                      
                        <IdentificationDocument documentUrl={pat.identificationDocument as any}/>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Primary Physician Card */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-slate-700/20 transform hover:scale-[1.02] transition-all duration-300 hover:rotate-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Primary Physician</h2>
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center transform -rotate-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center transform rotate-3 group-hover:rotate-6 transition-transform duration-300">
                    {doctorImage ? (
                      <img 
                        src={doctorImage} 
                        alt={pat.primaryPhysician}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold text-lg">
                        {pat.primaryPhysician.split(' ').map(n => n[0]).join('')}
                      </span>
                    )}
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-20 blur-sm"></div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{pat.primaryPhysician}</h3>
                  <p className="text-slate-600 dark:text-slate-400">Primary Care Physician</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          <p className="text-md text-slate-700 dark:text-slate-300">
            Last updated: {new Date(pat.createdAt as string | Date).toLocaleDateString('en-US')}
          </p>
        </div>
      </div>
    </div>
  );
};

// Reusable InfoItem component
const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col space-y-1">
    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
    <span className="text-lg font-semibold text-slate-800 dark:text-slate-100">
      {value || 'Not specified'}
    </span>
  </div>
);

export default PatientInfo;