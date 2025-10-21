// types/review.ts
export interface Review {
    _id: string;
    rating: number;
    comment?: string;
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
