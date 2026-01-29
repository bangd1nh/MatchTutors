// types/review.ts
export enum ReviewVisibilityRequestStatusEnum {
    NONE = "NONE",
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export const REVIEW_VISIBILITY_REQUEST_STATUS_VALUES = Object.values(
    ReviewVisibilityRequestStatusEnum
) as ReviewVisibilityRequestStatusEnum[];

export interface Review {
    _id: string;
    rating: number;
    comment?: string;
    isVisible?: boolean;
    visibilityRequestStatus?: ReviewVisibilityRequestStatusEnum;
    visibilityRequestReason?: string;
    visibilityRequestAdminNote?: string;
    visibilityReviewedAt?: string;
    visibilityReviewedBy?: string;
    reviewerId: {
        _id: string;
        name: string;
        avatarUrl?: string;
    };
    revieweeId: {
        _id: string;
        name: string;
        avatarUrl?: string;
    };
    teachingRequestId: {
        _id: string;
        subject: string;
        level: string;
    };
    createdAt: string;
}
