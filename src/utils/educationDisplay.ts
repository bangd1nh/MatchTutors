import { Level } from "@/enums/level.enum";
import { Subject } from "@/enums/subject.enum";
import { ClassType } from "../enums/classType.enum";

export const LEVEL_LABELS_VI: Record<string, string> = {
   [Level.GRADE_1]: "Lớp 1",
   [Level.GRADE_2]: "Lớp 2",
   [Level.GRADE_3]: "Lớp 3",
   [Level.GRADE_4]: "Lớp 4",
   [Level.GRADE_5]: "Lớp 5",
   [Level.GRADE_6]: "Lớp 6",
   [Level.GRADE_7]: "Lớp 7",
   [Level.GRADE_8]: "Lớp 8",
   [Level.GRADE_9]: "Lớp 9",
   [Level.GRADE_10]: "Lớp 10",
   [Level.GRADE_11]: "Lớp 11",
   [Level.GRADE_12]: "Lớp 12",
   [Level.UNIVERSITY]: "Đại học",
   HIGH_SCHOOL: "THPT",
   MIDDLE_SCHOOL: "THCS",
   ELEMENTARY: "Tiểu học",
};

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

export const CLASS_TYPE_VALUES_VI: Record<string, string> = {
   [ClassType.IN_PERSON]: "Trực tiếp",
   [ClassType.ONLINE]: "Trực tuyến",
};

export const getLevelLabelVi = (level: Level | string): string => {
   const key = String(level);
   return LEVEL_LABELS_VI[key] || key.replace(/_/g, " ");
};

export const getSubjectLabelVi = (subject: Subject | string): string => {
   const key = String(subject);
   return SUBJECT_LABELS_VI[key] || key.replace(/_/g, " ");
};

export const getClassTypeLabelVi = (classType: ClassType | string): string => {
   const key = String(classType);
   return CLASS_TYPE_VALUES_VI[key] || key.replace(/_/g, " ");
};
