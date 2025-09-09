import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyProfile, updateMyProfile } from "@/api/user";
import { useToast } from "@/hooks/useToast";

const USER_PROFILE_QUERY_KEY = ["user", "me"];

/**
 * Hook để lấy thông tin hồ sơ của người dùng hiện tại.
 */
export const useUserProfile = () => {
   return useQuery({
      queryKey: USER_PROFILE_QUERY_KEY,
      queryFn: getMyProfile,
      staleTime: 1000 * 60 * 5, // 5 phút
      retry: 1,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
   });
};

/**
 * Hook để cập nhật thông tin hồ sơ người dùng.
 */
export const useUpdateUserProfile = () => {
   const queryClient = useQueryClient();
   const toast = useToast();

   return useMutation({
      mutationFn: updateMyProfile,
      onSuccess: (updatedUser) => {
         queryClient.setQueryData(USER_PROFILE_QUERY_KEY, updatedUser);
         toast("success", "Hồ sơ đã được cập nhật thành công!");
      },
      onError: (error: any) => {
         const errorMessage =
            error?.response?.data?.message || "Cập nhật hồ sơ thất bại.";
         toast("error", errorMessage);
      },
   });
};
