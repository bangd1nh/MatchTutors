export enum SessionStatus {
   SCHEDULED = "SCHEDULED", // Gia sư đã tạo, chờ học sinh xác nhận
   CONFIRMED = "CONFIRMED", // Học sinh đã xác nhận tham gia
   REJECTED = "REJECTED", // Học sinh từ chối
   CANCELLED = "CANCELLED", // Đã hủy bởi một trong hai bên
   COMPLETED = "COMPLETED", // Buổi học đã kết thúc
   NOT_CONDUCTED = "NOT_CONDUCTED", // Không diễn ra
}

export const SESSION_STATUS_VALUES = Object.values(SessionStatus);
