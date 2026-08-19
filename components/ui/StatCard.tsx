import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  iconBgColor?: string;
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  isPositive = true,
  icon: Icon,
  iconBgColor = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  highlight = false
}) => {
  return (
    <div
      className={`relative p-5 rounded-xl border transition-all duration-300 ${
        highlight
          ? 'bg-gradient-to-b from-indigo-950/40 via-slate-900/90 to-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-950/30'
          : 'bg-slate-900/80 backdrop-blur-md border-slate-800/80 hover:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        <div className={`p-2.5 rounded-lg border ${iconBgColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-3xl font-extrabold tracking-tight text-slate-100">{value}</span>
        {trend && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-md ${
              isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      {subtitle && <p className="mt-1 text-xs text-slate-400 font-medium">{subtitle}</p>}
    </div>
  );
};
