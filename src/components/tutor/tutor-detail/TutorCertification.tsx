import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Tutor, Certification } from "@/types/tutorListandDetail";
import { Award, Image as ImageIcon, ZoomIn } from "lucide-react";

interface TutorCertificationProps {
   tutor: Tutor;
}

// Component con để hiển thị một chứng chỉ
const CertificationCard = ({ cert }: { cert: Certification }) => {
   const imageUrls = cert.imageUrls || [];

   return (
      <div className="flex flex-col gap-4 rounded-xl border bg-card text-card-foreground shadow-sm p-6">
         {/* Phần thông tin text */}
         <div className="flex-grow">
            <div className="flex justify-between items-start">
               <h4 className="font-bold text-lg text-primary">{cert.name}</h4>
               {imageUrls.length > 0 && (
                  <div className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                     {imageUrls.length} ảnh
                  </div>
               )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
               {cert.description}
            </p>
         </div>

         {/* Phần hiển thị ảnh */}
         {imageUrls.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
               {imageUrls.map((src, i) => (
                  <Dialog key={i}>
                     <DialogTrigger asChild>
                        <div className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg">
                           <img
                              src={src}
                              alt={`${cert.name} - ảnh ${i + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                           />
                           <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <ZoomIn className="w-6 h-6 text-white" />
                           </div>
                        </div>
                     </DialogTrigger>
                     <DialogContent className="max-w-3xl">
                        <DialogHeader>
                           <DialogTitle>
                              {cert.name} - Ảnh {i + 1}
                           </DialogTitle>
                        </DialogHeader>
                        <img
                           src={src}
                           alt={`${cert.name} - ảnh ${i + 1}`}
                           className="w-full h-auto object-contain rounded-lg max-h-[80vh]"
                        />
                     </DialogContent>
                  </Dialog>
               ))}
            </div>
         ) : (
            <div className="flex flex-col items-center justify-center text-center p-4 bg-muted rounded-lg">
               <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
               <p className="text-sm text-muted-foreground">
                  Không có ảnh chứng chỉ
               </p>
            </div>
         )}
      </div>
   );
};

export function TutorCertification({ tutor }: TutorCertificationProps) {
   return (
      <Card>
         <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <Award className="w-5 h-5 text-primary" />
               Certifications
            </CardTitle>
         </CardHeader>
         <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {(tutor.certifications || []).map((cert, index) => (
                  <CertificationCard key={cert._id ?? index} cert={cert} />
               ))}
            </div>
         </CardContent>
      </Card>
   );
}
