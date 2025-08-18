import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Video, MapPin, FileText } from "lucide-react";

export default function SessionDetails({
    session,
    setSession,
    isEditing,
    currentUser,
}: any) {
    return (
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Video className="h-5 w-5" />
                        Thông tin buổi học
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Ngày học</Label>
                            <Input
                                id="date"
                                type="date"
                                value={
                                    new Date(session.startTime)
                                        .toISOString()
                                        .split("T")[0]
                                }
                                disabled={!isEditing}
                                onChange={(e) => {
                                    const newDate = new Date(e.target.value);
                                    const startTime = new Date(
                                        session.startTime
                                    );
                                    const endTime = new Date(session.endTime);
                                    startTime.setFullYear(
                                        newDate.getFullYear(),
                                        newDate.getMonth(),
                                        newDate.getDate()
                                    );
                                    endTime.setFullYear(
                                        newDate.getFullYear(),
                                        newDate.getMonth(),
                                        newDate.getDate()
                                    );
                                    setSession({
                                        ...session,
                                        startTime,
                                        endTime,
                                    });
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Trạng thái</Label>
                            <Select
                                value={session.status}
                                disabled={
                                    !isEditing || currentUser.role === "student"
                                }
                                onValueChange={(value: any) =>
                                    setSession({ ...session, status: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="scheduled">
                                        Đã lên lịch
                                    </SelectItem>
                                    <SelectItem value="confirmed">
                                        Đã xác nhận
                                    </SelectItem>
                                    <SelectItem value="completed">
                                        Hoàn thành
                                    </SelectItem>
                                    <SelectItem value="rejected">
                                        Đã hủy
                                    </SelectItem>
                                    <SelectItem value="not_conducted">
                                        Không thực hiện
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startTime">Giờ bắt đầu</Label>
                            <Input
                                id="startTime"
                                type="time"
                                value={new Date(session.startTime)
                                    .toTimeString()
                                    .slice(0, 5)}
                                disabled={!isEditing}
                                onChange={(e) => {
                                    const [hours, minutes] =
                                        e.target.value.split(":");
                                    const newStartTime = new Date(
                                        session.startTime
                                    );
                                    newStartTime.setHours(
                                        parseInt(hours),
                                        parseInt(minutes)
                                    );
                                    setSession({
                                        ...session,
                                        startTime: newStartTime,
                                    });
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endTime">Giờ kết thúc</Label>
                            <Input
                                id="endTime"
                                type="time"
                                value={new Date(session.endTime)
                                    .toTimeString()
                                    .slice(0, 5)}
                                disabled={!isEditing}
                                onChange={(e) => {
                                    const [hours, minutes] =
                                        e.target.value.split(":");
                                    const newEndTime = new Date(
                                        session.endTime
                                    );
                                    newEndTime.setHours(
                                        parseInt(hours),
                                        parseInt(minutes)
                                    );
                                    setSession({
                                        ...session,
                                        endTime: newEndTime,
                                    });
                                }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Địa điểm & Liên kết
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="location">
                            Địa điểm/Liên kết học trực tuyến
                        </Label>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <Input
                                id="location"
                                value={session.location}
                                disabled={!isEditing}
                                onChange={(e) =>
                                    setSession({
                                        ...session,
                                        location: e.target.value,
                                    })
                                }
                                placeholder="Nhập địa chỉ hoặc link Google Meet"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Ghi chú buổi học
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        value={session.notes}
                        disabled={!isEditing}
                        onChange={(e) =>
                            setSession({ ...session, notes: e.target.value })
                        }
                        rows={4}
                        placeholder="Thêm ghi chú cho buổi học..."
                    />
                </CardContent>
            </Card>
        </div>
    );
}
