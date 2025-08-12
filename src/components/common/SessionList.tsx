import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import moment from "moment";
import { Pencil, Trash2 } from "lucide-react";
import { ScheduleSession } from "@/api/schedules";

interface SessionListProps {
    sessions: ScheduleSession[];
    onEdit: (session: ScheduleSession) => void;
    onDelete: (sessionId: string) => void;
}

export function SessionList({ sessions, onEdit, onDelete }: SessionListProps) {
    if (sessions.length === 0) {
        return (
            <p className="text-muted-foreground text-center">
                Chưa có buổi học nào.
            </p>
        );
    }
    return (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
            {sessions.map((session) => (
                <Card key={session._id}>
                    <CardHeader>
                        <CardTitle>
                            {session.notes || session.teachingRequestId}
                        </CardTitle>
                        <CardDescription>
                            {moment(session.startTime).format(
                                "DD/MM/YYYY HH:mm"
                            )}{" "}
                            - {moment(session.endTime).format("HH:mm")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <strong>Trạng thái:</strong> {session.status}
                        </div>
                        <div>
                            <strong>Trial:</strong>{" "}
                            {session.isTrial ? "Có" : "Không"}
                        </div>
                        <div>
                            <strong>Địa điểm:</strong> {session.location}
                        </div>
                        <div>
                            <strong>Tài liệu:</strong>{" "}
                            {session.materials?.join(", ")}
                        </div>
                        <div>
                            <strong>Quiz:</strong> {session.quizIds?.join(", ")}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onEdit(session)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => onDelete(session._id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
