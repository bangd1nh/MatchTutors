import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, Lock, Copy, Globe, MapPin, Home, Briefcase, Facebook } from "lucide-react"
import { useState } from "react"
import type { Tutor } from "@/types/Tutor"

interface TutorContactCardProps {
    tutor: Tutor
}

export function TutorContactCard({ tutor }: TutorContactCardProps) {
    const [showContactDetails, setShowContactDetails] = useState(false)

    const maskContact = (contact: string, type: "phone" | "email"): string => {
        if (type === "phone") {
            // Remove all non-digit characters
            const digitsOnly = contact.replace(/\D/g, '');

            // Handle different phone number lengths
            if (digitsOnly.length <= 7) {
                // For shorter numbers (like 555-5555 becomes 555****)
                return `${digitsOnly.slice(0, 3)}****`;
            } else {
                // Standard masking for longer numbers
                return `${digitsOnly.slice(0, 3)}****${digitsOnly.slice(-3)}`;
            }
        }

        const [local, domain] = contact.split("@");
        if (!local || !domain) return "****@****"; // Invalid email fallback
        return `${local.slice(0, 2)}****@${domain}`;

    };
    return (
        <Card className="border border-gray-200 shadow-sm">
            {/* Teaching Services */}
            <CardHeader className="pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div>
                        <CardTitle>Teaching Services</CardTitle>
                        <p className="text-sm text-muted-foreground mt-3">
                            Hello! You can have my teaching services direct at
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
                            {method === "Online" && <Globe className="w-3.5 h-3.5" />}
                            {method === "Offline" && <MapPin className="w-3.5 h-3.5" />}
                            {method === "StudentPlace" && <Home className="w-3.5 h-3.5" />}
                            {method === "TutorPlace" && <Briefcase className="w-3.5 h-3.5" />}
                            {method === "StudentPlace"
                                ? "Student's Place"
                                : method === "TutorPlace"
                                    ? "My Place"
                                    : method}
                        </Badge>
                    ))}
                </div>
            </CardContent>

            {/* Contact Details */}
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
                                    <span className="text-sm font-medium">Phone</span>
                                </div>
                                <span className="text-sm font-mono bg-background px-2 py-1 rounded border border-border text-muted-foreground">
                                    {maskContact(tutor.contact.phone, "phone")}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Email</span>
                                </div>
                                <span className="text-sm font-mono bg-background px-2 py-1 rounded border border-border text-muted-foreground">
                                    {maskContact(tutor.contact.email, "email")}
                                </span>
                            </div>

                            {tutor.contact.facebook && (
                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border">
                                    <div className="flex items-center gap-2">
                                        <Facebook className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">Facebook</span>
                                    </div>
                                    <span className="text-sm text-primary font-medium">
                                        Available
                                    </span>
                                </div>
                            )}
                        </div>
                        <Button
                            onClick={() => setShowContactDetails(true)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                        >
                            <Lock className="w-4 h-4 mr-2" />
                            Unlock Contact Details
                        </Button>

                        <div className="text-xs text-center text-muted-foreground mt-2">
                            Click the button below to login & unlock the contact details
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
                                    <span className="font-medium">{tutor.contact.phone}</span>
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
                                    <span className="font-medium">{tutor.contact.email}</span>
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
                                            href={tutor.contact.facebook}
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
                            onClick={() => setShowContactDetails(false)}
                            className="w-full border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                        >
                            <Lock className="w-4 h-4 mr-2 text-gray-500" />
                            Hide Details
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}