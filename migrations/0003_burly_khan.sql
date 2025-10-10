CREATE TYPE "public"."appointment_status" AS ENUM('SCHEDULED', 'CANCELLED', 'PENDING');--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"doctor" varchar(255) NOT NULL,
	"schedule" date NOT NULL,
	"reason" varchar(255) NOT NULL,
	"note" varchar(255) NOT NULL,
	"appointment_status" "appointment_status" DEFAULT 'PENDING' NOT NULL,
	"cancellationReason" varchar(255),
	CONSTRAINT "appointments_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON DELETE cascade ON UPDATE no action;