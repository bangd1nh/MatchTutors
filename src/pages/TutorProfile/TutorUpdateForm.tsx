import { BaseSyntheticEvent, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    User,
    Briefcase,
    GraduationCap,
    Clock,
    Phone,
    Mail,
    Plus,
    X,
    Upload,
    Loader2,
    Save,
    Check,
    DollarSign,
    Award,
    BookOpen,
    Camera,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Tutor } from "@/types/Tutor"
import { DAY_NAMES, getCommonSubjects, SUBJECT_CATEGORIES, TIME_SLOT_LABELS, TutorFormData, tutorSchema } from '../../components/tutor/tutor-profile-form/types';
import { Gender } from "@/enums/gender.enum"
import { TimeSlot } from "@/enums/timeSlot.enum"

interface TutorUpdateFormProps {
    tutorData: Tutor
    isLoading?: boolean
}

export default function TutorUpdateForm({ tutorData, isLoading = false }: TutorUpdateFormProps) {
    const [uploadingImages, setUploadingImages] = useState<{ [key: string]: boolean }>({})
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>(tutorData?.subjects || [])
    const [subjectSearch, setSubjectSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")

    const convertTutorToFormData = (tutor: Tutor): TutorFormData => ({
        fullName: tutor?.fullName || "",
        avatarUrl: tutor?.avatarUrl || "",
        gender: (tutor?.gender as Gender) || undefined,
        bio: tutor?.bio || "",
        address: {
            street: tutor?.address?.street || "",
            city: tutor?.address?.city || "",
            lat: tutor?.address?.lat,
            lng: tutor?.address?.lng,
        },
        hourlyRate: tutor?.hourlyRate || 0,
        experienceYears: tutor?.experienceYears || 0,
        certifications: tutor?.certifications?.map((cert) => ({
            name: cert.name,
            description: cert.description || "",
            imageUrl: cert.imageUrl || "",
            imageFile: undefined,
        })) || [],
        classType: tutor?.classType === "ONLINE" ? "ONLINE" : "IN_PERSON",
        education:
            tutor?.education?.map((edu) => ({
                degree: edu.degree,
                institution: edu.institution,
                fieldOfStudy: edu.fieldOfStudy || "",
                dateRange: {
                    startDate: edu.dateRange?.startDate || "",
                    endDate: edu.dateRange?.endDate || "",
                },
                description: edu.description || "",
            })) || [],
        subjects: tutor?.subjects || [],
        availability:
            tutor?.availability ||
            DAY_NAMES.map((_, index) => ({
                dayOfWeek: index,
                slots: [] as TimeSlot[],
            })),
        contact: {
            phone: tutor?.contact?.phone || "",
            email: tutor?.contact?.email || "",
        },
        levels: [],
    })

    const form = useForm<TutorFormData>({
        resolver: zodResolver(tutorSchema),
        defaultValues: convertTutorToFormData(tutorData),
        mode: "onChange", // Enable dynamic validation
    })

    const {
        fields: certificationFields,
        append: appendCertification,
        remove: removeCertification,
    } = useFieldArray({
        control: form.control,
        name: "certifications",
    })

    const {
        fields: educationFields,
        append: appendEducation,
        remove: removeEducation,
    } = useFieldArray({
        control: form.control,
        name: "education",
    })

    const watchedFields = form.watch()
    const formErrors = form.formState.errors

    const handleImageUpload = async (file: File, certificationIndex: number) => {
        const uploadKey = `cert-${certificationIndex}`
        setUploadingImages((prev) => ({ ...prev, [uploadKey]: true }))

        try {
            const imageUrl = URL.createObjectURL(file)
            form.setValue(`certifications.${certificationIndex}.imageUrl`, imageUrl)
        } catch (error) {
            console.error("Upload failed:", error)
        } finally {
            setUploadingImages((prev) => ({ ...prev, [uploadKey]: false }))
        }
    }

    const handleSubjectSelect = (subject: string) => {
        if (!selectedSubjects.includes(subject)) {
            const newSubjects = [...selectedSubjects, subject]
            setSelectedSubjects(newSubjects)
            form.setValue("subjects", newSubjects)
        }
    }

    const removeSubject = (subject: string) => {
        const newSubjects = selectedSubjects.filter((s) => s !== subject)
        setSelectedSubjects(newSubjects)
        form.setValue("subjects", newSubjects)
    }

    const addCustomSubject = () => {
        if (subjectSearch.trim() && !selectedSubjects.includes(subjectSearch.trim())) {
            handleSubjectSelect(subjectSearch.trim())
            setSubjectSearch("")
        }
    }

    const toggleAvailability = (dayIndex: number, timeSlot: TimeSlot) => {
        const currentAvailability = form.getValues("availability")
        const dayAvailability = currentAvailability[dayIndex]

        const newTimeSlots = dayAvailability.slots.includes(timeSlot)
            ? dayAvailability.slots.filter((slot) => slot !== timeSlot)
            : [...dayAvailability.slots, timeSlot]

        form.setValue(`availability.${dayIndex}.slots`, newTimeSlots)
    }

    const availableSubjects = selectedCategory
        ? getCommonSubjects(selectedCategory)
        : SUBJECT_CATEGORIES.flatMap((cat) => getCommonSubjects(cat))

    const filteredSubjects = availableSubjects.filter(
        (subject) => subject.toLowerCase().includes(subjectSearch.toLowerCase()) && !selectedSubjects.includes(subject),
    )

    function handleSubmit(data: { fullName: string; bio: string; address: { street?: string | undefined; city?: string | undefined; lat?: number | undefined; lng?: number | undefined }; hourlyRate: number; experienceYears: number; certifications: { name: string; imageUrl?: string | undefined; imageFile?: File | undefined; description?: string | undefined }[]; classType: "ONLINE" | "IN_PERSON"; education: { degree: string; institution: string; fieldOfStudy: string; dateRange: { startDate: string; endDate: string }; description?: string | undefined }[]; availability: { dayOfWeek: number; slots: TimeSlot[] }[]; contact: { phone: string; email?: string | undefined; facebook?: string | undefined }; avatarUrl?: string | undefined; avatarFile?: File | undefined; tagline?: string | undefined; dateOfBirth?: string | undefined; gender?: Gender | undefined; subjects?: string[] | undefined; levels?: string[] | undefined }, event?: BaseSyntheticEvent<object, any, any> | undefined): unknown {
        throw new Error("Function not implemented.")
    }

    return (
        <div className="max-h-screen ">
            <div className="max-w-6xl mx-auto p-6 space-y-8">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Profile</h1>
                        </div>
                    </div>
                </div>

                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                    {/* Personal Information */}
                    <Card className="shadow-sm border-slate-200/60">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                            <CardTitle className="flex items-center gap-3 text-blue-900">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <User className="h-5 w-5 text-blue-600" />
                                </div>
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-start gap-6">
                                <div className="flex flex-col items-center space-y-4">
                                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                                        <AvatarImage src={watchedFields.avatarUrl || "/placeholder.svg"} alt={watchedFields.fullName} />
                                        <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-semibold">
                                            {watchedFields.fullName?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Button type="button" variant="outline" size="sm" className="gap-2 bg-transparent">
                                        <Camera className="h-4 w-4" />
                                        Change Photo
                                    </Button>
                                </div>

                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName" className="text-sm font-medium text-slate-700">
                                            Full Name *
                                        </Label>
                                        <Input
                                            id="fullName"
                                            {...form.register("fullName")}
                                            className={cn("h-11", formErrors.fullName && "border-red-300 focus:border-red-500")}
                                        />
                                        {formErrors.fullName && <p className="text-sm text-red-600">{formErrors.fullName.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="gender" className="text-sm font-medium text-slate-700">
                                            Gender
                                        </Label>
                                        <Select
                                            value={watchedFields.gender || ""}
                                            onValueChange={(value) => form.setValue("gender", value as Gender)}
                                        >
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Male">Male</SelectItem>
                                                <SelectItem value="Female">Female</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <Label htmlFor="bio" className="text-sm font-medium text-slate-700">
                                            About You *
                                        </Label>
                                        <Textarea
                                            id="bio"
                                            {...form.register("bio")}
                                            rows={4}
                                            className={cn("resize-none", formErrors.bio && "border-red-300 focus:border-red-500")}
                                        />
                                        {formErrors.bio && <p className="text-sm text-red-600">{formErrors.bio.message}</p>}
                                        <p className="text-xs text-slate-500">{watchedFields.bio?.length || 0} characters (minimum 10)</p>
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="street" className="text-sm font-medium text-slate-700">
                                        Street Address
                                    </Label>
                                    <Input id="street" {...form.register("address.street")} className="h-11" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city" className="text-sm font-medium text-slate-700">
                                        City
                                    </Label>
                                    <Input id="city" {...form.register("address.city")} className="h-11" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Professional Details */}
                    <Card className="shadow-sm border-slate-200/60">
                        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                            <CardTitle className="flex items-center gap-3 text-green-900">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Briefcase className="h-5 w-5 text-green-600" />
                                </div>
                                Professional Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="hourlyRate" className="text-sm font-medium text-slate-700">
                                        Hourly Rate ($) *
                                    </Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="hourlyRate"
                                            type="number"
                                            {...form.register("hourlyRate", { valueAsNumber: true })}
                                            className={cn("h-11 pl-10", formErrors.hourlyRate && "border-red-300 focus:border-red-500")}
                                        />
                                    </div>
                                    {formErrors.hourlyRate && <p className="text-sm text-red-600">{formErrors.hourlyRate.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="experienceYears" className="text-sm font-medium text-slate-700">
                                        Experience (Years) *
                                    </Label>
                                    <Input
                                        id="experienceYears"
                                        type="number"
                                        {...form.register("experienceYears", { valueAsNumber: true })}
                                        className={cn("h-11", formErrors.experienceYears && "border-red-300 focus:border-red-500")}
                                    />
                                    {formErrors.experienceYears && (
                                        <p className="text-sm text-red-600">{formErrors.experienceYears.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="classType" className="text-sm font-medium text-slate-700">
                                        Class Type *
                                    </Label>
                                    <Select
                                        value={watchedFields.classType}
                                        onValueChange={(value) => form.setValue("classType", value as "ONLINE" | "IN_PERSON")}
                                    >
                                        <SelectTrigger className="h-11">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ONLINE">Online</SelectItem>
                                            <SelectItem value="IN_PERSON">In Person</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Certifications */}
                            <div className="space-y-4">
                                {certificationFields.map((field, index) => (
                                    <div key={field.id} className="flex gap-4 p-4 border border-slate-200 rounded-lg">

                                        {/* --- Image Preview on the Left --- */}
                                        <div className="flex-shrink-0">
                                            {form.watch(`certifications.${index}.imageUrl`) ? (
                                                <div className="relative">
                                                    <img
                                                        src={form.watch(`certifications.${index}.imageUrl`)} // ← Fixed this line
                                                        alt="Certification preview"
                                                        className="h-24 w-24 object-cover rounded border"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white shadow-sm"
                                                        onClick={() => form.setValue(`certifications.${index}.imageUrl`, "")}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Label
                                                    htmlFor={`cert-upload-${index}`}
                                                    className="cursor-pointer flex flex-col items-center justify-center h-24 w-24 border-2 border-dashed border-slate-300 rounded-md hover:bg-slate-50 text-slate-400 p-2 text-center"
                                                >
                                                    <Upload className="h-6 w-6 mb-1" />
                                                    <span className="text-xs">Upload Image</span>
                                                </Label>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    if (file) handleImageUpload(file, index)
                                                }}
                                                className="hidden"
                                                id={`cert-upload-${index}`}
                                            />
                                        </div>

                                        {/* --- Certification Info Fields --- */}
                                        <div className="flex-1 space-y-3">
                                            <Input
                                                {...form.register(`certifications.${index}.name`)}
                                                placeholder="Certification name *"
                                                className="h-10"
                                            />
                                            <Textarea
                                                {...form.register(`certifications.${index}.description`)}
                                                placeholder="Certification description (optional)"
                                                rows={2}
                                                className="resize-none"
                                            />
                                        </div>

                                        {/* --- Remove Button --- */}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeCertification(index)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 self-start"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Education & Subjects */}
                    <Card className="shadow-sm border-slate-200/60">
                        <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-t-lg">
                            <CardTitle className="flex items-center gap-3 text-purple-900">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <GraduationCap className="h-5 w-5 text-purple-600" />
                                </div>
                                Education & Subjects
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {/* Education */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium text-slate-700">Education</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            appendEducation({
                                                degree: "",
                                                institution: "",
                                                fieldOfStudy: "",
                                                dateRange: { startDate: "", endDate: "" },
                                                description: "",
                                            })
                                        }
                                        className="gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Education
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {educationFields.map((field, index) => (
                                        <div key={field.id} className="p-4 border border-slate-200 rounded-lg space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input
                                                    {...form.register(`education.${index}.degree`)}
                                                    placeholder="Degree (e.g., Bachelor of Science)"
                                                    className="h-10"
                                                />
                                                <Input
                                                    {...form.register(`education.${index}.institution`)}
                                                    placeholder="Institution"
                                                    className="h-10"
                                                />
                                                <Input
                                                    {...form.register(`education.${index}.fieldOfStudy`)}
                                                    placeholder="Field of Study"
                                                    className="h-10"
                                                />
                                                <div className="flex gap-2">
                                                    <Input
                                                        {...form.register(`education.${index}.dateRange.startDate`)}
                                                        placeholder="Start Year"
                                                        className="h-10"
                                                    />
                                                    <Input
                                                        {...form.register(`education.${index}.dateRange.endDate`)}
                                                        placeholder="End Year"
                                                        className="h-10"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <Textarea
                                                    {...form.register(`education.${index}.description`)}
                                                    placeholder="Description (optional)"
                                                    rows={2}
                                                    className="flex-1 resize-none"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeEducation(index)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Subjects */}
                            <div className="space-y-4">
                                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    Teaching Subjects
                                </Label>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {selectedSubjects.map((subject) => (
                                        <Badge key={subject} variant="secondary" className="gap-2 py-1 px-3">
                                            {subject}
                                            <button
                                                type="button"
                                                onClick={() => removeSubject(subject)}
                                                className="ml-1 hover:bg-slate-200 rounded-full p-0.5"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category (optional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SUBJECT_CATEGORIES.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <div className="flex gap-2">
                                        <Input
                                            value={subjectSearch}
                                            onChange={(e) => setSubjectSearch(e.target.value)}
                                            placeholder="Search or add custom subject"
                                            className="flex-1"
                                        />
                                        <Button type="button" variant="outline" onClick={addCustomSubject} disabled={!subjectSearch.trim()}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {filteredSubjects.length > 0 && (
                                    <div className="border border-slate-200 rounded-lg p-4">
                                        <p className="text-sm font-medium text-slate-700 mb-3">Suggested subjects:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {filteredSubjects.slice(0, 12).map((subject) => (
                                                <Button
                                                    key={subject}
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleSubjectSelect(subject)}
                                                    className="h-8 text-xs"
                                                >
                                                    <Plus className="h-3 w-3 mr-1" />
                                                    {subject}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Availability & Contact */}
                    <Card className="shadow-sm border-slate-200/60">
                        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-lg">
                            <CardTitle className="flex items-center gap-3 text-orange-900">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Clock className="h-5 w-5 text-orange-600" />
                                </div>
                                Availability & Contact
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {/* Availability Grid */}
                            <div className="space-y-4">
                                <Label className="text-sm font-medium text-slate-700">Weekly Availability</Label>
                                <div className="overflow-x-auto">
                                    <table className="w-full border border-slate-200 rounded-lg">
                                        <thead>
                                            <tr className="bg-slate-50">
                                                <th className="p-3 text-left text-sm font-medium text-slate-700 border-r border-slate-200">
                                                    Time
                                                </th>
                                                {DAY_NAMES.map((day) => (
                                                    <th
                                                        key={day}
                                                        className="p-3 text-center text-sm font-medium text-slate-700 border-r border-slate-200 last:border-r-0"
                                                    >
                                                        {day}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {([TimeSlot.PRE_12, TimeSlot.MID_12_17, TimeSlot.AFTER_17] as const).map((timeSlot) => (
                                                <tr key={timeSlot} className="border-t border-slate-200">
                                                    <td className="p-3 text-sm font-medium text-slate-700 border-r border-slate-200 bg-slate-50">
                                                        {TIME_SLOT_LABELS[timeSlot]}
                                                    </td>
                                                    {DAY_NAMES.map((_, dayIndex) => {
                                                        const isSelected = watchedFields.availability?.[dayIndex]?.slots?.includes(timeSlot)
                                                        return (
                                                            <td key={dayIndex} className="p-2 text-center border-r border-slate-200 last:border-r-0">
                                                                <Button
                                                                    type="button"
                                                                    variant={isSelected ? "default" : "outline"}
                                                                    size="sm"
                                                                    onClick={() => toggleAvailability(dayIndex, timeSlot)}
                                                                    className={cn(
                                                                        "w-8 h-8 p-0",
                                                                        isSelected && "bg-blue-600 hover:bg-blue-700 text-white",
                                                                    )}
                                                                >
                                                                    {isSelected && <Check className="h-4 w-4" />}
                                                                </Button>
                                                            </td>
                                                        )
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                                        Phone Number *
                                    </Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="phone"
                                            {...form.register("contact.phone")}
                                            className={cn("h-11 pl-10", formErrors.contact?.phone && "border-red-300 focus:border-red-500")}
                                        />
                                    </div>
                                    {formErrors.contact?.phone && (
                                        <p className="text-sm text-red-600">{formErrors.contact.phone.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input id="email" type="email" {...form.register("contact.email")} className="h-11 pl-10 bg-gray-100 cursor-not-allowed" readOnly />
                                    </div>
                                </div>

                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 gap-3"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Updating Profile...
                                </>
                            ) : (
                                <>
                                    <Save className="h-5 w-5" />
                                    Update Profile
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
