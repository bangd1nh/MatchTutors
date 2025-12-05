import { Checkbox } from "@/components/ui/checkbox"

// Ngày trong tuần bằng tiếng Việt
const DAYS = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"]

// Các khung giờ
const TIME_SLOTS = [
    { value: "PRE_12", label: "Trước 12 giờ trưa" },
    { value: "MID_12_17", label: "12 giờ trưa - 5 giờ chiều" },
    { value: "AFTER_17", label: "Sau 5 giờ chiều" },
]

interface AvailabilityGridProps {
    availability: any[]
    onAvailabilityChange?: (dayIndex: number, timeSlot: string, checked: boolean) => void
    isViewMode?: boolean
}

export function AvailabilityGrid({ availability, onAvailabilityChange, isViewMode = false }: AvailabilityGridProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="text-left p-2 border-b">Ngày</th>
                        {TIME_SLOTS.map((slot) => (
                            <th key={slot.value} className="text-center p-2 border-b min-w-[120px]">
                                {slot.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {DAYS.map((day, dayIndex) => (
                        <tr key={day} className="border-b">
                            <td className="p-2 font-medium">{day}</td>
                            {TIME_SLOTS.map((slot) => {
                                const isAvailable = availability?.some(
                                    (a) => a.dayOfWeek === dayIndex && a.slots?.includes(slot.value)
                                )

                                return (
                                    <td key={slot.value} className="text-center p-2">
                                        {isViewMode ? (
                                            <div className={`w-6 h-6 rounded-full mx-auto ${isAvailable ? "bg-blue-500" : "bg-gray-200"}`} />
                                        ) : (
                                            <Checkbox
                                                checked={isAvailable}
                                                onCheckedChange={(checked) => onAvailabilityChange?.(dayIndex, slot.value, checked as boolean)}
                                            />
                                        )}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
