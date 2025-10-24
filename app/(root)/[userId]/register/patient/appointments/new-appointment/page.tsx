
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { db } from "@/database/drizzle";
import { patient } from "@/database/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";




const Appointment = async({ params }: { params: Promise<{ userId: string }> } ) => {
  const patientId = (await params).userId;
   
    console.log("patientId", patientId)

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-3xl flex-1 justify-between">
          <AppointmentForm
              type="create"
              patientId={patientId}
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