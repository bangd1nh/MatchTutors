import { useTutorProfile } from "@/hooks/useTutorProfile";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export const TutorCommitmentActions = () => {
   // Hook này chỉ được gọi khi component này được render (tức là khi user là tutor)
   const { tutorProfile } = useTutorProfile();

   // Chỉ hiển thị nút nếu gia sư đã được phê duyệt
   if (!tutorProfile?.isApproved) {
      return null;
   }

   return (
      <Link to="/tutor/commitments/create" className="flex-shrink-0">
         <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all">
            <Plus className="w-5 h-5 mr-2" />
            Tạo Cam Kết
         </Button>
      </Link>
   );
};
