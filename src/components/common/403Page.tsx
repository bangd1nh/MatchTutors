import React from "react";

const ForbiddenPage: React.FC = () => {
   return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
         <div className="text-center p-8">
            <div className="text-9xl font-light text-slate-400 mb-4">403</div>
            <h1 className="text-3xl font-light text-slate-700 mb-2">
               Truy cập bị từ chối
            </h1>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
               Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản
               trị viên nếu bạn nghĩ đây là lỗi.
            </p>
            <button
               onClick={() => window.history.back()}
               className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200"
            >
               Quay lại
            </button>
         </div>
      </div>
   );
};

export default ForbiddenPage;
