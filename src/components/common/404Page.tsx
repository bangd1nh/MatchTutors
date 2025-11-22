import React from "react";

const NotFoundPage: React.FC = () => {
   return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
         <div className="text-center p-8">
            <div className="text-9xl font-light text-slate-400 mb-4">404</div>
            <h1 className="text-3xl font-light text-slate-700 mb-2">
               Trang không tìm thấy
            </h1>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
               Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển. Hãy
               kiểm tra lại đường dẫn.
            </p>
            <button
               onClick={() => (window.location.href = "/")}
               className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200"
            >
               Về trang chủ
            </button>
         </div>
      </div>
   );
};

export default NotFoundPage;
