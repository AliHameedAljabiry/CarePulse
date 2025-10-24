CREATE TABLE "doctors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"specialty_id" uuid NOT NULL,
	"doctor_name" varchar(200) NOT NULL,
	"gender" "gender" NOT NULL,
	"degree_description" text,
	"image" varchar(500),
	CONSTRAINT "doctors_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_specialty_id_specialties_id_fk" FOREIGN KEY ("specialty_id") REFERENCES "public"."specialties"("id") ON DELETE cascade ON UPDATE no action;