import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit3 } from "lucide-react";

export default function QuizzesCard({ quizData, canManageQuizzes }: any) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Bài tập & Quiz ({quizData.length})
                </CardTitle>
                {canManageQuizzes && (
                    <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Tạo Quiz mới
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {quizData.map((quiz: any) => (
                        <div key={quiz._id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h3 className="font-medium">
                                        {quiz.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {quiz.description}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">
                                        {quiz.quizMode === "practice" &&
                                            "Luyện tập"}
                                        {quiz.quizMode === "study" && "Học tập"}
                                        {quiz.quizMode === "exam" && "Kiểm tra"}
                                    </Badge>
                                    {canManageQuizzes && (
                                        <Button variant="ghost" size="sm">
                                            <Edit3 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {quiz.questions.length} câu hỏi
                                {quiz.quizMode === "study" &&
                                    quiz.cardOrder &&
                                    ` • Thứ tự: ${
                                        quiz.cardOrder === "front"
                                            ? "Mặt trước"
                                            : "Mặt sau"
                                    }`}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
