import {
   createStudentProfile,
   fetchStudentProfile,
   updateStudentProfile,
} from "@/api/studentProfile";
import { Student } from "@/types/student";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./useToast";
import { useNavigate } from "react-router-dom";

export const useFetchStudentProfile = () => {
   return useQuery<Student>({
      queryKey: ["studentProfile"],
      queryFn: fetchStudentProfile,
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
         addToast("success", "Tạo hồ sơ thành công!");
         navigate("/student/student-profile");
      },
      onError: (error: any) => {
         addToast("error", error.data.message || "Tạo hồ sơ thất bại!");
      },
   });
};
