'use client';

import React, { useState, useEffect } from 'react';
import { Grievance } from '@/lib/types';
import { fetchAndParseGrievances } from '@/lib/dataUtils';
import { StatCard } from '@/components/ui/StatCard';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { DepartmentBadge } from '@/components/ui/DepartmentBadge';
import { ComplaintDrawer } from '@/components/ui/ComplaintDrawer';
import {
  Inbox,
  AlertOctagon,
  TrendingUp,
  Copy,
  Layers,
  Search,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Loader2
} from 'lucide-react';

export default function OfficerPage() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);

  // Filter states
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      const data = await fetchAndParseGrievances();
      setGrievances(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Compute KPIs from dataset
  const totalGrievances = grievances.length;
  const criticalCount = grievances.filter(g => g.priority === 'Critical').length;
  const highCount = grievances.filter(g => g.priority === 'High').length;
  
  // Calculate AI Duplicates by finding meaningful clusters
  const duplicatesCount = grievances.filter(g => g.duplicate_cluster_id && g.duplicate_cluster_id.startsWith('CL-')).length;
  
  // Calculate Systemic Issues (unique clusters flagged as systemic)
  const systemicClusters = new Set(
    grievances.filter(g => g.systemic_cluster === 'Yes' && g.duplicate_cluster_id).map(g => g.duplicate_cluster_id)
  );
  const systemicCount = systemicClusters.size;

  // Extract dynamic categories for dropdown
  const uniqueCategories = Array.from(new Set(grievances.map(g => g.category))).sort();

  // Filtered dataset
  const filteredGrievances = grievances.filter((item) => {
    const p = priorityFilter === 'ALL' || item.priority.toUpperCase() === priorityFilter;
    const c = categoryFilter === 'ALL' || item.category === categoryFilter;
    const sq = searchQuery.toLowerCase();
    const s =
      sq === '' ||
      item.citizen_text.toLowerCase().includes(sq) ||
      item.location.toLowerCase().includes(sq) ||
      item.grievance_id.toLowerCase().includes(sq) ||
      item.department.toLowerCase().includes(sq);

    return p && c && s;
  }).slice(0, 100); // Limit to 100 for render performance

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-indigo-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="font-bold tracking-widest uppercase">Initializing AI Datasets...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Government Command Center Operations
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Officer Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            AI-assisted grievance prioritization, automated cluster detection & resolution workflow management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 text-xs font-bold flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span>● AI Engine Active</span>
          </div>
        </div>
      </div>

      {/* Top 5 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Grievances"
          value={totalGrievances.toLocaleString()}
          trend="+12% today"
          isPositive={true}
          icon={Inbox}
          iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/20"
        />
        <StatCard
          title="Critical Priority"
          value={criticalCount}
          subtitle="Immediate SLA risk"
          trend="Attention required"
          isPositive={false}
          icon={AlertOctagon}
          iconBgColor="bg-red-500/10 text-red-400 border-red-500/20"
          highlight={true}
        />
        <StatCard
          title="High Priority"
          value={highCount}
          subtitle="Pending assignment"
          icon={TrendingUp}
          iconBgColor="bg-orange-500/10 text-orange-400 border-orange-500/20"
        />
        <StatCard
          title="AI Duplicates"
          value={duplicatesCount}
          subtitle="Auto-grouped clusters"
          icon={Copy}
          iconBgColor="bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
        />
        <StatCard
          title="Systemic Issues"
          value={systemicCount}
          subtitle="Locality outbreaks"
          trend="Escalated"
          isPositive={false}
          icon={Layers}
          iconBgColor="bg-purple-500/10 text-purple-400 border-purple-500/20"
        />
      </div>

      {/* Main Priority Queue Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-6">
        {/* Controls Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-black text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              AI Priority Queue
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Grievances dynamically ranked by multi-dimensional urgency algorithm. Click any record to inspect AI rationale.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search ID, text, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {uniqueCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Priority Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((tab) => {
            const isActive = priorityFilter === tab;
            const count = tab === 'ALL' ? grievances.length : grievances.filter((g) => g.priority.toUpperCase() === tab).length;

            return (
              <button
                key={tab}
                onClick={() => setPriorityFilter(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{tab}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grievances Table */}
        <div className="overflow-x-auto max-h-[600px] relative">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-950/90 backdrop-blur z-10">
              <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="p-3.5 rounded-tl-lg">Priority</th>
                <th className="p-3.5">Grievance Details</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5 text-center">AI Score</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {filteredGrievances.length > 0 ? (
                filteredGrievances.map((item) => (
                  <tr
                    key={item.grievance_id}
                    onClick={() => setSelectedGrievance(item)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
                  >
                    <td className="p-3.5 whitespace-nowrap">
                      <PriorityBadge priority={item.priority.toUpperCase()} size="sm" />
                    </td>

                    <td className="p-3.5 max-w-xs">
                      <div className="font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
                        {item.citizen_text}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                        <span>{item.grievance_id}</span>
                        {item.related_complaint_count > 1 && (
                          <span className="text-cyan-400 font-semibold bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800">
                            {item.related_complaint_count} duplicates
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <DepartmentBadge category={item.category} />
                    </td>

                    <td className="p-3.5 text-slate-300 whitespace-nowrap">
                      {item.location}
                    </td>

                    <td className="p-3.5 text-slate-400 max-w-[160px] truncate" title={item.department}>
                      {item.department}
                    </td>

                    <td className="p-3.5 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-mono font-black text-sm px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800">
                        {item.priority_score}
                      </span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                          item.status.includes('Escalated') || item.status.includes('Critical')
                            ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                            : item.status === 'Assigned'
                            ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
                            : item.status === 'In Progress'
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                            : item.status === 'Resolved'
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-500/10 text-slate-300 border border-slate-500/30'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {item.status}
                      </span>
                    </td>

                    <td className="p-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGrievance(item);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors border border-slate-700"
                      >
                        <span>Inspect AI</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No grievances match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ComplaintDrawer
        grievance={selectedGrievance}
        onClose={() => setSelectedGrievance(null)}
      />
    </div>
  );
}
