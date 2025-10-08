export interface Review {
    _id: string
    rating: number
    comment: string
    reviewerId: {
        name: string
        avatarUrl: string
    }
    revieweeId: {
        name: string
        avatarUrl: string
    }
    teachingRequestId: string
    createdAt: string
    helpfulCount?: number
}

