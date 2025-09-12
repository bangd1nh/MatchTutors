import type React from "react";
import type { Tutor } from "@/types/Tutor";
import tutorsData from "@/data/tutors.json";
import { useParams, useNavigate } from "react-router-dom";
import { RelatedTutors, TutorAvailability, TutorCertification, TutorContactCard, TutorEducation, TutorHeader, TutorIntroduction, TutorSubject } from "@/components/tutor/tutor-detail";

const TutorDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const rawTutor = tutorsData.find((t) => t._id === id);
    const validTimeSlots = ["morning", "afternoon", "evening"] as const;
    const mapClassType = (type: string): "Online" | "In_Person" => {
        if (type === "Online") return "Online";
        if (type === "In_Person") return "In_Person";
        return "Online"; // fallback
    };
    const tutor: Tutor | undefined = rawTutor
        ? {
            ...rawTutor,
            availability: rawTutor.availability.map((a: any) => ({
                ...a,
                timeSlots: Array.isArray(a.timeSlots)
                    ? a.timeSlots.filter((slot: string) =>
                        validTimeSlots.includes(
                            slot as (typeof validTimeSlots)[number]
                        )
                    )
                    : [],
            })),
            classType: mapClassType(rawTutor.classType),
            education: Array.isArray(rawTutor.education)
                ? rawTutor.education.map((e: any) => ({
                    ...e,
                    dateRange:
                        typeof e.dateRange === "string"
                            ? (() => {
                                const [startDate, endDate] = e.dateRange.split(" - ");
                                return { startDate: startDate?.trim() || "", endDate: endDate?.trim() || "" };
                            })()
                            : e.dateRange,
                }))
                : [],
        }
        : undefined;

    if (!tutor) {
        return <div className="text-center text-red-500">Tutor not found</div>;
    }

    const getRelatedTutors = () => {
        const currentTutorSubjects = tutor.subjects
        const currentTutorLocation = `${tutor.address.city}`;

        return tutorsData
            .filter((t) => t._id !== tutor._id) // Exclude current tutor
            .map((t) => {
                let score = 0;
                const tutorSubjects = t.subjects
                const tutorLocation = `${t.address.city}`;

                // Score based on shared subjects
                const sharedSubjects = currentTutorSubjects.filter((subject) =>
                    tutorSubjects.includes(subject)
                ).length;
                score += sharedSubjects * 3;

                // Score based on location
                if (tutorLocation === currentTutorLocation) score += 2;

                // Score based on rating similarity
                const ratingDiff = Math.abs(
                    tutor.ratings.average - t.ratings.average
                );
                if (ratingDiff <= 0.5) score += 1;

                return { ...t, score };
            })
            .filter((t) => t.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3) // Show top 3 related tutors
            .map((t) => {
                // Remove the score property and filter availability timeSlots
                const { score, ...rest } = t;
                return {
                    ...rest,
                    availability: t.availability.map((a: any) => ({
                        ...a,
                        timeSlots: Array.isArray(a.timeSlots)
                            ? a.timeSlots.filter((slot: string) =>
                                validTimeSlots.includes(slot as (typeof validTimeSlots)[number])
                            )
                            : [],
                    })),
                    certifications: Array.isArray(t.certifications)
                        ? t.certifications.map((c: any) =>
                            typeof c === "string"
                                ? { name: c }
                                : c
                        )
                        : [],
                    education: Array.isArray(t.education)
                        ? t.education.map((e: any) => ({
                            ...e,
                            dateRange:
                                typeof e.dateRange === "string"
                                    ? (() => {
                                        const [startDate, endDate] = e.dateRange.split(" - ");
                                        return { startDate: startDate?.trim() || "", endDate: endDate?.trim() || "" };
                                    })()
                                    : e.dateRange,
                        }))
                        : [],
                    // Ensure 'levels' property is present for type compatibility
                    levels: Array.isArray((t as any).levels) ? (t as any).levels : [],
                };
            }) as Tutor[];
    };

    const relatedTutors = getRelatedTutors();

    function onViewProfile(_id: string): void {
        navigate(`/tutor-detail/${_id}`);
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column (8/12) */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Profile Header */}
                    <TutorHeader tutor={tutor} />

                    {/* Introduction */}
                    <TutorIntroduction tutor={tutor} />

                    {/* Certifications */}
                    <TutorCertification tutor={tutor} />

                    {/* Education */}
                    <TutorEducation tutor={tutor} />

                    {/* Subjects */}
                    <TutorSubject tutor={tutor} />

                    {/* Availability */}
                    <TutorAvailability tutor={tutor} />

                    {relatedTutors.length > 0 && (
                        <RelatedTutors
                            relatedTutors={relatedTutors}
                            onViewProfile={onViewProfile}
                        />
                    )}
                </div>

                {/* Right Column (4/12) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Teaching Services and Contact Card */}
                    <TutorContactCard tutor={tutor} />
                </div>

            </div>
        </div>
    );
};

export default TutorDetail;
