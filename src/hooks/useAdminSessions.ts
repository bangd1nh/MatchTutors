import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
   getDisputedSessions,
   getSessionDispute,
   resolveSessionDispute,
} from "@/api/adminSessions";

export const adminSessionKeys = {
   all: ["adminSessions"] as const,
   disputes: (status?: "OPEN" | "RESOLVED") =>
      [...adminSessionKeys.all, "disputes", status ?? "all"] as const,
   dispute: (sessionId: string) =>
      [...adminSessionKeys.all, "dispute", sessionId] as const,
};

export const useDisputedSessions = (status?: "OPEN" | "RESOLVED") => {
   return useQuery({
      queryKey: adminSessionKeys.disputes(status),
      queryFn: () => getDisputedSessions(status),
      staleTime: 1000 * 60 * 5, // 5 minutes
   });
};

export const useSessionDispute = (sessionId?: string) => {
   return useQuery({
      queryKey: adminSessionKeys.dispute(sessionId ?? "unknown"),
      queryFn: () => getSessionDispute(sessionId!),
      enabled: !!sessionId,
      staleTime: 1000 * 60 * 5,
   });
};

export const useResolveSessionDispute = () => {
   const qc = useQueryClient();
   return useMutation({
      mutationFn: (payload: {
         sessionId: string;
         decision: "COMPLETED" | "NOT_CONDUCTED";
         adminNotes?: string;
      }) =>
         resolveSessionDispute(
            payload.sessionId,
            payload.decision,
            payload.adminNotes
         ),
      onSuccess: (_data, variables) => {
         // refresh list + detail for this session
         qc.invalidateQueries({
            queryKey: adminSessionKeys.disputes(undefined),
         });
         qc.invalidateQueries({
            queryKey: adminSessionKeys.dispute(variables.sessionId),
         });
      },
   });
};
