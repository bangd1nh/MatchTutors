import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ValidationError } from "./ValidationError"
import ReactQuill from "react-quill"

interface TeachingInformationFormProps {
    formData: any
    handleFieldChange: (field: string, value: any) => void
    handleClassTypeChange: (type: string, checked: boolean) => void
    clearFieldError: (field: string) => void
    hasError: (field: string) => boolean
    getError: (field: string) => string | null | undefined
}

export const TeachingInformationForm: React.FC<TeachingInformationFormProps> = ({
    formData,
    handleFieldChange,
    handleClassTypeChange,
    clearFieldError,
    hasError,
    getError
}) => {
    return (
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Teaching Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Experience Years */}
                    <div>
                        <Label htmlFor="experienceYears">Experience (Years) *</Label>
                        <Input
                            id="experienceYears"
                            name="experienceYears"
                            type="number"
                            value={formData.experienceYears || ""}
                            onChange={(e) => {
                                handleFieldChange("experienceYears", parseInt(e.target.value) || 0)
                                clearFieldError("experienceYears")
                            }}
                            placeholder="0"
                            className={hasError("experienceYears") ? "border-red-500" : ""}
                        />
                        <ValidationError message={getError("experienceYears")} />
                    </div>

                    {/* Hourly Rate */}
                    <div>
                        <Label htmlFor="hourlyRate">Hourly Rate ($) *</Label>
                        <Input
                            id="hourlyRate"
                            name="hourlyRate"
                            type="number"
                            value={formData.hourlyRate || ""}
                            onChange={(e) => {
                                handleFieldChange("hourlyRate", parseInt(e.target.value) || 0)
                                clearFieldError("hourlyRate")
                            }}
                            placeholder="0"
                            className={hasError("hourlyRate") ? "border-red-500" : ""}
                        />
                        <ValidationError message={getError("hourlyRate")} />
                    </div>

                    {/* Class Type */}
                    <div>
                        <Label>Class Type *</Label>
                        <div className="mt-2 flex flex-col space-y-2">
                            {["ONLINE", "IN_PERSON"].map((type) => (
                                <div key={type} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id={type}
                                        name="classType"
                                        checked={formData.classType?.includes(type)}
                                        onChange={(e) => {
                                            handleClassTypeChange(type, e.target.checked)
                                            clearFieldError("classType")
                                        }}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    />
                                    <Label htmlFor={type}>
                                        {type === "ONLINE" ? "Online" : "In Person"}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        <ValidationError message={getError("classType")} />
                    </div>
                </div>

                {/* Bio */}
                <div>
                    <Label htmlFor="bio">Bio *</Label>
                    <ReactQuill
                        id="bio"
                        theme="snow"
                        value={formData.bio || ""}
                        onChange={(content) => {
                            handleFieldChange("bio", content)
                            clearFieldError("bio")
                        }}
                        placeholder="Tell students about yourself, your teaching style, and experience..."
                        className={`mt-2 ${hasError("bio") ? "border-red-500" : ""}`}
                    />
                    <ValidationError message={getError("bio")} />
                </div>
            </CardContent>
        </Card>
    )
}
