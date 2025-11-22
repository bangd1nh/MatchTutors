import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
   BookOpen,
   Calendar,
   DollarSign,
   Search,
   Users,
   CheckCircle,
   Star,
   MessageCircle,
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
      icon: <BookOpen className="h-8 w-8 text-sky-600" />,
      title: "Tài liệu & Bài tập",
      description:
         "Dễ dàng chia sẻ tài liệu, giao và chấm bài tập để nâng cao chất lượng dạy và học.",
   },
];

const testimonials = [
   {
      name: "Mai Anh",
      role: "Học sinh lớp 12",
      quote: "Nhờ TutorMatch tôi tìm được gia sư phù hợp, điểm số tăng rõ rệt. Giao diện trực quan, dễ sử dụng!",
      rating: 5,
   },
   {
      name: "Hoàng Nam",
      role: "Gia sư",
      quote: "Quản lý lịch và học viên tiện lợi, tích hợp thanh toán giúp công việc chuyên nghiệp hơn.",
      rating: 5,
   },
   {
      name: "Linh Trang",
      role: "Phụ huynh",
      quote: "Tính năng báo cáo tiến bộ và chia sẻ bài tập rất hữu ích, con tôi tiến bộ rõ rệt.",
      rating: 4,
   },
];

const faqs = [
   {
      q: "Làm sao để tìm gia sư phù hợp?",
      a: "Sử dụng bộ lọc thông minh: môn học, cấp độ, khoảng giá và review giúp bạn thu hẹp lựa chọn chính xác.",
   },
   {
      q: "TutorMatch hỗ trợ thanh toán như thế nào?",
      a: "Hệ thống thanh toán nội bộ an toàn, hỗ trợ nhiều phương thức và lịch sử giao dịch rõ ràng.",
   },
   {
      q: "Tôi có thể quản lý lớp và tài liệu không?",
      a: "Có — bạn có thể tạo lịch, gán bài tập, upload tài liệu và theo dõi tiến độ học sinh.",
   },
];

const statsData = [
   { label: "Gia sư", value: 1250 },
   { label: "Buổi học mỗi tháng", value: 4300 },
   { label: "Học viên đang hoạt động", value: 8900 },
];

