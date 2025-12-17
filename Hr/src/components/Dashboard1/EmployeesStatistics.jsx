//  const data = [
//     { month: "Jan", value: 80, color: "#FF6B6B" },
//     { month: "Feb", value: 200, color: "#FF8E53" },
//     { month: "Mar", value: 160, color: "#FFC560" },
//     { month: "Apr", value: 250, color: "#FFD75D" },
//     { month: "May", value: 150, color: "#A3E059" },
//     { month: "Jun", value: 100, color: "#8DD84F" },
//     { month: "Jul", value: 270, color: "#47D043" },
//     { month: "Aug", value: 170, color: "#5CD3A8" },
//     { month: "Sep", value: 150, color: "#52D5E0" },
//     { month: "Oct", value: 180, color: "#6BB9F0" },
//     { month: "Nov", value: 205, color: "#4EA3F7" },
//     { month: "Dec", value: 210, color: "#3A91E8" }
//   ];

// function EmployeesStatistics(){
//   const maxValue = Math.max(...data.map(item => item.value));
//   const containerHeight = 130;

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-lg w-full">
//       <h2 className="text-lg font-semibold mb-6 text-blue-600">
//         Employee statistics of company
//       </h2>

//       <div className="flex items-end justify-between px-5 mx-auto" style={{ height: `${containerHeight}px` }}>
//         {data.map((item, index) => (
//           <div key={index} className="flex flex-col items-center gap-1">

//             {/* Bar */}
//             <p className='text-gray-600 text-sm'>{item.value}</p>
//             <div
//               className="w-10 rounded-md  hover:scale-101 shadow-2xl hover:shadow-gray-700 duration-700
//                cursor-pointer "
//               style={{
//                 height: `${(item.value / maxValue) * containerHeight}px`,
//                 backgroundColor: item.color
//               }}
//             ></div>

//             {/* Label */}
//             <span className="text-xs text-gray-600">{item.month}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };


// export default EmployeesStatistics

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useEffect, useState } from "react";

const data = [
  { month: "Jan", hires: 25, attrition: 10, growth: 15 },
  { month: "Feb", hires: 140, attrition: 20, growth: 120 },
  { month: "Mar", hires: 80, attrition: 40, growth: 40 },
  { month: "Apr", hires: 120, attrition: 30, growth: 90 },
  { month: "May", hires: 200, attrition: 50, growth: 150 },
  { month: "Jun", hires: 30, attrition: 70, growth: -40 },
  { month: "Jul", hires: 160, attrition: 40, growth: 120 },
  { month: "Aug", hires: 90, attrition: 60, growth: 30 },
  { month: "Sep", hires: 70, attrition: 50, growth: 20 },
  { month: "Oct", hires: 110, attrition: 40, growth: 70 },
  { month: "Nov", hires: 130, attrition: 25, growth: 105 },
  { month: "Dec", hires: 120, attrition: 15, growth: 105 }
];

export default function HiringStatsChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Ensure we only render the responsive chart after mount to avoid zero width/height warnings
    setMounted(true);
  }, []);
  return (
    <div className="w-full h-[400px] bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">
          Monthly Hiring & Attrition
        </h2>
        <p className="text-sm text-gray-500">Overview of employee movement across the year</p>
      </div>

      {mounted && (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#E6E6E6" strokeDasharray="3 3" />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />

            <Tooltip
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              itemStyle={{ fontSize: '12px' }}
            />

            <Legend
              wrapperStyle={{ paddingTop: '30px', paddingBottom: '10px' }}
              iconType="circle"
              align="center"
              verticalAlign="bottom"
            />

            <Line
              type="monotone"
              dataKey="hires"
              stroke="#2563eb" // Blue-600
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
              name="New Hires"
            />

            <Line
              type="monotone"
              dataKey="attrition"
              stroke="#ef4444" // Red-500
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
              name="Attrition"
            />

            <Line
              type="monotone"
              dataKey="growth"
              stroke="#10b981" // Green-500
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
              name="Net Growth"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}