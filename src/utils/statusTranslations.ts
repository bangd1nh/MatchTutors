import { SessionStatus } from "../enums/session.enum";

type StatusMap = {
  [key: string]: string;
};

export const sessionStatusToVietnamese: StatusMap = {
  [SessionStatus.SCHEDULED]: "Đã lên lịch",
  [SessionStatus.CONFIRMED]: "Đã xác nhận",
  [SessionStatus.REJECTED]: "Từ chối",
  [SessionStatus.CANCELLED]: "Đã hủy",
  [SessionStatus.COMPLETED]: "Hoàn thành",
  [SessionStatus.NOT_CONDUCTED]: "Không diễn ra",
  [SessionStatus.DISPUTED]: "Đang tranh chấp"
};

export const learningCommitmentStatusToVietnamese: StatusMap = {
  "pending_agreement": "Chờ xác nhận",
  "active": "Đang hoạt động",
  "completed": "Hoàn thành",
  "cancelled": "Đã hủy",
  "cancellation_pending": "Chờ hủy",
  "admin_review": "Chờ xử lý",
  "rejected": "Từ chối"
};

export const translateSessionStatus = (status: string): string => {
  return sessionStatusToVietnamese[status] || status;
};

export const translateLearningCommitmentStatus = (status: string): string => {
  return learningCommitmentStatusToVietnamese[status] || status;
};

export const translatePieData = (data: Array<{ status: string; value: number }>, type: 'session' | 'commitment'): Array<{ status: string; value: number }> => {
  if (!data) return [];
  
  return data.map(item => ({
    ...item,
    status: type === 'session' 
      ? translateSessionStatus(item.status)
      : translateLearningCommitmentStatus(item.status)
  }));
};
