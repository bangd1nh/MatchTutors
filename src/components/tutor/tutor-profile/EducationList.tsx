// components/EducationList.tsx
import { GraduationCap } from "lucide-react"

interface EducationListProps {
    education: any[]
}

export function EducationList({ education }: EducationListProps) {
    return (
        <div className="space-y-4">
            {education.map((edu, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <h4 className="font-medium">{edu.degree}</h4>
                    <p className="text-gray-600">{edu.institution}</p>
                    {edu.fieldOfStudy && <p className="text-sm text-gray-500">{edu.fieldOfStudy}</p>}
                    <p className="text-sm text-gray-500">
                        {edu.startDate.substring(0, 7)} - {edu.endDate.substring(0, 7)}
                    </p>
                    <p className="text-sm mt-2">{edu.description}</p>
                </div>
            ))}
        </div>
    )
}