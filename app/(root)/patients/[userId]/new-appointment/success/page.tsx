import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { db } from "@/database/drizzle";
import { appointments, patient } from "@/database/schema";
import { eq } from "drizzle-orm";

const RequestSuccess = async({ params }: { params: Promise<{ userId: string }> } ) => {
  const userId = (await params).userId;
  const currentPatient = await db.select().from(patient).where(eq(patient.userId, userId))
  const currentPatientId = currentPatient[0]?.id; 
  const appointment = await  db.select().from(appointments).where(eq(appointments.patientId, currentPatientId))
  const currenAppointment= appointment[0]
  console.log(appointment)
  const doctor = Doctors.find(
    (doctor) => doctor.name === currenAppointment?.doctor
  );

  return (
    <div className=" flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted!
          </h2>
          <p>We&apos;ll be in touch shortly to confirm.</p>
        </section>

        <section className="request-details">
          <p>Requested appointment details: </p>
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image!}
              alt="doctor"
              width={100}
              height={100}
              className="size-6"
            />
            <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
          </div>
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
            />
            <p> {formatDateTime(currenAppointment.schedule).dateTime}</p>
          </div>
        </section>

        <Button variant="outline" className="shad-primary-btn" asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
            New Appointment
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default RequestSuccess;