interface Feature {
   id: string;
   label: string;
   title: string;
   description: string;
   image: string;
   imageAlt: string;
   benefits: string[];
}

export default function Features() {
   const features: Feature[] = [
      {
         id: "search",
         label: "Tìm kiếm",
         title: "Tìm kiếm hiệu quả",
         description:
            "Tìm kiếm đúng gia sư mà học sinh muốn, dễ dàng kết nối và tăng chất lượng",
         image: "/search.png",
         imageAlt: "Communication between tutor and student",
         benefits: [
            "Dễ dàng tìm kiếm với bộ lọc nâng cao với nhiều tiêu chí khác nhau",
            "Sử dụng AI cho việc tìm kiếm phù hợp theo ngữ cảnh người dùng muốn",
         ],
      },
      {
         id: "teaching",
         label: "Gửi yêu cầu dạy học",
         title: "Gửi lời mời cho gia sư",
         description: "Gửi lời mời dạy học kèm theo mong muốn của học sinh ",
         image: "/teaching.png",
         imageAlt: "Interactive learning sessions",
         benefits: [
            "Tạo hồ sơ nhanh chóng và gửi tới gia sư dễ dàng",
            "Đính kèm mong muốn, nguyện vọng khi học ",
            "Gia sư dễ dàng nắm bắt được tình hình",
         ],
      },
      {
         id: "quiz",
         label: "Tạo bài tập và tài liệu",
         title: "Bài kiểm tra & tài liệu",
         description:
            "Tạo và làm bài kiểm tra phong phú, hệ thống chấm điểm và thống kê kết quả tự động.",
         image: "/quiz.png",
         imageAlt: "Quiz and assessment tools",
         benefits: [
            "Bài kiểm tra đa dạng (trắc nghiệm, tự luận)",
            "Chấm điểm tự động và báo cáo",
            "Phân tích kết quả chi tiết",
            "Quản lý tài liệu theo từng buổi học",
         ],
      },
      {
         id: "ai-quiz",
         label: "Quiz AI",
         title: "Bài kiểm tra thông minh bằng AI",
         description:
            "Sinh đề bằng AI — giúp gia sư tiết kiệm thời gian và đa dạng câu hỏi",
         image: "/aiquiz.png",
         imageAlt: "AI-powered quizzes",
         benefits: [
            "Sinh đề tự động theo tài liệu",
            "Chấm điểm và phân tích kết quả theo gia sư mong muốn",
            "Bài tập cá nhân hóa cho từng học sinh",
         ],
      },
      {
         id: "review",
         label: "Đánh giá & Nhận xét",
         title: "Hệ thống đánh giá minh bạch",
         description:
            "Học viên có thể đánh giá và gửi nhận xét về buổi dạy; gia sư nhận phản hồi giúp cải tiến chất lượng giảng dạy.",
         image: "/review.png",
         imageAlt: "Reviews and ratings",
         benefits: [
            "Xếp hạng và nhận xét minh bạch",

            "Thống kê đánh giá theo thời gian",
         ],
      },
      {
         id: "scheduling",
         label: "Lịch học",
         title: "Quản lý lịch học thông minh",
         description: "Đặt lịch và quản lý buổi học dễ dàng",
         image: "/calendar.png",
         imageAlt: "Schedule management",
         benefits: [
            "Đặt lịch linh hoạt theo nhu cầu",

            "Quản lý lịch với nhiều thông tin đính kèm",
            "Minh bạch khi điểm danh",
         ],
      },
      {
         id: "payments",
         label: "Thanh toán",
         title: "Thanh toán & quản lý ví an toàn",
         description:
            "Quản lý thanh toán, nạp/rút tiền và theo dõi lịch sử giao dịch một cách an toàn và minh bạch.",
         image: "/money.png",
         imageAlt: "Payment and wallet management",
         benefits: [
            "Thanh toán an toàn, bảo mật",
            "Ví học viên và lịch sử giao dịch",
            "Hỗ trợ nạp/rút nhanh chóng",
         ],
      },
   ];

   return (
      <section className="py-16 px-4 bg-white">
         <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
               <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Tính Năng Nổi Bật
               </h2>
               <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Nền tảng dạy học trực tuyến toàn diện với các công cụ hiện đại
               </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
               {features.map((feature, index) => (
                  <div
                     key={feature.id}
                     className={`flex flex-col ${
                        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                     } items-center gap-8`}
                  >
                     {/* Image */}
                     <div className="flex-1 flex justify-center">
                        <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                           <img
                              src={feature.image}
                              alt={feature.imageAlt}
                              className="w-full h-full object-cover"
                           />
                        </div>
                     </div>

                     {/* Content */}
                     <div className="flex-1 flex flex-col justify-center">
                        <div className="inline-flex items-center mb-3">
                           <div className="w-1 h-8 bg-blue-500 rounded mr-3"></div>
                           <span className="text-sm font-semibold text-blue-500 uppercase tracking-wider">
                              {feature.label}
                           </span>
                        </div>

                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                           {feature.title}
                        </h3>

                        <p className="text-gray-600 leading-relaxed mb-6">
                           {feature.description}
                        </p>

                        <ul className="space-y-2 text-gray-600">
                           {feature.benefits.map((b, i) => (
                              <li key={i} className="flex items-center text-sm">
                                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></span>
                                 {b}
                              </li>
                           ))}
                        </ul>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}
