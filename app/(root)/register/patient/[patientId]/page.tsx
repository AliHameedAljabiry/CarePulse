
import RegisterForm from '@/components/forms/RegisterForm'
import { RegisterImage } from '@/components/RegisterImage'
import { db } from '@/database/drizzle'
import { patient, users } from '@/database/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import React from 'react'

const Register = async ({ params }: { params: Promise<{ patientId: string }> } ) => {
  const patientId = (await params).patientId;
  const currentPatient = await db.select().from(patient).where(eq(patient.id, patientId)).limit(1)
  const pat = currentPatient && currentPatient.length > 0 ? currentPatient[0] : null;
  if (pat) redirect(`/patients/${(pat as any).id}/appointments/new-appointment`);


  return (
    <div className="h-screen flex max-h-screen ">
      <section className=" remove-scrollbar container  max-h-screen overflow-auto ">
        <div className="sub-container max-w-5xl flex-1 flex-col ">
          <RegisterForm 
            type="create"
          />
        </div>
      </section>
     <RegisterImage darkSrc="/assets/images/register-img.png" lightSrc="/assets/images/register-light.png"/>
    </div>
  )
}

export default Register