import { useAsignMCQToSession } from "@/hooks/useQuiz";
import { useMCQ } from "@/hooks/useMCQ";
import { Loader2, Calendar, BookOpen, Users } from "lucide-react";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useState, useMemo, useEffect } from "react";
import { asignMCQ, useAsignMCQStore } from "@/store/useAsignMCQStore";

interface MCQListModalProps {
   isOpen: boolean;
   onClose: () => void;
   sessionId: string;
}

const MCQListModal = ({ isOpen, onClose, sessionId }: MCQListModalProps) => {
   const { fetchList } = useMCQ();
   const [searchTerm, setSearchTerm] = useState("");
   const [hoveredCard, setHoveredCard] = useState<string | null>(null);

   const quizzes = Array.isArray(fetchList.data?.data)
      ? fetchList.data!.data
      : [];
   const { initAsignMCQ, asignMCQ, toggleMCQ, setRefetchMCQ } =
      useAsignMCQStore();

   useEffect(() => {
      if (!fetchList.isLoading && fetchList.data && isOpen) {
         initAsignMCQ(quizzes);
      }
   }, [isOpen, fetchList.data?.data]);

   const asign = useAsignMCQToSession();

   const selectedMCQs: string[] = asignMCQ
      .filter((a) => a.isAsigned)
      .map((f) => f._id);

   const handleSave = () => {
      console.log({ sessionId, quizIds: selectedMCQs });
      asign.mutate(
         { sessionId, quizIds: selectedMCQs },
         {
            onSuccess: () => {
               setRefetchMCQ();
               onClose();
            },
         }
      );
   };

   const mcqs = useMemo(() => {
      if (!asignMCQ) return [];
      const filtered = asignMCQ.filter(
         (quiz: any) => quiz.quizType === "MULTIPLE_CHOICE"
      );

      const uniqueMCQs = filtered.filter(
         (mcq, index, self) =>
            index === self.findIndex((m) => m._id === mcq._id)
      );

      return uniqueMCQs;
   }, [asignMCQ]);

   const filteredMCQs = useMemo(() => {
      if (!searchTerm) return mcqs;
      return mcqs.filter(
         (mcq: any) =>
            mcq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mcq.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mcq.tags?.some((tag: string) =>
               tag.toLowerCase().includes(searchTerm.toLowerCase())
            )
      );
   }, [mcqs, searchTerm]);

   if (fetchList.isLoading) {
      return (
         <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[85vh]">
               <div className="flex items-center justify-center h-96">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-4 text-lg">Đang tải danh sách MCQ...</p>
               </div>
            </DialogContent>
         </Dialog>
      );
   }

   if (fetchList.isError) {
      return (
         <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[85vh]">
               <div className="text-center h-96 flex items-center justify-center">
                  <div className="text-red-500">
                     <p className="text-lg font-medium">Lỗi!</p>
                     <p>Không thể tải dữ liệu MCQ. Vui lòng thử lại.</p>
                     <Button
                        variant="outline"
                        className="mt-4"
                        onClick={onClose}
                     >
                        Đóng
                     </Button>
                  </div>
               </div>
            </DialogContent>
         </Dialog>
      );
   }

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
            <DialogHeader>
               <DialogTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <BookOpen className="h-5 w-5" />
                     Danh sách Multiple Choice Quiz ({filteredMCQs.length})
                  </div>
                  <Badge variant="secondary" className="px-3 mt-10">
                     Đã chọn: {selectedMCQs.length}
                  </Badge>
               </DialogTitle>
            </DialogHeader>

            {/* Search Input */}
            <div className="mb-3">
               <Input
                  placeholder="Tìm kiếm theo tên, mô tả hoặc tag..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
               />
            </div>

            {/* MCQ List */}
            <ScrollArea className="flex-1 pr-2">
               {filteredMCQs.length === 0 ? (
                  <div className="text-center py-12">
                     <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                     <p className="text-muted-foreground text-lg">
                        {searchTerm
                           ? "Không tìm thấy MCQ nào phù hợp"
                           : "Chưa có MCQ nào được tạo"}
                     </p>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                     {filteredMCQs.map((mcq: asignMCQ) => {
                        return (
                           <Card
                              key={mcq._id}
                              className="hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500/50"
                           >
                              <CardHeader className="pb-2 space-y-1">
                                 <div className="flex items-start gap-3">
                                    <div className="flex-1 min-w-0">
                                       <CardTitle className="text-sm font-semibold line-clamp-2 leading-tight">
                                          {mcq.title}
                                       </CardTitle>
                                       <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                          {mcq.description || "Không có mô tả"}
                                       </p>
                                    </div>
                                 </div>

                                 <div className="flex items-center justify-between">
                                    <Badge
                                       variant="outline"
                                       className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 border-blue-200"
                                    >
                                       {mcq.quizMode || "STUDY"}
                                    </Badge>
                                 </div>
                              </CardHeader>

                              <CardContent className="space-y-2 grid grid-cols-2">
                                 <div>
                                    {/* Stats - compact row */}
                                    <div className="flex items-center gap-5 text-xs text-muted-foreground mb-2">
                                       <div className="flex items-center gap-1">
                                          <Users className="h-3 w-3" />
                                          <span>
                                             {mcq.totalQuestions || 0} câu
                                          </span>
                                       </div>
                                       <div className="flex items-center gap-1">
                                          <Calendar className="h-3 w-3" />
                                          <span>
                                             {mcq.createdAt
                                                ? new Date(
                                                     mcq.createdAt
                                                  ).toLocaleDateString("vi-VN")
                                                : "N/A"}
                                          </span>
                                       </div>
                                    </div>

                                    {/* Tags - compact display */}
                                    {mcq.tags && mcq.tags.length > 0 && (
                                       <div className="flex items-center gap-1 flex-wrap mb-2 relative">
                                          {mcq.tags
                                             .slice(0, 2)
                                             .map(
                                                (
                                                   tag: string,
                                                   index: number
                                                ) => (
                                                   <Badge
                                                      key={index}
                                                      variant="secondary"
                                                      className="text-xs px-2 py-0.5 h-5"
                                                   >
                                                      {tag}
                                                   </Badge>
                                                )
                                             )}
                                          {mcq.tags.length > 2 && (
                                             <div className="relative">
                                                <Badge
                                                   variant="secondary"
                                                   className="text-xs px-2 py-0.5 h-5 cursor-pointer"
                                                   onMouseEnter={() =>
                                                      setHoveredCard(mcq._id)
                                                   }
                                                   onMouseLeave={() =>
                                                      setHoveredCard(null)
                                                   }
                                                >
                                                   +{mcq.tags.length - 2}
                                                </Badge>

                                                {/* Custom tooltip */}
                                                {hoveredCard === mcq._id && (
                                                   <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 z-50">
                                                      <div className="bg-popover border border-border rounded-md shadow-lg p-2 max-w-[200px]">
                                                         <div className="flex flex-wrap gap-1">
                                                            {mcq.tags
                                                               .slice(2)
                                                               .map(
                                                                  (
                                                                     tag: string,
                                                                     index: number
                                                                  ) => (
                                                                     <span
                                                                        key={
                                                                           index
                                                                        }
                                                                        className="inline-block text-xs bg-secondary/80 px-1.5 py-0.5 rounded"
                                                                     >
                                                                        {tag}
                                                                     </span>
                                                                  )
                                                               )}
                                                         </div>
                                                         {/* Arrow */}
                                                         <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                                            <div className="border-4 border-transparent border-t-border"></div>
                                                         </div>
                                                      </div>
                                                   </div>
                                                )}
                                             </div>
                                          )}
                                       </div>
                                    )}

                                    {/* Settings - minimal badges */}
                                    <div className="flex gap-1 flex-wrap">
                                       {mcq.settings?.shuffleQuestions && (
                                          <Badge
                                             variant="outline"
                                             className="text-xs px-2 py-0.5 h-5"
                                          >
                                             Xáo trộn
                                          </Badge>
                                       )}
                                       {mcq.settings
                                          ?.showCorrectAnswersAfterSubmit && (
                                          <Badge
                                             variant="outline"
                                             className="text-xs px-2 py-0.5 h-5"
                                          >
                                             Hiện đáp án
                                          </Badge>
                                       )}
                                       {mcq.settings?.timeLimitMinutes && (
                                          <Badge
                                             variant="outline"
                                             className="text-xs px-2 py-0.5 h-5"
                                          >
                                             {mcq.settings.timeLimitMinutes}p
                                          </Badge>
                                       )}
                                    </div>
                                 </div>

                                 <Button
                                    variant={
                                       mcq.isAsigned ? "outline" : "default"
                                    }
                                    className="mt-0.5 flex-shrink-0 h-[90%]"
                                    onClick={() =>
                                       toggleMCQ(mcq, !mcq.isAsigned)
                                    }
                                 >
                                    {mcq.isAsigned ? "Bỏ chọn MCQ" : "Chọn MCQ"}
                                 </Button>
                              </CardContent>
                           </Card>
                        );
                     })}
                  </div>
               )}
            </ScrollArea>

            {/* Footer with action buttons */}
            <div className="flex items-center justify-between pt-4 border-t bg-background">
               <div className="text-sm text-muted-foreground">
                  Đã chọn {selectedMCQs.length} MCQ(s)
               </div>
               <div className="flex gap-3">
                  <Button variant="outline" onClick={onClose}>
                     Hủy
                  </Button>
                  <Button onClick={handleSave} className="min-w-[100px]">
                     Lưu ({selectedMCQs.length})
                  </Button>
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
};

export default MCQListModal;
