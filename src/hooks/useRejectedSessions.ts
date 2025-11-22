import { useQuery } from "@tanstack/react-query";
import {
   getMyRejectedSessions,
   getRejectedSessionById,
   getMyCancelledSessions,
   getMyAbsenceSessions,
} from "@/api/sessions";
import { Session } from "@/types/session";

/**
 * Hook để lấy danh sách các session bị rejected và soft-deleted
 */
export const useRejectedSessions = () => {
   return useQuery<Session[]>({
      queryKey: ["rejected-sessions"],
      queryFn: getMyRejectedSessions,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
   });
};

/**
 * Hook để lấy chi tiết một session bị rejected và soft-deleted
 */
export const useRejectedSession = (sessionId: string) => {
   return useQuery<Session>({
      queryKey: ["rejected-session", sessionId],
      queryFn: () => getRejectedSessionById(sessionId),
      enabled: !!sessionId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
   });
};

/**
 * Hook để lấy danh sách các session bị cancelled
 */
export const useCancelledSessions = () => {
   return useQuery<Session[]>({
      queryKey: ["cancelled-sessions"],
      queryFn: getMyCancelledSessions,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
   });
};

/**
 * Hook để lấy danh sách các session vắng
 */
export const useAbsenceSessions = () => {
   return useQuery<Session[]>({
      queryKey: ["absence-sessions"],
      queryFn: getMyAbsenceSessions,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
   });
};
