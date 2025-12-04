import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
   getMyTeachingRequests,
   getTutorTeachingRequests,
   createTeachingRequest,
   respondToTeachingRequest,
   getTeachingRequestById,
   getStudentProfile,
} from "@/api/teachingRequest";
import { useToast } from "./useToast";
import {
   CreateTeachingRequestPayload,
   TeachingRequestList,
} from "@/types/teachingRequest";

export const teachingRequestKeys = {
   all: ["teachingRequests"] as const,
   lists: () => [...teachingRequestKeys.all, "list"] as const,
   tutorLists: (page?: number, limit?: number) =>
      [
         ...teachingRequestKeys.all,
         "tutor",
         "list",
         `p:${page ?? 1}`,
         `l:${limit ?? 10}`,
      ] as const,
   details: () => [...teachingRequestKeys.all, "detail"] as const,
   detail: (id: string) => [...teachingRequestKeys.details(), id] as const,
};

/**
 * Hook để lấy danh sách các yêu cầu dạy học của học sinh.
 */
export const useMyTeachingRequests = (page = 1, limit = 10) => {
   return useQuery<TeachingRequestList, Error>({
      queryKey: [...teachingRequestKeys.lists(), `p:${page}`, `l:${limit}`],
      queryFn: () => getMyTeachingRequests(page, limit),
      staleTime: 1000 * 60 * 5, // 5 phút
   });
};

/**
 * Hook để lấy chi tiết một yêu cầu.
 */
export const useTeachingRequestDetail = (id: string) => {
   return useQuery({
      queryKey: teachingRequestKeys.detail(id),
      queryFn: () => getTeachingRequestById(id),
      enabled: !!id,
   });
};

/**
 * Hook để tạo một yêu cầu dạy học mới.
 */
export const useCreateTeachingRequest = () => {
   const queryClient = useQueryClient();
   const addToast = useToast();

   return useMutation({
      mutationFn: (payload: CreateTeachingRequestPayload) =>
         createTeachingRequest(payload),
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: teachingRequestKeys.lists(),
         });
         addToast("success", "Gửi yêu cầu thành công!");
      },
      onError: (error: any) => {
         addToast(
            "error",
            error.response?.data?.message || "Gửi yêu cầu thất bại."
         );
      },
   });
};

// Hook để tutor lấy danh sách requests dành cho họ (hỗ trợ page/limit)
export const useTutorTeachingRequests = (page = 1, limit = 10) => {
   return useQuery<TeachingRequestList, Error>({
      queryKey: teachingRequestKeys.tutorLists(page, limit),
      queryFn: () => getTutorTeachingRequests(page, limit),
      staleTime: 1000 * 60 * 2,
   });
};

// Hook để tutor respond request
export const useRespondToRequest = () => {
   const qc = useQueryClient();
   const toast = useToast();
   return useMutation({
      mutationFn: ({
         requestId,
         decision,
      }: {
         requestId: string;
         decision: "ACCEPTED" | "REJECTED";
      }) => respondToTeachingRequest(requestId, decision),
      onSuccess: (data: any) => {
         try {
            // 1) Cập nhật detail cache nếu có
            const id = data?._id ?? data?.id;
            if (id) {
               qc.setQueryData(teachingRequestKeys.detail(String(id)), data);
            }

            // 2) cập nhật mọi cached tutorLists
            const matched = qc.getQueriesData({
               queryKey: teachingRequestKeys.tutorLists(),
            });
            for (const [queryKey] of matched) {
               try {
                  qc.setQueryData(queryKey, (old: any) => {
                     if (!old || !Array.isArray(old.data)) return old;
                     return {
                        ...old,
                        data: old.data.map((item: any) =>
                           String(item._id) === String(id) ? data : item
                        ),
                     };
                  });
               } catch (e) {
                  console.error(
                     "update tutorLists cache failed for",
                     queryKey,
                     e
                  );
               }
            }

            // 3) Invalidate các list chung để đảm bảo dữ liệu đồng bộ nếu backend có pagination/changes
            qc.invalidateQueries({
               queryKey: teachingRequestKeys.tutorLists(),
            });
            qc.invalidateQueries({ queryKey: teachingRequestKeys.lists() });
            qc.invalidateQueries({ queryKey: teachingRequestKeys.all });

            toast("success", "Đã phản hồi yêu cầu.");
         } catch (err) {
            console.error("useRespondToRequest onSuccess handler error:", err);
            toast("success", "Đã phản hồi yêu cầu.");
         }
      },
      onError: (err: any) => {
         toast("error", err.response?.data?.message || "Phản hồi thất bại.");
      },
   });
};

/**
 * Hook để lấy profile học sinh.
 */
export const useStudentProfile = (studentUserId: string | undefined) => {
   return useQuery({
      queryKey: ["studentProfile", studentUserId],
      queryFn: () => getStudentProfile(studentUserId!),
      enabled: !!studentUserId,
      staleTime: 1000 * 60 * 10,
   });
};
