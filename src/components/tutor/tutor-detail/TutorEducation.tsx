import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tutor } from "@/types/Tutor";
import { Check } from "lucide-react";

interface TutorEducationProps {
    tutor: Tutor;
}

export function TutorEducation({ tutor }: TutorEducationProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {tutor.education.map((edu, index) => (
                    <div
                        key={index}
                        className="border-l-2 border-primary pl-4"
                    >
                        <h3 className="font-semibold text-lg mb-3">
                            {edu.degree}
                        </h3>
                        <div className="space-y-2 mb-3">
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                <span className="text-sm">
                                    {edu.institution}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                <span className="text-sm">
                                    {edu.fieldOfStudy}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                <span className="text-sm">
                                    {edu.dateRange.startDate} - {edu.dateRange.endDate}
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {edu.description}
                        </p>
                    </div>
                ))}
            </CardContent>
        </Card>

    )
}