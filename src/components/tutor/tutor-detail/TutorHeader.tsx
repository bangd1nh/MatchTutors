import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tutor } from "@/types/Tutor";
import { Calendar, Clock, Globe, Heart, MapPin, MessageCircle, Star } from "lucide-react";

interface TutorHeaderProps {
    tutor: Tutor;
}

export function TutorHeader({ tutor }: TutorHeaderProps) {
    return (
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
                                        className={`w-4 h-4 ${i <
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
                                {tutor.address.city}
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

    )
}