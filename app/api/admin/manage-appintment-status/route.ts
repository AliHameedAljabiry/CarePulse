import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { appointments } from "@/database/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { appointmentId, status } = await req.json();
    const session = await auth()

    if (!session?.user?.id || !["USER", "ADMIN"].includes((session?.user as any)?.role)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    await db.update(appointments)
      .set({ status })
      .where(eq(appointments.id, appointmentId));

    return NextResponse.json({ success: true });
  } catch (error) {
   
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
