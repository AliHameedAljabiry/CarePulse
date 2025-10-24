"use server";

import { PatientFormValidation, specialtyFormValidation } from "@/lib/validation";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import {specialties} from "@/database/schema";

type SpecailtyProps = z.infer<typeof specialtyFormValidation>

export async function updateSpecailty(values: SpecailtyProps, specialtyId: string, clinicId: string) {
  try {
    await db
      .update(specialties)
      .set({
        clinicId: clinicId,
        specialty: values.specialty
      }).where(eq(specialties.id, specialtyId))
      

    return {
      success: true,
      message: "Patient updated successfully",
    };
  } catch (err: any) {
    console.error("registerPatient error:", err);
    return { success: false, error: err?.message ?? "Failed to register patient" };
  }
}
