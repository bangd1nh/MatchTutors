import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Upload } from "lucide-react";

export default function MaterialsCard({ session, canEdit }: any) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Tài liệu buổi học</CardTitle>
                {canEdit && (
                    <Button size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Tải lên tài liệu
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {session.materials.map((material: any) => (
                        <div
                            key={material._id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-blue-500" />
                                <div>
                                    <p className="font-medium">
                                        {material.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {material.description}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                    <Download className="h-4 w-4 mr-2" />
                                    Tải xuống
                                </Button>
                                {canEdit && (
                                    <Button variant="ghost" size="sm">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
