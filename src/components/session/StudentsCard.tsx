import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export default function StudentsCard({ session }: any) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Avatar className="h-5 w-5" />
                    Thông tin học sinh
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>
                            {session.teachingRequest.student.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h3 className="font-medium">
                            {session.teachingRequest.student.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {session.teachingRequest.student.email}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700"
                        >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Đã tham gia
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
