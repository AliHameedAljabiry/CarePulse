
import RegisterForm from '@/components/forms/RegisterForm'
import { RegisterImage } from '@/components/RegisterImage'
import { db } from '@/database/drizzle'
import { patient, users} from '@/database/schema'
import { eq } from 'drizzle-orm'
import React from 'react'

const Register = async ({ params }: { params: Promise<{ userId: string }> } ) => {
    const patientId = (await params).userId;
  
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
     <RegisterImage/>
    </div>
  )
}

export default Register