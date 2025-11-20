'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();

  const loadUserSession = () => {
    const userSession = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userSession) {
      router.push('/');
    }
  };

  useEffect(() => {
    loadUserSession();
  }, []);

  return (
    <div className="fixed top-0 left-0 bg-white border-r border-gray-200 w-[220px] h-full text-gray-800 flex flex-col px-5 py-8 shadow-md z-50">
      {/* Logo / Brand */}
      <div className="flex items-center gap-2 text-xl font-bold text-indigo-700 mb-8">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="App Logo" width={40} height={40} />
          <span className="text-xl font-bold text-indigo-700">Attendance</span>
        </div>
      </div>

      {/* Navigation Links */}
      <Link href="/employeer" className="flex items-center gap-3 py-2 hover:text-indigo-600 transition">
        <i className="bi bi-house"></i> Dashboard
      </Link>
      <Link href="/employeer/sessions" className="flex items-center gap-3 py-2 hover:text-indigo-600 transition">
        <i className="bi bi-calendar-check"></i> Sessions
      </Link>
      <Link href="/employeer/users" className="flex items-center gap-3 py-2 hover:text-indigo-600 transition">
        <i className="bi bi-people"></i> Users
      </Link>
      <Link href="/employeer/roles" className="flex items-center gap-3 py-2 hover:text-indigo-600 transition">
        <i className="bi bi-shield-lock"></i> Roles
      </Link>
      <Link href="/employeer/reports" className="flex items-center gap-3 py-2 hover:text-indigo-600 transition">
        <i className="bi bi-graph-up"></i> Reports
      </Link>

      <div className="mt-auto">
        <button
          onClick={() => {
            localStorage.removeItem('user');
            router.push('/');
          }}
          className="flex items-center gap-3 py-2 text-red-500 hover:text-red-600 transition"
        >
          <i className="bi bi-box-arrow-right"></i> Logout
        </button>
      </div>
    </div>
  );
}
