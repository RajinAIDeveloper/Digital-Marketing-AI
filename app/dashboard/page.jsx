// app/dashboard/page.jsx
'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);

  console.log('🔴 Dashboard State:', { user, role });

  useEffect(() => {
    if (!user || !role) return;

    console.log('🔴 Dashboard: Redirecting based on role:', role);
    if (role === 'admin') {
      redirect('/dashboard/admin');
    } else {
      redirect('/dashboard/seller');
    }
  }, [user, role]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900">Loading dashboard...</h2>
        <p className="text-sm text-gray-500 mt-2">Please wait while we redirect you</p>
        
      </div>
    </div>
  );
}