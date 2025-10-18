import { auth } from '@/auth';
import { db } from '@/database/drizzle';
import { appointments, patient, users } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const session = await auth();
        if(!session || (session && (session.user as any)?.role !== 'ADMIN' )) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

       const allAppointments = await db.select().from(appointments)

         .leftJoin(patient, eq(appointments.patientId, patient.id))
            .leftJoin(users, eq(patient.userId, users.id));
        return NextResponse.json(allAppointments);
    }catch (error) {

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}