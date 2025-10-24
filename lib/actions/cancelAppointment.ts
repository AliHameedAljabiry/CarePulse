"use server";


import { db } from "@/database/drizzle";
import { appointments } from "@/database/schema";
import { Appointment } from "@/types/appwrite.types";
import { eq } from "drizzle-orm";

interface Props extends Partial<Appointment> {
  patientId?: string;
  appointmentId?: string;
}


export const cancelAppointment = async (params: Props) => {
  try {
    const { patientId, appointmentId,  status,  ...values } = params;

    let scheduleDate: Date;

    if (values.schedule instanceof Date) {
      scheduleDate = values.schedule;
    } else if (typeof values.schedule === 'string') {
      scheduleDate = new Date(values.schedule);
    } else {
      scheduleDate = new Date();
    }

    await db
      .update(appointments)
      .set({
        patientId: patientId as string,
        doctor: values.doctor,
        schedule: scheduleDate,
        reason: values.reason!,
        status: status,
        note: values.note ?? "",
        cancellationReason: values.cancellationReason ?? "",
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
