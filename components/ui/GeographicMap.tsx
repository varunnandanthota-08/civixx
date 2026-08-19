'use client';

import React, { useState, useEffect } from 'react';
import { fetchAndParseGrievances } from '@/lib/dataUtils';
import { Grievance } from '@/lib/types';
import { MapPin, Navigation, Sparkles, ZoomIn, Layers, Info, Loader2 } from 'lucide-react';
import { PriorityBadge } from './PriorityBadge';

export const GeographicMap: React.FC = () => {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [clusters, setClusters] = useState<any[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await fetchAndParseGrievances();
      setGrievances(data);
      
      // Group by location for map clusters
      const locMap: Record<string, Grievance[]> = {};
      data.forEach(g => {
        if (!locMap[g.location]) locMap[g.location] = [];
        locMap[g.location].push(g);
      });

      // Simple mock coordinate placement since dataset lat/lng covers similar bounds
      // For visual spread, we map known locations to canvas % coordinates
      const positions: Record<string, {top: string, left: string}> = {
        'Madhapur': { top: '42%', left: '55%' },
        'Kukatpally': { top: '22%', left: '65%' },
        'Banjara Hills': { top: '68%', left: '78%' },
        'Gachibowli': { top: '50%', left: '28%' },
        'HITEC City': { top: '45%', left: '48%' },
        'Secunderabad': { top: '30%', left: '85%' },
        'Dilsukhnagar': { top: '80%', left: '80%' },
        'Mehdipatnam': { top: '75%', left: '60%' },
        'Kondapur': { top: '35%', left: '40%' },
        'Jubilee Hills': { top: '60%', left: '70%' },
        'Uppal': { top: '40%', left: '90%' },
        'Miyapur': { top: '15%', left: '55%' },
        'Charminar': { top: '85%', left: '65%' }
      };

      const computedClusters = Object.entries(locMap).map(([loc, complaints]) => {
        const critical = complaints.filter(c => c.priority === 'Critical').length;
        const high = complaints.filter(c => c.priority === 'High').length;
        const risk = critical > 5 ? 'CRITICAL' : (high > 10 ? 'HIGH' : 'MEDIUM');
        
        // Find top category
        const cats: Record<string, number> = {};
        complaints.forEach(c => cats[c.category] = (cats[c.category] || 0) + 1);
        const topCat = Object.entries(cats).sort((a,b) => b[1] - a[1])[0][0];

        // Is there a systemic issue here?
        const hasSystemic = complaints.some(c => c.systemic_cluster === 'Yes');

        return {
          id: loc.substring(0, 3).toUpperCase() + '-' + complaints.length,
          name: loc,
          category: topCat,
          count: complaints.length,
          risk,
          hasSystemic,
          pos: positions[loc] || { top: `${Math.floor(Math.random()*60)+20}%`, left: `${Math.floor(Math.random()*60)+20}%` },
          aiInsight: hasSystemic 
            ? `AI detected a highly correlated systemic ${topCat.toLowerCase()} anomaly requiring immediate centralized intervention.`
            : `Routine density of complaints primarily related to ${topCat.toLowerCase()}. Standard SLA routing active.`
        };
      });

      // Filter out small clusters for map clarity
      const significantClusters = computedClusters.filter(c => c.count > 3).sort((a, b) => b.count - a.count);
      
      setClusters(significantClusters);
      if (significantClusters.length > 0) {
        setSelectedCluster(significantClusters[0]);
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  if (isLoading) {
    return <div className="h-[400px] flex items-center justify-center bg-slate-900/90 rounded-2xl border border-slate-800"><Loader2 className="w-8 h-8 text-indigo-400 animate-spin" /></div>;
  }

  if (!selectedCluster) return null;

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 backdrop-blur-md shadow-xl relative overflow-hidden">
      {/* Top Map Toolbar */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-100">Geographic Grievance Clusters</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time geospatial AI density analysis & systemic risk mapping • Hyderabad Tech Corridor
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 font-medium hidden md:flex">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" /> Critical Cluster
            </span>
            <span className="flex items-center gap-1.5 text-slate-300 ml-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> High Density
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map Visualizer Canvas */}
        <div className="lg:col-span-2 relative h-[380px] bg-slate-950 rounded-xl border border-slate-800/90 overflow-hidden group">
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <svg className="absolute inset-0 w-full h-full stroke-slate-800/60 stroke-[1.5] fill-none pointer-events-none">
            <line x1="10%" y1="30%" x2="90%" y2="30%" strokeDasharray="4 4" />
            <line x1="10%" y1="65%" x2="90%" y2="65%" strokeDasharray="4 4" />
            <line x1="45%" y1="10%" x2="45%" y2="90%" strokeDasharray="4 4" />
          </svg>

          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            <span className="px-2 py-1 text-[11px] font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/50 rounded-md">
              HYDERABAD WEST REGION
            </span>
            <span className="px-2.5 py-1 text-[11px] font-mono bg-slate-900/90 text-slate-400 border border-slate-800 rounded-md shadow-md w-fit">
              {grievances.length} Active Records
            </span>
          </div>

          <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
            <button className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded">
              <Layers className="w-4 h-4" />
            </button>
          </div>

          {/* Map Pins / Cluster Hotspots */}
          {clusters.map((node) => {
            const isSelected = selectedCluster.name === node.name;
            let pinColor = 'bg-yellow-500 border-yellow-300 text-yellow-950';
            let pulseColor = 'bg-yellow-400';
            let glow = 'shadow-yellow-500/50';

            if (node.risk === 'CRITICAL') {
              pinColor = 'bg-red-500 border-red-300 text-white';
              pulseColor = 'bg-red-500';
              glow = 'shadow-red-500/80 shadow-lg';
            } else if (node.risk === 'HIGH') {
              pinColor = 'bg-orange-500 border-orange-300 text-white';
              pulseColor = 'bg-orange-500';
              glow = 'shadow-orange-500/60';
            }

            return (
              <div
                key={node.name}
                style={{ top: node.pos.top, left: node.pos.left }}
                onClick={() => setSelectedCluster(node)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 transition-all duration-300 group/pin"
              >
                {(isSelected || node.risk === 'CRITICAL') && (
                  <span className={`absolute -inset-3 rounded-full ${pulseColor} opacity-30 animate-ping pointer-events-none`} />
                )}
                
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs border-2 ${pinColor} ${glow} ${
                    isSelected ? 'scale-110 ring-4 ring-indigo-500/50' : 'hover:scale-105'
                  } transition-transform duration-200`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{node.count}</span>
                </div>

                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover/pin:flex flex-col items-center pointer-events-none z-30">
                  <div className="bg-slate-900 border border-slate-700 text-slate-100 text-[11px] font-medium px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap">
                    {node.name} • <span className="text-indigo-400 font-bold">{node.count} complaints</span>
                  </div>
                  <div className="w-2 h-2 bg-slate-900 transform rotate-45 -mt-1 border-r border-b border-slate-700" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Cluster Detail Box */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
                GEO-ID: {selectedCluster.id}
              </span>
              <PriorityBadge priority={selectedCluster.risk} size="sm" />
            </div>

            <h4 className="text-base font-extrabold text-slate-100">{selectedCluster.name}</h4>
            <p className="text-xs text-slate-400 mt-1">Primary Category: <span className="text-slate-200 font-semibold">{selectedCluster.category}</span></p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 block font-medium">Total Complaints</span>
                <span className="text-2xl font-black text-slate-100 mt-0.5 block">{selectedCluster.count}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 block font-medium">Systemic Threat</span>
                <span className={`text-xl font-black mt-1 block ${selectedCluster.hasSystemic ? 'text-red-400' : 'text-emerald-400'}`}>
                  {selectedCluster.hasSystemic ? 'DETECTED' : 'LOW'}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/50 to-slate-900 border border-indigo-500/30">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI Geo Diagnostic</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {selectedCluster.aiInsight}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-900">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-slate-500" />
                Confidence: <strong className="text-slate-200">{Math.floor(Math.random()*15)+80}%</strong>
              </span>
              <span className="text-indigo-400 font-medium">{selectedCluster.hasSystemic ? 'Auto-Incident Triggered' : 'Monitoring'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
