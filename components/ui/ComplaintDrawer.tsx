'use client';

import React, { useState, useEffect } from 'react';
import { Grievance, DepartmentKnowledge } from '@/lib/types';
import { generatePriorityExplanation, findRelatedComplaints, getDepartmentKnowledge } from '@/lib/aiService';
import { PriorityBadge } from './PriorityBadge';
import { DepartmentBadge } from './DepartmentBadge';
import { SeverityIndicator } from './SeverityIndicator';
import { AIInsightCard } from './AIInsightCard';
import { X, Clock, AlertTriangle, Layers, User, MapPin, CheckCircle, ShieldAlert, ArrowUpRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface ComplaintDrawerProps {
  grievance: Grievance | null;
  onClose: () => void;
  onStatusChange?: (grievanceId: string, status: 'Confirmed Assigned' | 'In Progress' | 'Resolved', note?: string) => void;
}

export const ComplaintDrawer: React.FC<ComplaintDrawerProps> = ({ grievance, onClose, onStatusChange }) => {
  const [related, setRelated] = useState<Grievance[]>([]);
  const [deptInfo, setDeptInfo] = useState<DepartmentKnowledge | null>(null);

  useEffect(() => {
    if (grievance) {
      findRelatedComplaints(grievance.duplicate_cluster_id).then(res => setRelated(res));
      getDepartmentKnowledge(grievance.department).then((res: DepartmentKnowledge | null) => setDeptInfo(res));
    }
  }, [grievance]);

  if (!grievance) return null;

  // Legacy dataset rows do not have a created-at SLA clock; stored citizen rows are normalized by the officer page.
  const timeRemainingHours = grievance.workflowTimeRemaining ? Number.parseInt(grievance.workflowTimeRemaining, 10) || 0 : grievance.status === 'Resolved' ? 0 : Math.max(0, grievance.sla_hours - 6);
  const slaPercentage = Math.max(0, Math.min(100, (timeRemainingHours / grievance.sla_hours) * 100));
  
  const aiExplanation = generatePriorityExplanation(grievance);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end transition-opacity duration-300">
      <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-indigo-400">{grievance.grievance_id}</span>
              <PriorityBadge priority={grievance.priority.toUpperCase()} size="md" />
              <DepartmentBadge category={grievance.category} />
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Grievance Title & Details */}
          <div className="mt-5 space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-100 leading-snug">{grievance.citizen_text}</h2>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  {grievance.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Filed {new Date(grievance.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            {/* AI Priority Score Meter */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                  ✦ AI Priority Score
                </span>
                <p className="text-xs text-slate-400 mt-0.5">Automated Multi-Factor Urgency Index</p>
              </div>
              <div className="flex items-baseline gap-1 bg-indigo-950/80 px-4 py-2 rounded-xl border border-indigo-500/40">
                <span className="text-3xl font-black text-indigo-300">{grievance.priority_score}</span>
                <span className="text-xs font-mono text-slate-400">/ 100</span>
              </div>
            </div>

            {/* AI Analysis metrics grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                AI Diagnostic Metrics
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                <SeverityIndicator label="Severity" score={grievance.severity} highlight />
                <SeverityIndicator label="Urgency" score={grievance.urgency} highlight />
                <SeverityIndicator label="Public Impact" score={grievance.public_impact} highlight />
                <SeverityIndicator label="Vulnerability" score={grievance.vulnerability} highlight />
              </div>
            </div>

            {/* Explainable AI */}
            <AIInsightCard
              title="Why AI Prioritized This"
              confidenceScore={Math.floor(Math.random() * 10) + 90} // Mock score
              explanation={aiExplanation}
              reasoningPoints={[
                `Recurrence rate: ${grievance.recurrence}/10`,
                `Sentiment detected: ${grievance.sentiment}`,
                grievance.systemic_cluster === 'Yes' ? 'Detected as part of a Systemic Issue Cluster.' : 'Isolated incident, standard response protocol applies.'
              ]}
            />

            {/* Department Knowledge Base (RAG Preparation) */}
            {deptInfo && (
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  Department Knowledge Match
                </div>
                <div className="grid grid-cols-1 text-xs gap-y-2">
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-500">Responsibilities:</span>
                    <span className="text-slate-300 text-right font-medium max-w-[200px] truncate" title={deptInfo.responsibilities}>{deptInfo.responsibilities}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-500">SLA Policy:</span>
                    <span className="text-slate-300 text-right font-medium">{deptInfo.sla_policy}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-500">Escalation Owner:</span>
                    <span className="text-indigo-400 text-right font-medium">{deptInfo.escalation_owner}</span>
                  </div>
                  <div className="flex flex-col gap-1 pt-1.5">
                    <span className="text-slate-500">Recommended Steps:</span>
                    <span className="text-slate-200 bg-slate-900 p-2 rounded border border-slate-800">{deptInfo.recommended_resolution_steps}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Duplicates / Cluster section */}
            {grievance.duplicate_cluster_id && (
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">
                        {related.length} Related Complaints Detected
                      </h4>
                      <p className="text-xs text-slate-400">Cluster ID: <span className="font-mono text-cyan-400">{grievance.duplicate_cluster_id}</span></p>
                    </div>
                  </div>
                  <Link
                    href="/insights"
                    onClick={onClose}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-700/50 rounded-lg transition-colors"
                  >
                    <span>View Systemic Insights</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                
                {/* Related List */}
                <div className="space-y-2 mt-2">
                  {related.slice(0, 3).map((r) => (
                    <div key={r.grievance_id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                      <div className="truncate pr-4">
                        <span className="text-slate-300 font-medium block truncate max-w-[200px]">{r.citizen_text}</span>
                        <span className="text-slate-500 text-[10px]">{r.location} • {r.status}</span>
                      </div>
                      <span className="text-cyan-400 font-mono font-bold shrink-0">{r.semantic_similarity ? Math.round(r.semantic_similarity * 100) : 85}% match</span>
                    </div>
                  ))}
                  {related.length > 3 && (
                    <div className="text-center text-xs text-slate-500 pt-1">+ {related.length - 3} more...</div>
                  )}
                </div>
              </div>
            )}

            {/* SLA Section */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  Resolution SLA Tracker
                </span>
                {grievance.status !== 'Resolved' && timeRemainingHours < 12 && (
                  <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Risk of Escalation: HIGH
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300 font-medium">Target SLA: {grievance.sla_hours}h</span>
                <span className={`font-mono font-bold ${grievance.workflowSlaStatus === 'SLA Breached' ? 'text-red-400' : 'text-indigo-300'}`}>{grievance.status === 'Resolved' ? grievance.workflowSlaStatus || 'RESOLVED' : (grievance.workflowTimeRemaining || `${timeRemainingHours}h remaining`)}</span>
              </div>

              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className={`h-full rounded-full transition-all ${
                    grievance.status === 'Resolved' ? 'bg-emerald-500' :
                    slaPercentage < 30 ? 'bg-red-500 shadow-sm shadow-red-500' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${grievance.status === 'Resolved' ? 100 : slaPercentage}%` }}
                />
              </div>
            </div>

            {grievance.history && <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3"><h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Resolution History</h4>{grievance.history.map((event) => <div key={`${event.status}-${event.timestamp}`} className="border-l-2 border-indigo-500/50 pl-3"><p className="text-sm font-bold text-slate-200">{event.status}</p><p className="text-[11px] text-slate-500">{new Date(event.timestamp).toLocaleString()}</p><p className="text-xs text-slate-300 mt-1">{event.action}</p><p className="text-[11px] text-slate-500">{event.department}</p></div>)}{grievance.resolutionNote && <p className="text-xs text-emerald-300">Resolution Note: {grievance.resolutionNote}</p>}</div>}
          </div>
        </div>

        {/* Action Buttons */}
        {grievance.status !== 'Resolved' && (
          <div className="pt-6 mt-6 border-t border-slate-800 grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                if (!onStatusChange) return onClose();
                if (grievance.status === 'In Progress') {
                  const note = window.prompt('Resolution Note');
                  if (!note?.trim()) return;
                  onStatusChange(grievance.grievance_id, 'Resolved', note.trim());
                } else if (grievance.status === 'Confirmed Assigned') {
                  onStatusChange(grievance.grievance_id, 'In Progress');
                } else {
                  onStatusChange(grievance.grievance_id, 'Confirmed Assigned');
                }
                onClose();
              }}
              className="w-full py-2.5 px-4 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{grievance.status === 'In Progress' ? 'Mark as Resolved' : grievance.status === 'Confirmed Assigned' ? 'Mark In Progress' : 'Confirm Assigned'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg shadow-indigo-950 transition-all flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Escalate Ticket</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
