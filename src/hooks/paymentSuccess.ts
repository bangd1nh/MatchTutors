import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
   getSuccessfulPayments,
   getSuccessfulPaymentsStudent,
} from "@/api/paymentSuccess";

export const usePaymentTutor = () => {
   const [page, setPage] = useState(1);
   const limit = 6;

   const {
      data: paymentData,
      isLoading,
      isError,
      error,
   } = useQuery({
      queryKey: ["paymentTutor", page],
      queryFn: () => getSuccessfulPayments(page, limit),
      staleTime: 5 * 60 * 1000,
   });

   return {
      payments: paymentData?.data || [],
      total: paymentData?.total || 0,
      currentPage: page,
      totalPages: paymentData?.totalPages || 1,
      limit,
      isLoading,
      isError,
      error,
      setPage,
   };
};

export const usePaymentStudent = () => {
   const [page, setPage] = useState(1);
   const limit = 6;

   const {
      data: paymentData,
      isLoading,
      isError,
      error,
   } = useQuery({
      queryKey: ["paymentStudent", page],
      queryFn: () => getSuccessfulPaymentsStudent(page, limit),
      staleTime: 5 * 60 * 1000,
   });

   return {
      payments: paymentData?.data || [],
      total: paymentData?.total || 0,
      currentPage: page,
      totalPages: paymentData?.totalPages || 1,
      limit,
      isLoading,
      isError,
      error,
      setPage,
   };
};
