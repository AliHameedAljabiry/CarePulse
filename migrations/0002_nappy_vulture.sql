CREATE TYPE "public"."gender" AS ENUM('Male', 'Female');--> statement-breakpoint
CREATE TABLE "patient" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"birth_date" date NOT NULL,
	"gender" "gender" NOT NULL,
	"address" varchar(500) NOT NULL,
	"occupation" varchar(500) NOT NULL,
	"emergency_contact_name" varchar(50) NOT NULL,
	"emergency_contact_number" varchar(20) NOT NULL,
	"primary_physician" varchar(255) NOT NULL,
	"insurance_provider" varchar(50) NOT NULL,
	"insurance_policy_number" varchar(50) NOT NULL,
	"allergies" text,
	"current_medication" text,
	"family_medical_history" text,
	"past_medical_history" text,
	"identification_type" varchar(100),
	"identification_number" varchar(100),
	"identification_document" varchar(500),
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "patient_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "patient" ADD CONSTRAINT "patient_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;