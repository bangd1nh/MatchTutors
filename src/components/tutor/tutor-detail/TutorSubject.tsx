import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@radix-ui/react-collapsible';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Tutor } from '../../../types/Tutor';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
interface TutorSubjectProps {
    tutor: Tutor;
}

export function TutorSubject({ tutor }: TutorSubjectProps) {
    const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);
    const toggleSubjectCategory = (category: string) => {
        setExpandedSubjects((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Subjects I Can Teach</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                {tutor.subjects.map((subject, index) => (
                    <Badge key={index} variant="outline">
                        {subject}
                    </Badge>
                ))}
            </CardContent>
        </Card>
    );
}