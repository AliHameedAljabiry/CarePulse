import Clinic from '@/components/Clinic'
import { db } from '@/database/drizzle'
import { clinics, doctors, galleries, insurances, specialties } from '@/database/schema'
import { eq } from 'drizzle-orm'
import React from 'react'

const Page = async ({ params }: { params: Promise<{ clinicId: string }> }) => {
  const clinicId = (await params).clinicId

  // ✅ Get clinic as a single object instead of array
  const clinicResult = await db.select().from(clinics).where(eq(clinics.id, clinicId)).limit(1)
  const clinic = clinicResult[0]

  if (!clinic) {
    return <div>Clinic not found</div>
  }

  // ✅ Fetch related data in parallel
  const [clinicDoctors, clinicGalleries, clinicInsurances, clinicSpecialties] = await Promise.all([
    db.select().from(doctors).where(eq(doctors.clinicId, clinicId)),
    db.select().from(galleries).where(eq(galleries.clinicId, clinicId)),
    db.select().from(insurances).where(eq(insurances.clinicId, clinicId)),
    db.select().from(specialties).where(eq(specialties.clinicId, clinicId)),
  ])

  // ✅ Combine all into one object
  const clinicData = {
    ...clinic,
    doctors: clinicDoctors,
    galleries: clinicGalleries,
    insurances: clinicInsurances,
    specialties: clinicSpecialties,
  }

  console.log('Clinic Data:', clinicData)

  return (
    <div>
      <Clinic clinicData={clinicData as any} />
    </div>
  )
}

export default Page
