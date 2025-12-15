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
        <div className="min-h-screen bg-background text-foreground">
            <div className="w-full h-full mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Hồ sơ Gia sư</h1>
                        <p className="text-muted-foreground">
                            Xem và quản lý thông tin gia sư của bạn
                        </p>
                    </div>
                    <Button onClick={onEdit} className="gap-2">
                        <Edit className="w-4 h-4" />
                        Chỉnh sửa hồ sơ
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Overview */}
                    <Card className="lg:col-span-1 bg-card text-card-foreground">
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
                                            : "Gia sư"}
                                    </h2>
                                    <div className="flex items-center justify-center space-x-1 mt-2">
                                        <Star className="w-4 h-4 text-yellow-500" />
                                        <span className="font-medium">{tutor?.ratings?.average ?? "-"}</span>
                                        <span className="text-muted-foreground">({tutor?.ratings?.totalReviews ?? "-"} đánh giá)</span>
                                    </div>
                                    <Badge
                                        variant={tutor?.isApproved ? "default" : "secondary"}
                                        className={tutor?.isApproved ? "bg-emerald-600 text-primary-foreground dark:bg-emerald-500" : ""}
                                    >
                                        {tutor?.isApproved ? "Đã duyệt" : "Đang chờ duyệt"}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact & Basic Info */}
                    <Card className="lg:col-span-2 bg-card text-card-foreground">
                        <CardHeader>
                            <CardTitle>Thông tin liên hệ</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {tutor && <ContactInfoDisplay tutor={tutor} />}
                        </CardContent>
                    </Card>

                    {/* Teaching Information */}
                    <Card className="lg:col-span-3 bg-card text-card-foreground">
                        <CardHeader>
                            <CardTitle>Thông tin giảng dạy</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {tutor && <StatsOverview tutor={tutor} />}
                        </CardContent>
                    </Card>

                    {/* Education */}
                    <Card className="lg:col-span-3 bg-card text-card-foreground">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <GraduationCap className="w-5 h-5 mr-2" />
                                Học vấn
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <EducationList education={tutor?.education || []} />
                        </CardContent>
                    </Card>

                    {/* Certifications */}
                    <Card className="lg:col-span-3 bg-card text-card-foreground">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Award className="w-5 h-5 mr-2" />
                                Chứng chỉ
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {(tutor?.certifications ?? []).map((cert, index) => (
                                <div key={index} className="border border-border rounded-lg p-4 bg-muted/40">
                                    <h4 className="font-medium text-foreground">{cert.name}</h4>
                                    {cert.description && (
                                        <p className="text-muted-foreground mt-2">{cert.description}</p>
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
                                                            className="w-20 h-20 object-cover rounded cursor-pointer border border-border hover:opacity-80"
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
                                <DialogContent className="max-w-2xl max-h-screen bg-card text-card-foreground border border-border">
                                    {selectedImage && (
                                        <img
                                            src={selectedImage}
                                            alt="Chứng chỉ phóng to"
                                            className="max-h-[80vh] w-auto mx-auto rounded-lg"
                                        />
                                    )}
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>

                    {/* Availability */}
                    <Card className="lg:col-span-3 bg-card text-card-foreground">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Calendar className="w-5 h-5 mr-2" />
                                Lịch giảng dạy
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
