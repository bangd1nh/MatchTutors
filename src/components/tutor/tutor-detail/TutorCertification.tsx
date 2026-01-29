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
      <div className="flex flex-col gap-4 rounded-xl border-0 bg-gray-50 p-6 transition-all hover:bg-gray-100">
         {/* Phần thông tin text */}
         <div className="flex-grow">
            <div className="flex justify-between items-start mb-2">
               <h4 className="font-medium text-lg text-gray-900">
                  {cert.name}
               </h4>
               {imageUrls.length > 0 && (
                  <div className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded-md border">
                     {imageUrls.length} ảnh
                  </div>
               )}
            </div>
            {cert.description && (
               <p className="text-sm text-gray-600 leading-relaxed">
                  {cert.description}
               </p>
            )}
         </div>

         {/* Phần hiển thị ảnh */}
         {imageUrls.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
               {imageUrls.map((src, i) => (
                  <Dialog key={i}>
                     <DialogTrigger asChild>
                        <div className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg bg-white border">
                           <img
                              src={src}
                              alt={`${cert.name} - ảnh ${i + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                           />
                           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                              <ZoomIn className="w-5 h-5 text-white drop-shadow-lg" />
                           </div>
                        </div>
                     </DialogTrigger>
                     <DialogContent className="max-w-3xl">
                        <DialogHeader>
                           <DialogTitle className="text-gray-900">
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
            <div className="flex flex-col items-center justify-center text-center p-6 bg-white rounded-lg border border-dashed border-gray-300">
               <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
               <p className="text-sm text-gray-500">Chưa có ảnh chứng chỉ</p>
            </div>
         )}
      </div>
   );
};

export function TutorCertification({ tutor }: TutorCertificationProps) {
   return (
      <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
         <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-medium text-sky-800">
               <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-sky-600" />
               </div>
               Chứng chỉ & Bằng cấp
            </CardTitle>
         </CardHeader>
         <CardContent>
            {(tutor.certifications || []).length > 0 ? (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {(tutor.certifications || []).map((cert, index) => (
                     <CertificationCard key={cert._id ?? index} cert={cert} />
                  ))}
               </div>
            ) : (
               <p className="text-gray-500 italic">
                  Chưa có thông tin chứng chỉ.
               </p>
            )}
         </CardContent>
      </Card>
   );
}
