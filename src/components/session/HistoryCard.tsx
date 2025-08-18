import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Plus, Edit3, XCircle } from "lucide-react";

export default function HistoryCard({ session, currentUser }: any) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Lịch sử thay đổi
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {session.sessionHistory.map(
                        (history: any, index: number) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 p-3 border-l-2 border-blue-200"
                            >
                                <div className="flex-shrink-0 mt-1">
                                    {history.action === "create" && (
                                        <Plus className="h-4 w-4 text-green-600" />
                                    )}
                                    {history.action === "update" && (
                                        <Edit3 className="h-4 w-4 text-blue-600" />
                                    )}
                                    {history.action === "cancel" && (
                                        <XCircle className="h-4 w-4 text-red-600" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">
                                        {history.summary}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(
                                            history.createdAt
                                        ).toLocaleString("vi-VN")}{" "}
                                        •{" "}
                                        {history.changedBy === currentUser._id
                                            ? "Bạn"
                                            : "Hệ thống"}
                                    </p>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
