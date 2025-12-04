import { TeachingRequestStatus } from "@/enums/teachingRequest.enum";
import { Level } from "@/enums/level.enum";
import { Subject } from "@/enums/subject.enum";
import { IUser } from "@/types/user";

// Đại diện cho thông tin user được populate lồng nhau
interface PopulatedUser {
   _id: string;
   userId: Pick<IUser, "_id" | "name" | "avatarUrl" | "email">;
}

export interface TeachingRequest {
   _id: string;
   studentId: PopulatedUser;
   tutorId: PopulatedUser;
   subject: Subject;
   level: Level;
   hourlyRate: number;
   description?: string;
   status: TeachingRequestStatus;
   createdAt: string;
   updatedAt: string;
}

export interface CreateTeachingRequestPayload {
   tutorId: string;
   subject: Subject;
   level: Level;
   hourlyRate: number;
   description?: string;
}

// Thêm interface cho response phân trang
export interface TeachingRequestList {
   data: TeachingRequest[];
   pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
   };
}
