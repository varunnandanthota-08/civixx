import React from 'react';

interface SeverityIndicatorProps {
  label: string;
  score: number; // 1-10
  maxScore?: number;
  highlight?: boolean;
}

export const SeverityIndicator: React.FC<SeverityIndicatorProps> = ({
  label,
  score,
  maxScore = 10,
  highlight = false
}) => {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));

  let barColor = 'bg-emerald-500';
  let textColor = 'text-emerald-400';

  if (score >= 8) {
    barColor = 'bg-red-500 shadow-sm shadow-red-500/50';
    textColor = 'text-red-400 font-bold';
  } else if (score >= 6) {
    barColor = 'bg-orange-500';
    textColor = 'text-orange-400';
  } else if (score >= 4) {
    barColor = 'bg-amber-400';
    textColor = 'text-amber-300';
  }

  return (
    <div className={`p-3 rounded-lg border ${highlight ? 'bg-slate-900/90 border-slate-700/80' : 'bg-slate-950/50 border-slate-800/60'}`}>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="font-semibold text-slate-300">{label}</span>
        <span className={`font-mono text-xs ${textColor}`}>
          {score}/{maxScore}
        </span>
      </div>
      <div className="w-full bg-slate-800/90 h-2 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
