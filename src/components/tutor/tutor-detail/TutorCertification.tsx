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
    <div className="flex flex-col gap-4 rounded-xl bg-muted/40 p-6 transition-colors hover:bg-muted">
      {/* Phần thông tin text */}
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-lg text-foreground">{cert.name}</h4>
          {imageUrls.length > 0 && (
            <div className="text-xs font-medium bg-card text-card-foreground px-2 py-1 rounded-md border border-border">
              {imageUrls.length} ảnh
            </div>
          )}
        </div>
        {cert.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
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
                <div className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg bg-card border border-border">
                  <img
                    src={src}
                    alt={`${cert.name} - ảnh ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <ZoomIn className="w-5 h-5 text-foreground drop-shadow-lg" />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="text-foreground">
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
        <div className="flex flex-col items-center justify-center text-center p-6 bg-card text-card-foreground rounded-lg border border-dashed border-border">
          <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Chưa có ảnh chứng chỉ</p>
        </div>
      )}
    </div>
  );
};

export function TutorCertification({ tutor }: TutorCertificationProps) {
  const certs = tutor.certifications || [];

  return (
    <Card className="bg-card text-card-foreground border border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-medium">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-muted text-muted-foreground">
            <Award className="w-4 h-4" />
          </div>
          Chứng chỉ & Bằng cấp
        </CardTitle>
      </CardHeader>
      <CardContent>
        {certs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {certs.map((cert, index) => (
              <CertificationCard key={cert._id ?? index} cert={cert} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground italic">
            Chưa có thông tin chứng chỉ.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
