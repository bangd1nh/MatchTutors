import { BaseAPIResponse } from "./response";

export interface SSchedulesBody {
   title: string;
   TRId: string;
   proposedTotalPrice: number; // Giá tổng đề xuất của gia sư
   location: string; // Bắt buộc
   schedules: {
      start: Date;
      end: Date;
      location?: string;
   }[];
}

export interface SSchedulesResponse extends BaseAPIResponse {
   data: {
      _id: string;
      tutorId: string;
      teachingRequestId: string;
      title: string;
      proposedTotalPrice: number; // Giá tổng đề xuất của gia sư
      location?: string;
      schedules: {
         start: Date;
         end: Date;
         location?: string;
      }[];
      status?: "PENDING" | "REJECTED" | "ACCEPTED";
      studentResponse?: {
         status: "PENDING" | "REJECTED" | "ACCEPTED";
         reason?: string;
         respondedAt?: Date;
      };
      commitmentId?: string;
      // Lịch bận của học sinh (chỉ có khi gia sư xem)
      studentBusySchedules?: Array<{
         schedules: Array<{ start: Date; end: Date }>;
         tutor: {
            _id: string;
            name: string;
            avatarUrl?: string;
            email: string;
         };
         teachingRequestId: string;
         type: "suggestion";
      }>;
      studentBusySessions?: Array<{
         startTime: Date;
         endTime: Date;
         status: string;
         tutor: {
            _id: string;
            name: string;
            avatarUrl?: string;
            email: string;
         };
         teachingRequestId: string;
         type: "session";
      }>;
      // Lịch bận của gia sư (chỉ có khi học sinh xem)
      tutorBusySchedules?: Array<{
         schedules: Array<{ start: Date; end: Date }>;
         student: {
            _id: string;
            name: string;
            avatarUrl?: string;
            email: string;
         };
         teachingRequestId: string;
         type: "suggestion";
      }>;
      tutorBusySessions?: Array<{
         startTime: Date;
         endTime: Date;
         status: string;
         student: {
            _id: string;
            name: string;
            avatarUrl?: string;
            email: string;
         };
         teachingRequestId: string;
         type: "session";
      }>;
   };
}
