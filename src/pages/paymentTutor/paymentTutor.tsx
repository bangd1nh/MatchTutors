import { Pagination } from "@/components/common/Pagination";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { usePaymentTutor } from "@/hooks/paymentSuccess";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PaymentTutorPage() {
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  const {
    payments,
    total,
    currentPage,
    totalPages,
    isLoading,
    isError,
    setPage,
  } = usePaymentTutor();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: "hsl(var(--primary))" }}
          />
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <p className="text-destructive text-lg font-medium">
            Có lỗi xảy ra khi tải dữ liệu
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Lịch sử thanh toán
        </h1>
        <p className="text-muted-foreground">
          Quản lý các khoản thanh toán thành công của bạn
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg border border-border">
          <p className="text-muted-foreground text-lg">
            Chưa có khoản thanh toán nào
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 mb-8">
            {payments.map((payment) => (
              <Card
                key={payment._id}
                className="bg-card text-card-foreground border border-border hover:shadow-md transition"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-muted-foreground">
                          Mã đơn hàng:
                        </span>
                        <span className="font-mono text-sm text-foreground">
                          {payment.orderCode}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-muted-foreground">
                          Loại:
                        </span>
                        <span className="text-sm capitalize text-foreground">
                          Gói học
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-muted-foreground">
                          Ngày:
                        </span>
                        <span className="text-sm text-foreground">
                          {new Date(payment.createdAt).toLocaleDateString("vi-VN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary mb-2">
                        {payment.amount.toLocaleString("vi-VN")} đ
                      </div>
                      <Badge
                        variant="secondary"
                        className="rounded-full px-3 py-1 bg-primary/10 text-primary"
                      >
                        ✓ Thành công
                      </Badge>
                    </div>
                  </div>

                  {payment.transactionId && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        Mã giao dịch: {payment.transactionId}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Hiển thị {(currentPage - 1) * 6 + 1} đến{" "}
            {Math.min(currentPage * 6, total)} trong {total} kết quả
          </div>
        </>
      )}
    </div>
  );
}
