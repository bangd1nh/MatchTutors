import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GraduationCap, Trash2, Plus, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Controller, UseFormReturn } from 'react-hook-form';
import { TutorFormData } from './types';
import { MultiSelectInput } from './MultiSelectInput';
import { SUBJECT_LABELS, SUBJECT_VALUES } from '@/enums/subject.enum';

interface EducationSubjectsStepProps {
    form: UseFormReturn<TutorFormData>
    educationFields: Array<{ id: string }>
    subjectFields: string[]
    removeEducation: (index: number) => void
    appendEducation: (value: { degree: string; institution: string; fieldOfStudy: string; dateRange: { startDate: string; endDate: string }; description: string }) => void
    removeSubject: (index: number) => void
    appendSubject: (value: { category: string; items: string[] }) => void
}

export default function EducationSubjectsStep({ form, educationFields, subjectFields, removeEducation, appendEducation, removeSubject, appendSubject }: EducationSubjectsStepProps) {
    return (
        <Card>
            <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-8 mb-4">
                <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-violet-600" />
                    Education & Subjects
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Education */}
                <div className="space-y-4">
                    <Label className="text-base font-semibold">Education</Label>
                    {educationFields.map((field, index) => (
                        <Card key={field.id} className="p-4">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-medium">Education #{index + 1}</h4>
                                    {educationFields.length > 1 && (
                                        <Button type="button" variant="outline" size="sm" onClick={() => removeEducation(index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Degree *</Label>
                                        <Input
                                            placeholder="e.g., Bachelor of Science"
                                            {...form.register(`education.${index}.degree` as const)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Institution *</Label>
                                        <Input
                                            placeholder="e.g., Harvard University"
                                            {...form.register(`education.${index}.institution` as const)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Field of Study</Label>
                                        <Input
                                            placeholder="e.g., Computer Science"
                                            {...form.register(`education.${index}.fieldOfStudy` as const)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label htmlFor={`education-${index}-startDate`}>
                                                Start Date *
                                            </Label>
                                            <Input
                                                id={`education-${index}-startDate`}
                                                type="month"
                                                placeholder="MM/YYYY"
                                                {...form.register(`education.${index}.dateRange.startDate` as const)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor={`education-${index}-endDate`}>
                                                End Date *
                                            </Label>
                                            <Input
                                                id={`education-${index}-endDate`}
                                                type="month"
                                                placeholder="MM/YYYY or Present"
                                                {...form.register(`education.${index}.dateRange.endDate` as const)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        placeholder="Additional details about your education..."
                                        {...form.register(`education.${index}.description` as const)}
                                    />
                                </div>
                            </div>
                        </Card>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            appendEducation({
                                degree: "",
                                institution: "",
                                fieldOfStudy: "",
                                dateRange: { startDate: "", endDate: "" },
                                description: ""
                            })
                        }
                        className="w-full"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                    </Button>
                </div>
                {/* Subjects */}
                <div className="space-y-2">
                    <Label className="text-base font-semibold flex items-center gap-2">
                        Subjects
                    </Label>
                    <Controller
                        name="subjects"
                        control={form.control}
                        render={({ field }) => (
                            <MultiSelectInput
                                value={field.value || []}
                                onChange={field.onChange}
                                options={SUBJECT_VALUES}
                                labels={SUBJECT_LABELS}
                                placeholder="Select subjects..."
                                searchPlaceholder="Search subjects..."
                                emptyMessage="No subject found."
                            />
                        )}
                    />
                </div>

            </CardContent>
        </Card>
    );
}