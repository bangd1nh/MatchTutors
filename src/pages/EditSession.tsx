import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SessionHeader from "@/components/session/SessionHeader";
import SessionDetails from "@/components/session/SessionDetails";
import SessionSidebar from "@/components/session/SessionSidebar";
import MaterialsCard from "@/components/session/MaterialsCard";
import QuizzesCard from "@/components/session/QuizzesCard";
import StudentsCard from "@/components/session/StudentsCard";
import HistoryCard from "@/components/session/HistoryCard";

const sessionData = {
    _id: "session_123",
    teachingRequestId: "req_456",
    title: "Toán học lớp 10 - Hàm số", // derived from teaching request
    startTime: new Date("2025-01-20T14:00:00Z"),
    endTime: new Date("2025-01-20T15:30:00Z"),
    status: "scheduled", // 'scheduled' | 'confirmed' | 'rejected' | 'completed' | 'not_conducted'
    isTrial: false,
    location: "https://meet.google.com/abc-defg-hij",
    notes: "Bài học về hàm số bậc nhất và bậc hai. Học sinh cần chuẩn bị sách giáo khoa và vở ghi chép.",
    createdBy: "tutor_789",
    reminders: [
        {
            userId: "student_001",
            minutesBefore: 1440,
            methods: ["email", "in_app"],
        }, // 1 day
        {
            userId: "student_001",
            minutesBefore: 30,
            methods: ["in_app", "sms"],
        }, // 30 minutes
    ],
    materials: [
        {
            _id: "mat_1",
            title: "Bài giảng Hàm số",
            description: "Slide bài giảng",
            fileUrl: "/files/ham-so.pdf",
            uploadedBy: "tutor_789",
        },
        {
            _id: "mat_2",
            title: "Bài tập thực hành",
            description: "Worksheet",
            fileUrl: "/files/bai-tap.docx",
            uploadedBy: "tutor_789",
        },
    ],
    quizIds: ["quiz_1", "quiz_2"],
    teachingRequest: {
        _id: "req_456",
        subject: "Toán học",
        level: "Lớp 10",
        status: "in_progress",
        student: {
            _id: "student_001",
            name: "Nguyễn Văn An",
            email: "an@example.com",
        },
        tutor: {
            _id: "tutor_789",
            name: "Thầy Minh",
            email: "minh@example.com",
        },
    },
    sessionHistory: [
        {
            action: "create",
            changedBy: "tutor_789",
            summary: "Tạo buổi học mới",
            createdAt: new Date("2025-01-15T10:00:00Z"),
        },
        {
            action: "update",
            changedBy: "tutor_789",
            summary: "Cập nhật thời gian",
            createdAt: new Date("2025-01-16T14:30:00Z"),
        },
    ],
};

const quizData = [
    {
        _id: "quiz_1",
        title: "Kiểm tra hàm số bậc nhất",
        description: "Bài kiểm tra 15 phút",
        quizMode: "practice",
        questions: [
            {
                _id: "q1",
                questionText: "Hàm số y = 2x + 1 có hệ số góc là?",
                questionType: "multiple_choice",
                options: ["1", "2", "-1", "0"],
                correctAnswer: "2",
            },
            {
                _id: "q2",
                questionText:
                    "Đồ thị hàm số y = -x + 3 cắt trục tung tại điểm nào?",
                questionType: "short_answer",
                correctAnswer: "(0, 3)",
            },
        ],
    },
    {
        _id: "quiz_2",
        title: "Flashcard từ vựng toán học",
        description: "Ôn tập thuật ngữ",
        quizMode: "study",
        cardOrder: "front",
        questions: [
            {
                _id: "q3",
                questionType: "flashcard",
                frontText: "Hệ số góc",
                backText: "Slope - Độ dốc của đường thẳng",
            },
            {
                _id: "q4",
                questionType: "flashcard",
                frontText: "Giao điểm",
                backText: "Intersection - Điểm mà hai đường thẳng cắt nhau",
            },
        ],
    },
];

const currentUser = {
    _id: "tutor_789",
    role: "tutor", // 'student' | 'tutor' | 'parent' | 'admin'
    name: "Thầy Minh",
};

export default function EditSession() {
    const [session, setSession] = useState(sessionData);
    const [activeTab, setActiveTab] = useState("details");
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        setIsEditing(false);
        console.log("[v0] Saving session:", session);
    };

    const handleCancel = () => {
        setSession(sessionData);
        setIsEditing(false);
    };

    const canEdit = () => {
        if (currentUser.role === "admin") return true;
        if (
            currentUser.role === "tutor" &&
            session.createdBy === currentUser._id
        )
            return true;
        if (currentUser.role === "student" && session.status === "scheduled")
            return true; // limited editing
        return false;
    };

    const canManageQuizzes =
        currentUser.role === "tutor" && session.createdBy === currentUser._id;
    const canViewHistory =
        currentUser.role === "tutor" || currentUser.role === "admin";

    return (
        <div className="min-h-screen bg-background">
            <SessionHeader
                session={session}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                handleSave={handleSave}
                handleCancel={handleCancel}
                canEdit={canEdit()}
            />

            <div className="max-w-6xl mx-auto px-4 py-6">
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-6"
                >
                    <TabsList
                        className={`grid w-full ${
                            canViewHistory ? "grid-cols-5" : "grid-cols-4"
                        }`}
                    >
                        <TabsTrigger value="details">
                            Chi tiết buổi học
                        </TabsTrigger>
                        <TabsTrigger value="materials">Tài liệu</TabsTrigger>
                        <TabsTrigger value="quizzes">
                            Bài tập & Quiz
                        </TabsTrigger>
                        <TabsTrigger value="students">Học sinh</TabsTrigger>
                        {canViewHistory && (
                            <TabsTrigger value="history">Lịch sử</TabsTrigger>
                        )}
                    </TabsList>

                    <TabsContent value="details" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <SessionDetails
                                session={session}
                                setSession={setSession}
                                isEditing={isEditing}
                                currentUser={currentUser}
                            />
                            <SessionSidebar
                                session={session}
                                setSession={setSession}
                                isEditing={isEditing}
                                canEdit={canEdit()}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="materials" className="space-y-6">
                        <MaterialsCard session={session} canEdit={canEdit()} />
                    </TabsContent>

                    <TabsContent value="quizzes" className="space-y-6">
                        <QuizzesCard
                            quizData={quizData}
                            canManageQuizzes={canManageQuizzes}
                        />
                    </TabsContent>

                    <TabsContent value="students" className="space-y-6">
                        <StudentsCard session={session} />
                    </TabsContent>

                    {canViewHistory && (
                        <TabsContent value="history" className="space-y-6">
                            <HistoryCard
                                session={session}
                                currentUser={currentUser}
                            />
                        </TabsContent>
                    )}
                </Tabs>
            </div>
        </div>
    );
}
