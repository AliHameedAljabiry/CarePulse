import {
    date, 
    uuid, 
    varchar, 
    integer, 
    pgTable, 
    text, 
    timestamp,
    boolean, 
    pgEnum,
    json 
} from 'drizzle-orm/pg-core';



export const STATUS_ENUM = pgEnum('status', [ 
    'PENDING', 
    'APPROVED', 
    'REJECTED'
]);

export const ROLE_ENUM = pgEnum('role', [
    'USER', 
    'ADMIN'
]);

export const users = pgTable('users', {
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    phoneNumber: varchar('phone_number', { length: 20 }).notNull(),
    status: STATUS_ENUM('status').notNull().default('PENDING'),
    role: ROLE_ENUM('role').notNull().default('USER'),
    lastActivityDate: date('last_activity_date').notNull().defaultNow(),
    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow(),
    image: varchar("image", { length: 500 }),
    username: varchar("username", { length: 100 }),
    passwordResetToken: text("password_reset_token"),
    passwordResetExpires: timestamp("password_reset_expires", { mode: 'date' }),
});

// Enum for gender
export const GENDER_ENUM = pgEnum("gender", ["Male", "Female"]);

export const patient = pgTable("patient", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  birthDate: date("birth_date").notNull(),
  gender: GENDER_ENUM("gender").notNull(),

  address: varchar("address", { length: 500 }).notNull(),
  occupation: varchar("occupation", { length: 500 }).notNull(),

  emergencyContactName: varchar("emergency_contact_name", { length: 50 }).notNull(),
  emergencyContactNumber: varchar("emergency_contact_number", { length: 20 }).notNull(),

  primaryPhysician: varchar("primary_physician", { length: 255 }).notNull(),

  insuranceProvider: varchar("insurance_provider", { length: 50 }).notNull(),
  insurancePolicyNumber: varchar("insurance_policy_number", { length: 50 }).notNull(),

  allergies: text("allergies"),
  currentMedication: text("current_medication"),
  familyMedicalHistory: text("family_medical_history"),
  pastMedicalHistory: text("past_medical_history"),

  identificationType: varchar("identification_type", { length: 100 }),
  identificationNumber: varchar("identification_number", { length: 100 }),
  identificationDocument: varchar("identification_document", { length: 500 }),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export type PatientInput = typeof patient.$inferInsert;
export type Patient = typeof patient.$inferSelect;


export const APPOINTMENT_STATUS_ENUM = pgEnum('appointment_status', [ 
    'SCHEDULED', 
    'CANCELLED', 
    'PENDING'
]);

export const appointments = pgTable("appointments", {
  id: uuid().notNull().primaryKey().defaultRandom().unique(),
  patientId: uuid("patient_id")
    .notNull()
    .references(() => patient.id, { onDelete: "cascade" }),
  doctor: varchar("doctor", { length: 255 }).notNull(),
  schedule: timestamp("schedule", { withTimezone: true, mode: 'date' }).notNull(),
  reason: varchar("reason", { length: 255 }).notNull(),
  note: varchar("note", { length: 255 }).notNull(),
  status: APPOINTMENT_STATUS_ENUM('appointment_status').notNull().default('PENDING'),
  cancellationReason: varchar("cancellationReason", { length: 255 })

})


export const CLINIC_STATUS_ENUM = pgEnum('clinic_status', [ 
    'OPEN', 
    'CLOSED',
    'MAINTENANCE',
    'VACATION'
]);

export const clinics = pgTable("clinics", {
  id: uuid().notNull().primaryKey().defaultRandom().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  clinicName: varchar("clinic_name", { length: 255 }).notNull(),
  clinicProfile: varchar("clinic_profile", { length: 255 }).notNull(),
  logo: varchar("logo", { length: 255 }).notNull(),
  location: text("location").notNull(),
  status: CLINIC_STATUS_ENUM('clinic_status').notNull().default('OPEN'),
  address: varchar("address", { length: 500 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }).notNull(),
  country: varchar("country", { length: 100 }).notNull().default('Iraq'),
  ownerName: varchar("owner_name", { length: 255 }),
  managerName: varchar("manager_name", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),

  // Business Hours (store as JSON)
  businessHours: json("business_hours").$type<{
    monday?: { open: string; close: string; closed: boolean };
    tuesday?: { open: string; close: string; closed: boolean };
    wednesday?: { open: string; close: string; closed: boolean };
    thursday?: { open: string; close: string; closed: boolean };
    friday?: { open: string; close: string; closed: boolean };
    saturday?: { open: string; close: string; closed: boolean };
    sunday?: { open: string; close: string; closed: boolean };
  }>(),

})

export const galleries = pgTable( "galleries", {
  id: uuid().notNull().primaryKey().defaultRandom().unique(),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinics.id, { onDelete: "cascade" }),
  image: varchar("image", { length: 500 }),
  description: text("description")
})

export const specialties = pgTable( "specialties", {
  id: uuid().notNull().primaryKey().defaultRandom().unique(),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinics.id, { onDelete: "cascade" }),
  specialty: varchar("specialty", { length: 100 }).notNull(),
})

export const insurances = pgTable( "insurances", {
  id: uuid().notNull().primaryKey().defaultRandom().unique(),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinics.id, { onDelete: "cascade" }),
  insuranceAccepted: varchar("insurance_accepted", { length: 200 }).notNull(),
})

export const doctors = pgTable( "doctors", {
  id: uuid().notNull().primaryKey().defaultRandom().unique(),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinics.id, { onDelete: "cascade" }),
  specialtyId: uuid("specialty_id")
    .notNull()
    .references(() => specialties.id, { onDelete: "cascade" }),
  doctorName: varchar("doctor_name", { length: 200 }).notNull(),
  gender: GENDER_ENUM("gender").notNull(),
  degree: text("degree_description"),
  image: varchar("image", { length: 500 }),
})