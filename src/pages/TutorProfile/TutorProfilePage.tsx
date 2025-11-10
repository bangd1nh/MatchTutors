import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, Loader2 } from "lucide-react"
import { Tutor } from "@/types/tutorListandDetail"
import { SUBJECT_LABELS, SUBJECT_VALUES } from "@/enums/subject.enum"
import { LEVEL_LABELS, LEVEL_VALUES } from '../../enums/level.enum';
import { ProfileAvatar, PersonalInfoForm, AvailabilityGrid, MultiSelectInput, TeachingInformationForm } from "@/components/tutor/tutor-profile"
import { useTutorFormValidation } from "@/hooks/useTutorFormValidation"
import { TutorProfileFormData } from "@/validation/tutorProfileSchema"
import { ValidationError } from "@/components/tutor/tutor-profile/ValidationError"
import { useTutorProfile } from "@/hooks/useTutorProfile"
import { useToast } from "@/hooks/useToast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CITY_TYPE_VALUES } from "@/enums/city.enum"
import { useUser } from "@/hooks/useUser"
import { Certification } from "@/types/tutorListandDetail";
import { TutorProfileView } from "@/components/tutor/tutor-profile/TutorProfileView"
import { EducationForm } from "@/components/tutor/tutor-profile/EducationForm"

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default function TutorProfile() {
    const { user } = useUser();
    const {
        tutorProfile,
        isLoading,
        error,
        createTutor,
        updateTutor,
        isCreating,
        isUpdating,
        refetch,
    } = useTutorProfile();
    const toast = useToast();
    const [tutor, setTutor] = useState<Tutor | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [certificationFiles, setCertificationFiles] = useState<{ [key: string]: File[] }>({});
    const [removedImages, setRemovedImages] = useState<
        { certId?: string; certIndex: number; tempCertId?: string; imageIndex: number }[]
    >([]);
    // console.log("Loaded tutor profile:", tutorProfile);
    const [isEditing, setIsEditing] = useState(!tutor);
    const { validateForm, getError, hasError, clearFieldError, validateField, clearErrors } = useTutorFormValidation();
    const levelsRef = useRef<HTMLDivElement>(null);
    const subjectRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState<Partial<Tutor>>({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        gender: user?.gender || '',
        address: {
            city: '',
            street: '',
        },
        certifications: [],
        experienceYears: 0,
        hourlyRate: 0,
        languages: [],
        education: [],
        subjects: [],
        availability: DAYS.map((_, index) => ({
            dayOfWeek: index,
            timeSlots: [],
        })),
        bio: '',
        classType: [] as string[],
        levels: [],
    });
    // Initialize form data when tutor profile is loaded
    useEffect(() => {
        if (tutorProfile) {
            const user = typeof tutorProfile.userId === "object" ? tutorProfile.userId : null;

            setFormData(prev => ({
                ...tutorProfile,
                name: user?.name ?? '',
                email: user?.email ?? '',
                phone: user?.phone ?? '',
                gender: user?.gender ?? '',
                avatarUrl: user?.avatarUrl ?? prev.avatarUrl ?? '',
                address: {
                    city: prev.address?.city || user?.address?.city || tutorProfile.address?.city || '',
                    street: prev.address?.street || user?.address?.street || tutorProfile.address?.street || '',
                },
            }));

            setTutor(tutorProfile);
        }
    }, [tutorProfile, user]);

    // Wait until data is loaded to decide editing state
    useEffect(() => {
        if (!isLoading) {
            setIsEditing(!tutorProfile);
        }
    }, [isLoading, tutorProfile]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <span className="ml-2 text-lg">Loading profile...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <p className="text-red-500">Failed to load profile. Please try again.</p>
            </div>
        );
    }

    const showForm = !tutorProfile || isEditing

    // Helper function to convert form data to FormData for file uploads
    const convertFormDataToFormData = (data: Tutor): FormData => {
        const formData = new FormData();

        // Add all simple fields
        Object.entries(data).forEach(([key, value]) => {
            if (key === "education" && Array.isArray(value)) {
                // Normalize startDate and endDate to YYYY-MM
                const normalizedEducation = value.map((edu: any) => ({
                    ...edu,
                    startDate: edu.startDate
                        ? new Date(edu.startDate).toISOString().slice(0, 7)
                        : "",
                    endDate: edu.endDate
                        ? new Date(edu.endDate).toISOString().slice(0, 7)
                        : "",
                }));
                formData.append(key, JSON.stringify(normalizedEducation));
            } else if (key === "address") {
                formData.append(key, JSON.stringify(value));
            } else if (Array.isArray(value)) {
                formData.append(key, JSON.stringify(value));
            } else if (typeof value === "object" && value !== null) {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value as string);
            }
        });

        if (avatarFile) {
            formData.append("avatar", avatarFile);
        }

        const imageCertMapping: Array<{
            action: "add" | "remove";
            certIndex?: number;
            fileIndex?: number;
            tempCertId?: string;
            certId?: string;
            imageIndex?: number;
        }> = [];

        // Handle uploads - collect ALL files first with proper indexing
        const allFiles: File[] = [];
        Object.entries(certificationFiles).forEach(([certIndexStr, files]) => {
            files.forEach(file => {
                allFiles.push(file);
            });
        });

        // Append all files to FormData with proper indexing
        allFiles.forEach((file, globalIndex) => {
            formData.append("certificationImages", file);
        });

        // Now create mapping with correct global file indexes
        Object.entries(certificationFiles).forEach(([certIndexStr, files]) => {
            const certIndex = parseInt(certIndexStr);
            const cert = data.certifications?.[certIndex];

            files.forEach((file, localFileIndex) => {
                // Find the global index of this file
                const globalIndex = allFiles.indexOf(file);

                if (globalIndex !== -1) {
                    imageCertMapping.push({
                        action: "add",
                        certIndex,
                        fileIndex: globalIndex, // Use global index
                        tempCertId: cert?.tempId,
                        certId: cert?._id,
                    });
                    console.log(`📸 Mapping: certIndex=${certIndex}, fileIndex=${globalIndex}, fileName=${file.name}`);
                }
            });
        });

        // Handle removals
        removedImages.forEach(r => {
            imageCertMapping.push({
                action: "remove",
                certIndex: r.certIndex,
                certId: r.certId,
                tempCertId: r.tempCertId,
                imageIndex: r.imageIndex,
            });
        });

        // Add the mapping information
        if (imageCertMapping.length > 0) {
            console.log("📨 Final imageCertMapping being sent:", imageCertMapping);
            formData.append("imageCertMapping", JSON.stringify(imageCertMapping));
        }

        return formData;
    };

    const handleSave = async () => {
        const submissionData = {
            ...formData,
            availability: (formData.availability ?? []).map(day => ({
                ...day,
                slots: Array.isArray(day.slots) ? day.slots : [],
            })),
        };

        const validation = validateForm(submissionData as TutorProfileFormData, !!tutorProfile);

        // console.log("📤 Form data being submitted:", submissionData);
        // console.log("🗑️ removedImages being sent:", removedImages);

        if (!validation.isValid) {
            return;
        }

        try {
            const formDataToSend = convertFormDataToFormData(formData as Tutor);

            // Log the actual FormData contents
            // console.log("📨 FormData contents:");
            for (let [key, value] of formDataToSend.entries()) {
                if (key === 'imageCertMapping') {
                    console.log(`  ${key}:`, JSON.parse(value as string));
                } else {
                    console.log(`  ${key}:`, value);
                }
            }

            if (tutorProfile) {
                await updateTutor(formDataToSend);
            } else {
                await createTutor(formDataToSend);
            }

            setCertificationFiles({});
            setRemovedImages([]);
            clearErrors();
            setIsEditing(false);
            refetch();
            toast("success", "Profile saved successfully!");
        } catch (error: any) {
            toast("error", error.response?.data?.message || "Failed to save profile");
        }
    };

    const handleFieldChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Real-time validation
        validateField(field, value, !!tutorProfile);
    };

    const handleAddressChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            address: { ...prev.address, [field]: value }
        }));

        // Real-time validation for address fields
        validateField(`address.${field}`, value, !!tutorProfile);
    };

    const handleClassTypeChange = (type: string, checked: boolean) => {
        setFormData((prev) => {
            const selected = prev.classType || [];
            const newClassType = checked
                ? [...selected, type]
                : selected.filter((t) => t !== type);

            // Validate after update
            setTimeout(() => validateField("classType", newClassType, !!tutorProfile), 0);

            return { ...prev, classType: newClassType };
        });
    };


    const handleCertificationChange = (
        index: number,
        field: keyof Certification,
        value: any
    ) => {
        setFormData(prev => {
            const certifications = [...(prev.certifications || [])];
            certifications[index] = { ...certifications[index], [field]: value };
            return { ...prev, certifications };
        });

        // Only validate if the value is not empty
        if (value && value.trim() !== "") {
            validateField(`certifications.${index}.${String(field)}`, value, !!tutorProfile);
        } else {
            clearFieldError(`certifications.${index}.${String(field)}`);
        }
    };

    const handleEducationChange = (index: number, field: string, value: string) => {
        const newEducation = [...(formData.education || [])];
        // Store as "YYYY-MM" directly
        newEducation[index] = { ...newEducation[index], [field]: value };

        setFormData((prev) => ({ ...prev, education: newEducation }));

        setTimeout(() => validateField("education", newEducation, !!tutorProfile), 0);
    };

    const getDateDisplayValue = (dateValue: any): string => {
        if (!dateValue) return "";

        if (typeof dateValue === 'string') {
            return dateValue.slice(0, 7); // "YYYY-MM"
        }

        if (dateValue instanceof Date) {
            return dateValue.toISOString().slice(0, 7); // "YYYY-MM"
        }

        return "";
    };

    const addCertification = () => {
        const tempId = crypto.randomUUID(); // unique temporary ID
        setFormData((prev) => ({
            ...prev,
            certifications: [...(prev.certifications || []), { tempId, name: "", description: "" }],
        }))
    }

    const removeCertification = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            certifications: prev.certifications?.filter((_, i) => i !== index) || [],
        }))
    }

    const handleCertificationImageUpload = (certIndex: number, files: FileList | null) => {
        if (!files) return;

        const newFiles = Array.from(files);
        setCertificationFiles(prev => ({
            ...prev,
            [certIndex]: [...(prev[certIndex] || []), ...newFiles]
        }));
    };

    const removeCertificationImage = (certIndex: number, fileIndex: number) => {
        setCertificationFiles(prev => {
            const updatedFiles = { ...prev };
            if (updatedFiles[certIndex]) {
                updatedFiles[certIndex] = updatedFiles[certIndex].filter((_, i) => i !== fileIndex);
                if (updatedFiles[certIndex].length === 0) {
                    delete updatedFiles[certIndex];
                }
            }
            return updatedFiles;
        });
    };

    const handleRemoveExistingImage = (cert: any, imageIndex: number, certIndex: number) => {
        // console.log("🔄 handleRemoveExistingImage called with:", {
        //     certIndex,
        //     imageIndex,
        //     certId: cert._id,
        //     tempCertId: cert.tempId,
        //     currentImageUrls: cert.imageUrls
        // });

        // Track for backend
        const removalData = {
            certId: cert._id,
            tempCertId: cert.tempId,
            certIndex: certIndex,
            imageIndex: imageIndex,
        };

        // console.log("📝 Adding to removedImages:", removalData);

        setRemovedImages(prev => {
            const newRemovedImages = [...prev, removalData];
            console.log("📋 removedImages state updated:", newRemovedImages);
            return newRemovedImages;
        });

        // Optimistic UI update
        setFormData(prev => {
            const updatedCertifications = prev.certifications?.map((c, idx) => {
                if (idx === certIndex) {
                    const currentUrls = Array.isArray(c.imageUrls) ? c.imageUrls : [];
                    const updatedImageUrls = currentUrls.filter((_, i) => i !== imageIndex);

                    // console.log(`🖼️ Cert ${idx}: removed image ${imageIndex}, from ${currentUrls.length} to ${updatedImageUrls.length} images`);

                    return {
                        ...c,
                        imageUrls: updatedImageUrls
                    };
                }
                return c;
            });

            // console.log("✅ Form data updated with new certifications");
            return {
                ...prev,
                certifications: updatedCertifications
            };
        });
    };

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

    const updateAvailability = (dayIndex: number, timeSlot: string, checked: boolean) => {
        setFormData((prev) => {
            const availability = [...(prev.availability || [])]
            const dayAvailability = availability.find((a) => a.dayOfWeek === dayIndex)

            if (dayAvailability) {
                if (checked) {
                    dayAvailability.slots = [...(dayAvailability.slots ?? []), timeSlot as any]
                } else {
                    dayAvailability.slots = (dayAvailability.slots ?? []).filter((slot) => slot !== timeSlot)
                }
                if (dayAvailability.slots.length === 0) {
                    availability.splice(availability.indexOf(dayAvailability), 1)
                }
            } else if (checked) {
                availability.push({ dayOfWeek: dayIndex, slots: [timeSlot as any] })
            }

            return { ...prev, availability }
        })
    }

    if (showForm) {
        return (
            <div className="w-full h-screen bg-gray-50">
                <div className="w-full h-full">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{tutor ? "Edit Profile" : "Create Tutor Profile"}</h1>
                            <p className="text-gray-600">
                                {tutor ? "Update your tutor information" : "Complete the information below to create your profile"}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Avatar Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Picture</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ProfileAvatar
                                    avatarUrl={formData.avatarUrl}
                                    name={formData.name}
                                    isEditing={true}
                                    onAvatarChange={(file: File | null) => setAvatarFile(file)}
                                />
                            </CardContent>
                        </Card>

                        {/* Personal Information */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Personal Information *</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <PersonalInfoForm
                                    formData={formData}
                                    onFieldChange={handleFieldChange}
                                    getError={getError}
                                    hasError={hasError}
                                    clearFieldError={clearFieldError}
                                />
                            </CardContent>
                        </Card>

                        {/* Teaching Information */}
                        <TeachingInformationForm
                            formData={formData}
                            handleFieldChange={handleFieldChange}
                            handleClassTypeChange={handleClassTypeChange}
                            clearFieldError={clearFieldError}
                            hasError={hasError}
                            getError={getError}
                        />

                        {/* Subjects */}
                        <Card className="lg:col-span-3">
                            <CardHeader>
                                <CardTitle>Subjects Teaching *</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <MultiSelectInput
                                    wrapperRef={subjectRef}
                                    value={formData.subjects || []}
                                    onChange={(val) => {
                                        setFormData((prev) => ({ ...prev, subjects: val }));
                                        validateField("subjects", val, !!tutorProfile);
                                        clearFieldError("subjects");
                                    }}
                                    options={SUBJECT_VALUES}
                                    labels={SUBJECT_LABELS}
                                    placeholder="Select subjects..."
                                    searchPlaceholder="Search subjects..."
                                    className={hasError("subjects") ? "border-red-500 rounded-md" : ""}
                                />
                                <ValidationError message={getError("subjects")} />
                            </CardContent>
                        </Card>

                        {/* Levels */}
                        <Card className="lg:col-span-3">
                            <CardHeader>
                                <CardTitle>Levels *</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <MultiSelectInput
                                    wrapperRef={levelsRef}
                                    value={formData.levels || []}
                                    onChange={(val) => {
                                        setFormData((prev) => ({ ...prev, levels: val }));
                                        validateField("levels", val, !!tutorProfile);
                                        clearFieldError("levels");
                                    }}
                                    options={LEVEL_VALUES}
                                    labels={LEVEL_LABELS}
                                    placeholder="Select levels..."
                                    searchPlaceholder="Search levels..."
                                    className={hasError("levels") ? "border-red-500 rounded-md" : ""}
                                />
                                <ValidationError message={getError("levels")} />
                            </CardContent>
                        </Card>

                        {/* Education */}
                        <EducationForm
                            education={
                                (formData.education || []).map(e => ({
                                    degree: e.degree ?? "",
                                    institution: e.institution ?? "",
                                    fieldOfStudy: e.fieldOfStudy ?? "",
                                    startDate: e.startDate ?? "",
                                    endDate: e.endDate ?? "",
                                    description: e.description ?? "",
                                    dateRange: e.dateRange ?? "",
                                }))
                            }
                            addEducation={addEducation}
                            removeEducation={removeEducation}
                            handleEducationChange={handleEducationChange}
                            hasError={hasError}
                            getError={getError}
                            getDateDisplayValue={getDateDisplayValue}
                        />


                        {/* Certifications */}
                        <Card className="lg:col-span-3">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    Certifications *
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
                                            <div>
                                                <Label htmlFor={`certifications.${index}.name`}>Certification Name *</Label>
                                                <Input
                                                    id={`certifications.${index}.name`}
                                                    name={`certifications.${index}.name`}
                                                    placeholder="Certification Name"
                                                    value={cert.name}
                                                    onChange={(e) => handleCertificationChange(index, "name", e.target.value)}
                                                    className={hasError(`certifications.${index}.name`) ? "border-red-500" : ""}
                                                />
                                                <ValidationError message={getError(`certifications.${index}.name`)} />
                                            </div>
                                            <div>
                                                <Label htmlFor={`certifications.${index}.description`}>Description *</Label>
                                                <Textarea
                                                    id={`certifications.${index}.description`}
                                                    name={`certifications.${index}.description`}
                                                    placeholder="Description"
                                                    value={cert.description || ""}
                                                    onChange={(e) => handleCertificationChange(index, "description", e.target.value)}
                                                />
                                                <ValidationError message={getError(`certifications.${index}.description`)} />
                                            </div>

                                            {/* Certification Images Upload */}
                                            <div>
                                                <Label>Certification Images</Label>
                                                <div className="mt-2">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={(e) => handleCertificationImageUpload(index, e.target.files)}
                                                        className="hidden"
                                                        id={`certification-images-${index}`}
                                                    />
                                                    <label htmlFor={`certification-images-${index}`}>
                                                        <Button variant="outline" size="sm" asChild>
                                                            <span>Add Images</span>
                                                        </Button>
                                                    </label>
                                                </div>

                                                {/* Display selected images */}
                                                {certificationFiles[index] && certificationFiles[index].length > 0 && (
                                                    <div className="mt-3">
                                                        <p className="text-sm text-gray-600 mb-2">Selected images:</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {certificationFiles[index].map((file, fileIndex) => (
                                                                <div key={fileIndex} className="relative">
                                                                    <img
                                                                        src={URL.createObjectURL(file)}
                                                                        alt={file.name}
                                                                        className="w-16 h-16 object-cover rounded border"
                                                                    />
                                                                    <Button
                                                                        size="sm"
                                                                        variant="destructive"
                                                                        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                                                                        onClick={() => removeCertificationImage(index, fileIndex)}
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                    </Button>
                                                                    <p className="text-xs text-gray-500 truncate w-16">
                                                                        {file.name}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Display existing images from server */}
                                                {cert.imageUrls && cert.imageUrls.length > 0 && (
                                                    <div className="mt-3">
                                                        <p className="text-sm text-gray-600 mb-2">Existing images:</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {cert.imageUrls?.map((url, urlIndex) => (
                                                                <div key={urlIndex} className="relative group">
                                                                    <img
                                                                        src={url}
                                                                        alt={`Certification image ${urlIndex + 1}`}
                                                                        className="w-16 h-16 object-cover rounded border"
                                                                    />
                                                                    <p className="text-xs text-gray-500 truncate w-16">
                                                                        Image {urlIndex + 1}
                                                                    </p>

                                                                    {/* Remove button */}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveExistingImage(cert, urlIndex, index)}
                                                                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    >
                                                                        ✕
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Availability */}
                        < Card className="lg:col-span-3" id="availability-section" >
                            <CardHeader>
                                <CardTitle>Availability Schedule *</CardTitle>
                                <p className="text-sm text-gray-600">Select the days and time slots when you're available to teach</p>
                            </CardHeader>
                            <CardContent>
                                <AvailabilityGrid
                                    availability={formData.availability || []}
                                    onAvailabilityChange={updateAvailability}
                                />
                                <ValidationError message={getError("availability")} className="mt-4" />
                            </CardContent>
                        </ Card>

                        {/* Address */}
                        <Card className="lg:col-span-3">
                            <CardHeader>
                                <CardTitle>Address *</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* City */}
                                    <div>
                                        <Label htmlFor="address.city">City *</Label>
                                        <Select
                                            value={formData.address?.city || ""}
                                            onValueChange={(value) => {
                                                handleAddressChange("city", value);
                                                clearFieldError("address.city");
                                            }}
                                        >
                                            <SelectTrigger className={hasError("address.city") ? "border-red-500" : ""}>
                                                <SelectValue placeholder="Select a city" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CITY_TYPE_VALUES.map((city) => (
                                                    <SelectItem key={city} value={city}>
                                                        {city}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <ValidationError message={getError("address.city")} />
                                    </div>

                                    {/* Street */}
                                    <div>
                                        <Label htmlFor="address.street">Street Address *</Label>
                                        <Input
                                            id="address.street"
                                            name="address.street"
                                            value={formData.address?.street || ""}
                                            onChange={(e) => {
                                                handleAddressChange("street", e.target.value);
                                                clearFieldError("address.street");
                                            }}
                                            placeholder="Enter street address"
                                            className={hasError("address.street") ? "border-red-500" : ""}
                                        />
                                        <ValidationError message={getError("address.street")} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <Card className="lg:col-span-3" >
                            <CardContent className="pt-6">
                                <div className="mt-4 flex justify-end space-x-2">
                                    <Button
                                        variant="secondary"
                                        onClick={() => setIsEditing(false)}
                                        disabled={isCreating || isUpdating}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        onClick={handleSave}
                                        disabled={isCreating || isUpdating}
                                    >
                                        {isCreating || isUpdating ? (
                                            <span className="flex items-center space-x-2">
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                <span>Saving...</span>
                                            </span>
                                        ) : (
                                            "Save"
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card >
                    </div >
                </div >
            </div >
        )
    }

    // Profile View
    return (
        <TutorProfileView tutor={tutorProfile} onEdit={() => setIsEditing(true)} />
    )
}
