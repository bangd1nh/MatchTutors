export interface Material {
   _id: string;
   title: string;
   description?: string;
   fileUrl?: string;
   uploadedBy?: string; // Hoặc một object User nếu được populate
   uploadedAt?: string; // ISO date string
}
