import { useEffect, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
    User,
    Briefcase,
    GraduationCap,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { TutorProfileFormProps, TutorFormData, tutorSchema, DAY_NAMES, PersonalInfoStep } from "../../components/tutor/tutor-profile-form"
import AvailabilityContactStep from "../../components/tutor/tutor-profile-form/AvailabilityContactStep"
import EducationSubjectsStep from "../../components/tutor/tutor-profile-form/EducationSubjectsStep"
import ProfessionalDetailsStep from "../../components/tutor/tutor-profile-form/ProfessionalDetailsStep"
import ReviewSubmitStep from "../../components/tutor/tutor-profile-form/ReviewSubmitStep"
import { useCreateTutorProfile, useTutorProfile } from "@/hooks/useTutorProfile"
import { useToast } from "@/hooks/useToast"
import { Gender, GENDER_VALUES } from "@/enums/gender.enum"
import { useUserProfile } from "@/hooks/useUserProfile"

const steps = [
    { id: 1, title: "Personal Info", icon: User, description: "Enter your personal information" },
    { id: 2, title: "Professional Details", icon: Briefcase, description: "Provide your professional details" },
    { id: 3, title: "Education & Subjects", icon: GraduationCap, description: "List your education and teaching subjects" },
    { id: 4, title: "Availability & Contact", icon: Clock, description: "Set your availability and contact info" },
    { id: 5, title: "Review & Submit", icon: CheckCircle, description: "Review your information and submit" },
]

export default function TutorProfileForm({ initialData }: TutorProfileFormProps) {
    const [currentStep, setCurrentStep] = useState(1)
    const [uploadingImages, setUploadingImages] = useState<{ [key: string]: boolean }>({})
    const [newSubject, setNewSubject] = useState("")
    const [isReviewComplete, setIsReviewComplete] = useState(false);

    const toast = useToast()

    // React Query mutation for creating tutor profile
    const createTutorMutation = useCreateTutorProfile()
    const { data: user } = useUserProfile()
    const form = useForm<TutorFormData>({
        resolver: zodResolver(tutorSchema),
        defaultValues: {
            fullName: initialData?.fullName || user?.name || "",
            avatarUrl: initialData?.avatarUrl || "",
            gender: (GENDER_VALUES.includes(initialData?.gender as Gender)
                ? (initialData?.gender as Gender)
                : user?.gender && GENDER_VALUES.includes(user.gender as Gender)
                    ? (user.gender as Gender)
                    : undefined),

            bio: initialData?.bio || "",
            address: {
                street: initialData?.address?.street || user?.address?.street || "",
                city: initialData?.address?.city || user?.address?.city || "",
            },
            hourlyRate: initialData?.hourlyRate || 0,
            experienceYears: initialData?.experienceYears || 0,
            certifications: initialData?.certifications || [],
            classType: initialData?.classType || "ONLINE",
            education: initialData?.education || [
                {
                    degree: "", institution: "", fieldOfStudy: "",
                    dateRange: { startDate: "", endDate: "" },
                    description: ""
                },
            ],
            subjects: initialData?.subjects || [],
            availability: initialData?.availability ||
                DAY_NAMES.map((_, index) => ({
                    dayOfWeek: index,
                    slots: [],
                })),
            contact: {
                phone: initialData?.contact?.phone || user?.phone || "",
                email: user?.email || initialData?.contact?.email || "",
            },
            levels: initialData?.levels || []
        },
    })

    useEffect(() => {
        if (user?.email) {
            form.setValue("contact.email", user.email)
        }
    }, [user])

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

    // For subjects, we'll handle them differently since they're just strings
    const subjects = form.watch("subjects") || []

    const addSubject = () => {
        if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
            form.setValue("subjects", [...subjects, newSubject.trim()])
            setNewSubject("")
        }
    }

    const removeSubject = (index: number) => {
        const updatedSubjects = [...subjects]
        updatedSubjects.splice(index, 1)
        form.setValue("subjects", updatedSubjects)
    }

    const getFieldsForStep = (step: number): (keyof TutorFormData)[] => {
        switch (step) {
            case 1:
                return ["fullName", "bio", "gender", "address", "avatarUrl"]
            case 2:
                return [
                    "hourlyRate",
                    "experienceYears",
                    "certifications",
                    "classType",
                    "levels",
                ]
            case 3:
                return ["education", "subjects"]
            case 4:
                return ["availability", "contact"]
            default:
                return []
        }
    }

    const debugFormData = (formData: FormData) => {
        console.log("=== FORM DATA CONTENTS ===");
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`${key}: [File] ${value.name} (${value.size} bytes)`);
            } else {
                console.log(`${key}: ${value}`);
            }
        }
        console.log("==========================");
    };

    const handleSubmit = async (data: TutorFormData) => {
        try {
            const formData = new FormData();

            // ✅ Append avatar file
            if (data.avatarFile) {
                formData.append("avatar", data.avatarFile);
            }

            // ✅ Append certification files
            data.certifications?.forEach((cert, index) => {
                if (cert.imageFile) {
                    formData.append("certificationImages", cert.imageFile);
                }
            });

            const education = (data.education || []).map((edu: any) => ({
                degree: edu.degree,
                institution: edu.institution,
                fieldOfStudy: edu.fieldOfStudy,
                startDate: edu.dateRange?.startDate,
                endDate: edu.dateRange?.endDate,
                description: edu.description,
            }));

            // ✅ Append ALL individual fields (not as JSON)
            formData.append("fullName", data.fullName);
            formData.append("bio", data.bio);
            if (data.gender) formData.append("gender", data.gender);
            formData.append("hourlyRate", data.hourlyRate.toString());
            formData.append("experienceYears", data.experienceYears.toString());
            formData.append("classType", data.classType);

            // Append arrays as JSON strings
            formData.append("subjects", JSON.stringify(data.subjects || []));
            formData.append("levels", JSON.stringify(data.levels || []));
            formData.append("education", JSON.stringify(education || []));
            formData.append("availability", JSON.stringify(data.availability || []));
            formData.append("contact", JSON.stringify(data.contact || {}));
            formData.append("address", JSON.stringify(data.address || {}));

            // Append certifications without imageFiles (backend will handle images separately)
            const certificationsWithoutFiles = data.certifications?.map(cert => ({
                name: cert.name,
                description: cert.description
            })) || [];
            formData.append("certifications", JSON.stringify(certificationsWithoutFiles));
            // Debug: Log formData contents
            debugFormData(formData);

            // Submit the form data
            await createTutorMutation.mutateAsync(formData);


        } catch (error: any) {
            console.error("Error creating tutor profile:", error)
        }
    };

    const goToStep = (step: number) => {
        setCurrentStep(step)
    }

    const handleImageUpload = async (file: File, certificationIndex: number) => {
        const uploadKey = `cert-${certificationIndex}`
        setUploadingImages((prev) => ({ ...prev, [uploadKey]: true }))

        try {
            // Store the file for backend upload
            form.setValue(`certifications.${certificationIndex}.imageFile`, file)

            // Create preview URL for immediate display
            const previewUrl = URL.createObjectURL(file)
            form.setValue(`certifications.${certificationIndex}.imageUrl`, previewUrl)
        } catch (error) {
            console.error("Upload failed:", error)
            toast("error", "Image upload failed. Please try again.")
        } finally {
            setUploadingImages((prev) => ({ ...prev, [uploadKey]: false }))
        }
    }

    const handleAvatarUpload = (file: File) => {
        // Store the file for backend upload
        form.setValue("avatarFile", file)

        // Create preview URL for immediate display
        const previewUrl = URL.createObjectURL(file)
        form.setValue("avatarUrl", previewUrl)
    }

    const progress = (currentStep / steps.length) * 100

    const handleNext = async () => {
        const fieldsToValidate = getFieldsForStep(currentStep);
        const isValid = await form.trigger(fieldsToValidate);

        if (isValid && currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const isLoading = createTutorMutation.isPending

    return (
        <div className="min-h-screen ">
            <div className="max-w-5xl mx-auto p-6 space-y-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-1">
                                Create Your Tutor Profile
                            </h1>
                            <p className="text-slate-600 text-sm">Share your expertise and connect with students</p>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-medium text-slate-500 mb-1">Progress</div>
                            <div className="text-lg font-bold text-blue-600">{Math.round(progress)}%</div>
                        </div>
                    </div>

                    <Progress value={progress} className="h-2 bg-slate-100" />

                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => {
                            const Icon = step.icon
                            const isActive = currentStep === step.id
                            const isCompleted = currentStep > step.id

                            return (
                                <div key={step.id} className="flex items-center">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={cn(
                                                "flex items-center justify-center w-9 h-9 rounded-xl border-2 transition-all duration-300 shadow-sm",
                                                isActive && "border-blue-500 bg-blue-500 text-white shadow-blue-200 shadow-md",
                                                isCompleted && "border-green-500 bg-green-500 text-white shadow-green-200 shadow-md",
                                                !isActive && !isCompleted && "border-slate-300 bg-white text-slate-400 hover:border-slate-400",
                                            )}
                                        >
                                            {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                                        </div>
                                        <div className="mt-2 text-center">
                                            <p
                                                className={cn(
                                                    "text-xs font-semibold",
                                                    isActive && "text-blue-600",
                                                    isCompleted && "text-green-600",
                                                    !isActive && !isCompleted && "text-slate-500",
                                                )}
                                            >
                                                {step.title}
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{step.description}</p>
                                        </div>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={cn(
                                                "hidden sm:block w-10 h-px mx-4 transition-colors",
                                                currentStep > step.id ? "bg-green-300" : "bg-slate-200",
                                            )}
                                        />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                    {/* Step 1: Personal Information */}
                    {currentStep === 1 && (
                        <PersonalInfoStep
                            form={form}
                            onAvatarUpload={handleAvatarUpload}
                        />
                    )}

                    {/* Step 2: Professional Details */}
                    {currentStep === 2 && (
                        <ProfessionalDetailsStep
                            form={form}
                            certificationFields={certificationFields}
                            appendCertification={appendCertification}
                            removeCertification={removeCertification}
                            uploadingImages={uploadingImages}
                            onImageUpload={handleImageUpload}
                        />
                    )}

                    {/* Step 3: Education & Subjects */}
                    {currentStep === 3 && (
                        <EducationSubjectsStep
                            form={form}
                            educationFields={educationFields}
                            appendEducation={appendEducation}
                            removeEducation={removeEducation}
                            subjectFields={subjects}
                            appendSubject={addSubject}
                            removeSubject={removeSubject}
                        />
                    )}

                    {/* Step 4: Availability & Contact */}
                    {currentStep === 4 && <AvailabilityContactStep form={form} />}

                    {/* Step 5: Review & Submit */}
                    {currentStep === 5 && (
                        <ReviewSubmitStep
                            form={form}
                            goToStep={goToStep}
                        />
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center pt-8">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentStep === 1 || isLoading}
                            className="h-12 px-8 text-base bg-transparent"
                        >
                            <ChevronLeft className="h-5 w-5 mr-2" />
                            Previous
                        </Button>

                        <div className="flex gap-3">
                            {currentStep < steps.length - 1 ? ( // Steps 1-3: Show Continue
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={isLoading}
                                    className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700"
                                >
                                    Continue
                                    <ChevronRight className="h-5 w-5 ml-2" />
                                </Button>
                            ) : currentStep === steps.length - 1 ? ( // Step 4: Show Review
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={isLoading}
                                    className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700"
                                >
                                    Review
                                    <ChevronRight className="h-5 w-5 ml-2" />
                                </Button>
                            ) : ( // Step 5: Show Submit
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="h-12 px-8 text-base bg-green-600 hover:bg-green-700"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-5 w-5 mr-2" />
                                            Complete Profile
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}