import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
   BookOpen,
   Calendar,
   DollarSign,
   Search,
   Users,
   Video,
} from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const features = [
   {
      icon: <Search className="h-8 w-8 text-sky-600" />,
      title: "Tìm kiếm thông minh",
      description:
         "Dễ dàng tìm kiếm gia sư hoặc học viên phù hợp với nhu cầu của bạn bằng bộ lọc nâng cao.",
   },
   {
      icon: <Calendar className="h-8 w-8 text-sky-600" />,
      title: "Quản lý lịch học",
      description:
         "Tạo và quản lý lịch học một cách trực quan, không bao giờ bỏ lỡ một buổi học nào.",
   },
   {
      icon: <Users className="h-8 w-8 text-sky-600" />,
      title: "Nâng cao hiệu quả",
      description:
         "Dùng AI để nâng cao chất lượng dạy và học, đưa ra lời khuyên hữu ích.",
   },
   {
      icon: <DollarSign className="h-8 w-8 text-sky-600" />,
      title: "Thanh toán tiện lợi",
      description:
         "Hệ thống thanh toán tích hợp, an toàn và minh bạch cho cả gia sư và học viên.",
   },
   {
      icon: <Video className="h-8 w-8 text-sky-600" />,
      title: "Đồng hành học sinh",
      description:
         "Liên kết với phụ huynh để đồng hành cùng con trên từng môn học.",
   },
   {
      icon: <BookOpen className="h-8 w-8 text-sky-600" />,
      title: "Tài liệu & Bài tập",
      description:
         "Dễ dàng chia sẻ tài liệu, giao và chấm bài tập để nâng cao chất lượng dạy và học.",
   },
];

const MidPage = () => {
   return (
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-950">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12">
               <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
                  Tại sao chọn TutorMatch?
               </h2>
               <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                  Những công cụ mạnh mẽ giúp việc dạy và học trở nên hiệu quả
                  hơn bao giờ hết.
               </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
               {features.map((feature) => (
                  <Card
                     key={feature.title}
                     className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                     <CardHeader className="flex flex-row items-center gap-4">
                        {feature.icon}
                        <CardTitle className="text-slate-800 dark:text-slate-100">
                           {feature.title}
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="text-slate-600 dark:text-slate-400">
                        {feature.description}
                     </CardContent>
                  </Card>
               ))}
            </div>

            {/* Image and CTA Section */}
            <div className="mt-20 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
               <div className="order-last lg:order-first">
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
                     Nền tảng linh hoạt cho mọi quy mô
                  </h2>
                  <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                     Dù bạn là một học sinh hay một gia sư, TutorMatch đều có
                     giải pháp phù hợp để giúp bạn phát triển và quản lý hiệu
                     quả.
                  </p>
                  <div className="mt-8">
                     <Link to="/register">
                        <Button
                           size="lg"
                           className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md hover:opacity-95 transition"
                        >
                           Bắt đầu ngay hôm nay
                        </Button>
                     </Link>
                  </div>
               </div>
               <div className="flex justify-center items-center p-8 bg-sky-100 dark:bg-slate-800 rounded-2xl">
                  <img
                     src="/tutor.png"
                     alt="TutorMatch Platform"
                     className="w-full max-w-sm h-auto object-contain rounded-lg"
                  />
               </div>
            </div>
         </div>
      </section>
   );
};

export default MidPage;
