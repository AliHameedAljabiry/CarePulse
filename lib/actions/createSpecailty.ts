"use server";

import { db } from "@/database/drizzle";
import { specialties} from "@/database/schema";


export async function createSpecailty(data: any, clinicId: any ) {
  try {
    const [inserted] = await db
      .insert(specialties)
      .values({
        clinicId: clinicId,
        specialty: data.specialty
      })
      .returning();

    return { success: true, data: inserted };
  } catch (err: any) {
    console.error("Specailty error:", err);
    return { success: false, error: err?.message ?? "Failed to add Specailty" };
  }
}
