"use server";


import { db } from "@/database/drizzle";
import { appointments } from "@/database/schema";
import { Appointment } from "@/types/appwrite.types";

interface Props extends Partial<Appointment> {
  patientId?: string;
}


export const createAppointment = async (params: Props) => {
  
  try {
    const { patientId, status,  ...values } = params;
    // Ensure proper date handling
    let scheduleDate: string;
    
    if (values.schedule instanceof Date) {
      // Use toISOString() for UTC or toString() for local
      scheduleDate = values.schedule.toISOString();
    } else if (typeof values.schedule === 'string') {
      scheduleDate = values.schedule;
    } else {
      scheduleDate = new Date().toISOString();
    }
    const testDate = new Date('2025-10-19T12:45:00'); 
    
    const newAppointments = await db
      .insert(appointments)
      .values({
        patientId: patientId as any,
        doctor: values.doctor,
        schedule: new Date(scheduleDate),
        reason: values.reason!,
        status: status ?? "PENDING",
        note: values.note ?? "",
      } as any)
      .returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newAppointments[0])),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while creating the appointment",
    };
  }
};
