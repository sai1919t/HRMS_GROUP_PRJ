import React from "react";
import { ArrowUpRight, ArrowDownRight, Users, Eye, FileText, UserMinus } from "lucide-react";

export default function StatsCards({ stats }) {
  // Safe defaults if stats is null (loading)
  const totalEmployees = stats?.totalEmployees ?? 0;
  const jobViews = stats?.jobViews ?? 0;
  const jobApplications = stats?.jobApplications ?? 0;
  const resignedEmployees = stats?.resignedEmployees ?? 0;

  // We don't have historical data for "change" percentage yet, so I'll leave placeholders or remove them.
  // For now, I'll remove the specific percentage pills or set them to 0% to be neutral, 
  // as calculating growth requires historical snapshots which we just added support for in dashboard_stats table but haven't fully implemented querying yet.

  const cards = [
    {
      title: "Total Employees",
      value: totalEmployees,
      label: "active employees",
      icon: <Users size={20} className="text-blue-600" />,
      bg: "bg-blue-50"
    },
    {
      title: "Job Views",
      value: jobViews,
      label: "total views",
      icon: <Eye size={20} className="text-indigo-600" />,
      bg: "bg-indigo-50"
    },
    {
      title: "Job Applied",
      value: jobApplications,
      label: "total applications",
      icon: <FileText size={20} className="text-emerald-600" />,
      bg: "bg-emerald-50"
    },
    {
      title: "Resigned Employees",
      value: resignedEmployees,
      label: "resigned employees",
      icon: <UserMinus size={20} className="text-orange-600" />,
      bg: "bg-orange-50"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
            <div className={`p-2 rounded-lg ${card.bg}`}>
              {card.icon}
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">
            {card.value.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1 capitalize">
            {card.label}
          </p>
        </div>
      ))}
    </div>
  );
}