const MidPage = () => {
   const [openFaq, setOpenFaq] = useState<number | null>(null);
   const [counters, setCounters] = useState(() => statsData.map(() => 0));

   useEffect(() => {
      // animate counters once when visible
      let mounted = true;
      statsData.forEach((s, i) => {
         const duration = 900;
         const start = Date.now();
         const step = () => {
            if (!mounted) return;
            const elapsed = Date.now() - start;
            const progress = Math.min(1, elapsed / duration);
            const value = Math.round(progress * s.value);
            setCounters((prev) => {
               const next = [...prev];
               next[i] = value;
               return next;
            });
            if (progress < 1) {
               requestAnimationFrame(step);
            }
         };
         requestAnimationFrame(step);
      });

      return () => {
         mounted = false;
      };
   }, []);

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
               {features.slice(0, 3).map((feature) => (
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

            {features.length > 3 && (
               <div className="mt-8 lg:mt-10 flex flex-col items-center gap-8">
                  <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                     <div className="flex flex-wrap justify-center gap-8">
                        {features.slice(3).map((feature) => (
                           <Card
                              key={feature.title}
                              className="w-full max-w-md bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
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
                  </div>
               </div>
            )}

            {/* Quick Stats */}
            <div className="mt-16 bg-gradient-to-r from-white dark:from-slate-900 to-sky-50 dark:to-slate-900 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
               <div className="md:flex-1">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                     Kết quả thực tế
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-prose">
                     Những con số cho thấy TutorMatch giúp kết nối và tối ưu
                     trải nghiệm dạy & học.
                  </p>
               </div>
               <div className="flex items-center gap-8 md:gap-12">
                  {statsData.map((s, i) => (
                     <div key={s.label} className="text-center">
                        <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                           {counters[i].toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                           {s.label}
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* How it works */}
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="inline-flex items-center gap-3">
                     <div className="p-2 rounded-md bg-indigo-600 text-white">
                        <CheckCircle className="h-5 w-5" />
                     </div>
                     <div>
                        <div className="text-sm font-semibold text-slate-800 dark:text-white">
                           Tạo hồ sơ
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                           Thiết lập thông tin và chuyên môn trong vài phút.
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="inline-flex items-center gap-3">
                     <div className="p-2 rounded-md bg-sky-600 text-white">
                        <MessageCircle className="h-5 w-5" />
                     </div>
                     <div>
                        <div className="text-sm font-semibold text-slate-800 dark:text-white">
                           Kết nối & Thảo luận
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                           Chat, đặt lịch và thỏa thuận trực tiếp với gia sư/học
                           viên.
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="inline-flex items-center gap-3">
                     <div className="p-2 rounded-md bg-emerald-600 text-white">
                        <Star className="h-5 w-5" />
                     </div>
                     <div>
                        <div className="text-sm font-semibold text-slate-800 dark:text-white">
                           Dạy & Tiến bộ
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                           Theo dõi tiến độ, phản hồi và cải thiện liên tục.
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Testimonials */}
            <div className="mt-16">
               <div className="text-center">
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                     Ý kiến người dùng
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                     Người dùng thực sự nói gì về TutorMatch
                  </p>
               </div>

               <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {testimonials.map((t) => (
                     <Card
                        key={t.name}
                        className="p-6 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                     >
                        <div className="flex items-start gap-4">
                           <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center font-semibold uppercase">
                              {t.name
                                 .split(" ")
                                 .map((s) => s[0])
                                 .slice(-2)
                                 .join("")}
                           </div>
                           <div className="flex-1">
                              <div className="flex items-center justify-between gap-4">
                                 <div>
                                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                       {t.name}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                       {t.role}
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-1 text-amber-400">
                                    {Array.from({ length: t.rating }).map(
                                       (_, i) => (
                                          <Star key={i} className="h-4 w-4" />
                                       )
                                    )}
                                 </div>
                              </div>

                              <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                                 "{t.quote}"
                              </div>
                           </div>
                        </div>
                     </Card>
                  ))}
               </div>
            </div>

            {/* FAQ */}
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
               <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                     Câu hỏi thường gặp
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                     Những câu hỏi hay gặp — trả lời nhanh
                  </p>

                  <div className="mt-6 space-y-3">
                     {faqs.map((f, i) => (
                        <div
                           key={f.q}
                           className="border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden"
                        >
                           <button
                              onClick={() =>
                                 setOpenFaq(openFaq === i ? null : i)
                              }
                              className="w-full text-left px-4 py-3 flex justify-between items-center bg-white dark:bg-slate-900"
                           >
                              <div>
                                 <div className="font-semibold text-slate-800 dark:text-white">
                                    {f.q}
                                 </div>
                              </div>
                              <div className="text-slate-400">
                                 {openFaq === i ? "-" : "+"}
                              </div>
                           </button>
                           {openFaq === i && (
                              <div className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800">
                                 {f.a}
                              </div>
                           )}
                        </div>
                     ))}
                  </div>
               </div>

               {/* Final CTA */}
               <div className="p-8 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
                  <div className="flex flex-col gap-4">
                     <div>
                        <h4 className="text-lg font-bold">Sẵn sàng bắt đầu?</h4>
                        <p className="text-sm opacity-90 mt-1">
                           Tạo tài khoản miễn phí, tìm gia sư phù hợp và bắt đầu
                           buổi học đầu tiên.
                        </p>
                     </div>

                     <div className="mt-4 flex flex-col sm:flex-row gap-3">
                        <Link to="/register">
                           <Button
                              size="lg"
                              className="bg-white text-indigo-700"
                           >
                              Đăng ký ngay
                           </Button>
                        </Link>
                        <Link
                           to="/tutor-list"
                           className="text-sm text-white/90 hover:underline flex items-center gap-2"
                        >
                           Khám phá gia sư
                        </Link>
                     </div>

                     <div className="mt-4 flex items-center gap-3 text-sm opacity-90">
                        <div className="inline-flex p-2 rounded bg-white/10">
                           <CheckCircle className="h-5 w-5" />
                        </div>
                        Bảo mật & Hỗ trợ 24/7
                     </div>
                  </div>
               </div>
            </div>

            {/* Small footer-ish hint */}
            <div className="mt-16 text-center text-sm text-slate-500 dark:text-slate-400">
               <div>
                  Hãy thử TutorMatch — Hỗ trợ mọi mức trình độ và mục tiêu học
                  tập.
               </div>
            </div>
         </div>
      </section>
   );
};

export default MidPage;
