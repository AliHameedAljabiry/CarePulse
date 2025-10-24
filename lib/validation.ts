import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),

  email: z.string().email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),
  confirmPassword: z.string().min(6, 'Confirm Password Does not match'),  
  phoneNumber: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match", 
  path: ["confirmPassword"], 
    
});
// ------------------------------------------------------------------------------
export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password is required'),
});

// ------------------------------------------------------------------------------

export const PatientFormValidation = z.object({
  phone: z.string().optional(),
  birthDate: z.coerce.date(),
  gender: z.enum(["Male", "Female", "Other"]),

  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters"),

  occupation: z
    .string()
    .min(2, "Occupation must be at least 2 characters")
    .max(500, "Occupation must be at most 500 characters"),

  emergencyContactName: z
    .string()
    .min(2, "Contact name must be at least 2 characters")
    .max(50, "Contact name must be at most 50 characters"),

  emergencyContactNumber: z
    .string()
    .refine(
      (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber),
      "Invalid phone number"
    ),

  primaryPhysician: z.string().min(2, "Select at least one doctor"),

  insuranceProvider: z
    .string()
    .min(2, "Insurance name must be at least 2 characters")
    .max(50, "Insurance name must be at most 50 characters"),

  insurancePolicyNumber: z
    .string()
    .min(2, "Policy number must be at least 2 characters")
    .max(50, "Policy number must be at most 50 characters"),

  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocument: z.custom<File[]>().optional(),

  treatmentConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to treatment in order to proceed",
    }),

  disclosureConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to disclosure in order to proceed",
    }),

  privacyConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to privacy in order to proceed",
    }),
});

// ------------------------------------------------------------------------------
export const CreateAppointmentSchema = z.object({
  doctor: z.string().min(2, "Select at least one doctor"),
  schedule: z.date({
  required_error: "Please select a date and time",
}),

  reason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),

  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

// ------------------------------------------------------------------------------

export const ScheduleAppointmentSchema = z.object({
  doctor: z.string().min(2, "Select at least one doctor"),
   schedule: z.date({
  required_error: "Please select a date and time",
}),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

// ------------------------------------------------------------------------------

export const CancelAppointmentSchema = z.object({
  doctor: z.string().min(2, "Select at least one doctor"),
  schedule: z.date({
  required_error: "Please select a date and time",
}),
  reason: z.string().optional(),
  note: z.string().optional(),

  cancellationReason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
});

// ------------------------------------------------------------------------------
export function getAppointmentSchema(type: string) {
  switch (type) {
    case "create":
      return CreateAppointmentSchema;
    case "cancel":
      return CancelAppointmentSchema;
    default:
      return ScheduleAppointmentSchema;
  }
}


// -----------------------------------------------------------------------------------

// Clinic validations

// Business Hours Schema
export const BusinessHoursSchema = z.object({
  monday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    closed: z.boolean().default(false)
  }).optional(),
  tuesday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    closed: z.boolean().default(false)
  }).optional(),
  wednesday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    closed: z.boolean().default(false)
  }).optional(),
  thursday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    closed: z.boolean().default(false)
  }).optional(),
  friday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    closed: z.boolean().default(false)
  }).optional(),
  saturday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    closed: z.boolean().default(false)
  }).optional(),
  sunday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    closed: z.boolean().default(false)
  }).optional()
}).refine((data) => {
  // Validate that at least one day is not closed
  const days = Object.values(data);
  return days.some(day => day && !day.closed);
}, {
  message: "At least one day must be open",
  path: ["businessHours"]
});


export const ClinicFormValidation = z.object({
  clinicName: z
    .string()
    .min(2, "Clinic name must be at least 2 characters")
    .max(255, "Clinic name must be at most 255 characters")
    .trim(),

  clinicProfile: z.custom<File[]>().optional(),
  logo: z.custom<File[]>().optional(),

  location: z
    .string()
    .min(5, "Location must be at least 5 characters")
    .max(1000, "Location must be at most 1000 characters")
    .optional()
    .or(z.literal("")),
    
  

  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters")
    .trim(),

  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City must be at most 100 characters")
    .trim(),

  phoneNumber: z
    .string()
    .min(8, "Phone number must be at least 8 characters")
    .max(20, "Phone number must be at most 20 characters")
    .refine((phone) => /^[\+]?[0-9\s\-\(\)]{8,20}$/.test(phone), "Invalid phone number format"),

  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country must be at most 100 characters")
    .default("Iraq"),

  
 
    ownerName: z
    .string()
    .min(2, "Owner name must be at least 2 characters")
    .max(255, "Owner name must be at most 255 characters")
    .optional()
    .or(z.literal("")),

  managerName: z
    .string()
    .min(2, "Manager name must be at least 2 characters")
    .max(255, "Manager name must be at most 255 characters")
    .optional()
    .or(z.literal("")),

  businessHours: BusinessHoursSchema.optional().default({
    sunday: { open: "09:00", close: "13:00", closed: false },
    monday: { open: "09:00", close: "17:00", closed: false },
    tuesday: { open: "09:00", close: "17:00", closed: false },
    wednesday: { open: "09:00", close: "17:00", closed: false },
    thursday: { open: "09:00", close: "17:00", closed: false },
    friday: { open: "09:00", close: "17:00", closed: true },
    saturday: { open: "09:00", close: "13:00", closed: false },
  }),

  status: z.enum(["OPEN", "CLOSED", "MAINTENANCE", "VACATION"], {
    required_error: "Status is required",
    invalid_type_error: "Invalid status value"
  })
})

export const galleryFormValidation = z.object({
  image: z.custom<File[]>().optional(),
  description: z.string()
    .min(5, "description must be at least 5 characters")
    .max(255, "description must be at most 255 characters")
    .optional()
    .or(z.literal("")),
})

export const specialtyFormValidation = z.object({
  specialty: z.string()
    .min(5, "specialty must be at least 5 characters")
    .max(255, "specialty must be at most 255 characters")
    .optional()
    .or(z.literal("")),
 })

export const insuranceFormValidation = z.object({
  insuranceAccepted: z.string()
    .min(5, "insurance must be at least 5 characters")
    .max(255, "insurance must be at most 255 characters")
    .optional()
    .or(z.literal("")),
 })

export const doctorFormValidation = z.object({
  doctorName: z.string()
    .min(5, "doctorName must be at least 5 characters")
    .max(255, "doctorName must be at most 255 characters")
    .optional()
    .or(z.literal("")),
  gender: z.enum(["Male", "Female"]),
  degree: z.string()
    .min(5, "doctorName must be at least 5 characters")
    .max(255, "doctorName must be at most 255 characters")
    .optional()
    .or(z.literal("")),
  image: z.custom<File[]>().optional(),
 })