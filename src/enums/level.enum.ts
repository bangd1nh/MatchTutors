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

export const LEVEL_LABELS: Record<Level, string> = {
   [Level.GRADE_1]: "Grade 1",
   [Level.GRADE_2]: "Grade 2",
   [Level.GRADE_3]: "Grade 3",
   [Level.GRADE_4]: "Grade 4",
   [Level.GRADE_5]: "Grade 5",
   [Level.GRADE_6]: "Grade 6",
   [Level.GRADE_7]: "Grade 7",
   [Level.GRADE_8]: "Grade 8",
   [Level.GRADE_9]: "Grade 9",
   [Level.GRADE_10]: "Grade 10",
   [Level.GRADE_11]: "Grade 11",
   [Level.GRADE_12]: "Grade 12",
   [Level.UNIVERSITY]: "University",
};