import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
   getMySessions,
   createSession,
   updateSession,
   deleteSession,
   getSessionById,
   confirmParticipation,
   confirmAttendance,
   cancelSession,
   rejectAttendance,
   createBatchSessions,
} from "@/api/sessions";

import { useToast } from "@/hooks/useToast";
import { UpsertSessionPayload } from "@/types/session";

// Query key factory for sessions
export const sessionKeys = {
   all: ["sessions"] as const,
   lists: () => [...sessionKeys.all, "list"] as const,
   list: (filters: string) => [...sessionKeys.lists(), filters] as const,
   details: () => [...sessionKeys.all, "detail"] as const,
   detail: (id: string) => [...sessionKeys.details(), id] as const,
};

/**
 * Hook to fetch all sessions for the current user.
 */
export const useMySessions = () => {
   return useQuery({
      queryKey: sessionKeys.lists(),
      queryFn: () => getMySessions(),
      staleTime: 1000 * 60 * 5, // 5 minutes
      select: (data) => data ?? [], // Ensure it always returns an array
   });
};

/**
 * Hook to fetch details for a single session.
 */
export const useSessionDetail = (sessionId?: string) => {
   return useQuery({
      queryKey: sessionKeys.detail(sessionId!),
      queryFn: () => getSessionById(sessionId!),
      enabled: !!sessionId,
      staleTime: 1000 * 60 * 5, // 5 minutes
   });
};

/**
 * Hook to create a new session.
 */
export const useCreateSession = () => {
   const queryClient = useQueryClient();
   const toast = useToast();

   return useMutation({
      mutationFn: (payload: UpsertSessionPayload) => createSession(payload),
      onSuccess: (data) => {
         // Luôn vô hiệu hóa toàn bộ danh sách sessions để cập nhật lịch
         queryClient.invalidateQueries({ queryKey: sessionKeys.all });

         // Nếu có learningCommitmentId, thì cũng vô hiệu hóa query chi tiết của commitment đó
         if ((data as any)?.learningCommitmentId) {
            const commitmentId =
               typeof (data as any).learningCommitmentId === "string"
                  ? (data as any).learningCommitmentId
                  : (data as any).learningCommitmentId?._id;
            if (commitmentId) {
               queryClient.invalidateQueries({
                  queryKey: ["learningCommitment", commitmentId],
               });
            }
         }
         // Luôn hiển thị toast thành công vì API đã trả về 2xx
         toast("success", "Tạo buổi học thành công!");
      },
      onError: (error: any) => {
         toast(
            "error",
            error.response?.data?.message || "Tạo buổi học thất bại."
         );
      },
   });
};

/**
 * Hook to update an existing session.
 */
export const useUpdateSession = () => {
   const queryClient = useQueryClient();
   const toast = useToast();

   return useMutation({
      mutationFn: ({
         sessionId,
         payload,
      }: {
         sessionId: string;
         payload: Partial<UpsertSessionPayload>;
      }) => updateSession(sessionId, payload),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: sessionKeys.all });
         // toast("success", "Cập nhật buổi học thành công!");
      },
      onError: (error: any) => {
         toast(
            "error",
            error.response?.data?.message || "Cập nhật buổi học thất bại."
         );
      },
   });
};

/**
 * Hook to delete a session.
 */
export const useDeleteSession = () => {
   const queryClient = useQueryClient();
   const toast = useToast();

   return useMutation({
      mutationFn: (sessionId: string) => deleteSession(sessionId),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
         toast("success", "Xóa buổi học thành công.");
      },
      onError: (error: any) => {
         toast(
            "error",
            error.response?.data?.message || "Xóa buổi học thất bại."
         );
      },
   });
};

/**
 * Hook để học sinh xác nhận tham gia buổi học
 */
export const useConfirmParticipation = () => {
   const queryClient = useQueryClient();
   const toast = useToast();

   return useMutation({
      mutationFn: ({
         sessionId,
         decision,
      }: {
         sessionId: string;
         decision: "ACCEPTED" | "REJECTED";
      }) => confirmParticipation(sessionId, decision),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: sessionKeys.all });
         toast("success", "Phản hồi thành công");
      },
      onError: (error: any) => {
         toast(
            "error",
            error.response?.data?.message || "Xác nhận tham gia thất bại."
         );
      },
   });
};

/**
 * Hook để xác nhận điểm danh
 */
export const useConfirmAttendance = () => {
   const queryClient = useQueryClient();
   const toast = useToast();

   return useMutation({
      mutationFn: (sessionId: string) => confirmAttendance(sessionId),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: sessionKeys.all });
         toast("success", "Đã xác nhận điểm danh!");
      },
      onError: (error: any) => {
         toast(
            "error",
            error.response?.data?.message || "Xác nhận điểm danh thất bại."
         );
      },
   });
};

/**
 * Hook để từ chối điểm danh
 */
export const useRejectAttendance = () => {
   const queryClient = useQueryClient();
   const toast = useToast();

   return useMutation({
      mutationFn: ({
         sessionId,
         payload,
      }: {
         sessionId: string;
         payload?: { reason?: string; evidenceUrls?: string[] };
      }) => rejectAttendance(sessionId, payload),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: sessionKeys.all });
         toast("success", "Phản hồi của bạn đã được ghi nhận!");
      },
      onError: (error: any) => {
         toast("error", error.response?.data?.message || "Thao tác thất bại.");
      },
   });
};

/**
 * Hook để hủy buổi học đã confirm
 */
export const useCancelSession = () => {
   const queryClient = useQueryClient();
   const toast = useToast();

   return useMutation({
      mutationFn: ({
         sessionId,
         reason,
      }: {
         sessionId: string;
         reason: string;
      }) => cancelSession(sessionId, reason),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: sessionKeys.all });
         toast("success", "Đã hủy buổi học thành công!");
      },
      onError: (error: any) => {
         toast(
            "error",
            error.response?.data?.message || "Hủy buổi học thất bại."
         );
      },
   });
};

export const useCreateBatchSessions = () => {
   const queryClient = useQueryClient();
   const toast = useToast();

   return useMutation({
      mutationFn: createBatchSessions,
      onSuccess: (data) => {
         queryClient.invalidateQueries({ queryKey: sessionKeys.all });

         const count = Array.isArray(data) ? data.length : 1;

         toast("success", `Đã tạo thành công ${count} buổi học!`);
      },
      onError: (error: any) => {
         console.error(" Mutation Error:", error);

         const message =
            error?.response?.data?.message || error?.message || "Tạo thất bại.";
         toast("error", message);
      },
   });
};
