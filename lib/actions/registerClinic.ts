
"use server";


import { ClinicFormValidation} from "@/lib/validation";
import { z } from "zod";
import { db } from "@/database/drizzle";
import { clinics} from "@/database/schema";

type ClinicInput = z.infer<typeof ClinicFormValidation>


export async function registerClinic(data: ClinicInput, locationData: any, userId: string) {
  try {

    const [inserted] = await db
      .insert(clinics)
      .values({
        userId: userId,
        clinicName: data.clinicName,
        clinicProfile: data.clinicProfile,
        logo: data.logo,
        location: locationData,
        city: data.city,
        phoneNumber: data.phoneNumber,
        country: data.country,
        address: data.address,
        ownerName: data.ownerName,
        managerName: data.managerName,
        status: data.status,
        businessHours: data.businessHours, 
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return { success: true, data: inserted };
  } catch (err: any) {
    console.error("Register clinic error:", err);
    return { success: false, error: err?.message ?? "Failed to register clinic" };
  }
}
