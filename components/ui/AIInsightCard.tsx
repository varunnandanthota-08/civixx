import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface AIInsightCardProps {
  title?: string;
  confidenceScore?: number;
  reasoningPoints?: string[];
  explanation?: string;
  badgeText?: string;
  className?: string;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  title = 'Why this priority?',
  confidenceScore,
  reasoningPoints,
  explanation,
  badgeText = 'AI Insight',
  className = ''
}) => {
  return (
    <div className={`p-5 rounded-xl bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-slate-900 border border-indigo-500/30 relative overflow-hidden shadow-lg shadow-indigo-950/20 ${className}`}>
      {/* Background ambient glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            <Sparkles className="w-4 h-4 text-indigo-300" />
          </div>
          <h4 className="text-sm font-bold tracking-wide text-slate-100">{title}</h4>
        </div>
        
        <div className="flex items-center gap-2">
          {confidenceScore !== undefined && (
            <span className="px-2 py-0.5 text-xs font-mono font-semibold text-indigo-300 bg-indigo-900/60 border border-indigo-700/50 rounded-md">
              AI Confidence: {confidenceScore}%
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 rounded-full">
            ✦ {badgeText}
          </span>
        </div>
      </div>

      {explanation && (
        <p className="text-sm text-slate-300 leading-relaxed font-normal bg-slate-950/40 p-3.5 rounded-lg border border-slate-800/80 mb-3">
          {explanation}
        </p>
      )}

      {reasoningPoints && reasoningPoints.length > 0 && (
        <div className="space-y-2 mt-3">
          {reasoningPoints.map((point, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/40 px-3 py-2 rounded-md border border-slate-800/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
