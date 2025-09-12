import { Controller, UseFormReturn } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Clock, Calendar, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DAY_NAMES, TIME_SLOTS, TIME_SLOT_LABELS, TutorFormData } from "./types";

interface AvailabilityContactStepProps {
    form: UseFormReturn<TutorFormData>
}

export default function AvailabilityContactStep({ form }: AvailabilityContactStepProps) {
    return (
        <Card className="shadow-lg border-0 bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-8">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Clock className="h-6 w-6 text-orange-600" />
                    Availability & Contact
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
                <div className="space-y-4">
                    <Label className="text-base font-semibold flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Availability
                    </Label>
                    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="text-left p-4 font-semibold text-gray-700 min-w-[120px]">Time</th>
                                        {DAY_NAMES.map((day) => (
                                            <th key={day} className="text-center p-4 font-semibold text-gray-700 min-w-[80px]">
                                                {day}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {TIME_SLOTS.map((timeSlot) => (
                                        <tr key={timeSlot} className="border-b hover:bg-gray-50">
                                            <td className="p-4 font-medium text-gray-700">{TIME_SLOT_LABELS[timeSlot]}</td>
                                            {DAY_NAMES.map((_, dayIndex) => (
                                                <td key={dayIndex} className="p-2 text-center">
                                                    <Controller
                                                        name="availability"
                                                        control={form.control}
                                                        render={({ field }) => {
                                                            const dayAvailability = field.value.find((a) => a.dayOfWeek === dayIndex)
                                                            const isSelected = dayAvailability?.timeSlots.includes(timeSlot)

                                                            return (
                                                                <Button
                                                                    type="button"
                                                                    variant={isSelected ? "default" : "outline"}
                                                                    size="sm"
                                                                    className={cn(
                                                                        "w-8 h-8 p-0 rounded-full transition-all duration-200",
                                                                        isSelected
                                                                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                                                                            : "hover:bg-blue-50 hover:border-blue-300",
                                                                    )}
                                                                    onClick={() => {
                                                                        const newAvailability = [...field.value]
                                                                        const dayIndex_copy = dayIndex
                                                                        let dayAvailability = newAvailability.find((a) => a.dayOfWeek === dayIndex_copy)

                                                                        if (!dayAvailability) {
                                                                            dayAvailability = { dayOfWeek: dayIndex_copy, timeSlots: [] }
                                                                            newAvailability.push(dayAvailability)
                                                                        }

                                                                        if (dayAvailability.timeSlots.includes(timeSlot)) {
                                                                            dayAvailability.timeSlots = dayAvailability.timeSlots.filter(
                                                                                (s) => s !== timeSlot,
                                                                            )
                                                                        } else {
                                                                            dayAvailability.timeSlots.push(timeSlot)
                                                                        }

                                                                        // Remove days with no time slots
                                                                        const filteredAvailability = newAvailability.filter((a) => a.timeSlots.length > 0)
                                                                        field.onChange(filteredAvailability)
                                                                    }}
                                                                >
                                                                    {isSelected && <Check className="h-4 w-4" />}
                                                                </Button>
                                                            )
                                                        }}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">Click the buttons to toggle your availability for each time slot.</p>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                    <Label className="text-base font-semibold">Contact Information</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" {...form.register("contact.phone")} />
                            {form.formState.errors.contact?.phone && (
                                <p className="text-sm text-destructive">{form.formState.errors.contact.phone.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input id="email" type="email" placeholder="john@example.com" {...form.register("contact.email")} />
                            {form.formState.errors.contact?.email && (
                                <p className="text-sm text-destructive">{form.formState.errors.contact.email.message}</p>
                            )}
                        </div>

                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
