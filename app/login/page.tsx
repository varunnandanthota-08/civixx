'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserRound,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowDown,
  BrainCircuit,
  Building2,
  Loader2,
} from 'lucide-react';
import {
  demoUsers,
  getCurrentUser,
  getDashboardPath,
  login,
  OfficerDepartment,
  UserRole,
} from '@/lib/auth';

type LoginStep = 'role' | 'department' | 'credentials';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<OfficerDepartment | null>(null);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      router.replace(getDashboardPath(user.role));
      return;
    }
    setIsCheckingSession(false);
  }, [router]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep(role === 'officer' ? 'department' : 'credentials');
    setError(null);
    setIdentifier('');
    setPassword('');
  };

  const handleBackToRoles = () => {
    setStep('role');
    setSelectedRole(null);
    setSelectedDepartment(null);
    setError(null);
    setIdentifier('');
    setPassword('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedRole) return;

    setIsSubmitting(true);
    setError(null);

    const authRole: UserRole = selectedRole === 'officer' && selectedDepartment === 'Admin' ? 'admin' : selectedRole;
    const result = login(authRole, identifier, password, selectedDepartment || undefined);

    if (!result.success) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    router.push(getDashboardPath(authRole));
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-[calc(100vh-2rem)] flex items-center justify-center text-indigo-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="font-bold tracking-widest uppercase text-sm">Loading...</span>
      </div>
    );
  }

  const citizenDemo = demoUsers.find((user) => user.role === 'citizen')!;
  const officerDemo = demoUsers.find((user) => user.role === 'officer' && user.department === 'Water Supply')!;
  const adminDemo = demoUsers.find((user) => user.role === 'admin')!;

  return (
    <div className="min-h-[calc(100vh-2rem)] flex items-center justify-center py-8">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-center">
          {/* Left: Branding & concept flow */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Hackathon Demo Login
              </div>

              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                Civic<span className="text-indigo-400">AI</span>
              </h1>
              <p className="mt-3 text-lg font-semibold text-slate-200">
                AI-Powered Grievance Intelligence
              </p>
              <p className="mt-4 text-slate-400 leading-relaxed max-w-md">
                Report civic issues. Prioritize what matters. Improve public services.
              </p>
            </div>

            {/* Subtle concept flow */}
            <div className="hidden sm:flex flex-col items-start gap-2 text-sm text-slate-500 pl-1">
              <div className="flex items-center gap-3 text-slate-400">
                <UserRound className="w-4 h-4 text-cyan-400" />
                <span>Citizen Grievance</span>
              </div>
              <ArrowDown className="w-4 h-4 text-indigo-500/60 ml-0.5" />
              <div className="flex items-center gap-3 text-slate-400">
                <BrainCircuit className="w-4 h-4 text-indigo-400" />
                <span>AI</span>
              </div>
              <ArrowDown className="w-4 h-4 text-indigo-500/60 ml-0.5" />
              <div className="flex items-center gap-3 text-slate-400">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Public Service Resolution</span>
              </div>
            </div>
          </div>

          {/* Right: Role selection & login form */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl shadow-2xl shadow-black/30 p-6 md:p-8">
            {step === 'role' ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Select your role</h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Choose how you want to access CivicAI
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('citizen')}
                    className={`group text-left p-5 rounded-xl border transition-all duration-200 ${
                      selectedRole === 'citizen'
                        ? 'border-cyan-500/60 bg-cyan-950/30 shadow-lg shadow-cyan-950/30'
                        : 'border-slate-700/80 bg-slate-950/50 hover:border-cyan-500/40 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-500/20 w-fit mb-4 group-hover:scale-105 transition-transform">
                      <UserRound className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="font-bold text-white text-lg">Citizen</h3>
                    <p className="text-sm text-slate-400 mt-1 mb-4">
                      Submit and track civic grievances
                    </p>
                    <span className="text-sm font-semibold text-cyan-400 group-hover:text-cyan-300">
                      Continue as Citizen →
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSelect('officer')}
                    className={`group text-left p-5 rounded-xl border transition-all duration-200 ${
                      selectedRole === 'officer'
                        ? 'border-indigo-500/60 bg-indigo-950/30 shadow-lg shadow-indigo-950/30'
                        : 'border-slate-700/80 bg-slate-950/50 hover:border-indigo-500/40 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-500/20 w-fit mb-4 group-hover:scale-105 transition-transform">
                      <ShieldCheck className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h3 className="font-bold text-white text-lg">Officer</h3>
                    <p className="text-sm text-slate-400 mt-1 mb-4">
                      Manage, prioritize, and resolve grievances
                    </p>
                    <span className="text-sm font-semibold text-indigo-400 group-hover:text-indigo-300">
                      Continue as Officer →
                    </span>
                  </button>
                </div>
              </div>
            ) : step === 'department' ? (
              <div className="space-y-6">
                <div><button type="button" onClick={handleBackToRoles} className="text-xs text-slate-500 hover:text-slate-300 transition-colors mb-3">← Change role</button><h2 className="text-xl font-bold text-white">Select department</h2><p className="text-sm text-slate-400 mt-1">Choose the department you represent</p></div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {(['Drainage', 'Electricity', 'Public Safety', 'Roads', 'Sanitation', 'Water Supply', 'Admin'] as OfficerDepartment[]).map((department) => <button key={department} type="button" onClick={() => { setSelectedDepartment(department); setStep('credentials'); setError(null); }} className="text-left p-4 rounded-xl border border-slate-700/80 bg-slate-950/50 hover:border-indigo-500/50 hover:bg-indigo-950/30 transition-colors"><span className="font-bold text-slate-100">{department}</span><span className="block text-xs text-slate-500 mt-1">{department === 'Admin' ? 'Full grievance access' : `${department} operations`}</span></button>)}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <button
                    type="button"
                    onClick={handleBackToRoles}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors mb-3"
                  >
                    ← Change role
                  </button>
                  <h2 className="text-xl font-bold text-white">
                    Sign in as{' '}
                    <span
                      className={
                        selectedRole === 'citizen' ? 'text-cyan-400' : 'text-indigo-400'
                      }
                    >
                      {selectedRole === 'citizen' ? 'Citizen' : selectedDepartment === 'Admin' ? 'Admin' : `${selectedDepartment} Officer`}
                    </span>
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Enter your credentials to continue
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="identifier"
                      className="block text-sm font-medium text-slate-300 mb-1.5"
                    >
                      {selectedRole === 'citizen' ? 'Email / Phone' : selectedDepartment === 'Admin' ? 'Admin Email' : 'Officer Email'}
                    </label>
                    <input
                      id="identifier"
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                      autoComplete="username"
                      placeholder={
                        selectedRole === 'citizen'
                          ? 'citizen@civicai.demo'
                          : selectedDepartment === 'Admin' ? 'admin@civicai.demo' : `${selectedDepartment?.toLowerCase().replace(/ /g, '')}@civicai.demo`
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate-300 mb-1.5"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-600 bg-slate-950 text-indigo-500 focus:ring-indigo-500/30"
                      />
                      Remember me
                    </label>
                    <button
                      type="button"
                      className="text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {error && (
                    <div className="px-4 py-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold shadow-lg shadow-indigo-950/50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      selectedRole === 'citizen' ? 'Sign In' : selectedDepartment === 'Admin' ? 'Sign In as Admin' : `Sign In as ${selectedDepartment} Officer`
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Demo credentials expandable */}
            <div className="mt-6 pt-6 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setShowDemoCredentials((prev) => !prev)}
                className="flex items-center justify-between w-full text-left text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <span>Demo Credentials</span>
                {showDemoCredentials ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {showDemoCredentials && (
                <div className="mt-4 space-y-3 text-sm">
                  <p className="text-[11px] uppercase tracking-wider font-bold text-amber-400/90">
                    For Hackathon Demonstration Only
                  </p>

                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <p className="font-semibold text-cyan-400 mb-1">Citizen</p>
                    <p className="text-slate-400 font-mono text-xs">{citizenDemo.identifier}</p>
                    <p className="text-slate-400 font-mono text-xs">{citizenDemo.password}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <p className="font-semibold text-indigo-400 mb-1">Officer</p>
                    <p className="text-slate-400 font-mono text-xs">{officerDemo.identifier}</p>
                    <p className="text-slate-400 font-mono text-xs">{officerDemo.password}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <p className="font-semibold text-amber-400 mb-1">Admin</p>
                    <p className="text-slate-400 font-mono text-xs">{adminDemo.identifier}</p>
                    <p className="text-slate-400 font-mono text-xs">{adminDemo.password}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
