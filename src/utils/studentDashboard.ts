export const TIMELINE_TYPE_TRANSLATIONS: Record<string, string> = {
    SESSION: "Buổi học",
    QUIZ: "Bài kiểm tra",
    REVIEW: "Đánh giá",
    TEACHING_REQUEST: "Yêu cầu học tập",
};

// Session Status
export const SESSION_STATUS_TRANSLATIONS: Record<string, string> = {
    SCHEDULED: "Đã lên lịch",
    CONFIRMED: "Đã xác nhận",
    REJECTED: "Bị từ chối",
    CANCELLED: "Đã hủy",
    COMPLETED: "Hoàn thành",
    NOT_CONDUCTED: "Không diễn ra",
    DISPUTED: "Tranh chấp",
};

// Student confirmation status
export const STUDENT_CONFIRMATION_STATUS_TRANSLATIONS: Record<string, string> = {
    PENDING: "Chưa xác nhận",
    CONFIRMED: "Đã xác nhận",
    REJECTED: "Đã từ chối",
};

// Teaching Request Status
export const TEACHING_REQUEST_STATUS_TRANSLATIONS: Record<string, string> = {
    PENDING: "Chờ gia sư phản hồi",
    ACCEPTED: "Đã chấp nhận",
    REJECTED: "Đã từ chối",
    COMPLETED: "Hoàn thành",
};

// Quiz Status
export const QUIZ_STATUS_TRANSLATIONS: Record<string, string> = {
    COMPLETED: "Hoàn thành",
    PENDING: "Chưa làm",
    FAILED: "Không đạt",
};

// Review Status
export const REVIEW_STATUS_TRANSLATIONS: Record<string, string> = {
    COMPLETED: "Đã gửi",
    PENDING: "Chưa gửi",
};

// Unified helper for timeline item status
export const translateStatus = (type: string, status: string, field?: string) => {
    const s = status?.toUpperCase?.() || status;

    switch (type) {
        case "SESSION":
            return SESSION_STATUS_TRANSLATIONS[s] || status;
        case "TEACHING_REQUEST":
            return TEACHING_REQUEST_STATUS_TRANSLATIONS[s] || status;
        case "QUIZ":
            return QUIZ_STATUS_TRANSLATIONS[s] || status;
        case "REVIEW":
            return REVIEW_STATUS_TRANSLATIONS[s] || status;
        case "STUDENT_CONFIRMATION":
            return STUDENT_CONFIRMATION_STATUS_TRANSLATIONS[s] || status;
        default:
            return status;
    }
};

// Translate type
export const translateType = (type: string) =>
    TIMELINE_TYPE_TRANSLATIONS[type] || type;
