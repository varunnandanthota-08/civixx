'use client';

import { getLeaderboard, getRewardLevel, LeaderboardEntry } from '@/lib/citizenStorage';
import { Award, Download, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CivicRewards({ points, successfulComplaints, citizen }: { points: number; successfulComplaints: number; citizen: string }) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const level = getRewardLevel(points);

  useEffect(() => setLeaderboard(getLeaderboard()), [points, successfulComplaints]);

  const downloadCertificate = () => {
    const certificate = `<html><body style="font-family: Georgia; text-align:center; padding:80px"><h1>CivicAI Civic Leader Certificate</h1><p>This certifies that</p><h2>${citizen}</h2><p>has earned ${points} CivicAI points through responsible civic participation.</p></body></html>`;
    const blob = new Blob([certificate], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'civicai-civic-leader-certificate.html';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800"><Award className="w-5 h-5 text-amber-400 mb-2" /><p className="text-2xl font-black text-white">{points}</p><p className="text-xs text-slate-400">Civic points</p></div>
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800"><Trophy className="w-5 h-5 text-indigo-400 mb-2" /><p className="text-lg font-black text-white">{level}</p><p className="text-xs text-slate-400">Current level</p></div>
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800"><p className="text-2xl font-black text-white">{successfulComplaints}</p><p className="text-xs text-slate-400 mt-2">Successfully resolved complaints</p></div>
    </div>
    {points >= 250 && <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-950/20"><div><p className="font-bold text-amber-300">CivicAI Civic Leader Certificate</p><p className="text-xs text-slate-400 mt-1">Your civic contribution has reached the leader threshold.</p></div><button type="button" onClick={downloadCertificate} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold"><Download className="w-4 h-4" /> Download Certificate</button></div>}
    <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="text-slate-500 uppercase tracking-wider"><tr><th className="p-3">Rank</th><th className="p-3">Citizen</th><th className="p-3">Successful Complaints</th><th className="p-3">Points</th><th className="p-3">Level</th></tr></thead><tbody>{leaderboard.map((entry, index) => <tr key={entry.citizen} className={`border-t border-slate-800 ${entry.citizen === citizen ? 'bg-indigo-950/40 text-indigo-100' : 'text-slate-300'}`}><td className="p-3 font-bold">#{index + 1}</td><td className="p-3 font-semibold">{entry.citizen}{entry.citizen === citizen && <span className="ml-2 text-[10px] text-indigo-300">YOU</span>}</td><td className="p-3">{entry.successfulComplaints}</td><td className="p-3 font-mono">{entry.points}</td><td className="p-3">{getRewardLevel(entry.points)}</td></tr>)}</tbody></table></div>
  </div>;
}
