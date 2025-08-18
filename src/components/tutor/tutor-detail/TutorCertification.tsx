import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tutor } from "@/types/Tutor";
import { Award } from "lucide-react";

interface TutorCertification {
    tutor: Tutor;
}

export function TutorCertification({ tutor }: TutorCertification) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Certifications
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tutor.certifications.map(
                        (cert, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10"
                            >
                                <Award className="w-5 h-5 text-primary flex-shrink-0" />
                                <span className="text-sm font-medium">
                                    {cert}
                                </span>
                            </div>
                        )
                    )}
                </div>
            </CardContent>
        </Card>
    );
}