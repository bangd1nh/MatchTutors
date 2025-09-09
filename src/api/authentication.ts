import { LoginCredentials, RegisterData } from "@/validation/authSchema";
import { Role } from "@/types/user";
import apiClient from "../lib/api";
import { IUser } from "../types/user";

export const registerUser = async (
   userData: RegisterData & { role?: Role }
) => {
   const response = await apiClient.post("/auth/register", userData);
   return response.data;
};

export const loginUser = async (credentials: LoginCredentials) => {
   const response = await apiClient.post<{
      data: any;
      token: string;
      user: IUser;
   }>("/auth/login", credentials);
   const { token } = response.data;

   // Chỉ lưu token vào localStorage
   localStorage.setItem("token", token);

   return response.data;
};

export const googleLogin = async (idToken: string) => {
   const response = await apiClient.post("/auth/google", { idToken });
   return response.data;
};

export const getMe = async () => {
   const response = await apiClient.get("/auth/me");
   return response.data.metadata;
};

export const forgotPassword = async (email: string) => {
   const response = await apiClient.post("/auth/forgot-password", { email });
   return response.data;
};

export const resetPassword = async (data: {
   token: string;
   password: string;
}) => {
   const response = await apiClient.post("/auth/reset-password", data);
   return response.data;
};

export const changePassword = async (data: {
   oldPassword: string;
   newPassword: string;
}) => {
   const response = await apiClient.post("/auth/change-password", data);
   return response.data;
};

export const verifyEmail = async (token: string) => {
   const response = await apiClient.get(`/auth/verify-email?token=${token}`);
   return response.data;
};
