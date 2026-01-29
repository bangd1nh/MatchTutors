import React from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable, renderStatus } from "./DataTable";
import { formatDate, translateType } from "@/utils/tutorProfileHelpers";
import { useGetTutorViolationReports } from "@/hooks/useAdminTutors";

interface ReportsTabProps {
  tutorId: string;
  page: number;
  statusFilter: string;
  searchTerm: string;
  onPageChange: (page: number) => void;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  tutorId,
  page,
  statusFilter,
  searchTerm,
  onPageChange,
}) => {
  const { data, isLoading } = useGetTutorViolationReports(tutorId, {
    page,
    limit: 10,
    status: statusFilter !== "all" ? statusFilter : undefined,
    search: searchTerm || undefined,
  });

  const responseData = data?.data as any;
  const items = responseData?.reports || responseData?.data || [];
  const pagination = responseData?.pagination || { page: 1, limit: 10, total: 0, pages: 1 };

  const columns = [
    {
      key: "type",
      label: "Loại",
      render: (item: any) => (
        <Badge variant="outline">
          {item.type ? translateType(item.type, "report") : "Chưa có"}
        </Badge>
      ),
    },
    {
      key: "reporter",
      label: "Người báo cáo",
      render: (item: any) => item.reporterId?.name || item.reportedBy?.name || "Chưa có",
    },
    {
      key: "reason",
      label: "Lý do",
      render: (item: any) => item.reason || "Chưa có",
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (item: any) => renderStatus(item, (status) => {
        if (status === "PENDING") return "destructive";
        if (status === "RESOLVED") return "default";
        if (status === "DISMISSED") return "secondary";
        return "outline";
      }),
    },
    {
      key: "createdAt",
      label: "Ngày báo cáo",
      render: (item: any) => formatDate(item.createdAt),
    },
  ];

  return (
    <DataTable
      isLoading={isLoading}
      items={items}
      pagination={pagination}
      currentPage={page}
      onPageChange={onPageChange}
      columns={columns}
    />
  );
};
