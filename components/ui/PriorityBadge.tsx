import React from 'react';

interface PriorityBadgeProps {
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | string;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md', showPulse = true }) => {
  const p = priority.toUpperCase();

  let colors = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let dotColor = 'bg-emerald-400';

  if (p === 'CRITICAL') {
    colors = 'bg-red-500/15 text-red-400 border-red-500/40 shadow-sm shadow-red-950/50';
    dotColor = 'bg-red-500';
  } else if (p === 'HIGH') {
    colors = 'bg-orange-500/15 text-orange-400 border-orange-500/40 shadow-sm shadow-orange-950/50';
    dotColor = 'bg-orange-500';
  } else if (p === 'MEDIUM') {
    colors = 'bg-amber-500/15 text-amber-400 border-amber-500/40';
    dotColor = 'bg-amber-400';
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold tracking-wider rounded-md border',
    md: 'px-2.5 py-1 text-xs font-bold tracking-wider rounded-lg border',
    lg: 'px-3.5 py-1.5 text-sm font-extrabold tracking-widest rounded-xl border-2'
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 uppercase ${sizeClasses} ${colors}`}>
      <span className="relative flex h-2 w-2">
        {showPulse && (p === 'CRITICAL' || p === 'HIGH') && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-75`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
      </span>
      {p}
    </span>
  );
};
