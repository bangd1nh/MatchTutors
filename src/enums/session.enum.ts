export enum SessionStatus {
   SCHEDULED = "SCHEDULED",
   CONFIRMED = "CONFIRMED", // Học sinh xác nhận tham gia
   REJECTED = "REJECTED", // Học sinh từ chối (nếu cần)
   COMPLETED = "COMPLETED", // Đã hoàn thành
   NOT_CONDUCTED = "NOT_CONDUCTED", // Không diễn ra
}

export const SESSION_STATUS_VALUES = Object.values(SessionStatus);
