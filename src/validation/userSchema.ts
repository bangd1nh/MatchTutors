import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
   "image/jpeg",
   "image/jpg",
   "image/png",
   "image/webp",
];

export const updateProfileSchema = z.object({
   name: z
      .string()
      .min(2, "Tên phải có ít nhất 2 ký tự")
      .max(50, "Tên không được vượt quá 50 ký tự")
      .optional(),
   phone: z
      .string()
      .regex(/^[0-9]{10}$/, "Số điện thoại phải có đúng 10 chữ số")
      .optional()
      .or(z.literal("")), // Cho phép chuỗi rỗng
   avatar: z
      .any()
      // Nếu files === undefined OR files.length === 0 => không có file (hợp lệ).
      // Nếu có file => kiểm tra kích thước và kiểu.
      .refine((files) => {
         if (!files) return true;
         if (typeof files.length === "number" && files.length === 0)
            return true;
         const f = files?.[0];
         return Boolean(f && f.size <= MAX_FILE_SIZE);
      }, `Kích thước ảnh tối đa là 5MB.`)
      .refine((files) => {
         if (!files) return true;
         if (typeof files.length === "number" && files.length === 0)
            return true;
         const f = files?.[0];
         return Boolean(f && ACCEPTED_IMAGE_TYPES.includes(f.type));
      }, "Chỉ chấp nhận định dạng .jpg, .jpeg, .png và .webp.")
      .optional(),
   gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional().or(z.literal("")),
   city: z
      .string()
      .max(100, "Tên thành phố quá dài")
      .optional()
      .or(z.literal("")),
   street: z.string().max(200, "Địa chỉ quá dài").optional().or(z.literal("")),
});

export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
