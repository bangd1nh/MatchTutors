// components/StatsOverview.tsx
import { Badge } from "@/components/ui/badge"
import { getClassTypeLabelVi, getLevelLabelVi, getSubjectLabelVi } from "@/utils/educationDisplay"

interface StatsOverviewProps {
    tutor: any
}

export function StatsOverview({ tutor }: StatsOverviewProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{tutor.experienceYears}</p>
                    <p className="text-sm text-gray-600">Năm kinh nghiệm</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{(tutor.subjects ?? []).length}</p>
                    <p className="text-sm text-gray-600">Môn học</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">
                        {(tutor.classType || [])
                            .map((type: string) => getClassTypeLabelVi(type))
                            .join(", ")}
                    </p>
                    <p className="text-sm text-gray-600">Loại lớp học</p>
                </div>
            </div>

            <div>
                <h4 className="font-medium mb-3">Môn học</h4>
                <div className="flex flex-wrap gap-2">
                    {(tutor.subjects ?? []).map((subject: string) => (
                        <Badge key={subject} variant="secondary">
                            {getSubjectLabelVi(subject)}
                        </Badge>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="font-medium mb-3">Trình độ giảng dạy</h4>
                <div className="flex flex-wrap gap-2">
                    {(tutor.levels ?? []).map((level: string) => (
                        <Badge key={level} variant="outline">
                            {getLevelLabelVi(level)}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    )
}