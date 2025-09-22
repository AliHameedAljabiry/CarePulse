
import RegisterForm from '@/components/forms/RegisterForm'
import { RegisterImage } from '@/components/RegisterImage'
import { redirect } from 'next/navigation'
import React from 'react'

const Register = async ({ params }: { params: Promise<{ userId: string }> } ) => {
  const userId = (await params).userId;
  // const user = await getUser(userId)
  // const patient = await getPatient(userId);

  // if (patient) redirect(`/patients/${userId}/new-appointment`);
  return (
    <div className="h-screen flex max-h-screen ">
      <section className=" remove-scrollbar container  max-h-screen overflow-auto ">
        <div className="sub-container max-w-5xl flex-1 flex-col ">
          <RegisterForm />
        </div>
      </section>
     <RegisterImage/>
    </div>
  )
}

export default Register