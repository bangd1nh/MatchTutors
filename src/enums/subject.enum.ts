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

export const SUBJECT_LABELS_VI: Record<string, string> = {
   [Subject.ACCOUNTING]: "Kế toán",
   [Subject.ADDITIONAL_MATHS]: "Toán nâng cao",
   [Subject.BIOLOGY]: "Sinh học",
   [Subject.BUSINESS_STUDIES]: "Kinh doanh",
   [Subject.CHEMISTRY]: "Hóa học",
   [Subject.CHINESE]: "Tiếng Trung",
   [Subject.COMPUTER_SCIENCE]: "Khoa học máy tính",
   [Subject.ECONOMICS]: "Kinh tế học",
   [Subject.ENGLISH]: "Tiếng Anh",
   [Subject.FREE_CONSULTATION]: "Tư vấn miễn phí",
   [Subject.FURTHER_MATHS]: "Toán nâng cao",
   [Subject.GEOGRAPHY]: "Địa lý",
   [Subject.GUITAR]: "Guitar",
   [Subject.HISTORY]: "Lịch sử",
   [Subject.MALAY]: "Tiếng Malay",
   [Subject.MATHEMATICS]: "Toán học",
   [Subject.ORGAN]: "Organ",
   [Subject.PHONICS_ENGLISH]: "Phát âm tiếng Anh",
   [Subject.PHYSICS]: "Vật lý",
   [Subject.PIANO]: "Piano",
   [Subject.RISE_PROGRAM]: "Chương trình RISE",
   [Subject.SCIENCE]: "Khoa học",
   [Subject.SWIMMING]: "Bơi lội",
   [Subject.TAMIL]: "Tiếng Tamil",
   [Subject.TENNIS]: "Tennis",
   [Subject.WORLD_LITERATURE]: "Văn học thế giới",
   [Subject.YOGA]: "Yoga",
};