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
    const newAppointments = await db
      .insert(appointments)
      .values({
        patientId: patientId,
        doctor: values.doctor,
        schedule: new Date(values.schedule),
        reason: values.reason!,
        status: status,
        note: values.note,
      })
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
