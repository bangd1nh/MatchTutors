import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useShortAnswerQuiz } from "@/hooks/useSAQ";
import { IQuizInfo } from "@/types/quiz";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/useToast";

const ViewShortAnswerQuizList: React.FC = () => {
    const { fetchList, delete: deleteQuiz } = useShortAnswerQuiz();
    const navigate = useNavigate();
    const addToast = useToast();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const isLoading = fetchList.isLoading;
    const isError = fetchList.isError;
    const data = fetchList.data;
    const quizzes: IQuizInfo[] = Array.isArray(data?.data) ? data!.data : [];

    const handleDelete = async (quizId: string) => {
        setDeletingId(quizId);
        try {
            await deleteQuiz.mutateAsync(quizId);
            addToast("success", "Xóa short answer quiz thành công");
        } catch (error) {
            addToast("error", "Xóa short answer quiz thất bại");
        } finally {
            setDeletingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[240px] flex items-center justify-center">
                <div className="text-sm text-muted-foreground">
                    Đang tải quiz...
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-[240px] flex items-center justify-center">
                <div className="text-sm text-red-400">
                    Không tải được danh sách quiz
                </div>
            </div>
        );
    }

    if (!quizzes.length) {
        return (
            <div className="min-h-[240px] flex items-center justify-center">
                <div className="text-sm text-muted-foreground">
                    Chưa có short answer quiz nào
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quizzes.map((q: IQuizInfo) => (
                    <Card key={q._id} className="overflow-hidden">
                        <CardHeader className="px-4 py-3">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <CardTitle className="text-base">
                                        {q.title}
                                    </CardTitle>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {q.description ?? "—"}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <Badge
                                        variant="default"
                                        className="uppercase text-xs"
                                    >
                                        {String(q.quizType ?? "SHORT_ANSWER")}
                                    </Badge>
                                    <Badge
                                        variant="secondary"
                                        className="uppercase text-xs"
                                    >
                                        {String(q.quizMode ?? "STUDY")}
                                    </Badge>
                                    <div className="text-xs text-muted-foreground">
                                        {q.totalQuestions != null
                                            ? `${q.totalQuestions} câu`
                                            : "—"}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="px-4 pb-4 pt-2">
                            <div className="flex flex-wrap gap-2 mb-3">
                                {(q.tags || []).map((t: string) => (
                                    <Badge key={t} className="text-xs">
                                        {t}
                                    </Badge>
                                ))}
                            </div>

                            <div className="text-xs text-muted-foreground mb-3">
                                {q.settings ? (
                                    <>
                                        Thời gian:{" "}
                                        {q.settings.timeLimitMinutes
                                            ? q.settings.timeLimitMinutes + " phút"
                                            : "Không giới hạn"}{" "}
                                        • Hiện câu trả lời:{" "}
                                        {q.settings.showCorrectAnswersAfterSubmit
                                            ? "Có"
                                            : "Không"}
                                    </>
                                ) : (
                                    "No settings"
                                )}
                            </div>

                            <div className="flex justify-between items-center gap-3">
                                <div className="text-xs text-muted-foreground">
                                    Tạo:{" "}
                                    {q.createdAt
                                        ? new Date(q.createdAt).toLocaleString()
                                        : "—"}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() =>
                                            navigate(
                                                `/tutor/shortAnswer?shortAnswerId=${q._id}`
                                            )
                                        }
                                    >
                                        Xem
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            navigate(
                                                `/tutor/editShortAnswer?shortAnswerId=${q._id}`
                                            )
                                        }
                                    >
                                        Chỉnh sửa
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                disabled={deletingId === q._id}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Xác nhận xóa
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Bạn có chắc chắn muốn xóa quiz "{q.title}"?
                                                    Hành động này không thể hoàn tác.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Hủy
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDelete(q._id)}
                                                    className="bg-red-500 hover:bg-red-600"
                                                    disabled={deletingId === q._id}
                                                >
                                                    {deletingId === q._id ? "Đang xóa..." : "Xóa"}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ViewShortAnswerQuizList;