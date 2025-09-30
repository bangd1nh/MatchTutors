import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Star, GraduationCap, Award, Calendar } from "lucide-react";
import { Tutor } from "@/types/tutorListandDetail";
import { ContactInfoDisplay, StatsOverview, EducationList, AvailabilityGrid } from "@/components/tutor/tutor-profile";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

interface TutorProfileViewProps {
    tutor: Tutor | null;
    onEdit: () => void;
}

export function TutorProfileView({ tutor, onEdit }: TutorProfileViewProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full h-full mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tutor Profile</h1>
                        <p className="text-gray-600">View and manage your tutor information</p>
                    </div>
                    <Button onClick={onEdit} className="bg-blue-600 hover:bg-blue-700">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Overview */}
                    <Card className="lg:col-span-1">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center space-y-4">
                                <Avatar className="w-32 h-32">
                                    <AvatarImage src={typeof tutor?.userId === "object" && tutor?.userId.avatarUrl ? tutor.userId.avatarUrl : "/placeholder.svg"} />
                                    <AvatarFallback className="text-2xl">
                                        {typeof tutor?.userId === "object" && tutor?.userId?.name
                                            ? tutor.userId.name
                                                .split(" ")
                                                .map((n: string) => n[0])
                                                .join("")
                                            : "TU"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-center">
                                    <h2 className="text-xl font-bold">
                                        {typeof tutor?.userId === "object" && tutor?.userId?.name
                                            ? tutor.userId.name
                                            : "Tutor"}
                                    </h2>
                                    <div className="flex items-center justify-center space-x-1 mt-2">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-medium">{tutor?.ratings?.average ?? "-"}</span>
                                        <span className="text-gray-500">({tutor?.ratings?.totalReviews ?? "-"} reviews)</span>
                                    </div>
                                    <Badge
                                        className={`mt-2 ${tutor?.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                                    >
                                        {tutor?.isApproved ? "Approved" : "Pending Approval"}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact & Basic Info */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {tutor && <ContactInfoDisplay tutor={tutor} />}
                        </CardContent>
                    </Card>

                    {/* Teaching Information */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Teaching Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {tutor && <StatsOverview tutor={tutor} />}
                        </CardContent>
                    </Card>

                    {/* Education */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <GraduationCap className="w-5 h-5 mr-2" />
                                Education
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <EducationList education={tutor?.education || []} />
                        </CardContent>
                    </Card>

                    {/* Certifications */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Award className="w-5 h-5 mr-2" />
                                Certifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {(tutor?.certifications ?? []).map((cert, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                    <h4 className="font-medium">{cert.name}</h4>
                                    {cert.description && (
                                        <p className="text-gray-600 mt-2">{cert.description}</p>
                                    )}

                                    {/* Images */}
                                    {cert.imageUrls && cert.imageUrls.length > 0 && (
                                        <div className="mt-3">
                                            <div className="flex flex-wrap gap-2">
                                                {cert.imageUrls.map((url, urlIndex) => (
                                                    <div key={urlIndex} className="relative">
                                                        <img
                                                            src={url}
                                                            alt={`Certification ${index + 1} - Image ${urlIndex + 1}`}
                                                            className="w-20 h-20 object-cover rounded cursor-pointer border hover:opacity-80"
                                                            onClick={() => setSelectedImage(url)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                                <DialogContent className="max-w-2xl max-h-screen bg-white border-none shadow-none">
                                    {selectedImage && (
                                        <img
                                            src={selectedImage}
                                            alt="Certification enlarged"
                                            className="max-h-[80vh] w-auto mx-auto rounded-lg"
                                        />
                                    )}
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>

                    {/* Availability */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Calendar className="w-5 h-5 mr-2" />
                                Availability Schedule
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AvailabilityGrid
                                availability={tutor?.availability || []}
                                isViewMode={true}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}