import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { formatDateTime, getDoctorImage } from "@/lib/utils";
import { db } from "@/database/drizzle";
import { appointments, patient } from "@/database/schema";
import { eq } from "drizzle-orm";

const RequestSuccess = async({ params }: { params: Promise<{ userId: string }> } ) => {
  const patientId = (await params).userId;
  const appointment = await  db.select().from(appointments).where(eq(appointments.patientId, patientId))
  const currenAppointment= appointment[0]
  console.log(currenAppointment)
  const doctorImage = getDoctorImage(currenAppointment?.doctor, Doctors);

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
              src={doctorImage}
              alt="doctor"
              width={100}
              height={100}
              className="size-6"
            />
            <p className="whitespace-nowrap">Dr. {currenAppointment?.doctor}</p>
          </div>
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
            />
            <p> {formatDateTime(currenAppointment?.schedule).dateTime}</p>
          </div>
        </section>

        <Button variant="outline" className="shad-primary-btn" asChild>
          <Link href={`/patients/${patientId}/appointments`}>
            See All your Appointments
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default RequestSuccess;