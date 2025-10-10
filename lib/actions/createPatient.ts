
"use server";


import { PatientFormValidation } from "@/lib/validation";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { patient, users } from "@/database/schema";

type PatientInput = z.infer<typeof PatientFormValidation> & {
  userId: string;
  phone?: string; // optional phone from form
};

// return type
type RegisterResult =
  | { success: true; data: any }
  | { success: false; error: string };

export async function registerPatient(values: PatientInput) {
  try {
    // -- Update user's phone if provided --
    if (values.phone) {
      await db
        .update(users)
        .set({ phoneNumber: values.phone })
        .where(eq(users.id, values.userId));
    }


    const [inserted] = await db
      .insert(patient)
      .values({
        userId: values.userId,
        birthDate: values.birthDate, 
        gender: values.gender,
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
        identificationDocument: values.identificationDocument,
        createdAt: new Date(),
      })
      .returning();

    return { success: true, data: inserted };
  } catch (err: any) {
    console.error("registerPatient error:", err);
    return { success: false, error: err?.message ?? "Failed to register patient" };
  }
}
