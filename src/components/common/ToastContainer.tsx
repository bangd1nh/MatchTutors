import { useToastStore } from "@/store/useToastStore";

const getToastClasses = (type: string) => {
   switch (type) {
      case "success":
         return "bg-green-500 text-white";
      case "error":
         return "bg-red-500 text-white";
      case "info":
         return "bg-blue-500 text-white";
      case "warning":
         return "bg-yellow-400 text-black";
      default:
         return "bg-gray-800 text-white";
   }
};

const ToastContainer = () => {
   const { toasts, removeToast } = useToastStore();

   return (
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 w-80">
         {toasts.map((toast) => (
            <div
               key={toast.id}
               className={`relative animate-slide-in flex items-start gap-3 p-4 rounded-lg shadow-md ${getToastClasses(
                  toast.type
               )}`}
            >
               <span className="flex-1 text-sm">{toast.message}</span>
               <button
                  onClick={() => removeToast(toast.id)}
                  className="text-xl font-bold leading-none hover:opacity-70"
               >
                  &times;
               </button>

               {/* Timer bar */}
               <div
                  className="absolute bottom-0 left-0 h-1 bg-white/50"
                  style={{
                     width: "100%",
                     animation: `shrink 5000ms linear forwards`,
                  }}
               />
            </div>
         ))}
      </div>
   );
};

export default ToastContainer;
