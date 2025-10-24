
"use server";


import { PatientFormValidation } from "@/lib/validation";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { patient, users } from "@/database/schema";

type PatientInput = z.infer<typeof PatientFormValidation> & {
  userId: string;
  phone?: string; 
  patientId: string
};



export async function updatePatient(values: PatientInput) {
  try {
    // -- Update user's phone if provided --
    if (values.phone) {
      await db
        .update(users)
        .set({ phoneNumber: values.phone })
        .where(eq(users.id, values.userId));
    }


    await db
      .update(patient)
      .set({
        userId: values.userId,
        birthDate: (values as any).birthDate, 
        gender: (values as any).gender,
        address: values.address,
        occupation: values.occupation,
        emergencyContactName: values.emergencyContactName,
        emergencyContactNumber: values.emergencyContactNumber,
        primaryPhysician: values.primaryPhysician,
        insuranceProvider: values.insuranceProvider,
        insurancePolicyNumber: (values as any).insuranceNumber ?? values.insurancePolicyNumber, 
        allergies: values.allergies ?? null,
        currentMedication: values.currentMedication ?? null,
        familyMedicalHistory: values.familyMedicalHistory ?? null,
        pastMedicalHistory: values.pastMedicalHistory ?? null,
        identificationType: values.identificationType ?? null,
        identificationNumber: values.identificationNumber ?? null,
        identificationDocument: (values as any).identificationDocument,
        createdAt: new Date(),
      }).where(eq(patient.id, values.patientId))
      

    return {
      success: true,
      message: "Patient updated successfully",
    };
  } catch (err: any) {
    console.error("registerPatient error:", err);
    return { success: false, error: err?.message ?? "Failed to register patient" };
  }
}
