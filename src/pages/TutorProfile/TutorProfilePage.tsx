import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, X, Edit, Star, MapPin, Phone, Mail, Calendar, Clock, GraduationCap, Award } from "lucide-react"
import { Tutor } from "@/types/Tutor"
import { SUBJECT_VALUES } from "@/enums/subject.enum"
import { LEVEL_VALUES } from '../../enums/level.enum';
import { TimeSlot } from "@/types/student"

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const TIME_SLOTS = [
    { value: TimeSlot.PRE_12, label: "Before 12 PM" },
    { value: TimeSlot.MID_12_17, label: "12 PM - 5 PM" },
    { value: TimeSlot.AFTER_17, label: "After 5 PM" },
]

export default function TutorProfile() {
    const [tutor, setTutor] = useState<Tutor | null>(null) // Set to null to show create form
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState<Partial<Tutor>>(
        tutor || {
            name: "",
            gender: "",
            address: { city: "", street: "" },
            certifications: [],
            experienceYears: 0,
            hourlyRate: 0,
            languages: [],
            education: [],
            subjects: [],
            availability: [],
            phone: "",
            email: "",
            bio: "",
            classType: "ONLINE",
            levels: [],
        },
    )

    const showForm = !tutor || isEditing

    const handleSave = () => {
        // Mock save logic
        setTutor(formData as Tutor)
        setIsEditing(false)
    }

    const handleCancel = () => {
        setFormData(tutor || {})
        setIsEditing(false)
    }

    const addCertification = () => {
        setFormData((prev) => ({
            ...prev,
            certifications: [...(prev.certifications || []), { name: "", description: "" }],
        }))
    }

    const removeCertification = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            certifications: prev.certifications?.filter((_, i) => i !== index) || [],
        }))
    }

    const addEducation = () => {
        setFormData((prev) => ({
            ...prev,
            education: [
                ...(prev.education || []),
                {
                    degree: "",
                    institution: "",
                    fieldOfStudy: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                },
            ],
        }))
    }

    const removeEducation = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            education: prev.education?.filter((_, i) => i !== index) || [],
        }))
    }

    const toggleSubject = (subject: string) => {
        setFormData((prev) => ({
            ...prev,
            subjects: prev.subjects?.includes(subject)
                ? prev.subjects.filter((s) => s !== subject)
                : [...(prev.subjects || []), subject],
        }))
    }

    const toggleLevel = (level: string) => {
        setFormData((prev) => ({
            ...prev,
            levels: prev.levels?.includes(level) ? prev.levels.filter((l) => l !== level) : [...(prev.levels || []), level],
        }))
    }

    const updateAvailability = (dayIndex: number, timeSlot: string, checked: boolean) => {
        setFormData((prev) => {
            const availability = [...(prev.availability || [])]
            const dayAvailability = availability.find((a) => a.dayOfWeek === dayIndex)

            if (dayAvailability) {
                if (checked) {
                    dayAvailability.timeSlots = [...dayAvailability.timeSlots, timeSlot as any]
                } else {
                    dayAvailability.timeSlots = dayAvailability.timeSlots.filter((slot) => slot !== timeSlot)
                }
                if (dayAvailability.timeSlots.length === 0) {
                    availability.splice(availability.indexOf(dayAvailability), 1)
                }
            } else if (checked) {
                availability.push({ dayOfWeek: dayIndex, timeSlots: [timeSlot as any] })
            }

            return { ...prev, availability }
        })
    }

    if (showForm) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{tutor ? "Edit Profile" : "Create Tutor Profile"}</h1>
                            <p className="text-gray-600">
                                {tutor ? "Update your tutor information" : "Complete the information below to create your profile"}
                            </p>
                        </div>
                        <Button onClick={() => setTutor(null)} className="bg-blue-600 hover:bg-blue-700">
                            Create Profile
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Avatar Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Picture</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center space-y-4">
                                <Avatar className="w-32 h-32">
                                    <AvatarImage src={formData.avatarUrl || "/placeholder.svg"} />
                                    <AvatarFallback className="text-2xl">
                                        {formData.name
                                            ?.split(" ")
                                            .map((n) => n[0])
                                            .join("") || "TU"}
                                    </AvatarFallback>
                                </Avatar>
                                <Button variant="outline" size="sm">
                                    Choose Photo
                                </Button>
                                <p className="text-sm text-gray-500 text-center">Upload a professional photo</p>
                            </CardContent>
                        </Card>

                        {/* Personal Information */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={formData.name || ""}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="gender">Gender</Label>
                                        <Select
                                            value={formData.gender}
                                            onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Male">Male</SelectItem>
                                                <SelectItem value="Female">Female</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email || ""}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone || ""}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                                            placeholder="Enter phone number"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Address */}
                        <Card className="lg:col-span-3">
                            <CardHeader>
                                <CardTitle>Address</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            value={formData.address?.city || ""}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    address: { ...prev.address, city: e.target.value },
                                                }))
                                            }
                                            placeholder="Enter city"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="street">Street Address</Label>
                                        <Input
                                            id="street"
                                            value={formData.address?.street || ""}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    address: { ...prev.address, street: e.target.value },
                                                }))
                                            }
                                            placeholder="Enter street address"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Teaching Information */}
                        <Card className="lg:col-span-3">
                            <CardHeader>
                                <CardTitle>Teaching Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="experience">Experience (Years)</Label>
                                        <Input
                                            id="experience"
                                            type="number"
                                            value={formData.experienceYears || ""}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, experienceYears: Number.parseInt(e.target.value) || 0 }))
                                            }
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                                        <Input
                                            id="hourlyRate"
                                            type="number"
                                            value={formData.hourlyRate || ""}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, hourlyRate: Number.parseInt(e.target.value) || 0 }))
                                            }
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <Label>Class Type</Label>
                                        <RadioGroup
                                            value={formData.classType}
                                            onValueChange={(value) => setFormData((prev) => ({ ...prev, classType: value as any }))}
                                            className="flex flex-row space-x-4 mt-2"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="ONLINE" id="online" />
                                                <Label htmlFor="online">Online</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="IN_PERSON" id="in-person" />
                                                <Label htmlFor="in-person">In Person</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </div>

                                <div>
                                    <Label>Bio</Label>
                                    <Textarea
                                        value={formData.bio || ""}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                                        placeholder="Tell students about yourself, your teaching style, and experience..."
                                        className="mt-2"
                                        rows={4}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Subjects */}
                        <Card className="lg:col-span-3">
                            <CardHeader>
                                <CardTitle>Subjects</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {SUBJECT_VALUES.map((subject) => (
                                        <Badge
                                            key={subject}
                                            variant={formData.subjects?.includes(subject) ? "default" : "outline"}
                                            className="cursor-pointer"
                                            onClick={() => toggleSubject(subject)}
                                        >
                                            {subject.replace(/_/g, " ")}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Levels */}
                        <Card className="lg:col-span-3">
                            <CardHeader>
                                <CardTitle> Levels</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label className="text-base font-medium">Teaching Levels</Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {LEVEL_VALUES.map((level) => (
                                            <Badge
                                                key={level}
                                                variant={formData.levels?.includes(level) ? "default" : "outline"}
                                                className="cursor-pointer"
                                                onClick={() => toggleLevel(level)}
                                            >
                                                {level}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Education */}
                        <Card className="lg:col-span-3">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    Education
                                    <Button onClick={addEducation} size="sm" variant="outline">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Education
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {formData.education?.map((edu, index) => (
                                    <div key={index} className="border rounded-lg p-4 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-medium">Education {index + 1}</h4>
                                            <Button onClick={() => removeEducation(index)} size="sm" variant="ghost">
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input
                                                placeholder="Degree"
                                                value={edu.degree}
                                                onChange={(e) => {
                                                    const newEducation = [...(formData.education || [])]
                                                    newEducation[index].degree = e.target.value
                                                    setFormData((prev) => ({ ...prev, education: newEducation }))
                                                }}
                                            />
                                            <Input
                                                placeholder="Institution"
                                                value={edu.institution}
                                                onChange={(e) => {
                                                    const newEducation = [...(formData.education || [])]
                                                    newEducation[index].institution = e.target.value
                                                    setFormData((prev) => ({ ...prev, education: newEducation }))
                                                }}
                                            />
                                            <Input
                                                placeholder="Field of Study"
                                                value={edu.fieldOfStudy || ""}
                                                onChange={(e) => {
                                                    const newEducation = [...(formData.education || [])]
                                                    newEducation[index].fieldOfStudy = e.target.value
                                                    setFormData((prev) => ({ ...prev, education: newEducation }))
                                                }}
                                            />
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Start Year"
                                                    value={edu.startDate}
                                                    onChange={(e) => {
                                                        const newEducation = [...(formData.education || [])]
                                                        newEducation[index].startDate = e.target.value
                                                        setFormData((prev) => ({ ...prev, education: newEducation }))
                                                    }}
                                                />
                                                <Input
                                                    placeholder="End Year"
                                                    value={edu.endDate}
                                                    onChange={(e) => {
                                                        const newEducation = [...(formData.education || [])]
                                                        newEducation[index].endDate = e.target.value
                                                        setFormData((prev) => ({ ...prev, education: newEducation }))
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <Textarea
                                            placeholder="Description"
                                            value={edu.description}
                                            onChange={(e) => {
                                                const newEducation = [...(formData.education || [])]
                                                newEducation[index].description = e.target.value
                                                setFormData((prev) => ({ ...prev, education: newEducation }))
                                            }}
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Certifications */}
                        <Card className="lg:col-span-3">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    Certifications
                                    <Button onClick={addCertification} size="sm" variant="outline">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Certification
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {formData.certifications?.map((cert, index) => (
                                    <div key={index} className="border rounded-lg p-4 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-medium">Certification {index + 1}</h4>
                                            <Button onClick={() => removeCertification(index)} size="sm" variant="ghost">
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div className="space-y-4">
                                            <Input
                                                placeholder="Certification Name"
                                                value={cert.name}
                                                onChange={(e) => {
                                                    const newCertifications = [...(formData.certifications || [])]
                                                    newCertifications[index].name = e.target.value
                                                    setFormData((prev) => ({ ...prev, certifications: newCertifications }))
                                                }}
                                            />
                                            <Textarea
                                                placeholder="Description"
                                                value={cert.description || ""}
                                                onChange={(e) => {
                                                    const newCertifications = [...(formData.certifications || [])]
                                                    newCertifications[index].description = e.target.value
                                                    setFormData((prev) => ({ ...prev, certifications: newCertifications }))
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Availability */}
                        <Card className="lg:col-span-3">
                            <CardHeader>
                                <CardTitle>Availability Schedule</CardTitle>
                                <p className="text-sm text-gray-600">Select the days and time slots when you're available to teach</p>
                            </CardHeader>
                            <CardContent>
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
                                                        const isChecked =
                                                            formData.availability?.some(
                                                                (a) => a.dayOfWeek === dayIndex && a.timeSlots.includes(slot.value as any),
                                                            ) || false
                                                        return (
                                                            <td key={slot.value} className="text-center p-2">
                                                                <Checkbox
                                                                    checked={isChecked}
                                                                    onCheckedChange={(checked) =>
                                                                        updateAvailability(dayIndex, slot.value, checked as boolean)
                                                                    }
                                                                />
                                                            </td>
                                                        )
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <Card className="lg:col-span-3">
                            <CardContent className="pt-6">
                                <div className="flex justify-end space-x-4">
                                    <Button onClick={handleCancel} variant="outline">
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                                        {tutor ? "Save Changes" : "Create Profile"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    // Profile View
    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tutor Profile</h1>
                        <p className="text-gray-600">View and manage your tutor information</p>
                    </div>
                    <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Overview */}
                    <Card className="lg:col-span-1">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center space-y-4">
                                <Avatar className="w-32 h-32">
                                    <AvatarImage src={tutor.avatarUrl || "/placeholder.svg"} />
                                    <AvatarFallback className="text-2xl">
                                        {tutor.name
                                            ?.split(" ")
                                            .map((n) => n[0])
                                            .join("") || "TU"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-center">
                                    <h2 className="text-xl font-bold">{tutor.name}</h2>
                                    <div className="flex items-center justify-center space-x-1 mt-2">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-medium">{tutor.ratings.average}</span>
                                        <span className="text-gray-500">({tutor.ratings.totalReviews} reviews)</span>
                                    </div>
                                    <Badge
                                        className={`mt-2 ${tutor.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                                    >
                                        {tutor.isApproved ? "Approved" : "Pending Approval"}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact & Basic Info */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{tutor.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-medium">{tutor.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Location</p>
                                        <p className="font-medium">
                                            {tutor.address.city}, {tutor.address.street}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Clock className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Hourly Rate</p>
                                        <p className="font-medium">${tutor.hourlyRate}/hour</p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4">
                                <p className="text-sm text-gray-500 mb-2">Bio</p>
                                <p className="text-gray-700">{tutor.bio}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Teaching Information */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Teaching Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <p className="text-2xl font-bold text-blue-600">{tutor.experienceYears}</p>
                                    <p className="text-sm text-gray-600">Years Experience</p>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <p className="text-2xl font-bold text-green-600">{tutor.subjects.length}</p>
                                    <p className="text-sm text-gray-600">Subjects</p>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <p className="text-2xl font-bold text-purple-600">{tutor.languages.length}</p>
                                    <p className="text-sm text-gray-600">Languages</p>
                                </div>
                                <div className="text-center p-4 bg-orange-50 rounded-lg">
                                    <p className="text-2xl font-bold text-orange-600">{tutor.classType}</p>
                                    <p className="text-sm text-gray-600">Class Type</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-3">Subjects</h4>
                                <div className="flex flex-wrap gap-2">
                                    {tutor.subjects.map((subject) => (
                                        <Badge key={subject} variant="secondary">
                                            {subject.replace(/_/g, " ")}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-3">Languages</h4>
                                <div className="flex flex-wrap gap-2">
                                    {tutor.languages.map((language) => (
                                        <Badge key={language} variant="outline">
                                            {language}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-3">Teaching Levels</h4>
                                <div className="flex flex-wrap gap-2">
                                    {tutor.levels.map((level) => (
                                        <Badge key={level} variant="outline">
                                            {level}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Education */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <GraduationCap className="w-5 h-5 mr-2" />
                                Education
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {tutor.education.map((edu, index) => (
                                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                                    <h4 className="font-medium">{edu.degree}</h4>
                                    <p className="text-gray-600">{edu.institution}</p>
                                    {edu.fieldOfStudy && <p className="text-sm text-gray-500">{edu.fieldOfStudy}</p>}
                                    <p className="text-sm text-gray-500">
                                        {edu.startDate} - {edu.endDate}
                                    </p>
                                    <p className="text-sm mt-2">{edu.description}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Certifications */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Award className="w-5 h-5 mr-2" />
                                Certifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {tutor.certifications.map((cert, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                    <h4 className="font-medium">{cert.name}</h4>
                                    {cert.description && <p className="text-gray-600 mt-2">{cert.description}</p>}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Availability */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Calendar className="w-5 h-5 mr-2" />
                                Availability Schedule
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
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
                                                    const isAvailable = tutor.availability.some(
                                                        (a) => a.dayOfWeek === dayIndex && a.timeSlots.includes(slot.value as any),
                                                    )
                                                    return (
                                                        <td key={slot.value} className="text-center p-2">
                                                            <div
                                                                className={`w-6 h-6 rounded-full mx-auto ${isAvailable ? "bg-blue-500" : "bg-gray-200"
                                                                    }`}
                                                            />
                                                        </td>
                                                    )
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
