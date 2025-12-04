import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X } from "lucide-react"
import { ValidationError } from "./ValidationError"

interface Education {
    institution: string
    degree: string
    fieldOfStudy?: string
    startDate: string
    endDate?: string
    description?: string
}

interface EducationFormProps {
    education?: Education[]
    addEducation: () => void
    removeEducation: (index: number) => void
    handleEducationChange: (index: number, field: keyof Education, value: any) => void
    hasError: (field: string) => boolean
    getError: (field: string) => string | null | undefined
    getDateDisplayValue: (date?: string) => string
}

export function EducationForm({
    education,
    addEducation,
    removeEducation,
    handleEducationChange,
    hasError,
    getError,
    getDateDisplayValue
}: EducationFormProps) {
    return (
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    Học vấn *
                    <Button onClick={addEducation} size="sm" variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm học vấn
                    </Button>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {education?.map((edu, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-start">
                            <h4 className="font-medium">Học vấn {index + 1}</h4>
                            <Button
                                onClick={() => removeEducation(index)}
                                size="sm"
                                variant="ghost"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Institution */}
                            <div>
                                <Label htmlFor={`education.${index}.institution`}>
                                    Tên trường *
                                </Label>
                                <Input
                                    id={`education.${index}.institution`}
                                    name={`education.${index}.institution`}
                                    placeholder="Tên trường"
                                    value={edu.institution}
                                    onChange={(e) =>
                                        handleEducationChange(index, "institution", e.target.value)
                                    }
                                    className={hasError(`education.${index}.institution`) ? "border-red-500" : ""}
                                />
                                <ValidationError message={getError(`education.${index}.institution`)} />
                            </div>

                            {/* Degree */}
                            <div>
                                <Label htmlFor={`education.${index}.degree`}>Bằng cấp *</Label>
                                <Input
                                    id={`education.${index}.degree`}
                                    name={`education.${index}.degree`}
                                    placeholder="Bằng cấp"
                                    value={edu.degree}
                                    onChange={(e) =>
                                        handleEducationChange(index, "degree", e.target.value)
                                    }
                                    className={hasError(`education.${index}.degree`) ? "border-red-500" : ""}
                                />
                                <ValidationError message={getError(`education.${index}.degree`)} />
                            </div>

                            {/* Field of Study */}
                            <div>
                                <Label>Ngành học *</Label>
                                <Input
                                    placeholder="Ngành học"
                                    id={`education.${index}.fieldOfStudy`}
                                    name={`education.${index}.fieldOfStudy`}
                                    value={edu.fieldOfStudy || ""}
                                    onChange={(e) =>
                                        handleEducationChange(index, "fieldOfStudy", e.target.value)
                                    }
                                />
                                <ValidationError message={getError(`education.${index}.fieldOfStudy`)} />
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label>Ngày bắt đầu *</Label>
                                    <Input
                                        type="month"
                                        value={getDateDisplayValue(edu.startDate)}
                                        id={`education.${index}.startDate`}
                                        name={`education.${index}.startDate`}
                                        onChange={(e) =>
                                            handleEducationChange(index, "startDate", e.target.value)
                                        }
                                        className={`w-full ${hasError(`education.${index}.startDate`) ? "border-red-500" : ""}`}
                                        max={new Date().toISOString().slice(0, 7)}
                                    />
                                    <ValidationError message={getError(`education.${index}.startDate`)} />
                                </div>

                                <div>
                                    <Label>Ngày kết thúc</Label>
                                    <Input
                                        type="month"
                                        value={getDateDisplayValue(edu.endDate)}
                                        id={`education.${index}.endDate`}
                                        name={`education.${index}.endDate`}
                                        onChange={(e) =>
                                            handleEducationChange(index, "endDate", e.target.value)
                                        }
                                        className={`w-full ${hasError(`education.${index}.endDate`) ? "border-red-500" : ""}`}
                                        max={new Date().toISOString().slice(0, 7)}
                                        min={edu.startDate}
                                    />
                                    <ValidationError message={getError(`education.${index}.endDate`)} />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <Label>Mô tả *</Label>
                            <Textarea
                                placeholder="Mô tả"
                                id={`education.${index}.description`}
                                name={`education.${index}.description`}
                                value={edu.description || ""}
                                onChange={(e) =>
                                    handleEducationChange(index, "description", e.target.value)
                                }
                            />
                            <ValidationError message={getError(`education.${index}.description`)} />
                        </div>
                    </div>
                ))}

                <ValidationError message={getError("education")} />
            </CardContent>
        </Card>
    )
}
