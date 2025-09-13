import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Award, Globe, Plus, Trash2, ImageIcon, Check, ChevronDown, X, Briefcase, Upload } from "lucide-react"
import { Controller, UseFormReturn } from "react-hook-form"
import { TutorFormData } from "./types"
import { MultiSelectInput } from "./MultiSelectInput"
import { LEVEL_LABELS, LEVEL_VALUES } from "@/enums/level.enum"
import { Textarea } from "@/components/ui/textarea"

interface ProfessionalDetailsStepProps {
    form: UseFormReturn<TutorFormData>
    certificationFields: any
    appendCertification: any
    removeCertification: any
    uploadingImages: { [key: string]: boolean }
    onImageUpload: (file: File, certificationIndex: number) => void // ← Changed from handleImageUpload to onImageUpload
}

export default function ProfessionalDetailsStep({
    form,
    certificationFields,
    appendCertification,
    removeCertification,
    uploadingImages,
    onImageUpload, // ← Changed prop name here
}: ProfessionalDetailsStepProps) {
    return (
        <Card className="shadow-lg border-0 bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-8">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Briefcase className="h-6 w-6 text-green-600" />
                    Professional Details
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="hourlyRate">Hourly Rate ($) *</Label>
                        <Input
                            id="hourlyRate"
                            type="number"
                            min="1"
                            placeholder="25"
                            {...form.register("hourlyRate", { valueAsNumber: true })}
                        />
                        {form.formState.errors.hourlyRate && (
                            <p className="text-sm text-destructive">{form.formState.errors.hourlyRate.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="experienceYears">Years of Experience *</Label>
                        <Input
                            id="experienceYears"
                            type="number"
                            min="0"
                            placeholder="5"
                            {...form.register("experienceYears", { valueAsNumber: true })}
                        />
                        {form.formState.errors.experienceYears && (
                            <p className="text-sm text-destructive">{form.formState.errors.experienceYears.message}</p>
                        )}
                    </div>
                </div>

                {/* Class Type */}
                <div className="space-y-2">
                    <Label>Class Type</Label>
                    <RadioGroup
                        value={form.watch("classType")}
                        onValueChange={(value) => form.setValue("classType", value as "ONLINE" | "IN_PERSON")}
                        className="flex gap-6"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="ONLINE" id="online" />
                            <Label htmlFor="online">Online</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="IN_PERSON" id="in_person" />
                            <Label htmlFor="in_person">In Person</Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Dynamic Lists */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <Label className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <Award className="h-5 w-5 text-amber-500" />
                            Certifications & Credentials
                        </Label>
                        <p className="text-sm text-slate-600">Add your professional certifications with supporting images (required)</p>

                        <div className="space-y-4">
                            {certificationFields.map((field: any, index: number) => (
                                <div
                                    key={field.id}
                                    className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-4"
                                >
                                    {/* Certification Name */}
                                    <div>
                                        <Label className="text-sm font-medium text-slate-600 mb-2 block">
                                            Certification Name *
                                        </Label>
                                        <Input
                                            placeholder="e.g., TESOL Certificate, Teaching License"
                                            className="h-11"
                                            {...form.register(`certifications.${index}.name` as const, { required: true })}
                                        />
                                        {form.formState.errors.certifications?.[index]?.name && (
                                            <p className="text-red-500 text-xs mt-1">Certification name is required</p>
                                        )}
                                    </div>

                                    {/* Certification Description */}
                                    <div>
                                        <Label className="text-sm font-medium text-slate-600 mb-2 block">
                                            Description *
                                        </Label>
                                        <Textarea
                                            placeholder="e.g., Description of the certification"
                                            className="h-24"
                                            {...form.register(`certifications.${index}.description` as const, { required: true })}
                                        />
                                        {form.formState.errors.certifications?.[index]?.description && (
                                            <p className="text-red-500 text-xs mt-1">Description is required</p>
                                        )}
                                    </div>

                                    {/* Certification Image */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium text-slate-600">Certificate Image *</Label>
                                        <div className="flex items-center gap-4">
                                            {form.watch(`certifications.${index}.imageUrl`) ? (
                                                <div className="relative">
                                                    <img
                                                        src={form.watch(`certifications.${index}.imageUrl`) || "/placeholder.svg"}
                                                        alt="Certificate"
                                                        className="w-20 h-20 object-cover rounded-xl border-2 border-slate-200"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white shadow-md"
                                                        onClick={() => form.setValue(`certifications.${index}.imageUrl`, "")}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center">
                                                    <ImageIcon className="h-8 w-8 text-slate-400" />
                                                </div>
                                            )}

                                            {/* Image URL / Upload */}
                                            <div className="flex-1">
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="Image URL"
                                                        className="flex-1"
                                                        {...form.register(`certifications.${index}.imageUrl` as const, { required: true })}
                                                    />
                                                    <div className="relative">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            disabled={uploadingImages[`cert-${index}`]}
                                                            className="relative bg-transparent"
                                                        >
                                                            {uploadingImages[`cert-${index}`] ? (
                                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-300 border-t-slate-600"></div>
                                                            ) : (
                                                                <Upload className="h-4 w-4" />
                                                            )}
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0]
                                                                    if (file) onImageUpload(file, index)
                                                                }}
                                                                required={!form.watch(`certifications.${index}.imageUrl`)}
                                                            />
                                                        </Button>
                                                    </div>
                                                </div>
                                                {form.formState.errors.certifications?.[index]?.imageUrl && (
                                                    <p className="text-red-500 text-xs mt-1">Certificate image is required</p>
                                                )}
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Upload a clear image of your certificate for verification (required)
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => appendCertification({ name: "", imageUrl: "" })}
                            className="w-full border-dashed border-slate-300 hover:border-slate-400"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Another Certification
                        </Button>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-base font-semibold flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Levels You Teach *
                        </Label>
                        <Controller
                            name="levels"
                            control={form.control}
                            render={({ field }) => (
                                <MultiSelectInput
                                    value={field.value || []}
                                    onChange={field.onChange}
                                    options={LEVEL_VALUES}
                                    placeholder="Select levels..."
                                    searchPlaceholder="Search levels..."
                                    emptyMessage="No levels found."
                                    labels={LEVEL_LABELS}
                                />
                            )}
                        />
                    </div>
                </div>
            </CardContent>
        </Card >
    )
}