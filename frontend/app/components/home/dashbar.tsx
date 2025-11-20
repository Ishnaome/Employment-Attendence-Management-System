'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashbar() {
  const router = useRouter();
  const [initials, setInitials] = useState<string | null>(null);

  const loadUserSession = () => {
    const userSession = JSON.parse(localStorage.getItem('user') || '{}');
    if (userSession && userSession.name && ) {
      const initials = userSession.name
        .split(' ')
        .map((part: string) => part[0])
        .join('')
        .toUpperCase();
      setInitials(initials);
    } else {
      window.location.assign('/');
    }
  };

  useEffect(() => {
    loadUserSession();
  }, []);

  const handleLogout = () => {
    router.push('/dashboard/logout');
  };


  return (
    <header className="fixed top-0 left-[220px] right-0 bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center z-30">
      {/* Logo and Brand */}
      <div className="flex items-center gap-3">
         <i className="bi bi-heart-pulse-fill text-red-500 text-2xl"></i>
        <span className="text-xl font-bold text-blue-600">MyHealth</span>
      </div>

      {/* Actions & Profile */}
      <nav className="flex items-center gap-6">

        {/* User Avatar (Initials) */}
        <div className="relative bg-blue-100 text-blue-400 font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-sm">
          {initials}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="text-gray-600 hover:text-red-500 text-xl transition"
        >
          <i className="bi bi-box-arrow-right"></i>
        </button>
      </nav>
    </header>
  );
}
