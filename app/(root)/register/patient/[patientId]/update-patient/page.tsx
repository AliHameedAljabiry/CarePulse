
import RegisterForm from '@/components/forms/RegisterForm'
import { RegisterImage } from '@/components/RegisterImage'
import { db } from '@/database/drizzle'
import { patient, users} from '@/database/schema'
import { eq } from 'drizzle-orm'
import React from 'react'

const clinicImage = "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=300&q=80"

const Register = async ({ params }: { params: Promise<{ patientId: string }> } ) => {
    const patientId = (await params).patientId;
  
    const currentPatient = await db.select().from(patient).where(eq(patient.id, patientId)).limit(1);
    const pat = currentPatient && currentPatient.length > 0 ? currentPatient[0] : null;
    const currentUser = await db.select().from(users).where(eq(users.id, (pat as any).userId )).limit(1);
    const user = currentUser && currentUser.length > 0 ? currentUser[0] : null;



  return (
    <div className="h-screen flex max-h-screen ">
      <section className=" remove-scrollbar container  max-h-screen overflow-auto ">
        <div className="sub-container max-w-5xl flex-1 flex-col ">
          <RegisterForm 
            type="update"
            patient={pat}
          />
        </div>
      </section>
     <RegisterImage darkSrc={clinicImage} lightSrc="/assets/images/register-light.png"/>
    </div>
  )
}

export default Register