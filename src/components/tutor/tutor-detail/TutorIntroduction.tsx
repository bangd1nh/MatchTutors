import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tutor } from "@/types/Tutor";
import { Check } from "lucide-react";

interface TutorIntroductionProps {
    tutor: Tutor;
}


export function TutorIntroduction({ tutor }: TutorIntroductionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                    {tutor.bio}
                </p>

                <ul className="space-y-2">
                    {tutor.keyPoints.map((point, index) => (
                        <li
                            key={index}
                            className="flex items-start gap-2"
                        >
                            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{point}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}