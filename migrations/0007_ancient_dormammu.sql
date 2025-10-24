ALTER TABLE "clinics" ALTER COLUMN "clinic_profile" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "clinics" ALTER COLUMN "location" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "clinics" ADD COLUMN "logo" varchar(255);