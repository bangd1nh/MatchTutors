import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Edit3,
    Save,
    Settings,
    Calendar,
    Clock,
    Users,
} from "lucide-react";

export default function SessionHeader({
    session,
    isEditing,
    setIsEditing,
    handleSave,
    handleCancel,
    canEdit,
}: any) {
    // >>> changed code: map status -> label + classes
    const statusMap: Record<string, { label: string; className: string }> = {
        scheduled: {
            label: "Đã lên lịch",
            className: "bg-blue-100 text-blue-800",
        },
        confirmed: {
            label: "Đã xác nhận",
            className: "bg-green-100 text-green-800",
        },
        completed: {
            label: "Hoàn thành",
            className: "bg-gray-100 text-gray-800",
        },
        rejected: {
            label: "Đã hủy",
            className: "bg-red-100 text-red-800",
        },
        not_conducted: {
            label: "Không thực hiện",
            className: "bg-orange-100 text-orange-800",
        },
    };

    const statusInfo = statusMap[session.status] ?? {
        label: session.status,
        className: "bg-gray-100 text-gray-800",
    };
    // <<< changed code

    return (
        <div className="border-b bg-card">
            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-semibold text-foreground">
                                    {session.teachingRequest.subject} -{" "}
                                    {session.teachingRequest.level}
                                </h1>

                                {/* >>> changed code: use mapped label + class */}
                                <Badge className={statusInfo.className}>
                                    {statusInfo.label}
                                </Badge>
                                {/* <<< changed code */}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(
                                        session.startTime
                                    ).toLocaleDateString("vi-VN")}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {new Date(
                                        session.startTime
                                    ).toLocaleTimeString("vi-VN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}{" "}
                                    -{" "}
                                    {new Date(
                                        session.endTime
                                    ).toLocaleTimeString("vi-VN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    {session.teachingRequest.student.name}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {canEdit && (
                            <>
                                {isEditing ? (
                                    <>
                                        <Button
                                            variant="outline"
                                            onClick={handleCancel}
                                        >
                                            Hủy
                                        </Button>
                                        <Button onClick={handleSave}>
                                            <Save className="h-4 w-4 mr-2" />
                                            Lưu
                                        </Button>
                                    </>
                                ) : (
                                    <Button onClick={() => setIsEditing(true)}>
                                        <Edit3 className="h-4 w-4 mr-2" />
                                        Chỉnh sửa
                                    </Button>
                                )}
                            </>
                        )}
                        <Button variant="outline" size="icon">
                            <Settings className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
