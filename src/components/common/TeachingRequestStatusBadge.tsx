import { TeachingRequestStatus } from "@/enums/teachingRequest.enum";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusInfo {
   label: string;
   className: string;
}

const statusMap: Record<TeachingRequestStatus, StatusInfo> = {
   [TeachingRequestStatus.PENDING]: {
      label: "Chờ phản hồi",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
   },
   [TeachingRequestStatus.REJECTED]: {
      label: "Đã từ chối",
      className: "bg-red-100 text-red-800 border-red-200",
   },
   [TeachingRequestStatus.TRIAL_ACCEPTED]: {
      label: "Đã chấp nhận học thử",
      className: "bg-cyan-100 text-cyan-800 border-cyan-200",
   },
   [TeachingRequestStatus.TRIAL_SCHEDULED]: {
      label: "Đã lên lịch học thử",
      className: "bg-blue-100 text-blue-800 border-blue-200",
   },
   [TeachingRequestStatus.TRIAL_COMPLETED]: {
      label: "Hoàn thành học thử",
      className: "bg-indigo-100 text-indigo-800 border-indigo-200",
   },
   [TeachingRequestStatus.IN_PROGRESS]: {
      label: "Đang học",
      className: "bg-green-100 text-green-800 border-green-200",
   },
   [TeachingRequestStatus.COMPLETED]: {
      label: "Đã hoàn thành",
      className: "bg-gray-200 text-gray-800 border-gray-300",
   },
   [TeachingRequestStatus.CANCELLED]: {
      label: "Đã hủy",
      className: "bg-gray-200 text-gray-800 border-gray-300",
   },
   [TeachingRequestStatus.CANCELLATION_PENDING]: {
      label: "Chờ hủy",
      className: "bg-orange-100 text-orange-800 border-orange-200",
   },
   [TeachingRequestStatus.COMPLETE_PENDING]: {
      label: "Chờ hoàn thành",
      className: "bg-lime-100 text-lime-800 border-lime-200",
   },
   [TeachingRequestStatus.ADMIN_REVIEW]: {
      label: "Admin xem xét",
      className: "bg-purple-100 text-purple-800 border-purple-200",
   },
};

interface TeachingRequestStatusBadgeProps {
   status: TeachingRequestStatus;
}

export const TeachingRequestStatusBadge = ({
   status,
}: TeachingRequestStatusBadgeProps) => {
   const { label, className } = statusMap[status] || {
      label: "Không rõ",
      className: "bg-gray-100",
   };
   return <Badge className={cn("font-medium", className)}>{label}</Badge>;
};
