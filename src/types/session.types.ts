export enum SessionStatus {
  SCHEDULED = "SCHEDULED",
  CONFIRMED = "CONFIRMED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  NOT_CONDUCTED = "NOT_CONDUCTED",
  DISPUTED = "DISPUTED",
}

export interface IStudentConfirmation {
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  confirmedAt?: Date;
}

export interface IAttendanceConfirmation {
  tutor: {
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    decidedAt?: Date;
  };
  student: {
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    decidedAt?: Date;
  };
  finalizedAt?: Date;
  isAttended: boolean;
}

export interface IAttendanceWindow {
  tutorDeadline: Date;
  studentDeadline: Date;
}

export interface IAttendanceLogEntry {
  userRole: "TUTOR" | "STUDENT" | "SYSTEM";
  action: "CHECKED_IN" | "ABSENT_AUTO" | "ABSENT_MANUAL" | "DISPUTE_OPENED";
  note?: string;
  createdAt: Date;
}

export interface IAbsenceInfo {
  tutorAbsent?: boolean;
  studentAbsent?: boolean;
  decidedAt?: Date;
  reason?: string;
  evidenceUrls?: string[];
}

export interface IDisputeInfo {
  status: "OPEN" | "RESOLVED";
  openedBy: string;
  reason: string;
  evidenceUrls: string[];
  openedAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  decision?: SessionStatus.COMPLETED | SessionStatus.NOT_CONDUCTED;
  adminNotes?: string;
}

export interface ICancellationInfo {
  cancelledBy: string;
  reason: string;
  cancelledAt: Date;
}

export interface ISession {
  _id: string;
  teachingRequestId?: string;
  learningCommitmentId: string;
  startTime: Date;
  endTime: Date;
  status: SessionStatus;
  isTrial?: boolean;
  createdBy: string;
  studentConfirmation?: IStudentConfirmation;
  attendanceConfirmation?: IAttendanceConfirmation;
  attendanceWindow?: IAttendanceWindow;
  attendanceLogs?: IAttendanceLogEntry[];
  absence?: IAbsenceInfo;
  dispute?: IDisputeInfo;
  cancellation?: ICancellationInfo;
  isDeleted?: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  materials?: string[];
  quizIds: string[];
  reminders?: any[];
  location?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
