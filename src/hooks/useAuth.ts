import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
   loginUser,
   googleLogin as apiGoogleLogin,
   forgotPassword as apiForgotPassword,
   resetPassword as apiResetPassword,
   changePassword as apiChangePassword,
} from "../api/authentication";

import { useToast } from "./useToast";

export const useAuth = () => {
   const navigate = useNavigate();
   const queryClient = useQueryClient();
   const toast = useToast();

   // helper to extract server message from axios-like errors
   const getServerMessage = (error: any) =>
      error?.response?.data?.message ||
      error?.response?.data?.metadata?.message ||
      error?.message;

   const loginMutation = useMutation({
      mutationFn: loginUser,
      onSuccess: (responseBody) => {
         const token = responseBody.data?.token;
         const user = responseBody.data?.user;
         if (token && user) {
            localStorage.setItem("token", token);
            queryClient.invalidateQueries({ queryKey: ["user", "auth"] });
            toast("success", "Đăng nhập thành công!");

            // Điều hướng dựa trên role
            if (user.role === "STUDENT") {
               navigate("/tutor-list");
            } else if (user.role === "TUTOR") {
               navigate("/tutor/dashboard");
            } else {
               navigate("/");
            }
         } else {
            toast("error", "Phản hồi đăng nhập không hợp lệ.");
         }
      },
      onError: (error: any) => {
         const serverMessage =
            error?.response?.data?.message ||
            error?.response?.data?.metadata?.message ||
            error?.message;
         toast("error", serverMessage || "Đăng nhập thất bại.");
      },
   });

   const googleLoginMutation = useMutation({
      mutationFn: apiGoogleLogin,
      onSuccess: (responseBody) => {
         const token = responseBody.data?.token;
         const user = responseBody.data?.user;
         if (token && user) {
            localStorage.setItem("token", token);
            queryClient.invalidateQueries({ queryKey: ["user", "auth"] });
            toast("success", "Đăng nhập bằng Google thành công!");

            // Điều hướng dựa trên role
            if (user.role === "STUDENT") {
               navigate("/tutor-list");
            } else if (user.role === "TUTOR") {
               navigate("/tutor/dashboard");
            } else {
               navigate("/");
            }
         } else {
            toast("error", "Phản hồi đăng nhập Google không hợp lệ.");
         }
      },
      onError: (error: any) => {
         const serverMessage =
            error?.response?.data?.message ||
            error?.response?.data?.metadata?.message ||
            error?.message;
         toast("error", serverMessage || "Đăng nhập bằng Google thất bại.");
      },
   });

   const forgotPasswordMutation = useMutation({
      mutationFn: apiForgotPassword,
      onSuccess: () => {
         toast(
            "success",
            "Nếu email tồn tại, một liên kết đặt lại mật khẩu đã được gửi."
         );
      },
      onError: (error: any) => {
         toast("error", getServerMessage(error) || "Gửi yêu cầu thất bại.");
      },
   });

   const logout = () => {
      localStorage.removeItem("token");
      queryClient.invalidateQueries({ queryKey: ["user", "auth"] });
      navigate("/");
   };

   const resetPasswordMutation = useMutation({
      mutationFn: apiResetPassword,
      onSuccess: () => {
         toast("success", "Mật khẩu đã được đặt lại thành công!");
         navigate("/login");
      },
      onError: (error: any) => {
         toast(
            "error",
            getServerMessage(error) || "Đặt lại mật khẩu thất bại."
         );
      },
   });

   const changePasswordMutation = useMutation({
      mutationFn: apiChangePassword,
      onSuccess: () => {
         toast("success", "Đổi mật khẩu thành công!");
      },
      onError: (error: any) => {
         toast(
            "error",
            getServerMessage(error) ||
               "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ."
         );
      },
   });

   return {
      login: loginMutation.mutate,
      googleLogin: googleLoginMutation.mutate,
      logout,
      isLoading: loginMutation.isPending || googleLoginMutation.isPending,
      isError: loginMutation.isError || googleLoginMutation.isError,
      error: loginMutation.error || googleLoginMutation.error,
      forgotPassword: forgotPasswordMutation.mutate,
      isForgotPasswordLoading: forgotPasswordMutation.isPending,
      resetPassword: resetPasswordMutation.mutate,
      isResetPasswordLoading: resetPasswordMutation.isPending,
      changePassword: changePasswordMutation.mutate,
      isChangePasswordLoading: changePasswordMutation.isPending,
   };
};
