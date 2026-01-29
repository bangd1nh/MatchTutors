import {
   createStudentProfile,
   fetchStudentProfile,
   updateStudentProfile,
} from "@/api/studentProfile";
import { Student } from "@/types/student";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./useToast";
import { useNavigate } from "react-router-dom";
import { useUser } from "./useUser";

export const useFetchStudentProfile = () => {
   const { isAuthenticated, user } = useUser();

   return useQuery<Student>({
      queryKey: ["studentProfile"],
      queryFn: fetchStudentProfile,
      // Chỉ fetch khi đã đăng nhập VÀ là STUDENT
      enabled: isAuthenticated && user?.role === "STUDENT",
      retry: (failureCount, error: any) => {
         if (error?.response?.status === 404) {
            return false;
         }
         return failureCount < 2;
      },
   });
};

// Cập nhật profile
export const useUpdateStudentProfile = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: updateStudentProfile,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["studentProfile"] });
         // Invalidate suggestion để refetch gợi ý mới
         queryClient.invalidateQueries({ queryKey: ["suggestion_tutor"] });
      },
   });
};

// Tạo mới profile
export const useCreateStudentProfile = () => {
   const queryClient = useQueryClient();
   const addToast = useToast();
   const navigate = useNavigate();

   return useMutation({
      mutationFn: createStudentProfile,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["studentProfile"] });
         // Invalidate suggestion để bắt đầu polling ngay
         queryClient.invalidateQueries({ queryKey: ["suggestion_tutor"] });
         addToast("success", "Tạo hồ sơ thành công!");
         navigate("/student/student-profile");
      },
      onError: (error: any) => {
         addToast("error", error.data.message || "Tạo hồ sơ thất bại!");
      },
   });
};
