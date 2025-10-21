import React from "react";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
} from "@/components/ui/dialog";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useSessionAssignedQuizzes, useDeleteFlashcard } from "@/hooks/useQuiz";
import {
   Calendar,
   Users,
   Clock,
   AlertTriangle,
   XCircle,
   Info,
   BookOpen,
   ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DeleteFlashcardModalProps {
   quizId: string;
   isOpen: boolean;
   onClose: () => void;
   quizTitle?: string;
}

const DeleteFlashcardModal: React.FC<DeleteFlashcardModalProps> = ({
   quizId,
   isOpen,
   onClose,
   quizTitle,
}) => {
   const { data, isLoading, isError } = useSessionAssignedQuizzes(quizId);
   const deleteQuiz = useDeleteFlashcard();
   const navigate = useNavigate();
   const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);

   const sessions = data?.data || [];
   const hasAssignedSessions = sessions.length > 0;

   const handleDelete = () => {
      if (hasAssignedSessions) {
         setShowConfirmDialog(true);
      } else {
         executeDelete();
      }
   };

   const executeDelete = () => {
      deleteQuiz.mutate(quizId, {
         onSuccess: () => {
            setShowConfirmDialog(false);
            onClose();
         },
         onError: (error) => {
            console.error("Error deleting quiz:", error);
            setShowConfirmDialog(false);
         },
      });
   };

   if (isLoading) {
      return (
         <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
               <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                  <span>Đang kiểm tra các session...</span>
               </div>
            </DialogContent>
         </Dialog>
      );
   }

   if (isError) {
      return (
         <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
               <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-red-600">
                     <XCircle className="h-5 w-5" />
                     Lỗi
                  </DialogTitle>
               </DialogHeader>
               <div className="py-4">
                  <p className="text-muted-foreground">
                     Không thể tải thông tin các session. Vui lòng thử lại.
                  </p>
               </div>
               <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={onClose}>
                     Đóng
                  </Button>
               </div>
            </DialogContent>
         </Dialog>
      );
   }

   return (
      <>
         <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
               <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                     <BookOpen className="h-5 w-5" />
                     Xác nhận xóa Quiz
                  </DialogTitle>
                  <DialogDescription>
                     {quizTitle && (
                        <span className="font-medium">"{quizTitle}" </span>
                     )}
                     {hasAssignedSessions
                        ? `đang được sử dụng trong ${sessions.length} session(s)`
                        : "sẽ bị xóa vĩnh viễn"}
                  </DialogDescription>
               </DialogHeader>

               {hasAssignedSessions && (
                  <div className="flex-1 overflow-hidden space-y-4">
                     {/* Warning Banner */}
                     <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div>
                           <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                              Cảnh báo
                           </h4>
                           <p className="text-sm text-yellow-700 dark:text-yellow-300">
                              Quiz này đang được sử dụng trong {sessions.length}{" "}
                              session(s). Việc xóa sẽ loại bỏ quiz này khỏi tất
                              cả các session liên quan.
                           </p>
                        </div>
                     </div>

                     {/* Sessions List */}
                     <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                           <Users className="h-4 w-4" />
                           Danh sách Sessions ({sessions.length})
                        </h4>

                        <ScrollArea className="h-[300px] pr-4">
                           <div className="space-y-3">
                              {sessions.map((session: any, index: number) => {
                                 // Extract data from nested structure
                                 const student =
                                    session.teachingRequestId?.studentId;
                                 const user = student?.userId;
                                 const subject =
                                    session.teachingRequestId?.subject;
                                 const level = session.teachingRequestId?.level;

                                 return (
                                    <Card
                                       key={session._id || `session-${index}`}
                                       className="border-l-4 border-l-blue-500"
                                    >
                                       <CardHeader className="pb-3">
                                          <div className="flex items-center justify-between">
                                             <div className="flex-1">
                                                <CardTitle className="text-base mb-1">
                                                   Session với{" "}
                                                   {user?.name || "Học viên"}
                                                </CardTitle>
                                                <p className="text-sm text-muted-foreground">
                                                   {user?.email ||
                                                      "Không có email"}
                                                </p>
                                             </div>
                                             <div className="flex items-center gap-2">
                                                <Badge
                                                   variant={
                                                      session.status ===
                                                      "SCHEDULED"
                                                         ? "default"
                                                         : session.status ===
                                                           "COMPLETED"
                                                         ? "secondary"
                                                         : "outline"
                                                   }
                                                   className="text-xs"
                                                >
                                                   {session.status || "UNKNOWN"}
                                                </Badge>
                                                {session.isTrial && (
                                                   <Badge
                                                      variant="outline"
                                                      className="text-xs border-orange-500 text-orange-600"
                                                   >
                                                      Trial
                                                   </Badge>
                                                )}
                                                <Button
                                                   size="sm"
                                                   variant="ghost"
                                                   onClick={() => {
                                                      navigate(
                                                         `/tutor/session/${session._id}`
                                                      );
                                                      onClose();
                                                   }}
                                                   className="h-6 w-6 p-0"
                                                >
                                                   <ExternalLink className="h-3 w-3" />
                                                </Button>
                                             </div>
                                          </div>
                                       </CardHeader>

                                       <CardContent className="pt-0">
                                          {/* Subject & Level */}
                                          {(subject || level) && (
                                             <div className="mb-3 flex flex-wrap gap-2">
                                                {subject && (
                                                   <Badge
                                                      variant="secondary"
                                                      className="text-xs"
                                                   >
                                                      {subject.replace(
                                                         "_",
                                                         " "
                                                      )}
                                                   </Badge>
                                                )}
                                                {level && (
                                                   <Badge
                                                      variant="outline"
                                                      className="text-xs"
                                                   >
                                                      {level.replace("_", " ")}
                                                   </Badge>
                                                )}
                                             </div>
                                          )}

                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                             <div className="space-y-2">
                                                {/* Start Time */}
                                                {session.startTime && (
                                                   <div className="flex items-center gap-2">
                                                      <Calendar className="h-3 w-3 text-green-600" />
                                                      <span className="text-muted-foreground">
                                                         Bắt đầu:
                                                      </span>
                                                      <span className="text-xs font-medium">
                                                         {new Date(
                                                            session.startTime
                                                         ).toLocaleString(
                                                            "vi-VN"
                                                         )}
                                                      </span>
                                                   </div>
                                                )}

                                                {/* End Time */}
                                                {session.endTime && (
                                                   <div className="flex items-center gap-2">
                                                      <Calendar className="h-3 w-3 text-red-600" />
                                                      <span className="text-muted-foreground">
                                                         Kết thúc:
                                                      </span>
                                                      <span className="text-xs font-medium">
                                                         {new Date(
                                                            session.endTime
                                                         ).toLocaleString(
                                                            "vi-VN"
                                                         )}
                                                      </span>
                                                   </div>
                                                )}

                                                {/* Duration */}
                                                {session.startTime &&
                                                   session.endTime && (
                                                      <div className="flex items-center gap-2">
                                                         <Clock className="h-3 w-3 text-blue-600" />
                                                         <span className="text-muted-foreground">
                                                            Thời lượng:
                                                         </span>
                                                         <span className="text-xs font-medium">
                                                            {Math.round(
                                                               (new Date(
                                                                  session.endTime
                                                               ).getTime() -
                                                                  new Date(
                                                                     session.startTime
                                                                  ).getTime()) /
                                                                  (1000 * 60)
                                                            )}{" "}
                                                            phút
                                                         </span>
                                                      </div>
                                                   )}
                                             </div>

                                             <div className="space-y-2">
                                                {/* Student ID */}
                                                {student?._id && (
                                                   <div className="flex items-center gap-2">
                                                      <Users className="h-3 w-3 text-muted-foreground" />
                                                      <span className="text-muted-foreground">
                                                         Student ID:
                                                      </span>
                                                      <span className="text-xs font-mono">
                                                         {student._id.slice(-8)}
                                                      </span>
                                                   </div>
                                                )}

                                                {/* Session ID */}
                                                {session._id && (
                                                   <div className="flex items-center gap-2">
                                                      <Info className="h-3 w-3 text-muted-foreground" />
                                                      <span className="text-muted-foreground">
                                                         Session ID:
                                                      </span>
                                                      <span className="text-xs font-mono">
                                                         {session._id.slice(-8)}
                                                      </span>
                                                   </div>
                                                )}

                                                {/* Created Date */}
                                                {session.createdAt && (
                                                   <div className="flex items-center gap-2">
                                                      <Calendar className="h-3 w-3 text-muted-foreground" />
                                                      <span className="text-muted-foreground">
                                                         Tạo lúc:
                                                      </span>
                                                      <span className="text-xs">
                                                         {new Date(
                                                            session.createdAt
                                                         ).toLocaleDateString(
                                                            "vi-VN"
                                                         )}
                                                      </span>
                                                   </div>
                                                )}
                                             </div>
                                          </div>

                                          {/* Teaching Request Details */}
                                          {session.teachingRequestId?._id && (
                                             <>
                                                <Separator className="my-3" />
                                                <div className="bg-secondary/20 p-2 rounded text-xs">
                                                   <div className="flex items-center justify-between">
                                                      <span className="text-muted-foreground">
                                                         Teaching Request:
                                                      </span>
                                                      <span className="font-mono">
                                                         {session.teachingRequestId._id.slice(
                                                            -8
                                                         )}
                                                      </span>
                                                   </div>
                                                </div>
                                             </>
                                          )}
                                       </CardContent>
                                    </Card>
                                 );
                              })}
                           </div>
                        </ScrollArea>
                     </div>
                  </div>
               )}

               {/* Footer */}
               <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                     <Info className="h-4 w-4" />
                     {hasAssignedSessions
                        ? "Hãy cân nhắc kỹ trước khi xóa"
                        : "Bạn có chắc chắn muốn xóa quiz này?"}
                  </div>

                  <div className="flex gap-3">
                     <Button variant="outline" onClick={onClose}>
                        Hủy
                     </Button>

                     <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteQuiz.isPending}
                     >
                        {deleteQuiz.isPending ? "Đang xóa..." : "Xóa"}
                     </Button>
                  </div>
               </div>
            </DialogContent>
         </Dialog>

         {/* Confirmation Dialog */}
         <AlertDialog
            open={showConfirmDialog}
            onOpenChange={setShowConfirmDialog}
         >
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                     <AlertTriangle className="h-5 w-5 text-red-500" />
                     Xác nhận xóa Quiz
                  </AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2">
                     <p>
                        Quiz{" "}
                        <span className="font-semibold">"{quizTitle}"</span>{" "}
                        đang được sử dụng trong{" "}
                        <span className="font-semibold text-red-600">
                           {sessions.length} session(s)
                        </span>
                        .
                     </p>
                     <p className="text-red-600 font-medium">
                        ⚠️ Việc xóa sẽ loại bỏ quiz này khỏi tất cả các session
                        liên quan và xóa vĩnh viễn.
                     </p>
                     <p>Bạn có chắc chắn muốn tiếp tục?</p>
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel
                     onClick={() => setShowConfirmDialog(false)}
                     disabled={deleteQuiz.isPending}
                  >
                     Hủy bỏ
                  </AlertDialogCancel>
                  <AlertDialogAction
                     onClick={executeDelete}
                     disabled={deleteQuiz.isPending}
                     className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                  >
                     {deleteQuiz.isPending ? (
                        <>
                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                           Đang xóa...
                        </>
                     ) : (
                        "Xác nhận xóa"
                     )}
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </>
   );
};

export default DeleteFlashcardModal;
