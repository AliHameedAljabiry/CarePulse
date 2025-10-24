export const GenderOptions = ["Male", "Female"];

export const PatientFormDefaultValues = {
  birthDate: new Date(Date.now()),
  gender: "Male" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Birth Certificate",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Social Security Card",
  "State ID Card",
  "Student ID Card",
  "Voter ID Card",
];

export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "John Green",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Leila Cameron",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "David Livingston",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Evan Peter",
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "Jane Powell",
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Alex Ramirez",
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Jasmine Lee",
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Alyana Cruz",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Hardik Sharma",
  },
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};

export const FIELD_NAMES = {
  fullName: "Full name",
  email: "Email",
  password: "Password",
  confirmPassword: "Confirm Password",
  phoneNumber: "Phone Number",
};

export const FIELD_TYPES = {
  fullName: "text",
  email: "email",
  password: "password",
  confirmPassword: "password",
  phoneNumber: "text",
};


export const adminSideBarLinks = [
  {
    img: "/icons/admin/home.png",
    route: "/admin",
    text: "Home",
  },
  {
    img: "/icons/admin/users.png",
    route: "/admin/users",
    text: "All Users",
  },
  {
    img: "/icons/admin/docs.png",
    route: "/admin/docs",
    text: "All Docs",
  },
  
  {
    img: "/icons/admin/folder.svg",
    route: "/admin/projects",
    text: "All Projects",
  },
  
];

export const Countries = [
  { name: "Afghanistan", code: "AF"},
  { name: "Albania", code: "AL"},
  { name: "Algeria", code: "DZ"},
  { name: "Argentina", code: "AR"},
  { name: "Australia", code: "AU"},
  { name: "Brazil", code: "BR"},
  { name: "Canada", code: "CA"},
  { name: "China", code: "CN"},
  { name: "Egypt", code: "EG"},
  { name: "France", code: "FR"},
  { name: "Germany", code: "DE"},
  { name: "India", code: "IN"},
  { name: "Indonesia", code: "ID"},
  { name: "Iraq", code: "IQ"},
  { name: "Italy", code: "IT"},
  { name: "Japan", code: "JP"},
  { name: "Jordan", code: "JO"},
  { name: "Kuwait", code: "KW"},
  { name: "Lebanon", code: "LB"},
  { name: "Malaysia", code: "MY"},
  { name: "Mexico", code: "MX"},
  { name: "Pakistan", code: "PK"},
  { name: "Russia", code: "RU"},
  { name: "Saudi Arabia", code: "SA"},
  { name: "South Africa", code: "ZA"},
  { name: "South Korea", code: "KR"},
  { name: "Spain", code: "ES"},
  { name: "Turkey", code: "TR"},
  { name: "United Arab Emirates", code: "AE"},
  { name: "United Kingdom", code: "GB"},
  { name: "United States", code: "US"},
]

export const StatusOptions = ["OPEN", "CLOSED", "MAINTENANCE", "VACATION"]
