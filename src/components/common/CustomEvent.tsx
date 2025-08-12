import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import moment from "moment";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CustomEvent({ event }: { event: any }) {
    const navigate = useNavigate();
    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="cursor-pointer p-1">{event.title}</div>
            </PopoverTrigger>
            <PopoverContent className="w-96">
                <div className="space-y-2">
                    <h4 className="font-medium leading-none">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">
                        Từ {moment(event.start).format("LT")} đến{" "}
                        {moment(event.end).format("LT")}
                    </p>
                    <div>
                        <strong>Status:</strong> {event.status}
                    </div>
                    <div>
                        <strong>Trial:</strong> {event.isTrial ? "Có" : "Không"}
                    </div>
                    <div>
                        <strong>Materials:</strong>{" "}
                        {event.materials?.join(", ")}
                    </div>
                    <div>
                        <strong>Quizzes:</strong> {event.quizIds?.join(", ")}
                    </div>
                    <div>
                        <strong>Location:</strong> {event.location}
                    </div>
                    <div>
                        <strong>Notes:</strong> {event.notes}
                    </div>
                    <div>
                        <strong>Reminders:</strong>
                        <ul className="list-disc ml-4">
                            {event.reminders?.map((rem: any, idx: number) => (
                                <li key={idx}>
                                    {rem.minutesBefore} phút trước bằng{" "}
                                    {rem.method.join(", ")} ({rem.notes})
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Button
                        variant={"default"}
                        onClick={() => navigate("/editSession")}
                    >
                        <Pencil />
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
