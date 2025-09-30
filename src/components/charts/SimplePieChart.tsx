import {
   PieChart,
   Pie,
   Cell,
   ResponsiveContainer,
   Tooltip,
   Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
   { name: "Group A", value: 400 },
   { name: "Group B", value: 300 },
   { name: "Group C", value: 300 },
   { name: "Group D", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const SimplePieChart = () => {
   return (
      <Card className="w-full">
         <CardHeader>
            <CardTitle>Simple Pie Chart</CardTitle>
         </CardHeader>
         <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                  <Pie
                     data={data}
                     cx="50%"
                     cy="50%"
                     labelLine={false}
                     outerRadius={80}
                     fill="#8884d8"
                     dataKey="value"
                  >
                     {data.map((entry, index) => (
                        <Cell
                           key={`cell-${index}`}
                           fill={COLORS[index % COLORS.length]}
                        />
                     ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
               </PieChart>
            </ResponsiveContainer>
         </CardContent>
      </Card>
   );
};

export default SimplePieChart;
