import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { patient } from "@/database/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET() {
    const session = await auth()
    const userId = session?.user?.id;
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }
    
    const currentPatient = await db
        .select()
        .from(patient)
        .where(eq(patient.userId, userId))
        .limit(1)

    return NextResponse.json(currentPatient[0])
}



