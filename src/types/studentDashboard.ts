// types/studentDashboard.ts
export interface NextSessionDTO {
  id: string;
  startTime: string;
  endTime: string;
  tutorName: string;
  subject: string;
  status: string;
  studentConfirmation?: { status: string };
}

export interface QuickStatsDTO {
  activeCommitments: number;
  favoriteTutors: number;
  totalPaidAmount: number;
  totalReviews: number;
}

export interface SessionStatsDTO {
  completedSessions: number;
  absentSessions: number;
  quizzesCompleted: number;
}

export interface TopCourseDTO {
  id: string;
  tutorName: string;
  subject: string;
  level: string;
  progress: { completed: number; total: number; percentage: number };
  studentPaidAmount?: number;
  absentSessions: number;
}

export interface TimelineItemDTO {
  type: "SESSION" | "QUIZ" | "REVIEW" | "TEACHING_REQUEST";
  title: string;
  description: string;
  status: string;
  date: string;
  metadata?: Record<string, any>;
}

export interface StudentDashboardDTO {
  nextSession: NextSessionDTO | null;
  quickStats: QuickStatsDTO;
  sessionStats: SessionStatsDTO;
  timeline: TimelineItemDTO[];
  topCourses: TopCourseDTO[];
}