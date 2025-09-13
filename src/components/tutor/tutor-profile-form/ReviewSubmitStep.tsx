import { UseFormReturn } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, Edit, User, Briefcase, GraduationCap, Phone, Mail, Globe, Clock, Check, Award, ImageIcon, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DAY_NAMES, TIME_SLOT_LABELS, TIME_SLOTS, TutorFormData } from "./types";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ReviewSubmitStepProps {
    form: UseFormReturn<TutorFormData>
    goToStep: (step: number) => void
}

export default function ReviewSubmitStep({ form, goToStep }: ReviewSubmitStepProps) {
    return (
        <Card className="shadow-lg border-0 bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-8">
                <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-blue-100 rounded-full">
                        <CheckCircle className="h-6 w-6 text-blue-600" />
                    </div>
                    Review & Submit Profile
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                    Please review all information before submitting your tutor profile.
                </p>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
                {/* Personal Information Summary */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-600" />
                            Personal Information
                        </h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => goToStep(1)}
                            className="hover:bg-blue-50"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    </div>
                    <Card className="bg-slate-50 border-slate-200">
                        <CardContent className="p-6">
                            {/* avatar */}
                            <div className="flex items-center mb-6">
                                <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
                                    <AvatarImage src={form.watch("avatarUrl") || "/placeholder.svg"} />
                                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xl font-semibold">
                                        <User className="h-10 w-10" />
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                <div className="space-y-2">
                                    <span className="font-semibold text-slate-700">Full Name:</span>
                                    <p className="text-slate-900">{form.watch("fullName")}</p>
                                </div>
                                <div className="space-y-2">
                                    <span className="font-semibold text-slate-700">Gender:</span>
                                    <p className="text-slate-900">{form.watch("gender") || "Not specified"}</p>
                                </div>
                                <div className="space-y-2">
                                    <span className="font-semibold text-slate-700">Date of Birth:</span>
                                    <p className="text-slate-900">{form.watch("dateOfBirth") || "Not specified"}</p>
                                </div>
                                <div className="space-y-2">
                                    <span className="font-semibold text-slate-700">Location:</span>
                                    <p className="text-slate-900">
                                        {form.watch("address.city")}, {form.watch("address.street")}
                                    </p>
                                </div>

                            </div>
                            <div className="mt-6 space-y-2">
                                <span className="font-semibold text-slate-700">Bio:</span>
                                <div
                                    className="prose prose-slate max-w-none text-slate-900 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: form.watch("bio") }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Separator className="my-8" />

                {/* Professional Details Summary */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-green-600" />
                            Professional Details
                        </h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => goToStep(2)}
                            className="hover:bg-green-50"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    </div>
                    <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm mb-6">
                                <div className="space-y-2">
                                    <span className="font-semibold text-slate-700">Hourly Rate:</span>
                                    <p className="text-2xl font-bold text-green-600">${form.watch("hourlyRate")}/hr</p>
                                </div>
                                <div className="space-y-2">
                                    <span className="font-semibold text-slate-700">Experience:</span>
                                    <p className="text-2xl font-bold text-green-600">{form.watch("experienceYears")} years</p>
                                </div>
                                <div className="space-y-2">
                                    <span className="font-semibold text-slate-700">Class Type:</span>
                                    <p className="text-slate-900 font-medium">{form.watch("classType")}</p>
                                </div>
                                <div className="space-y-2">
                                    <span className="font-semibold text-slate-700">Levels:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {(form.watch("levels") ?? []).map((level) => (
                                            <Badge
                                                key={level}
                                                variant="outline"
                                                className="bg-green-100 border-green-300 text-green-700"
                                            >
                                                {level}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>

                <Separator className="my-8" />

                {/* Certifications Section */}
                {form.watch("certifications") && form.watch("certifications").length > 0 && (
                    <>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                                    <Award className="h-5 w-5 text-amber-600" />
                                    Certifications & Credentials
                                </h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => goToStep(2)}
                                    className="hover:bg-amber-50"
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                            </div>
                            <Card className="bg-amber-50 border-amber-200">
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        {form.watch("certifications")?.map((cert, index) => (
                                            <div key={index} className="bg-white p-4 rounded-lg border border-amber-200">
                                                <div className="flex flex-col md:flex-row md:items-start gap-4">
                                                    {cert.imageUrl && (
                                                        <div className="flex-shrink-0">
                                                            <div className="w-24 h-24 rounded-lg border border-amber-300 overflow-hidden bg-amber-100 flex items-center justify-center">
                                                                <img
                                                                    src={cert.imageUrl}
                                                                    alt={cert.name}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.currentTarget.style.display = 'none'
                                                                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                                                    }}
                                                                />
                                                                <div className="hidden w-full h-full flex items-center justify-center">
                                                                    <ImageIcon className="h-8 w-8 text-amber-400" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-amber-800 text-lg mb-1">
                                                            {cert.name}
                                                        </h4>
                                                        {!cert.imageUrl && (
                                                            <div className="flex items-center gap-2 text-amber-600 text-sm mt-2">
                                                                <ImageIcon className="h-4 w-4" />
                                                                <span>No image uploaded</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <Separator className="my-8" />
                    </>
                )}

                {/* Education & Subjects Summary */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-purple-600" />
                            Education & Subjects
                        </h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => goToStep(3)}
                            className="hover:bg-purple-50"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    </div>
                    <Card className="bg-purple-50 border-purple-200">
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                <div>
                                    <span className="font-semibold text-slate-700 block mb-3">Education:</span>
                                    <div className="space-y-3">
                                        {form.watch("education")?.map((edu, index) => (
                                            <div key={index} className="bg-white p-4 rounded-lg border border-purple-200">
                                                <div className="font-semibold text-slate-900">
                                                    {edu.degree} - {edu.institution}
                                                </div>
                                                <div className="text-slate-600 mt-1">
                                                    {edu.fieldOfStudy} • {edu.dateRange.startDate} - {edu.dateRange.endDate}
                                                </div>
                                                {edu.description && (
                                                    <div className="text-slate-500 mt-2 text-sm">
                                                        {edu.description}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-700 block mb-3">Subjects:</span>
                                    <div className="space-y-4">
                                        {(form.watch("subjects") ?? []).length > 0 ? (
                                            <div className="bg-white p-4 rounded-lg border border-purple-200">
                                                <div className="font-semibold mb-2">Selected Subjects</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {(form.watch("subjects") ?? [])
                                                        .filter((subject) => subject)
                                                        .map((subject, index) => (
                                                            <Badge
                                                                key={index}
                                                                variant="outline"
                                                                className="bg-purple-100 border-purple-300 text-purple-700"
                                                            >
                                                                {subject}
                                                            </Badge>
                                                        ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-muted-foreground text-sm p-4 text-center">
                                                No subjects selected yet
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Separator className="my-8" />

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-orange-600" />
                            Availability & Contact
                        </h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => goToStep(4)}
                            className="hover:bg-orange-50"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    </div>
                    <Card className="bg-orange-50 border-orange-200">
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                {/* Availability Grid Display */}
                                <div>
                                    <span className="font-semibold text-slate-700 block mb-3">Weekly Availability:</span>
                                    <div className="bg-white rounded-lg border border-orange-200 overflow-hidden">
                                        <div className="grid grid-cols-8 gap-0">
                                            {/* Header */}
                                            <div className="bg-orange-100 p-3 font-semibold text-center text-sm border-r border-orange-200">
                                                Time
                                            </div>
                                            {DAY_NAMES.map((day) => (
                                                <div
                                                    key={day}
                                                    className="bg-orange-100 p-3 font-semibold text-center text-sm border-r border-orange-200 last:border-r-0"
                                                >
                                                    {day}
                                                </div>
                                            ))}

                                            {/* Time slots */}
                                            {TIME_SLOTS.map((timeSlot) => (
                                                <React.Fragment key={timeSlot}>
                                                    <div className="p-3 font-medium text-sm bg-gray-50 border-r border-t border-orange-200">
                                                        {TIME_SLOT_LABELS[timeSlot]}
                                                    </div>
                                                    {DAY_NAMES.map((_, dayIndex) => {
                                                        // Get the availability for this day
                                                        const dayAvailability = form.watch("availability")?.find(
                                                            (a) => a.dayOfWeek === dayIndex
                                                        );
                                                        // Check if this time slot is selected for this day
                                                        const isAvailable = dayAvailability?.slots?.includes(timeSlot);

                                                        return (
                                                            <div
                                                                key={`${dayIndex}-${timeSlot}`}
                                                                className="p-3 text-center border-r border-t border-orange-200 last:border-r-0"
                                                            >
                                                                {isAvailable ? (
                                                                    <div className="w-6 h-6 bg-green-500 rounded-full mx-auto flex items-center justify-center">
                                                                        <Check className="h-4 w-4 text-white" />
                                                                    </div>
                                                                ) : (
                                                                    <div className="w-6 h-6 bg-gray-200 rounded-full mx-auto"></div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div>
                                    <span className="font-semibold text-slate-700 block mb-3">Contact Information:</span>
                                    <div className={`grid grid-cols-1 md:grid-cols-1 gap-4`}>
                                        <div className="bg-white p-4 rounded-lg border border-orange-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Phone className="h-4 w-4 text-orange-600" />
                                                <span className="font-semibold text-slate-700">Phone:</span>
                                            </div>
                                            <p className="text-slate-900">{form.watch("contact.phone")}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg border border-orange-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Mail className="h-4 w-4 text-orange-600" />
                                                <span className="font-semibold text-slate-700">Email:</span>
                                            </div>
                                            <p className="text-slate-900">{form.watch("contact.email")}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </CardContent>
        </Card>
    )
}