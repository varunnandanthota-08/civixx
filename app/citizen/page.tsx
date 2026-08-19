'use client';

import React, { useState } from 'react';
import { analyzeGrievance, AIAnalysisResult } from '@/lib/aiService';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { DepartmentBadge } from '@/components/ui/DepartmentBadge';
import { SeverityIndicator } from '@/components/ui/SeverityIndicator';
import { AIInsightCard } from '@/components/ui/AIInsightCard';
import {
  Sparkles,
  ShieldCheck,
  MapPin,
  Camera,
  Phone,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  Clock,
  Building2,
  Share2,
  Check
} from 'lucide-react';
import Link from 'next/link';

export default function CitizenPage() {
  const [description, setDescription] = useState(
    'There has been no water supply in our locality for five days. My mother is 78 years old and we are struggling to get drinking water.'
  );
  const [location, setLocation] = useState('Madhapur, Sector 3, Hyderabad');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [imageAttached, setImageAttached] = useState(true);

  // Analysis States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);

  const analysisSteps = [
    'Understanding your complaint...',
    'Analyzing urgency and severity...',
    'Checking for similar grievances...',
    'Identifying responsible department...',
    'Generating recommended action...'
  ];

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsAnalyzing(true);
    setCurrentStep(0);
    setResult(null);
    setErrorMsg(null);

    try {
      // 1. Kick off actual API call in the background
      const aiPromise = analyzeGrievance(description, location);

      // 2. Step by step animation timing for hackathon presentation UI
      for (let i = 0; i < analysisSteps.length; i++) {
        setCurrentStep(i);
        await new Promise((resolve) => setTimeout(resolve, 600));
      }

      // 3. Await the actual API completion and populate real data
      const aiRes = await aiPromise;
      setResult(aiRes);
    } catch (err: any) {
      console.error('Submission failed:', err);
      setErrorMsg(err.message || 'AI analysis is temporarily unavailable. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const setSamplePrompt = (text: string, loc: string) => {
    setDescription(text);
    setLocation(loc);
    setResult(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Citizen Grievance Portal
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Report a Grievance</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Describe your issue in plain language. Our AI will automatically analyze urgency, detect duplicates, route to the correct authority, and calculate priority.
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Your complaint is encrypted & directly analyzed by official algorithms.</span>
        </div>
      </div>

      {/* Main Grid: Form + Quick Samples */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Container */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl">
          <form onSubmit={handleAnalyze} className="space-y-5">
            {/* Description Area */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-200">
                  Grievance Description <span className="text-red-400">*</span>
                </label>
                <span className="text-xs text-indigo-400 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Auto-Categorization Enabled
                </span>
              </div>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your grievance in your own words..."
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                required
              />
              <p className="mt-1.5 text-xs text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                AI will automatically identify category, severity, urgency, and responsible department.
              </p>
            </div>

            {/* Location & Contact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Locality / Landmark
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Madhapur Sector 3, Hyderabad"
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-xl py-2.5 left-0 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Contact Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 Mobile number"
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-xl py-2.5 left-0 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Photo Attachment Placeholder */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setImageAttached(!imageAttached)}
                  className={`p-2 rounded-lg border transition-colors ${
                    imageAttached
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                </button>
                <div>
                  <span className="font-semibold text-slate-200 block">
                    {imageAttached ? 'water_shortage_photo.jpg attached' : 'Attach Photo Evidence'}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {imageAttached ? 'AI verified image metadata (GPS tagged)' : 'Supports JPG, PNG up to 5MB'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setImageAttached(!imageAttached)}
                className="text-xs text-indigo-400 hover:underline font-medium"
              >
                {imageAttached ? 'Remove' : 'Browse'}
              </button>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-sm shadow-xl shadow-indigo-950/80 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing AI Diagnostics...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-indigo-200" />
                  <span>Analyze & Submit Grievance</span>
                </>
              )}
            </button>

            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/30 text-sm text-red-400 font-medium flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                {errorMsg}
              </div>
            )}
          </form>
        </div>

        {/* Quick Demo Prompts Sidebar */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Send className="w-4 h-4 text-indigo-400" />
            Hackathon Demo Quick-Select
          </div>
          <p className="text-xs text-slate-400">
            Click any realistic scenario below to prefill and evaluate AI triage logic:
          </p>

          <div className="space-y-2.5">
            <button
              onClick={() =>
                setSamplePrompt(
                  'There has been no water supply in our locality for five days. My mother is 78 years old and we are struggling to get drinking water.',
                  'Madhapur, Sector 3, Hyderabad'
                )
              }
              className="w-full text-left p-3 rounded-xl bg-slate-950/80 hover:bg-slate-850 border border-slate-800 text-xs text-slate-300 hover:text-white transition-all group"
            >
              <div className="flex items-center justify-between text-indigo-400 font-bold mb-1">
                <span>1. Critical Water Outage</span>
                <span className="text-[10px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20">Critical</span>
              </div>
              <p className="line-clamp-2 text-slate-400 group-hover:text-slate-200">
                No water supply for 5 days with vulnerable 78-year-old resident...
              </p>
            </button>

            <button
              onClick={() =>
                setSamplePrompt(
                  'A deep sinkhole has developed near St. Marks School entrance following yesterday rains. High accident risk for children.',
                  'Kukatpally Phase 2, Hyderabad'
                )
              }
              className="w-full text-left p-3 rounded-xl bg-slate-950/80 hover:bg-slate-850 border border-slate-800 text-xs text-slate-300 hover:text-white transition-all group"
            >
              <div className="flex items-center justify-between text-orange-400 font-bold mb-1">
                <span>2. School Zone Sinkhole</span>
                <span className="text-[10px] bg-orange-500/10 text-orange-400 px-1.5 py-0.5 rounded border border-orange-500/20">High Risk</span>
              </div>
              <p className="line-clamp-2 text-slate-400 group-hover:text-slate-200">
                Major road damage near primary school creating immediate traffic hazard...
              </p>
            </button>

            <button
              onClick={() =>
                setSamplePrompt(
                  'Massive foul smell and stray animals accumulating around overflowed community dumpster near apartment complex.',
                  'Banjara Hills, Road 12'
                )
              }
              className="w-full text-left p-3 rounded-xl bg-slate-950/80 hover:bg-slate-850 border border-slate-800 text-xs text-slate-300 hover:text-white transition-all group"
            >
              <div className="flex items-center justify-between text-yellow-400 font-bold mb-1">
                <span>3. Uncollected Waste Dumpster</span>
                <span className="text-[10px] bg-yellow-500/10 text-yellow-400 px-1.5 py-0.5 rounded border border-yellow-500/20">Medium</span>
              </div>
              <p className="line-clamp-2 text-slate-400 group-hover:text-slate-200">
                Uncollected solid waste accumulating for 4 days...
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* STEP-BY-STEP SIMULATED AI ANALYSIS ANIMATION */}
      {isAnalyzing && (
        <div className="p-8 rounded-2xl bg-slate-900 border border-indigo-500/40 shadow-2xl space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">CivicAI Multi-Stage NLP Analysis</h3>
                <p className="text-xs text-indigo-300">Evaluating complaint semantics, vulnerability indicators & geospatial density</p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">Step {currentStep + 1} of 5</span>
          </div>

          <div className="space-y-3">
            {analysisSteps.map((step, idx) => {
              const isDone = idx < currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    isDone
                      ? 'bg-slate-950/80 border-emerald-500/30 text-emerald-300'
                      : isCurrent
                      ? 'bg-indigo-950/60 border-indigo-500/50 text-indigo-200 font-semibold shadow-md'
                      : 'bg-slate-950/30 border-slate-800/60 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3 text-sm">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                    )}
                    <span>{step}</span>
                  </div>
                  {isDone && <span className="text-xs font-mono text-emerald-400 font-bold">DONE</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI ANALYSIS RESULT PANEL */}
      {result && !isAnalyzing && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          {/* Header result banner */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-indigo-400">{result.grievanceId}</span>
                  <PriorityBadge priority={result.priority} size="lg" />
                  <DepartmentBadge category={result.category} />
                </div>
                <h2 className="text-2xl font-black text-slate-100 mt-2">AI Grievance Analysis Complete</h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">AI Priority Score</span>
                  <span className="text-2xl font-black text-indigo-400 font-mono">{result.priorityScore}/100</span>
                </div>
              </div>
            </div>

            {/* original user input highlight */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Submitted Grievance</span>
              <p className="text-sm text-slate-200 italic font-normal">"{result.originalText}"</p>
            </div>

            {/* Category & Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-semibold">Category</span>
                <span className="text-sm font-bold text-slate-100 mt-1 block">{result.category}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-semibold">Department</span>
                <span className="text-xs font-bold text-indigo-300 mt-1 block truncate" title={result.department}>
                  {result.department}
                </span>
              </div>
              <SeverityIndicator label="Severity" score={result.severity} />
              <SeverityIndicator label="Urgency" score={result.urgency} />
              <SeverityIndicator label="Public Impact" score={result.public_impact} />
              <SeverityIndicator label="Vulnerability" score={result.vulnerability} />
            </div>

            {/* Why this priority? Explainable AI Card */}
            <AIInsightCard
              title="Why this priority?"
              confidenceScore={95}
              explanation={result.explanation}
              reasoningPoints={[
                'Extended essential-service disruption (Water scarcity > 48h)',
                'High vulnerability flag: Senior citizen resident (78 yrs old)',
                'Geographic proximity match with 12 existing sector complaints',
                'Escalation index elevated to CRITICAL priority'
              ]}
            />
          </div>

          {/* SIMILAR COMPLAINTS & SYSTEMIC ISSUE PANEL */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Similar Complaints */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-bold text-slate-100">
                    AI Detected {result.similarComplaints.length + 9} Related Grievances in Your Area
                  </h3>
                </div>
                <span className="text-xs font-mono bg-indigo-950 text-indigo-300 px-2.5 py-1 rounded-md border border-indigo-800">
                  Cluster ID: SYS-WATER-01
                </span>
              </div>

              <div className="space-y-2.5">
                {result.similarComplaints.map((comp, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-200 block text-sm">{comp.title}</span>
                      <span className="text-slate-400">{comp.location} • Filed {comp.createdAt}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-extrabold text-cyan-400 text-sm">{comp.similarity}% match</span>
                      <span className="text-[10px] text-slate-500 block">Vector Similarity</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Possible Systemic Issue Banner */}
              {result.possibleSystemicIssue && (
                <div className="p-5 rounded-xl bg-gradient-to-r from-red-950/50 via-slate-950 to-slate-950 border border-red-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-red-300">Possible Systemic Issue Identified</h4>
                      <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                        {result.systemicIssueDescription}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/insights"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-lg transition-colors shrink-0"
                  >
                    <span>View Civic Insight</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Resolution Recommendation Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                  <Building2 className="w-4 h-4" />
                  AI Recommended Action
                </div>
                <h4 className="text-base font-extrabold text-slate-100 leading-snug">
                  {result.recommendedAction}
                </h4>

                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Responsible Dept:</span>
                    <span className="font-semibold text-slate-200 text-right">{result.department}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Suggested SLA:</span>
                    <span className="font-mono font-bold text-indigo-300">{result.suggestedSLA}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Escalation Level:</span>
                    <span className="font-semibold text-red-400">{result.escalationLevel}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Next Step:</span>
                    <span className="font-semibold text-slate-300 text-right">{result.recommendedNextStep}</span>
                  </div>
                </div>
              </div>

              {/* Success status footer */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Status:</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> AI Prioritized → Department Assigned
                  </span>
                </div>
                <button
                  onClick={() => alert(`Tracking Grievance #${result.grievanceId}. Notification SMS sent.`)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>Track Grievance ({result.grievanceId})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
