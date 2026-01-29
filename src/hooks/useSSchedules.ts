import {
   createSuggestion,
   getSuggestion,
   studentRespondSuggestion,
   tutorUpdateSuggestion,
} from "@/api/suggestionSchedules";
import { SSchedulesBody } from "@/types/suggestionSchedules";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./useToast";

export const useSSchedules = (TRid: string) => {
   const addToast = useToast();
   const queryClient = useQueryClient();
   const createSSchedules = useMutation({
      mutationFn: createSuggestion,
      onSuccess: () => {
         addToast("success", "Lưu lịch đề xuất thành công");
         queryClient.invalidateQueries({ queryKey: ["SUGGESTION", TRid] });
      },
      onError: (err: any) => {
         // Lấy error message từ backend (có thể ở nhiều vị trí)
         const errorMessage =
            err?.response?.data?.message ||
            err?.response?.data?.metadata?.message ||
            err?.message ||
            "Lưu lịch đề xuất thất bại";
         addToast("error", errorMessage);
      },
   });

   const fetchSSchedules = useQuery({
      queryFn: () => getSuggestion(TRid!),
      queryKey: ["SUGGESTION", TRid],
      enabled: !!TRid,
   });

   const respondSuggestion = useMutation({
      mutationFn: ({
         suggestionId,
         decision,
         reason,
      }: {
         suggestionId: string;
         decision: "ACCEPT" | "REJECT";
         reason?: string;
      }) => studentRespondSuggestion(suggestionId, decision, reason),
      onSuccess: (res) => {
         queryClient.invalidateQueries({ queryKey: ["SUGGESTION", TRid] });
         if (res.data?.commitmentId) {
            addToast("success", "Đã đồng ý lịch học. Vui lòng thanh toán.");
         } else {
            addToast("success", "Đã từ chối lịch học");
         }
      },
      onError: (err: any) => {
         addToast(
            "error",
            err?.response?.data?.message ||
               "Phản hồi thất bại. Vui lòng thử lại."
         );
      },
   });

   const updateSSchedules = useMutation({
      mutationFn: ({
         suggestionId,
         payload,
      }: {
         suggestionId: string;
         payload: SSchedulesBody;
      }) => tutorUpdateSuggestion(suggestionId, payload),
      onSuccess: () => {
         addToast("success", "Cập nhật lịch đề xuất thành công");
         queryClient.invalidateQueries({ queryKey: ["SUGGESTION", TRid] });
      },
      onError: (err: any) => {
         // Lấy error message từ backend (có thể ở nhiều vị trí)
         const errorMessage =
            err?.response?.data?.message ||
            err?.response?.data?.metadata?.message ||
            err?.message ||
            "Cập nhật lịch đề xuất thất bại";
         addToast("error", errorMessage);
      },
   });

   return {
      createSSchedules,
      fetchSSchedules,
      respondSuggestion,
      updateSSchedules,
   };
};
