export enum ViolationTypeEnum {
   SCAM_TUTOR = "SCAM_TUTOR",
   FALSE_FEEDBACK = "FALSE_FEEDBACK",
   SCAM_STUDENT = "SCAM_STUDENT",
}

export const VIOLATION_TYPE_VALUES = Object.values(
   ViolationTypeEnum
) as ViolationTypeEnum[];

export const VIOLATION_TYPE_LABELS_VI: Record<string, string> = {
   [ViolationTypeEnum.SCAM_TUTOR]: "Gia sư lừa đảo",
   [ViolationTypeEnum.FALSE_FEEDBACK]: "Đánh giá sai",
   [ViolationTypeEnum.SCAM_STUDENT]: "Học sinh lừa đảo",
   OTHER: "Khác",
};

export enum ViolationStatusEnum {
   PENDING = "PENDING",
   REVIEWED = "REVIEWED",
   RESOLVED = "RESOLVED",
   REJECTED = "REJECTED",
}

export const VIOLATION_STATUS_VALUES = Object.values(
   ViolationStatusEnum
) as ViolationStatusEnum[];

export const VIOLATION_STATUS_LABELS_VI: Record<string, string> = {
   [ViolationStatusEnum.PENDING]: "Đang chờ",
   [ViolationStatusEnum.REVIEWED]: "Đã xem",
   [ViolationStatusEnum.RESOLVED]: "Đã xử lý",
   [ViolationStatusEnum.REJECTED]: "Đã từ chối",
};
