import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
   ArrowLeft,
   Edit3,
   Save,
   Settings,
   Calendar,
   Clock,
   Users,
   Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getSubjectLabelVi, getLevelLabelVi } from "@/utils/educationDisplay";
import { translateSessionStatus } from "@/utils/statusTranslations";

export default function SessionHeader({
   session,
   isEditing,
   setIsEditing,
   handleSave,
   handleCancel,
   canEdit,
   isSaving,
}: any) {
   const navigate = useNavigate();

   // Use learningCommitment for subject/level
   const learningCommitment = (session as any).learningCommitmentId;

   // mapping for badge colors (kept separate from translation)
   const statusClassMap: Record<string, string> = {
      SCHEDULED: "bg-blue-100 text-blue-800",
      CONFIRMED: "bg-green-100 text-green-800",
      COMPLETED: "bg-gray-100 text-gray-800",
      REJECTED: "bg-red-100 text-red-800",
      CANCELLED: "bg-red-100 text-red-800",
      NOT_CONDUCTED: "bg-orange-100 text-orange-800",
      DISPUTED: "bg-purple-100 text-purple-800",
   };
   const statusLabel = translateSessionStatus(String(session.status));
   const statusClass =
      statusClassMap[String(session.status)] ?? "bg-gray-100 text-gray-800";

   // cho phép chỉnh sửa khi ở các trạng thái này
   const editableStatuses = new Set(["SCHEDULED", "CONFIRMED"]);

   return (
      <div className="border-b bg-card">
         <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <Button
                     variant="ghost"
                     size="icon"
                     onClick={() => navigate(-1)}
                  >
                     <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                     <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-semibold text-foreground">
                           {learningCommitment?.teachingRequest?.subject
                              ? getSubjectLabelVi(
                                   learningCommitment.teachingRequest.subject
                                )
                              : "Môn học"}
                           {" - "}
                           {learningCommitment?.teachingRequest?.level
                              ? getLevelLabelVi(
                                   learningCommitment.teachingRequest.level
                                )
                              : "Cấp độ"}
                        </h1>
                        {/*  label translated + color from map */}
                        <Badge className={statusClass}>{statusLabel}</Badge>
                     </div>
                     <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                           <Calendar className="h-4 w-4" />
                           {new Date(session.startTime).toLocaleDateString(
                              "vi-VN"
                           )}
                        </div>
                        <div className="flex items-center gap-1">
                           <Clock className="h-4 w-4" />
                           {new Date(session.startTime).toLocaleTimeString(
                              "vi-VN",
                              {
                                 hour: "2-digit",
                                 minute: "2-digit",
                              }
                           )}{" "}
                           -{" "}
                           {new Date(session.endTime).toLocaleTimeString(
                              "vi-VN",
                              {
                                 hour: "2-digit",
                                 minute: "2-digit",
                              }
                           )}
                        </div>
                        <div className="flex items-center gap-1">
                           <Users className="h-4 w-4" />1 học sinh
                        </div>
                     </div>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  {canEdit && editableStatuses.has(String(session.status)) && (
                     <>
                        {isEditing ? (
                           <>
                              <Button onClick={handleSave} disabled={isSaving}>
                                 {isSaving ? (
                                    <>
                                       <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                       Đang lưu...
                                    </>
                                 ) : (
                                    <>
                                       <Save className="h-4 w-4 mr-2" />
                                       Lưu
                                    </>
                                 )}
                              </Button>
                              <Button
                                 variant="outline"
                                 onClick={handleCancel}
                                 disabled={isSaving}
                              >
                                 Hủy
                              </Button>
                           </>
                        ) : (
                           <Button onClick={() => setIsEditing(true)}>
                              <Edit3 className="h-4 w-4 mr-2" />
                              Chỉnh sửa
                           </Button>
                        )}
                     </>
                  )}
                  <Button variant="outline" size="icon">
                     <Settings className="h-4 w-4" />
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}
