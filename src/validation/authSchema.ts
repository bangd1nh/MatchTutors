import { z } from "zod";
import { Role } from "@/types/user";

export const registerSchema = z
   .object({
      name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
      email: z.string().email("Email không hợp lệ"),
      password: z
         .string()
         .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
         .regex(
            /(?=.*[A-Z])(?=.*[^A-Za-z0-9]).*/,
            "Mật khẩu phải chứa ít nhất 1 ký tự in hoa và 1 ký tự đặc biệt"
         ),
      confirmPassword: z.string(),
      role: z.nativeEnum(Role).optional().default(Role.STUDENT),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: "Mật khẩu xác nhận không khớp.",
      path: ["confirmPassword"],
   });

export const loginSchema = z.object({
   email: z.string().email("Email không hợp lệ"),
   password: z.string().min(1, "Mật khẩu không được để trống"),
});

export type RegisterData = z.infer<typeof registerSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
