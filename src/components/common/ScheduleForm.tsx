import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

const statusOptions = [
    "scheduled",
    "confirmed",
    "rejected",
    "completed",
    "not_conducted",
];

const scheduleSessionSchema = z.object({
    teachingRequestId: z.string().min(1, "ID yêu cầu học không được để trống"),
    startDate: z.date(),
    startTime: z.any(),
    endTime: z.any(),
    startHour: z.string().min(1, "Chọn giờ bắt đầu"),
    endDate: z.date(),
    endHour: z.string().min(1, "Chọn giờ kết thúc"),
    status: z.enum([
        "scheduled",
        "confirmed",
        "rejected",
        "completed",
        "not_conducted",
    ]),
    isTrial: z.boolean(),
    location: z.string().optional(),
    notes: z.string().optional(),
    materials: z.array(z.string()).optional(),
    quizIds: z.array(z.string()).optional(),
});

export type ScheduleSessionFormValues = z.infer<typeof scheduleSessionSchema>;

const hourOptions = Array.from({ length: 24 }, (_, i) =>
    i < 10 ? `0${i}:00` : `${i}:00`
);

interface ScheduleFormProps {
    onSubmit: (data: ScheduleSessionFormValues) => void;
    initialValues?: Partial<ScheduleSessionFormValues>;
    isPending?: boolean;
    isCreated?: boolean;
}

export function ScheduleForm({
    onSubmit,
    initialValues,
    isPending,
    isCreated,
}: ScheduleFormProps) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<ScheduleSessionFormValues>({
        resolver: zodResolver(scheduleSessionSchema),
        defaultValues: initialValues,
        resetOptions: { keepDirtyValues: true },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {isCreated ? (
                <div>
                    <Label htmlFor="teachingRequestId">ID Yêu cầu học</Label>
                    <Input
                        id="teachingRequestId"
                        {...register("teachingRequestId")}
                        disabled
                    />
                    {errors.teachingRequestId && (
                        <p className="text-red-500 text-sm">
                            {errors.teachingRequestId.message}
                        </p>
                    )}
                </div>
            ) : (
                <></>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label>Ngày bắt đầu</Label>
                    <Controller
                        name="startDate"
                        control={control}
                        render={({ field }) => (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !field.value &&
                                                "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Chọn ngày</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                    {errors.startDate && (
                        <p className="text-red-500 text-sm">
                            {errors.startDate.message}
                        </p>
                    )}
                    <div className="mt-2">
                        <Label>Giờ bắt đầu</Label>
                        <Controller
                            name="startHour"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Chọn giờ bắt đầu" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {hourOptions.map((opt) => (
                                            <SelectItem key={opt} value={opt}>
                                                {opt}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.startHour && (
                            <p className="text-red-500 text-sm">
                                {errors.startHour.message}
                            </p>
                        )}
                    </div>
                </div>
                <div>
                    <Label>Ngày kết thúc</Label>
                    <Controller
                        name="endDate"
                        control={control}
                        render={({ field }) => (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !field.value &&
                                                "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Chọn ngày</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                    {errors.endDate && (
                        <p className="text-red-500 text-sm">
                            {errors.endDate.message}
                        </p>
                    )}
                    <div className="mt-2">
                        <Label>Giờ kết thúc</Label>
                        <Controller
                            name="endHour"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Chọn giờ kết thúc" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {hourOptions.map((opt) => (
                                            <SelectItem key={opt} value={opt}>
                                                {opt}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.endHour && (
                            <p className="text-red-500 text-sm">
                                {errors.endHour.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <div>
                <Label htmlFor="status">Trạng thái</Label>
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select
                            onValueChange={field.onChange}
                            value={field.value}
                        >
                            <SelectTrigger id="status" className="w-full">
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((opt) => (
                                    <SelectItem key={opt} value={opt}>
                                        {opt}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.status && (
                    <p className="text-red-500 text-sm">
                        {errors.status.message}
                    </p>
                )}
            </div>
            <div>
                <Label>
                    <input type="checkbox" {...register("isTrial")} />
                    &nbsp;Buổi học thử
                </Label>
            </div>
            <div>
                <Label htmlFor="location">Địa điểm / Link học</Label>
                <Input id="location" {...register("location")} />
            </div>
            <div>
                <Label htmlFor="notes">Ghi chú</Label>
                <Input id="notes" {...register("notes")} />
            </div>
            <div>
                <Label htmlFor="materials">
                    Tài liệu (IDs, cách nhau dấu phẩy)
                </Label>
                <Input
                    id="materials"
                    {...register("materials")}
                    placeholder="mat1,mat2"
                />
            </div>
            <div>
                <Label htmlFor="quizIds">Quiz (IDs, cách nhau dấu phẩy)</Label>
                <Input
                    id="quizIds"
                    {...register("quizIds")}
                    placeholder="quiz1,quiz2"
                />
            </div>
            <Button type="submit" disabled={isPending}>
                {isPending
                    ? "Đang lưu..."
                    : initialValues
                    ? "Cập nhật"
                    : "Tạo mới"}
            </Button>
        </form>
    );
}
