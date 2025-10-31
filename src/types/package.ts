export interface IPackage {
  name: string;
  description?: string[];
  price: number;
  isActive?: boolean;
  popular?: boolean;
  features?: {
    boostVisibility: boolean;
    priorityRanking: boolean;
    maxStudents?: number;
    maxQuiz?: number;
    featuredProfile: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// UI helper type (frontend-only) to manage local ids
export type UIPackage = IPackage & { id: string };

export interface PackageFormData {
  name: string;
  description?: string[];
  price: number;
  isActive?: boolean;
  popular?: boolean;
  features: {
    boostVisibility: boolean;
    priorityRanking: boolean;
    maxStudents?: number;
    maxQuiz?: number;
    featuredProfile: boolean;
  };
}
