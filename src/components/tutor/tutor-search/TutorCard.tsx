
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Clock, Heart, User } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Tutor } from "@/types/Tutor"
import { useNavigate } from "react-router-dom"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

interface TutorCardProps {
    tutor: Tutor
}

export function TutorCard({ tutor }: TutorCardProps) {
    const [isSaved, setIsSaved] = useState(false)
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const availableDays = tutor.availability.map((a) => a.dayOfWeek)
    const navigate = useNavigate()

    const getMethodBadgeColor = (method: string) => {
        switch (method) {
            case "Online":
                return "bg-blue-100 text-blue-800 hover:bg-blue-200"
            case "Offline":
                return "bg-green-100 text-green-800 hover:bg-green-200"
            case "StudentPlace":
                return "bg-purple-100 text-purple-800 hover:bg-purple-200"
            case "TutorPlace":
                return "bg-orange-100 text-orange-800 hover:bg-orange-200"
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }
    }

    function onViewProfile(_id: string): void {
        navigate(`/tutor-detail/${_id}`)
    }

    return (
        <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Profile Section */}
                    <div className="flex flex-col items-center sm:items-start">
                        <Avatar className="h-20 w-20 mb-3">
                            <AvatarImage src={tutor.avatarUrl || "/placeholder.svg"} alt={tutor.fullName} />
                            <AvatarFallback>
                                <User className="h-8 w-8" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={cn(
                                        "h-4 w-4",
                                        i < Math.floor(tutor.ratings.average) ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                                    )}
                                />
                            ))}
                            <span className="text-sm text-muted-foreground ml-1">({tutor.ratings.totalReviews})</span>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                            <div>
                                <h3 className="text-xl font-semibold mb-1 cursor-pointer" onClick={() => onViewProfile(tutor._id)}>{tutor.fullName}</h3>
                                <div className="flex items-center text-muted-foreground mb-2">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span className="text-sm">
                                        {tutor.address.city}, {tutor.address.state}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">Starting from:</p>
                                <p className="text-2xl font-bold text-primary">${tutor.hourlyRate}.00/hr</p>
                            </div>
                        </div>

                        {/* Availability Calendar */}
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Availability</span>
                            </div>
                            <div className="flex gap-1">
                                {dayNames.map((day, index) => (
                                    <div
                                        key={day}
                                        className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                                            availableDays.includes(index)
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-muted-foreground",
                                        )}
                                    >
                                        {day.charAt(0)}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Teaching Methods */}
                        <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                                {tutor.teachingServices.map((method) => (
                                    <Badge key={method} variant="secondary" className={getMethodBadgeColor(method)}>
                                        {method === "StudentPlace" ? "Student Place" : method === "TutorPlace" ? "Tutor Place" : method}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Subjects */}
                        <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                                {tutor.subjects
                                    .flatMap((subject) => subject.items)
                                    .slice(0, 4)
                                    .map((item) => (
                                        <Badge key={item} variant="outline">
                                            {item}
                                        </Badge>
                                    ))}

                                {tutor.subjects.flatMap((subject) => subject.items).length > 4 && (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-6 px-2 text-xs rounded-full border-dashed"
                                            >
                                                +{tutor.subjects.flatMap((subject) => subject.items).length - 4} more
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80 p-3" align="start">
                                            <div className="flex flex-wrap gap-2">
                                                {tutor.subjects
                                                    .flatMap((subject) => subject.items)
                                                    .slice(4)
                                                    .map((item) => (
                                                        <Badge key={item} variant="outline" className="text-xs">
                                                            {item}
                                                        </Badge>
                                                    ))}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                )}
                            </div>
                        </div>

                        {/* Bio */}
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tutor.bio}</p>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsSaved(!isSaved)}
                                className="flex items-center gap-2"
                            >
                                <Heart className={cn("h-4 w-4", isSaved && "fill-red-500 text-red-500")} />
                                Save
                            </Button>
                            <Button size="sm" className="flex-1 sm:flex-none" onClick={() => onViewProfile(tutor._id)}>
                                View Profile
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
