import { auth } from "@/auth";
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { db } from "@/database/drizzle";
import { clinics, patient } from "@/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const patientImage = "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=300&q=80"
const clinicImage = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=300&q=80"

const Home = async () => {
  const session = await auth()
  const userId = session?.user?.id;
  if (userId) {
    const currentclinic = await db.select().from(clinics).where(eq(clinics.userId, userId)).limit(1)
    const clinic = currentclinic && currentclinic.length > 0 ? currentclinic[0] : null;
    const currentPatient = await db.select().from(patient).where(eq(patient.userId, userId)).limit(1)
    const pat = currentPatient && currentPatient.length > 0 ? currentPatient[0] : null;
    if (pat) {
      redirect(`/${userId}/register/patient/${(pat as any).id}/appointments/new-appointment`);
    }else if (clinic) {
      redirect(`/${userId}/register/clinic/${(clinic as any).id}`);
    }

  }
  
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full mx-auto">
          <div className="text-center mb-16">
            <h1 className='text-5xl font-bold text-gray-800 dark:text-white mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              Join Our Healthcare Community
            </h1>
            <p className='text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
              Select your role to begin your journey with us. Whether you're a patient seeking care or a clinic providing services, we're here to help.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto'>
            {/* Patient Card */}
            <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 dark:border-gray-700 hover:scale-105 transform transition-transform">
              <Link href={`/${userId}/register/patient`} className="block">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={patientImage || "/placeholder-patient.jpg"}
                    alt="Patient Registration"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-bold text-white">Patient</h3>
                    <p className="text-blue-200 text-sm">Seek medical care</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-semibold">Individual Account</span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    Book appointments, manage your health records, and connect with healthcare providers.
                  </p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                    <span>Get Started</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Animated border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10">
                  <div className="absolute inset-[2px] rounded-2xl bg-white dark:bg-gray-800 z-10"></div>
                </div>
              </Link>
            </div>

            {/* Clinic Card */}
            <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 dark:border-gray-700 hover:scale-105 transform transition-transform">
              <Link href={`/${userId}/register/clinic`} className="block">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={clinicImage || "/placeholder-clinic.jpg"}
                    alt="Clinic Registration"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-bold text-white">Clinic</h3>
                    <p className="text-green-200 text-sm">Provide healthcare services</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="font-semibold">Professional Account</span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    Manage your practice, schedule appointments, and provide quality healthcare services to patients.
                  </p>
                  <div className="flex items-center text-green-600 dark:text-green-400 font-medium">
                    <span>Get Started</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Animated border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10">
                  <div className="absolute inset-[2px] rounded-2xl bg-white dark:bg-gray-800 z-10"></div>
                </div>
              </Link>
            </div>
          </div>

          
        </div>
      </section>
    
    </div>

  );
}

export default Home;