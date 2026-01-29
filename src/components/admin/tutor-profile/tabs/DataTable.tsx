import React from "react";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Pagination } from "../Pagination";
import { formatDate, translateStatus } from "@/utils/tutorProfileHelpers";
import { SUBJECT_LABELS_VI } from "@/enums/subject.enum";

interface DataTableProps {
  isLoading: boolean;
  items: any[];
  pagination: { page: number; limit: number; total: number; pages: number };
  currentPage: number;
  onPageChange: (page: number) => void;
  columns: {
    key: string;
    label: string;
    render?: (item: any) => React.ReactNode;
  }[];
}

export const DataTable: React.FC<DataTableProps> = ({
  isLoading,
  items,
  pagination,
  currentPage,
  onPageChange,
  columns,
}) => {
  if (isLoading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  if (items.length === 0) {
    return <div className="text-center py-8 text-gray-500">Không có dữ liệu</div>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item: any) => (
              <tr key={item._id} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-sm">
                    {col.render ? col.render(item) : item[col.key] || "Chưa có"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={pagination.pages || 1}
        onPageChange={onPageChange}
      />
    </>
  );
};

// Helper functions for rendering specific cell types
export const renderSubject = (item: any) => {
  // Ưu tiên subject từ learningCommitmentId.teachingRequest (khi được populate)
  // Backend populate: learningCommitmentId.teachingRequest.subject
  const learningCommitment = item.learningCommitmentId;
  const teachingRequest = learningCommitment?.teachingRequest;
  
  // Kiểm tra nếu teachingRequest là object và có property subject (đã được populate)
  // Nếu teachingRequest là string (ID), nó sẽ không có property subject
  let subject: string | undefined;
  
  // Kiểm tra nhiều cách để lấy subject
  if (teachingRequest && typeof teachingRequest === 'object' && teachingRequest !== null && 'subject' in teachingRequest) {
    subject = teachingRequest.subject;
  } else if (item.teachingRequest?.subject) {
    subject = item.teachingRequest.subject;
  } else if (item.subject) {
    subject = item.subject;
  } else if (item.commitment?.subject) {
    subject = item.commitment.subject;
  }

  if (!subject) return "Chưa có";
  return SUBJECT_LABELS_VI[subject] || subject;
};

export const renderStatus = (item: any, variantMap?: (status: string) => "default" | "secondary" | "destructive" | "outline") => {
  const status = item.status || "Chưa có";
  const variant = variantMap ? variantMap(status) : "outline";
  return (
    <Badge variant={variant}>
      {status !== "Chưa có" ? translateStatus(status) : status}
    </Badge>
  );
};

export const renderRating = (item: any) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < (item.rating || 0)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium">{item.rating || 0}</span>
    </div>
  );
};

export const renderTimeRange = (item: any) => {
  if (!item.startTime) return "Chưa có";
  return (
    <>
      {formatDate(item.startTime)} {new Date(item.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} - {item.endTime ? new Date(item.endTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "Chưa có"}
    </>
  );
};
