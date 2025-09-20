// components/StatsOverview.tsx
import { Badge } from "@/components/ui/badge"

interface StatsOverviewProps {
    tutor: any
}

export function StatsOverview({ tutor }: StatsOverviewProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{tutor.experienceYears}</p>
                    <p className="text-sm text-gray-600">Years Experience</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{(tutor.subjects ?? []).length}</p>
                    <p className="text-sm text-gray-600">Subjects</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">
                        {(tutor.classType || []).join(", ")}
                    </p>
                    <p className="text-sm text-gray-600">Class Type</p>
                </div>
            </div>

            <div>
                <h4 className="font-medium mb-3">Subjects</h4>
                <div className="flex flex-wrap gap-2">
                    {(tutor.subjects ?? []).map((subject: string) => (
                        <Badge key={subject} variant="secondary">
                            {subject.replace(/_/g, " ")}
                        </Badge>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="font-medium mb-3">Teaching Levels</h4>
                <div className="flex flex-wrap gap-2">
                    {(tutor.levels ?? []).map((level: string) => (
                        <Badge key={level} variant="outline">
                            {level}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    )
}