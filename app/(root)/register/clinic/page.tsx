
import { auth } from '@/auth'
import ClinicForm from '@/components/forms/ClinicForm'
import RegisterForm from '@/components/forms/RegisterForm'
import { RegisterImage } from '@/components/RegisterImage'
import { db } from '@/database/drizzle'
import { clinics, patient, users } from '@/database/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import React from 'react'

const clinicImage = "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=300&q=80"

const Page = async ( ) => {

  const session = await auth();
    const userId = session?.user?.id
  
    if (!userId || userId === undefined) {
      redirect('/sign-in');
    } 
    
    const userdb = await db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        phoneNumber: users.phoneNumber,
        image: users.image,
        role: users.role,
        createdAt: users.createdAt,
        status: users.status,
        username: users.username,
        
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
  
    if(userdb) {
      const currentclinic = await db.select().from(clinics).where(eq(clinics.userId, userId)).limit(1)
      const clinic = currentclinic && currentclinic.length > 0 ? currentclinic[0] : null;
      if (clinic) redirect(`${(clinic as any).id}`);
    } else {
      redirect("/sign-in")
    }
  


  return (
    <div className="h-screen flex max-h-screen ">
      <section className=" remove-scrollbar container  max-h-screen overflow-auto ">
        <div className="sub-container max-w-5xl flex-1 flex-col ">
          <ClinicForm 
            type="create"
          />
        </div>
      </section>
     <RegisterImage darkSrc={clinicImage} lightSrc="/assets/images/register-light.png"/>
    </div>
  )
}

export default Page