export enum Level {
   GRADE_1 = "GRADE_1",
   GRADE_2 = "GRADE_2",
   GRADE_3 = "GRADE_3",
   GRADE_4 = "GRADE_4",
   GRADE_5 = "GRADE_5",
   GRADE_6 = "GRADE_6",
   GRADE_7 = "GRADE_7",
   GRADE_8 = "GRADE_8",
   GRADE_9 = "GRADE_9",
   GRADE_10 = "GRADE_10",
   GRADE_11 = "GRADE_11",
   GRADE_12 = "GRADE_12",
   UNIVERSITY = "UNIVERSITY",
}

export const LEVEL_VALUES = Object.values(Level) as Level[];

export const LEVEL_LABELS: Record<string, string> = Object.fromEntries(
   LEVEL_VALUES.map((l) => [
      l,
      l
         .replace("GRADE_", "Grade ") // convert GRADE_1 → Grade 1
         .replace("UNIVERSITY", "University"),
   ])
);

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