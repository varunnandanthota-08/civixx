'use client';

import { CitizenGrievance } from '@/lib/types';
import { getSlaStatus } from '@/lib/citizenStorage';
import { CheckCircle2, Circle, Clock3 } from 'lucide-react';

export function ResolutionTimeline({ grievance }: { grievance: CitizenGrievance }) {
  return (
    <div className="space-y-0">
      {grievance.history.map((event, index) => (
        <div key={`${event.status}-${event.timestamp}`} className="flex gap-4">
          <div className="flex flex-col items-center">
            {index < grievance.history.length - 1 ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Circle className="w-5 h-5 text-indigo-400" />}
            {index < grievance.history.length - 1 && <div className="w-px flex-1 min-h-12 bg-slate-700" />}
          </div>
          <div className="pb-5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-bold text-slate-100">{event.status}</h4>
              {index === grievance.history.length - 1 && <span className="text-[10px] uppercase tracking-wider text-indigo-300 border border-indigo-500/30 rounded px-1.5 py-0.5">Current</span>}
            </div>
            <p className="text-xs text-slate-400 mt-1">{new Date(event.timestamp).toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
            <p className="text-sm text-slate-300 mt-2">{event.action}</p>
            <p className="text-xs text-slate-500 mt-1">{event.department} · {index === grievance.history.length - 1 && grievance.status === 'Resolved' ? getSlaStatus(grievance) : 'SLA monitoring active'}</p>
          </div>
        </div>
      ))}
      {grievance.status !== 'Resolved' && <div className="flex items-center gap-2 text-xs text-slate-500"><Clock3 className="w-4 h-4" /> Resolution updates will appear here as the case progresses.</div>}
    </div>
  );
}
