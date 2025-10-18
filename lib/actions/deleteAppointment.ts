'use server';

import { db } from "@/database/drizzle";
import { appointments } from "@/database/schema";
import { eq } from "drizzle-orm";

export const deleteAppointment = async ({appointmentId}: {appointmentId: string}) => {
    try {
        await db
        .delete(appointments)
        .where(eq(appointments.id, appointmentId))
        
    }catch (error) {
        console.log(error)
    }
}