import { AppointmentForm } from '@/components/forms/AppointmentForm';
import { db } from '@/database/drizzle';
import { appointments, patient } from '@/database/schema';
import { eq } from 'drizzle-orm';
import Image from 'next/image';
import React from 'react'

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const appointmentId = (await params).id;
    
    const appointmentWithPatient = await db
        .select()
        .from(appointments)
        .where(eq(appointments.id, appointmentId))
        .limit(1)
        .leftJoin(patient, eq(appointments.patientId, patient.id))
        
    return (
        <div className="flex h-screen max-h-screen">
          <section className="remove-scrollbar container my-auto">
            <div className="sub-container max-w-3xl flex-1 justify-between">
              <AppointmentForm
                  type="update"
                  appointment={(appointmentWithPatient[0] as any).appointments}
                  patientId={(appointmentWithPatient[0] as any).patient?.id}
              />
            </div>
          </section>
    
          <Image
            src="/assets/images/appointment-img.png"
            height={1500}
            width={1500}
            alt="appointment"
            className="side-img max-w-[40%] bg-bottom"
          />
        </div>
      );
}

export default page