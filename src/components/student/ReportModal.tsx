import { useState } from "react";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
   DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ViolationTypeEnum, VIOLATION_TYPE_VALUES } from "@/enums/violationReport.enum";
import { Loader2, X, Upload } from "lucide-react";

interface ReportModalProps {
   isOpen: boolean;
   onClose: () => void;
   tutorId: string;
   tutorName?: string;
   onSubmit: (data: {
      type: ViolationTypeEnum;
      reason: string;
      evidenceFiles: File[];
   }) => Promise<void>;
}

const VIOLATION_TYPE_LABELS: Record<ViolationTypeEnum, string> = {
   [ViolationTypeEnum.SCAM_TUTOR]: "Gia sư lừa đảo",
   [ViolationTypeEnum.FALSE_FEEDBACK]: "Đánh giá sai sự thật",
   [ViolationTypeEnum.SCAM_STUDENT]: "Gia sư lừa đảo học sinh",
};

export const ReportModal = ({
   isOpen,
   onClose,
   tutorName,
   onSubmit,
}: ReportModalProps) => {
   const [type, setType] = useState<ViolationTypeEnum | "">("");
   const [reason, setReason] = useState("");
   const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      setEvidenceFiles((prev) => [...prev, ...files]);
   };

   const removeFile = (index: number) => {
      setEvidenceFiles((prev) => prev.filter((_, i) => i !== index));
   };

   const handleSubmit = async () => {
      if (!type || !reason.trim()) {
         return;
      }

      setIsSubmitting(true);
      try {
         await onSubmit({
            type: type as ViolationTypeEnum,
            reason: reason.trim(),
            evidenceFiles,
         });
         // Reset form
         setType("");
         setReason("");
         setEvidenceFiles([]);
         onClose();
      } catch (error) {
         console.error("Error submitting report:", error);
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleClose = () => {
      if (!isSubmitting) {
         setType("");
         setReason("");
         setEvidenceFiles([]);
         onClose();
      }
   };

   return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle className="text-2xl font-bold">
                  Báo cáo gia sư
               </DialogTitle>
               <DialogDescription>
                  {tutorName
                     ? `Báo cáo vi phạm của gia sư ${tutorName}`
                     : "Vui lòng điền thông tin báo cáo vi phạm"}
               </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
               {/* Type Selection */}
               <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm font-semibold">
                     Loại vi phạm <span className="text-red-500">*</span>
                  </Label>
                  <Select
                     value={type}
                     onValueChange={(value) =>
                        setType(value as ViolationTypeEnum)
                     }
                     disabled={isSubmitting}
                  >
                     <SelectTrigger id="type">
                        <SelectValue placeholder="Chọn loại vi phạm" />
                     </SelectTrigger>
                     <SelectContent>
                        {VIOLATION_TYPE_VALUES.map((violationType) => (
                           <SelectItem key={violationType} value={violationType}>
                              {VIOLATION_TYPE_LABELS[violationType]}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>

               {/* Reason */}
               <div className="space-y-2">
                  <Label htmlFor="reason" className="text-sm font-semibold">
                     Lý do báo cáo <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                     id="reason"
                     placeholder="Mô tả chi tiết lý do báo cáo vi phạm..."
                     value={reason}
                     onChange={(e) => setReason(e.target.value)}
                     disabled={isSubmitting}
                     rows={5}
                     className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                     Vui lòng cung cấp thông tin chi tiết và chính xác
                  </p>
               </div>

               {/* File Upload */}
               <div className="space-y-2">
                  <Label htmlFor="evidence" className="text-sm font-semibold">
                     Tài liệu bằng chứng (Tùy chọn)
                  </Label>
                  <div className="flex items-center gap-2">
                     <Input
                        id="evidence"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        disabled={isSubmitting}
                        accept="image/*,.pdf,.doc,.docx"
                        className="flex-1"
                     />
                     <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                     Hỗ trợ: hình ảnh, PDF, Word (tối đa 10MB mỗi file)
                  </p>

                  {/* File List */}
                  {evidenceFiles.length > 0 && (
                     <div className="mt-3 space-y-2">
                        {evidenceFiles.map((file, index) => (
                           <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-muted rounded-md"
                           >
                              <span className="text-sm text-foreground truncate flex-1">
                                 {file.name}
                              </span>
                              <Button
                                 type="button"
                                 variant="ghost"
                                 size="sm"
                                 onClick={() => removeFile(index)}
                                 disabled={isSubmitting}
                                 className="h-6 w-6 p-0 ml-2"
                              >
                                 <X className="h-4 w-4" />
                              </Button>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>

            <DialogFooter className="gap-2">
               <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
               >
                  Hủy
               </Button>
               <Button
                  onClick={handleSubmit}
                  disabled={!type || !reason.trim() || isSubmitting}
                  className="bg-red-600 hover:bg-red-700 text-white"
               >
                  {isSubmitting ? (
                     <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang gửi...
                     </>
                  ) : (
                     "Gửi báo cáo"
                  )}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

