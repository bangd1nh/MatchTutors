export interface TutorUser {
   _id: string;
   name: string;
   email?: string;
   phone?: string;
   avatarUrl?: string;
   address?: {
      city?: string;
      street?: string;
   };
   gender?: "MALE" | "FEMALE" | "OTHER";
}

export interface Education {
   institution?: string;
   degree?: string;
   fieldOfStudy?: string;
   startDate?: string;
   endDate?: string;
   description?: string;
   // optional legacy dateRange helper
   dateRange?: { startDate?: string; endDate?: string } | string;
}

export interface Certification {
   _id?: string;
   name?: string;
   description?: string;
   imageUrls?: string[];
   newFiles?: File[];
   tempId?: string;
}

export type TimeSlot = "PRE_12" | "MID_12_17" | "AFTER_17" | string;
export type ClassType = "ONLINE" | "IN_PERSON" | string;

export interface Availability {
   dayOfWeek: number;
   slots?: TimeSlot[];
}

export interface Ratings {
   average: number;
   totalReviews: number;
}

export interface Tutor {
   _id: string;
   userId: TutorUser | string;
   subjects?: string[];
   levels?: string[];
   education?: Education[];
   certifications?: Certification[];
   experienceYears?: number;
   hourlyRate?: number;
   bio?: string;
   classType?: ClassType[] | string[];
   availability?: Availability[];
   isApproved?: boolean;
   ratings?: Ratings;
   createdAt?: string;
   updatedAt?: string;
   // backend can return other fields, keep index signature if needed
   [key: string]: any;
}

export interface PaginationInfo {
   total: number;
   page: number;
   limit: number;
   totalPages: number;
}

export interface TutorsApiResponse {
   data: Tutor[];
   pagination: PaginationInfo;
}
