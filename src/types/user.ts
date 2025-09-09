export enum Role {
   STUDENT = "STUDENT",
   TUTOR = "TUTOR",
   PARENT = "PARENT",
   ADMIN = "ADMIN",
}

export interface IUser {
   _id: string;
   role: Role;
   name: string;
   email: string;
   phone?: string;
   avatarUrl?: string;
   gender?: string;
   address?: {
      city?: string;
      street?: string;
      lat?: number;
      lng?: number;
   };
   isActive: boolean;
   isVerifiedEmail: boolean;
   createdAt?: Date;
   updatedAt?: Date;
}
