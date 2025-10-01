import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
   getMySessions,
   createSession,
   updateSession,
   deleteSession,
   getSessionById,
} from "@/api/sessions";
import { useToast } from "@/hooks/useToast";
import { UpsertSessionPayload } from "@/types/session";
import { teachingRequestKeys } from "./useTeachingRequest";

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
      queryFn: getMySessions,
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
         queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
         // Also invalidate the specific teaching request to update its status
         if (data.teachingRequestId) {
            const requestId =
               typeof data.teachingRequestId === "string"
                  ? data.teachingRequestId
                  : (data.teachingRequestId as any)._id;
            queryClient.invalidateQueries({
               queryKey: teachingRequestKeys.detail(requestId),
            });
         }
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
         toast("success", "Cập nhật buổi học thành công!");
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
