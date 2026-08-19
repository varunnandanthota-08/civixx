'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldAlert } from 'lucide-react';
import { getCurrentUser, getDashboardPath, UserRole } from '@/lib/auth';

interface RouteGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export function RouteGuard({ allowedRoles, children }: RouteGuardProps) {
  const router = useRouter();
  const [status, setStatus] = useState<'checking' | 'authorized' | 'unauthorized'>('checking');

  useEffect(() => {
    const user = getCurrentUser();

    if (!user) {
      router.replace('/login');
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      setStatus('unauthorized');
      const timer = window.setTimeout(() => {
        router.replace(getDashboardPath(user.role));
      }, 1500);

      return () => window.clearTimeout(timer);
    }

    setStatus('authorized');
  }, [allowedRoles, router]);

  if (status === 'checking') {
    return (
      <div className="flex h-[80vh] items-center justify-center text-indigo-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="font-bold tracking-widest uppercase text-sm">Verifying Access...</span>
      </div>
    );
  }

  if (status === 'unauthorized') {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center max-w-md px-6">
          <ShieldAlert className="w-10 h-10 text-amber-400" />
          <p className="text-slate-200 font-semibold">
            You don&apos;t have permission to access this page.
          </p>
          <p className="text-sm text-slate-500">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
