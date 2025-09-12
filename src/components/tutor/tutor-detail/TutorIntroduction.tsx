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

            </CardContent>
        </Card>
    )
}