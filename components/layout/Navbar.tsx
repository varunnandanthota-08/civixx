'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  UserCheck,
  ShieldCheck,
  Cpu,
  Sparkles,
  Activity,
  LogOut,
} from 'lucide-react';
import {
  AUTH_CHANGE_EVENT,
  getDashboardPath,
  getUserRole,
  logout,
  UserRole,
} from '@/lib/auth';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    setUserRole(getUserRole());

    const handleAuthChange = () => setUserRole(getUserRole());
    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
  }, [pathname]);

  if (pathname === '/login') {
    return null;
  }

  const navItems = [
    {
      name: 'Citizen Portal',
      href: '/citizen',
      icon: UserCheck,
      desc: 'Report Grievance & AI Analysis',
      roles: ['citizen'] as UserRole[],
    },
    {
      name: 'Officer Dashboard',
      href: '/officer',
      icon: ShieldCheck,
      desc: 'AI Priority Command Queue',
      roles: ['officer'] as UserRole[],
    },
    {
      name: 'AI Civic Insights',
      href: '/insights',
      icon: Cpu,
      desc: 'Systemic Issue Intelligence',
      roles: ['officer'] as UserRole[],
    },
  ];

  const visibleNavItems = userRole
    ? navItems.filter((item) => item.roles.includes(userRole))
    : navItems;

  const dashboardHref = userRole ? getDashboardPath(userRole) : '/login';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-full lg:w-72 bg-slate-900/90 border-r border-slate-800/80 flex flex-col justify-between p-5 backdrop-blur-xl shrink-0 z-30">
      <div>
        {/* Brand Header */}
        <div className="pb-5 border-b border-slate-800/80">
          <Link href={dashboardHref} className="group block">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-950 group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                    Civic<span className="text-indigo-400">AI</span>
                  </h1>
                  {userRole && (
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        userRole === 'citizen'
                          ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30'
                          : 'bg-indigo-950/60 text-indigo-300 border-indigo-500/30'
                      }`}
                    >
                      {userRole.toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-medium text-slate-400 tracking-wide">
                  AI-Powered Grievance Intelligence
                </p>
              </div>
            </div>
          </Link>

          {/* AI Engine Status Badge */}
          <div className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-indigo-950/60 border border-indigo-500/30 rounded-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-indigo-200 tracking-wide">
              ● AI Engine Active
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-2">
            Main Application Views
          </span>
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-start gap-3.5 p-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-950 border border-indigo-400/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div
                  className={`p-2 rounded-lg mt-0.5 ${
                    isActive
                      ? 'bg-indigo-500/30 text-white'
                      : 'bg-slate-800/80 text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold block">{item.name}</span>
                  <span
                    className={`text-xs block font-normal mt-0.5 ${
                      isActive
                        ? 'text-indigo-200'
                        : 'text-slate-500 group-hover:text-slate-400'
                    }`}
                  >
                    {item.desc}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        {userRole && (
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-600 transition-all duration-200 text-sm font-semibold"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        )}

        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
          <div className="flex items-center justify-between font-semibold text-slate-300 mb-1">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              TCS Tech Day Hackathon
            </span>
            <span className="font-mono text-[10px] text-indigo-400">v2.4 Pro</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Prioritization Engine & Multi-Grievance Systemic Detection Platform.
          </p>
        </div>
      </div>
    </aside>
  );
};
