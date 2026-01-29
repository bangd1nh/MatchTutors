import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  color?: "blue" | "green" | "yellow" | "red" | "purple" | "orange";
}

const colorClasses = {
  blue: "bg-blue-50 text-blue-600 border-blue-200",
  green: "bg-green-50 text-green-600 border-green-200",
  yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
  red: "bg-red-50 text-red-600 border-red-200",
  purple: "bg-purple-50 text-purple-600 border-purple-200",
  orange: "bg-orange-50 text-orange-600 border-orange-200",
};

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  color = "blue",
}) => {
  return (
    <div className={`rounded-xl p-6 border-2 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold mb-1">{value}</p>
          <p className="text-sm font-medium opacity-80">{label}</p>
        </div>
        <div className={`p-3 rounded-lg bg-white/50`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};
