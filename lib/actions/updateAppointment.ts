"use server";


import { db } from "@/database/drizzle";
import { appointments } from "@/database/schema";
import { Appointment } from "@/types/appwrite.types";
import { eq } from "drizzle-orm";

interface Props extends Partial<Appointment> {
  patientId?: string;
  appointmentId?: string;
}


export const updateAppointment = async (params: Props) => {
  try {
    const { patientId, appointmentId,  status,  ...values } = params;
    await db
      .update(appointments)
      .set({
        patientId: patientId as any,
        doctor: values.doctor,
        schedule: new Date(values.schedule as string | Date),
        reason: values.reason!,
        status: status ?? "PENDING",
        note: values.note ?? "",
      } as any)
      .where(eq(appointments.id, appointmentId as string))

    return {
      success: true,
      message: "Appointment updated successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while updating the appointment",
    };
  }
};
