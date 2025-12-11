import {
   BarChart,
   Bar,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
   Cell,
   LabelList,
} from "recharts";

interface BarChartTutorProps {
   stats: {
      completed: number;
      notCompleted: number;
      cancelled: number;
      rejected: number;
   };
   selectedMonth?: number;
   selectedYear?: number;
   onMonthChange?: (month?: number) => void;
   onYearChange?: (year?: number) => void;
   onSearch?: () => void;
   onReset?: () => void;
}

export default function BarChartTutor({
   stats,
   selectedMonth,
   selectedYear,
   onMonthChange,
   onYearChange,
   onSearch,
   onReset,
}: BarChartTutorProps) {
   const data = [
      { name: "Hoàn thành", value: stats.completed, color: "#4CAF50" },
      { name: "Không hoàn thành", value: stats.notCompleted, color: "#FF9800" },
      { name: "Hủy", value: stats.cancelled, color: "#F44336" },
      { name: "Từ chối", value: stats.rejected, color: "#9C27B0" },
   ];

   const currentYear = new Date().getFullYear();
   const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

   return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
         <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold dark:text-white">
               Thống kê buổi học theo tháng/năm
            </h3>
            <div className="flex items-center gap-3">
               <div>
                  <label className="sr-only">Tháng</label>
                  <select
                     value={selectedMonth ?? ""}
                     onChange={(e) =>
                        onMonthChange?.(
                           e.target.value ? parseInt(e.target.value) : undefined
                        )
                     }
                     className="px-2 py-1 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                  >
                     <option value="">Tất cả</option>
                     {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                           {i + 1}
                        </option>
                     ))}
                  </select>
               </div>
               <div>
                  <label className="sr-only">Năm</label>
                  <select
                     value={selectedYear ?? ""}
                     onChange={(e) =>
                        onYearChange?.(
                           e.target.value ? parseInt(e.target.value) : undefined
                        )
                     }
                     className="px-2 py-1 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                  >
                     <option value="">Tất cả</option>
                     {years.map((y) => (
                        <option key={y} value={y}>
                           {y}
                        </option>
                     ))}
                  </select>
               </div>
               <button
                  onClick={onSearch}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
               >
                  Tìm kiếm
               </button>
               <button
                  onClick={onReset}
                  className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
               >
                  Reset
               </button>
            </div>
         </div>

         <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis dataKey="name" />
               <YAxis />

               <Tooltip formatter={(value: any) => [value, "Số lượng"]} />

               <Bar dataKey="value">
                  {/* show numeric counts inside the bar */}
                  <LabelList
                     dataKey="value"
                     position="insideTop"
                     fill="#fff"
                     fontSize={14}
                  />
                  {data.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
               </Bar>
            </BarChart>
         </ResponsiveContainer>
      </div>
   );
}
