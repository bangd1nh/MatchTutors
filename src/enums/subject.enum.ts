export enum Subject {
   ACCOUNTING = "ACCOUNTING",
   ADDITIONAL_MATHS = "ADDITIONAL_MATHS",
   BIOLOGY = "BIOLOGY",
   BUSINESS_STUDIES = "BUSINESS_STUDIES",
   CHEMISTRY = "CHEMISTRY",
   CHINESE = "CHINESE",
   COMPUTER_SCIENCE = "COMPUTER_SCIENCE",
   ECONOMICS = "ECONOMICS",
   ENGLISH = "ENGLISH",
   FREE_CONSULTATION = "FREE_CONSULTATION",
   FURTHER_MATHS = "FURTHER_MATHS",
   GEOGRAPHY = "GEOGRAPHY",
   GUITAR = "GUITAR",
   HISTORY = "HISTORY",
   MALAY = "MALAY",
   MATHEMATICS = "MATHEMATICS",
   ORGAN = "ORGAN",
   PHONICS_ENGLISH = "PHONICS_ENGLISH",
   PHYSICS = "PHYSICS",
   PIANO = "PIANO",
   RISE_PROGRAM = "RISE_PROGRAM",
   SCIENCE = "SCIENCE",
   SWIMMING = "SWIMMING",
   TAMIL = "TAMIL",
   TENNIS = "TENNIS",
   WORLD_LITERATURE = "WORLD_LITERATURE",
   YOGA = "YOGA",
}

export const SUBJECT_VALUES = Object.values(Subject) as Subject[];

export const SUBJECT_LABELS: Record<string, string> = Object.fromEntries(
   SUBJECT_VALUES.map((s) => [
      s,
      s
         .toLowerCase()
         .replace(/_/g, " ") // replace underscores with spaces
         .replace(/\b\w/g, (c) => c.toUpperCase()), // capitalize each word
   ])
);
