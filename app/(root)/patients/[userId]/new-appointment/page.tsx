
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { db } from "@/database/drizzle";
import { patient } from "@/database/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";

// import { AppointmentForm } from "@/components/forms/AppointmentForm";


const Appointment = async({ params }: { params: Promise<{ userId: string }> } ) => {
  const userId = (await params).userId;
    
    const currentPatient = await db.select().from(patient).where(eq(patient.userId, userId))
    const patientRecord = currentPatient[0]; 
    console.log("patientId", patientRecord?.id)

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-3xl flex-1 justify-between">
          <AppointmentForm
              type="create"
              patientId={patientRecord?.id}
              userId={userId}
          />
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1500}
        width={1500}
        alt="appointment"
        className="side-img max-w-[40%] bg-bottom"
      />
    </div>
  );
};

export default Appointment;