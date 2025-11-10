import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSessionDetail, useUpdateSession } from "@/hooks/useSessions";
import { useUser } from "@/hooks/useUser";
import { Role } from "@/types/user";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SessionHeader from "@/components/session/SessionHeader";
import SessionDetails from "@/components/session/SessionDetails";
import SessionSidebar from "@/components/session/SessionSidebar";
import MaterialsCard from "@/components/session/MaterialsCard";
import QuizzesCard from "@/components/session/QuizzesCard";
import { useToast } from "@/hooks/useToast";
import MCQCard from "@/components/session/MCQCard";
import SAQCard from "@/components/session/SAQCard";

export default function SessionDetailPage() {
   const { id } = useParams<{ id: string }>();
   const { data: session, isLoading, isError, refetch } = useSessionDetail(id);
   const { user: currentUser } = useUser();
   const updateSessionMutation = useUpdateSession();
   const toast = useToast();

   const [isEditing, setIsEditing] = useState(false);
   const [activeTab, setActiveTab] = useState("details");
   const [editableSession, setEditableSession] = useState(session);

   // Cập nhật editableSession khi session từ API thay đổi
   useEffect(() => {
      if (session) {
         setEditableSession(session);
      }
   }, [session]);

   const canEdit = () => {
      if (!currentUser || !session) return false;

      if (currentUser.role === Role.ADMIN) return true;

      // Cho phép cả TUTOR và STUDENT chỉnh sửa dựa trên learningCommitment
      const lc: any = (session as any).learningCommitmentId;
      if (currentUser.role === Role.TUTOR) {
         const tutorUserId = lc?.tutor?.userId?._id || lc?.tutor?.userId;
         return tutorUserId === currentUser.id;
      }

      // if (currentUser.role === Role.STUDENT) {
      //    const studentUserId = lc?.student?.userId?._id || lc?.student?.userId;
      //    return studentUserId === currentUser.id;
      // }

      return false;
   };

   const handleSave = async () => {
      if (!editableSession || !id) return;

      try {
         // Chuẩn bị payload chỉ với các field được phép update
         const payload: any = {
            location: editableSession.location,
            notes: editableSession.notes, // Thêm notes vào payload
         };

         // Chỉ cho phép tutor thay đổi status và thời gian
         if (currentUser?.role === Role.TUTOR) {
            payload.status = editableSession.status;

            payload.startTime = new Date(
               editableSession.startTime
            ).toISOString();
            payload.endTime = new Date(editableSession.endTime).toISOString();
         }

         await updateSessionMutation.mutateAsync({
            sessionId: id,
            payload,
         });

         toast("success", "Cập nhật buổi học thành công!");
         setIsEditing(false);
         refetch(); // Refresh data
      } catch (error) {
         console.error("Update error:", error);
         toast("error", "Cập nhật buổi học thất bại!");
      }
   };

   const handleCancel = () => {
      setEditableSession(session);
      setIsEditing(false);
   };

   if (isLoading) {
      return (
         <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin" />
         </div>
      );
   }

   if (isError || !session) {
      return (
         <div className="flex h-screen items-center justify-center text-red-500">
            Không thể tải thông tin buổi học hoặc buổi học không tồn tại.
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-background">
         <SessionHeader
            session={editableSession || session}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleSave={handleSave}
            handleCancel={handleCancel}
            canEdit={true} // Tạm thời force = true để test
            isSaving={updateSessionMutation.isPending}
         />

         <div className="max-w-6xl mx-auto px-4 py-6">
            <Tabs
               value={activeTab}
               onValueChange={setActiveTab}
               className="space-y-6"
            >
               <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="details">Chi tiết buổi học</TabsTrigger>
                  <TabsTrigger value="materials">Tài liệu</TabsTrigger>
                  <TabsTrigger value="quizzes">Flashcards</TabsTrigger>
                  <TabsTrigger value="mcq">Bài tập trắc nghiệm</TabsTrigger>
                  <TabsTrigger value="saq">Bài tập tự luận</TabsTrigger>
               </TabsList>

               <TabsContent value="details" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     <SessionDetails
                        session={editableSession || session}
                        setSession={setEditableSession}
                        isEditing={isEditing}
                        currentUser={currentUser}
                     />
                     <SessionSidebar
                        session={editableSession || session}
                        setSession={setEditableSession}
                        isEditing={isEditing}
                        canEdit={canEdit()}
                     />
                  </div>
               </TabsContent>

               <TabsContent value="materials" className="space-y-6">
                  <MaterialsCard session={session} canEdit={canEdit()} />
               </TabsContent>

               <TabsContent value="quizzes" className="space-y-6">
                  <QuizzesCard session={session} canManage={canEdit()} />
               </TabsContent>

               <TabsContent value="mcq" className="space-y-6">
                  <MCQCard session={session} canManage={canEdit()} />
               </TabsContent>

               <TabsContent value="saq" className="space-y-6">
                  <SAQCard session={session} canManage={canEdit()} />
               </TabsContent>

            </Tabs>
         </div>
      </div>
   );
}
