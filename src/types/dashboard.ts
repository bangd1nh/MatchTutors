export interface LimitRemaining {
   maxStudents: number;
   currentStudents: number;
   studentsRemaining: number;
   maxQuiz: number;
   currentQuiz: number;
   quizRemaining: number;
}

export interface TeachingRequests {
   PENDING: number;
   ACCEPTED: number;
   REJECTED: number;
}

export interface ChartDataPoint {
   _id: string;
   count?: number;
   totalAmount?: number;
}

export interface Spending {
   chartData: ChartDataPoint[];
   totalSpent: number;
}

export interface Contribution {
   date: string;
   dayOfWeek: number;
   count: number;
}

export interface SessionStatus {
   day: string;
   [key: string]: any; // for SCHEDULED, COMPLETED, etc.
}

export interface SubjectAnalysis {
   subject: string;
   offered: number;
   requested: number;
}

export interface DashboardData {
   limitRemaining: LimitRemaining;
   teachingRequests: TeachingRequests;
   quizCreated: ChartDataPoint[];
   spending: Spending;
   contributionGraph: Contribution[];
   sessionStatus: SessionStatus[];
   commitmentStats: ChartDataPoint[];
   subjectAnalysis: SubjectAnalysis[];
}
