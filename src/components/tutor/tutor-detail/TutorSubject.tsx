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
            <CardContent className="space-y-4">
                {tutor.subjects.map((subject, index) => (
                    <div key={index}>
                        <Collapsible
                            open={expandedSubjects.includes(
                                subject.category
                            )}
                            onOpenChange={() =>
                                toggleSubjectCategory(
                                    subject.category
                                )
                            }
                        >
                            <CollapsibleTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-between p-0 h-auto"
                                >
                                    <span className="font-medium">
                                        {subject.category}
                                    </span>
                                    {expandedSubjects.includes(
                                        subject.category
                                    ) ? (
                                        <ChevronUp className="w-4 h-4" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4" />
                                    )}
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-3">
                                <div className="flex flex-wrap gap-2">
                                    {subject.items
                                        .slice(0, 8)
                                        .map((item, itemIndex) => (
                                            <Badge
                                                key={itemIndex}
                                                variant="outline"
                                            >
                                                {item}
                                            </Badge>
                                        ))}
                                    {subject.items.length > 8 && (
                                        <Badge variant="secondary">
                                            +
                                            {subject.items.length -
                                                8}{" "}
                                            more
                                        </Badge>
                                    )}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}