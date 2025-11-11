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
   [TeachingRequestStatus.ACCEPTED]: {
      label: "Đã chấp nhận",
      className: "bg-green-100 text-green-800 border-green-200",
   },
   [TeachingRequestStatus.REJECTED]: {
      label: "Đã từ chối",
      className: "bg-red-100 text-red-800 border-red-200",
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
