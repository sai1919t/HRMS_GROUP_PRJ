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
import axios from "axios";

export default function HiringStatsChart() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Using axios direct call or we could make a service. Direct for now.
      const baseUrl = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
      const token = localStorage.getItem('token');
      const res = await axios.get(`${baseUrl}/api/dashboard/stats`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });

      if (res.data.success) {
        // Calculate growth if needed, or mapping. 
        // Backend sends: month, hires, attrition, job_views, job_applied
        const mappedData = res.data.data.map(item => ({
          ...item,
          growth: item.hires - item.attrition
        }));
        setData(mappedData);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[400px] bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">
          Monthly Hiring, Attrition & Recruitment
        </h2>
        <p className="text-sm text-gray-500">Overview of employee movement and recruitment activity</p>
      </div>

      {mounted && !loading && (
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