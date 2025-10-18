import {
    date, 
    uuid, 
    varchar, 
    integer, 
    pgTable, 
    text, 
    timestamp,
    boolean, 
    pgEnum 
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
  schedule: timestamp("schedule", { withTimezone: true }).notNull(),
  reason: varchar("reason", { length: 255 }).notNull(),
  note: varchar("note", { length: 255 }).notNull(),
  status: APPOINTMENT_STATUS_ENUM('appointment_status').notNull().default('PENDING'),
  cancellationReason: varchar("cancellationReason", { length: 255 })

})
