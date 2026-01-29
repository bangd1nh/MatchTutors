import React, { useMemo, useState } from "react";
import { useReview } from "@/hooks/useReview";
import { ReviewVisibilityRequestStatusEnum, REVIEW_VISIBILITY_REQUEST_STATUS_VALUES } from "@/types/review";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/useToast";

type VisibilityStatus = ReviewVisibilityRequestStatusEnum;

const statusLabel: Record<VisibilityStatus, string> = {
  [ReviewVisibilityRequestStatusEnum.NONE]: "Tất cả",
  [ReviewVisibilityRequestStatusEnum.PENDING]: "Chờ duyệt",
  [ReviewVisibilityRequestStatusEnum.APPROVED]: "Đã ẩn",
  [ReviewVisibilityRequestStatusEnum.REJECTED]: "Từ chối",
};

const statusVariant: Record<VisibilityStatus, "secondary" | "outline" | "destructive" | "default"> = {
  [ReviewVisibilityRequestStatusEnum.NONE]: "outline",
  [ReviewVisibilityRequestStatusEnum.PENDING]: "secondary",
  [ReviewVisibilityRequestStatusEnum.APPROVED]: "default",
  [ReviewVisibilityRequestStatusEnum.REJECTED]: "destructive",
};

const ReviewVisibilityRequests: React.FC = () => {
  const toast = useToast();
  const [status, setStatus] = useState<VisibilityStatus>(ReviewVisibilityRequestStatusEnum.NONE);
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [note, setNote] = useState("");
  const [actionReviewId, setActionReviewId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | "restore">("approve");

  const { useVisibilityRequests, updateReviewVisibility, isUpdatingVisibility } = useReview();

  const queryParams = useMemo(
    () => ({
      page: 1,
      limit: 20,
      // BE yêu cầu NONE để lấy tất cả, nên cast về union cho hook
      status: status as "NONE" | "PENDING" | "APPROVED" | "REJECTED",
    }),
    [status]
  );

  const { data = {}, isLoading } = useVisibilityRequests(queryParams);
  // API trả "reviews" hoặc "data" -> gom về requests
  const requests =
    (data as any)?.requests ||
    (data as any)?.reviews ||
    (data as any)?.data ||
    [];
  const filteredRequests =
    ratingFilter === "all"
      ? requests
      : requests.filter((item: any) => {
          const target = Number(ratingFilter);
          const rate = Number(item?.rating ?? 0);
          return rate === target;
        });
  const pagination = (data as any)?.pagination || {};

  const handleAction = async () => {
    if (!actionReviewId) return;
    try {
      await updateReviewVisibility({
        reviewId: actionReviewId,
        action: actionType,
        note: note.trim() || undefined,
      });
      toast("success", actionType === "approve" ? "Đã duyệt ẩn review" : "Đã từ chối yêu cầu");
      setActionReviewId(null);
      setNote("");
    } catch (error: any) {
      toast("error", error?.response?.data?.message || "Xử lý thất bại");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Yêu cầu ẩn đánh giá</h1>
        <p className="text-muted-foreground mt-2">
          Duyệt/Từ chối các yêu cầu ẩn review do gia sư gửi lên.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border p-4 flex flex-wrap gap-3 items-center">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Trạng thái</span>
          <select
            className="border rounded-md px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value as VisibilityStatus)}
          >
            {REVIEW_VISIBILITY_REQUEST_STATUS_VALUES.map((key) => (
              <option key={key} value={key}>
                {statusLabel[key]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Lọc theo rating</span>
          <select
            className="border rounded-md px-3 py-2"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="5">Từ 5 sao</option>
            <option value="4">Từ 4 sao</option>
            <option value="3">Từ 3 sao</option>
            <option value="2">Từ 2 sao</option>
            <option value="1">Từ 1 sao</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Reviewer", "Gia sư", "Rating", "Nội dung", "Lý do", "Trạng thái", "Thời gian", "Ghi chú admin", "Hành động"].map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-gray-500">
                    Đang tải...
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-gray-500">
                    Không có yêu cầu nào.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((item: any) => {
                  const statusKey = (item.visibilityRequestStatus || ReviewVisibilityRequestStatusEnum.PENDING) as VisibilityStatus;
                  return (
                    <tr key={item._id}>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {item.reviewer?.name || item.reviewerId?.name || "Ẩn danh"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {item.revieweeId?.name || item.tutor?.name || item.tutorUser?.name || item.tutorId?.name || "Chưa có"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {item.rating ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                        {item.comment || "Không có bình luận"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                        {item.visibilityRequestReason || item.reason || "Không cung cấp"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant={statusVariant[statusKey] || "secondary"}>
                          {statusLabel[statusKey] || statusKey}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {item.createdAt ? new Date(item.createdAt).toLocaleString("vi-VN") : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                        {item.visibilityRequestAdminNote || item.adminNote || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 space-x-2">
                        {statusKey === "PENDING" ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setActionReviewId(item._id);
                                setActionType("approve");
                              }}
                            >
                              Duyệt ẩn
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setActionReviewId(item._id);
                                setActionType("reject");
                              }}
                            >
                              Từ chối
                            </Button>
                          </>
                        ) : statusKey === "APPROVED" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setActionReviewId(item._id);
                              setActionType("restore");
                            }}
                          >
                            Bật lại
                          </Button>
                        ) : (
                          <span className="text-xs text-gray-400">Đã xử lý</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {pagination?.total ? (
          <div className="px-4 py-3 text-sm text-gray-500">
            Tổng {pagination.total} yêu cầu
          </div>
        ) : null}
      </div>

      <Dialog open={!!actionReviewId} onOpenChange={(open) => !open && setActionReviewId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve"
                ? "Duyệt ẩn review"
                : actionType === "reject"
                ? "Từ chối yêu cầu"
                : "Bật lại review"}
            </DialogTitle>
            <DialogDescription>Ghi chú (tùy chọn, tối đa 1000 ký tự)</DialogDescription>
          </DialogHeader>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, 1000))}
            className="min-h-[120px]"
            placeholder="Nhập ghi chú (tùy chọn)"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionReviewId(null)}>
              Hủy
            </Button>
            <Button onClick={handleAction} disabled={isUpdatingVisibility}>
              {actionType === "approve"
                ? "Duyệt ẩn"
                : actionType === "reject"
                ? "Từ chối"
                : "Bật lại"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewVisibilityRequests;
