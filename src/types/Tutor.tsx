import { Subject } from "@/enums/subject.enum";
import { BaseAPIResponse } from "./response";

export interface Tutor {
   _id: string;
   userId: string;
   name?: string;
   avatarUrl?: string;
   gender?: string;
   address: {
      city?: string;
      street?: string;
      lat?: number;
      lng?: number;
   };
   certifications: {
      name: string;
      description?: string;
      imageUrl?: string[];
   }[];
   experienceYears: number;
   hourlyRate: number;
   languages: string[];
   education: {
      degree: string;
      institution: string;
      fieldOfStudy?: string;
      startDate: string;
      endDate: string;
      description: string;
   }[];
   subjects: string[];
   availability: {
      dayOfWeek: number; // 0-6 (Sun-Sat)
      timeSlots: ("PRE_12" | "MID_12_17" | "AFTER_17")[];
   }[];
   phone: string;
   email: string;
   isApproved: boolean;
   ratings: {
      average: number;
      totalReviews: number;
   };
   createdAt: string;
   updatedAt: string;
   bio: string;
   classType: "ONLINE" | "IN_PERSON";
   levels: string[];
}

export interface SuggestionResponse extends BaseAPIResponse {
   data: {
      _id: string;
      studentId: string;
      recommendedTutors: {
         tutorId: {
            _id: string;
            userId: {
               address: {
                  city: string;
               };
               _id: string;
               avatarUrl: string;
               gender: string;
               name: string;
            };
            subjects: string[];
            levels: string[];
            experienceYears: number;
            hourlyRate: number;
            bio: string;
         };
      }[];
   };
}

export interface TutorSuggestion {
   tutorId: {
      _id: string;
      userId: {
         address: {
            city: string;
         };
         _id: string;
         avatarUrl: string;
         gender: string;
         name: string;
      };
      subjects: string[];
      levels: string[];
      experienceYears: number;
      hourlyRate: number;
      bio: string;
   };
}
