import React from 'react';
import { Droplet, HardHat, Trash2, Zap, ShieldAlert, Waves } from 'lucide-react';

interface DepartmentBadgeProps {
  category: string;
}

export const DepartmentBadge: React.FC<DepartmentBadgeProps> = ({ category }) => {
  let icon = <Droplet className="w-3.5 h-3.5 text-blue-400" />;
  let badgeStyle = 'bg-blue-950/60 text-blue-300 border-blue-800/50';

  if (category.includes('Road')) {
    icon = <HardHat className="w-3.5 h-3.5 text-orange-400" />;
    badgeStyle = 'bg-amber-950/60 text-amber-300 border-amber-800/50';
  } else if (category.includes('Waste') || category.includes('Sanitation')) {
    icon = <Trash2 className="w-3.5 h-3.5 text-yellow-400" />;
    badgeStyle = 'bg-yellow-950/60 text-yellow-300 border-yellow-800/50';
  } else if (category.includes('Electricity') || category.includes('Power')) {
    icon = <Zap className="w-3.5 h-3.5 text-purple-400" />;
    badgeStyle = 'bg-purple-950/60 text-purple-300 border-purple-800/50';
  } else if (category.includes('Safety')) {
    icon = <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />;
    badgeStyle = 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50';
  } else if (category.includes('Drainage')) {
    icon = <Waves className="w-3.5 h-3.5 text-cyan-400" />;
    badgeStyle = 'bg-cyan-950/60 text-cyan-300 border-cyan-800/50';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border ${badgeStyle}`}>
      {icon}
      <span>{category}</span>
    </span>
  );
};
