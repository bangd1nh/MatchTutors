// components/AvailabilityGrid.tsx
import { Checkbox } from "@/components/ui/checkbox"

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const TIME_SLOTS = [
    { value: "PRE_12", label: "Before 12 PM" },
    { value: "MID_12_17", label: "12 PM - 5 PM" },
    { value: "AFTER_17", label: "After 5 PM" },
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
                        <th className="text-left p-2 border-b">Day</th>
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