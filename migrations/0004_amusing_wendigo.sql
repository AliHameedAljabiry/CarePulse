CREATE TYPE "public"."clinic_status" AS ENUM('OPEN', 'CLOSED', 'MAINTENANCE', 'VACATION');--> statement-breakpoint
CREATE TABLE "clinics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"clinic_name" varchar(255) NOT NULL,
	"clinic_profile" varchar(255) NOT NULL,
	"location" text,
	"clinic_status" "clinic_status" DEFAULT 'OPEN' NOT NULL,
	"address" varchar(500) NOT NULL,
	"city" varchar(100) NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"country" varchar(100) DEFAULT 'Iraq' NOT NULL,
	"owner_name" varchar(255),
	"manager_name" varchar(255),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"business_hours" json,
	CONSTRAINT "clinics_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "insurances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"insurance_accepted" varchar(200) NOT NULL,
	CONSTRAINT "insurances_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "galleries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"image" varchar(500),
	"description" text,
	CONSTRAINT "galleries_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "specialties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"specialty" varchar(100) NOT NULL,
	CONSTRAINT "specialties_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "schedule" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "clinics" ADD CONSTRAINT "clinics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insurances" ADD CONSTRAINT "insurances_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "galleries" ADD CONSTRAINT "galleries_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "specialties" ADD CONSTRAINT "specialties_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE cascade ON UPDATE no action;