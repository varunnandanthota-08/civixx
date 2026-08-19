'use client';

import { CitizenGrievance } from '@/lib/types';
import { isSlaExpired } from '@/lib/citizenStorage';
import { CheckCircle2, Star } from 'lucide-react';
import { useState } from 'react';

export function FeedbackPanel({ grievance, onSubmit }: { grievance: CitizenGrievance; onSubmit: (rating: number, comment: string) => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const unlocked = isSlaExpired(grievance);

  if (grievance.feedbackSubmittedAt) {
    return <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-sm text-emerald-300 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Thank you for helping improve public services.</div>;
  }

  return (
    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
      <div className="flex items-center justify-between gap-3 mb-3"><span className="text-sm font-bold text-slate-200">Feedback</span><span className={`text-xs font-semibold ${unlocked ? 'text-emerald-400' : 'text-slate-500'}`}>{unlocked ? 'Feedback available' : 'Locked until SLA expires'}</span></div>
      <div className="flex gap-1 mb-3" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" disabled={!unlocked} onClick={() => setRating(value)} aria-label={`${value} stars`} className="disabled:opacity-30"><Star className={`w-5 h-5 ${value <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} /></button>)}
      </div>
      <textarea value={comment} onChange={(event) => setComment(event.target.value)} disabled={!unlocked} rows={2} placeholder={unlocked ? 'Optional comment' : 'Feedback becomes available after the suggested SLA'} className="w-full rounded-lg bg-slate-900 border border-slate-800 p-3 text-xs text-slate-200 disabled:opacity-50" />
      <button type="button" disabled={!unlocked || rating === 0} onClick={() => onSubmit(rating, comment)} className="mt-3 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white disabled:opacity-40">Submit Feedback</button>
    </div>
  );
}
