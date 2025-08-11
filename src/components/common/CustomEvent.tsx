// src/components/common/CustomEvent.tsx
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import moment from "moment";

interface CustomEventProps {
    event: {
        title: string;
        start: Date;
        end: Date;
    };
}

export function CustomEvent({ event }: CustomEventProps) {
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
                </div>
            </PopoverContent>
        </Popover>
    );
}
