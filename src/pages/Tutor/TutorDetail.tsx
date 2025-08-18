import type React from "react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Star,
    MessageCircle,
    Calendar,
    MapPin,
    Phone,
    Mail,
    ChevronDown,
    ChevronUp,
    Check,
    Minus,
    Globe,
    Copy,
    Lock,
    Briefcase,
    Home,
    Heart,
    Award,
    Clock,
    Facebook,
} from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import type { Tutor } from "@/types/Tutor";
import tutorsData from "@/data/tutors.json";
import { useParams, useNavigate } from "react-router-dom";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const TutorDetail: React.FC = () => {
    const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);
    const [showContactDetails, setShowContactDetails] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const rawTutor = tutorsData.find((t) => t._id === id);
    const validTimeSlots = ["morning", "afternoon", "evening"] as const;
    const validTeachingServices = [
        "Online",
        "Offline",
        "StudentPlace",
        "TutorPlace",
    ] as const;
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
              teachingServices: Array.isArray(rawTutor.teachingServices)
                  ? rawTutor.teachingServices.filter(
                        (
                            service: string
                        ): service is (typeof validTeachingServices)[number] =>
                            validTeachingServices.includes(
                                service as (typeof validTeachingServices)[number]
                            )
                    )
                  : [],
          }
        : undefined;

    if (!tutor) {
        return <div className="text-center text-red-500">Tutor not found</div>;
    }

    const getRelatedTutors = () => {
        const currentTutorSubjects = tutor.subjects.flatMap(
            (subject) => subject.items
        );
        const currentTutorLocation = `${tutor.address.city}, ${tutor.address.state}`;

        return tutorsData
            .filter((t) => t._id !== tutor._id) // Exclude current tutor
            .map((t) => {
                let score = 0;
                const tutorSubjects = t.subjects.flatMap(
                    (subject) => subject.items
                );
                const tutorLocation = `${t.address.city}, ${t.address.state}`;

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
            .slice(0, 3); // Show top 3 related tutors
    };

    const relatedTutors = getRelatedTutors();

    const toggleSubjectCategory = (category: string) => {
        setExpandedSubjects((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const maskContact = (contact: string, type: "phone" | "email") => {
        if (type === "phone") {
            return contact.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2");
        }
        const [local, domain] = contact.split("@");
        return `${local.slice(0, 2)}****@${domain}`;
    };

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const timeSlotLabels = {
        morning: "PRE 12PM",
        afternoon: "12PM-5PM",
        evening: "AFTER 5PM",
    };

    const availabilityGrid = () => {
        const grid: { [key: string]: boolean } = {};
        tutor.availability.forEach(({ dayOfWeek, timeSlots }) => {
            timeSlots.forEach((slot) => {
                grid[`${dayOfWeek}-${slot}`] = true;
            });
        });
        return grid;
    };

    const grid = availabilityGrid();

    function onViewProfile(_id: string): void {
        navigate(`/tutor-detail/${_id}`);
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Profile Header */}
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column (8/12) */}
                <div className="lg:col-span-8 space-y-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex flex-col items-center md:items-start">
                                    <Avatar className="w-32 h-32 mb-4">
                                        <AvatarImage
                                            src={
                                                tutor.avatarUrl ||
                                                "/placeholder.svg"
                                            }
                                            alt={tutor.fullName}
                                        />
                                        <AvatarFallback className="text-2xl">
                                            {(tutor.fullName ?? "N/A")
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-center md:text-left">
                                        <div className="flex items-center gap-1 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${
                                                        i <
                                                        Math.floor(
                                                            tutor.ratings
                                                                .average
                                                        )
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "text-gray-300"
                                                    }`}
                                                />
                                            ))}
                                            <span className="ml-2 text-sm text-muted-foreground">
                                                {tutor.ratings.average} (
                                                {tutor.ratings.totalReviews}{" "}
                                                reviews)
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold mb-2">
                                        {tutor.fullName}
                                    </h1>

                                    <div className="flex items-center gap-2 mb-3">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            {tutor.address.city},{" "}
                                            {tutor.address.state}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-4 mb-3">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm">
                                                {tutor.experienceYears}+ years
                                                experience
                                            </span>
                                        </div>
                                        {tutor.gender && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-muted-foreground">
                                                    •
                                                </span>
                                                <span className="text-sm">
                                                    {tutor.gender}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm">
                                                Languages I know:
                                            </span>
                                        </div>
                                        {tutor.languages
                                            .slice(0, 3)
                                            .map((lang, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                >
                                                    {lang}
                                                </Badge>
                                            ))}
                                        {tutor.languages.length > 3 && (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-6 px-2 text-xs rounded-full border-dashed"
                                                    >
                                                        +
                                                        {tutor.languages
                                                            .length - 3}{" "}
                                                        more
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-48 p-3"
                                                    align="start"
                                                >
                                                    <div className="space-y-2">
                                                        {tutor.languages
                                                            .slice(3)
                                                            .map(
                                                                (
                                                                    lang,
                                                                    index
                                                                ) => (
                                                                    <Badge
                                                                        key={
                                                                            index
                                                                        }
                                                                        variant="secondary"
                                                                        className="text-xs"
                                                                    >
                                                                        {lang}
                                                                    </Badge>
                                                                )
                                                            )}
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-3">
                                        <Button variant="outline" size="sm">
                                            <Heart className="w-4 h-4 mr-2" />
                                            Save
                                        </Button>
                                        <Button size="sm">
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            Let's talk now
                                        </Button>
                                        <Button variant="secondary" size="sm">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            Book a tuition
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Introduction */}
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
                    {tutor.certifications &&
                        tutor.certifications.length > 0 && (
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
                        )}

                    {/* Education */}
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
                                                {edu.location}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-green-600" />
                                            <span className="text-sm">
                                                {edu.dateRange}
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

                    {/* Subjects I Can Teach */}
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

                    {/* Availability */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Availability</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="text-left p-2 border-b font-medium">
                                                Time
                                            </th>
                                            {dayNames.map((day) => (
                                                <th
                                                    key={day}
                                                    className="text-center p-2 border-b font-medium min-w-[60px]"
                                                >
                                                    {day}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(timeSlotLabels).map(
                                            ([slot, label]) => (
                                                <TableRow key={slot}>
                                                    <TableCell className="p-2 border-b text-sm font-medium">
                                                        {label}
                                                    </TableCell>
                                                    {dayNames.map(
                                                        (_, dayIndex) => (
                                                            <TableCell
                                                                key={dayIndex}
                                                                className={`p-2 border-b text-center ${
                                                                    grid[
                                                                        `${dayIndex}-${slot}`
                                                                    ]
                                                                        ? ""
                                                                        : "bg-gray-100"
                                                                }`}
                                                            >
                                                                {grid[
                                                                    `${dayIndex}-${slot}`
                                                                ] ? (
                                                                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                                                                ) : (
                                                                    <Minus className="w-4 h-4 text-gray-400 mx-auto" />
                                                                )}
                                                            </TableCell>
                                                        )
                                                    )}
                                                </TableRow>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {relatedTutors.length > 0 && (
                        <div className="mt-8 lg:col-span-8">
                            <h3 className="text-xl font-semibold mb-4">
                                Explore related tutors
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {relatedTutors.map((tutor) => (
                                    <Card
                                        key={tutor._id}
                                        className="hover:shadow-md transition-shadow h-full"
                                    >
                                        <CardContent className="p-4">
                                            {/* Avatar and Basic Info - Compact layout */}
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage
                                                        src={tutor.avatarUrl}
                                                    />
                                                    <AvatarFallback className="text-sm">
                                                        {tutor.fullName
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h4
                                                        className="text-sm font-medium cursor-pointer"
                                                        onClick={() =>
                                                            onViewProfile(
                                                                tutor._id
                                                            )
                                                        }
                                                    >
                                                        {tutor.fullName}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground">
                                                        {tutor.address.city},{" "}
                                                        {tutor.address.state}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Rating - Compact */}
                                            <div className="flex items-center mt-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-3 h-3 ${
                                                            i <
                                                            Math.floor(
                                                                tutor.ratings
                                                                    .average
                                                            )
                                                                ? "text-yellow-400 fill-yellow-400"
                                                                : "text-gray-300"
                                                        }`}
                                                    />
                                                ))}
                                                <span className="text-xs text-muted-foreground ml-1">
                                                    (
                                                    {tutor.ratings.totalReviews}
                                                    )
                                                </span>
                                            </div>

                                            {/* Key Info - Compact */}
                                            <div className="mt-3 space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">
                                                        From:
                                                    </span>
                                                    <span className="font-medium">
                                                        ${tutor.hourlyRate}/hr
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">
                                                        Exp:
                                                    </span>
                                                    <span>
                                                        {tutor.experienceYears}+
                                                        yrs
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Teaching Methods - Compact */}
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {tutor.teachingServices
                                                    ?.slice(0, 2)
                                                    .map((method, i) => (
                                                        <Badge
                                                            key={i}
                                                            variant="outline"
                                                            className="text-xs px-1.5 py-0.5"
                                                        >
                                                            {method}
                                                        </Badge>
                                                    ))}
                                            </div>

                                            {/* Subjects - Compact */}
                                            <div className="mt-3">
                                                <p className="text-xs text-muted-foreground mb-1">
                                                    Teaches:
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                    {tutor.subjects
                                                        ?.flatMap(
                                                            (s) => s.items
                                                        )
                                                        .slice(0, 2)
                                                        .map((subject, i) => (
                                                            <Badge
                                                                key={i}
                                                                variant="secondary"
                                                                className="text-xs px-1.5 py-0.5"
                                                            >
                                                                {subject}
                                                            </Badge>
                                                        ))}
                                                    {tutor.subjects?.flatMap(
                                                        (s) => s.items
                                                    ).length > 2 && (
                                                        <Popover>
                                                            <PopoverTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-6 px-1.5 text-xs rounded-md"
                                                                >
                                                                    +
                                                                    {tutor.subjects.flatMap(
                                                                        (s) =>
                                                                            s.items
                                                                    ).length -
                                                                        2}
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent
                                                                className="w-64 p-2"
                                                                align="start"
                                                                sideOffset={4}
                                                            >
                                                                <div className="grid gap-2">
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {tutor.subjects
                                                                            ?.flatMap(
                                                                                (
                                                                                    s
                                                                                ) =>
                                                                                    s.items
                                                                            )
                                                                            .slice(
                                                                                2
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    subject,
                                                                                    i
                                                                                ) => (
                                                                                    <Badge
                                                                                        key={
                                                                                            i
                                                                                        }
                                                                                        variant="secondary"
                                                                                        className="text-xs px-1.5 py-0.5"
                                                                                    >
                                                                                        {
                                                                                            subject
                                                                                        }
                                                                                    </Badge>
                                                                                )
                                                                            )}
                                                                    </div>
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>
                                                    )}
                                                </div>
                                            </div>

                                            {/* View Profile Button - Compact */}
                                            <Button
                                                size="sm"
                                                className="mt-3 w-full text-sm"
                                                onClick={() =>
                                                    onViewProfile(tutor._id)
                                                }
                                            >
                                                View Profile
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column (4/12) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Combined Teaching Services and Contact Card */}
                    <Card className="border border-gray-200 shadow-sm">
                        {/* Teaching Services Section */}
                        <CardHeader className="pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div>
                                    <CardTitle>Teaching Services</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-3">
                                        Hello! You can have my teaching services
                                        direct at
                                    </p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-5 pb-6">
                            <div className="flex flex-wrap gap-3">
                                {tutor.teachingServices.map((method, index) => (
                                    <Badge
                                        key={index}
                                        variant="default"
                                        className="px-3 py-1.5 rounded-md flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100"
                                    >
                                        {method === "Online" && (
                                            <Globe className="w-3.5 h-3.5" />
                                        )}
                                        {method === "Offline" && (
                                            <MapPin className="w-3.5 h-3.5" />
                                        )}
                                        {method === "StudentPlace" && (
                                            <Home className="w-3.5 h-3.5" />
                                        )}
                                        {method === "TutorPlace" && (
                                            <Briefcase className="w-3.5 h-3.5" />
                                        )}
                                        {method === "StudentPlace"
                                            ? "Student's Place"
                                            : method === "TutorPlace"
                                            ? "My Place"
                                            : method}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>

                        {/* Contact Details Section */}
                        <CardHeader className="pb-4 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                                <div>
                                    <CardTitle>Contact Details</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-3">
                                        {showContactDetails
                                            ? "Full contact information"
                                            : "Secure contact details"}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-4 pb-6">
                            {!showContactDetails ? (
                                <div className="space-y-5">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border">
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">
                                                    Phone
                                                </span>
                                            </div>
                                            <span className="text-sm font-mono bg-background px-2 py-1 rounded border border-border text-muted-foreground">
                                                {maskContact(
                                                    tutor.contact.phone,
                                                    "phone"
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">
                                                    Email
                                                </span>
                                            </div>
                                            <span className="text-sm font-mono bg-background px-2 py-1 rounded border border-border text-muted-foreground">
                                                {maskContact(
                                                    tutor.contact.email,
                                                    "email"
                                                )}
                                            </span>
                                        </div>

                                        {tutor.contact.facebook && (
                                            <div className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border">
                                                <div className="flex items-center gap-2">
                                                    <Facebook className="w-4 h-4 text-muted-foreground" />
                                                    <span className="text-sm font-medium">
                                                        Facebook
                                                    </span>
                                                </div>
                                                <span className="text-sm text-primary font-medium">
                                                    Available
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        onClick={() =>
                                            setShowContactDetails(true)
                                        }
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                                    >
                                        <Lock className="w-4 h-4 mr-2" />
                                        Unlock Contact Details
                                    </Button>

                                    <div className="text-xs text-center text-muted-foreground mt-2">
                                        Click the button below to login & unlock
                                        the contact details
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Phone className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm font-medium text-blue-600">
                                                    Phone Number
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">
                                                    {tutor.contact.phone}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-2 hover:bg-gray-100"
                                                >
                                                    <Copy className="w-4 h-4 text-gray-500" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Mail className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm font-medium text-blue-600">
                                                    Email Address
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">
                                                    {tutor.contact.email}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-2 hover:bg-gray-100"
                                                >
                                                    <Copy className="w-4 h-4 text-gray-500" />
                                                </Button>
                                            </div>
                                        </div>

                                        {tutor.contact.facebook && (
                                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Facebook className="w-4 h-4 text-blue-600" />
                                                    <span className="text-sm font-medium text-blue-600">
                                                        Facebook
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <a
                                                        href={
                                                            tutor.contact
                                                                .facebook
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="font-medium text-blue-600 hover:underline"
                                                    >
                                                        View Profile
                                                    </a>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-2 hover:bg-gray-100"
                                                    >
                                                        <Copy className="w-4 h-4 text-gray-500" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            setShowContactDetails(false)
                                        }
                                        className="w-full border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                                    >
                                        <Lock className="w-4 h-4 mr-2 text-gray-500" />
                                        Hide Details
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TutorDetail;
