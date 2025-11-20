'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AddAttendanceModal from '../appointment/attendance';

export default function UserTopbar() {
  const router = useRouter();
  const [initials, setInitials] = useState<string | null>(null);
  const [role, setRole] = useState('');
  const [newSession, setNewSession] = useState(false);

  // Load user from localStorage and get initials
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user?.name) {
          const initials = user.name
            .split(' ')
            .map((part: string) => part[0])
            .join('')
            .toUpperCase();
          setInitials(initials);
          setRole(user.role);
          return;
        }
      } catch {
        // JSON parse error fallback
      }
    }
    // If no valid user, redirect or handle accordingly
   // router.push('/');
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user'); // clear session
    router.push('/');
  };

  useEffect(() => {
    if(role && role !== "Student"){
      if(role !== "Employee"){
        router.push("/");
      }
    }
  },[role])

  return (
    <>
    <header className="fixed top-0 left-[220px] right-0 bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center z-30">
      {/* Left side - New Session button */}
      <button
        onClick={() => window.location.assign("/dashboard/sessions")}
        className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded text-sm font-semibold flex items-center gap-1"
      >
        <i className="bi bi-plus-lg"></i> Attend
      </button>

      {/* Right side - Logged in + initials + logout */}
      <div className="flex items-center gap-6">
        <span className="text-sm font-medium text-gray-700">Logged in As <strong>{role}</strong></span>
        <div className="relative bg-indigo-100 text-indigo-600 font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-sm select-none">
          {initials || '??'}
        </div>
        <button
          onClick={handleLogout}
          title="Logout"
          className="text-gray-600 hover:text-red-500 text-xl transition"
        >
          <i className="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </header>
    {newSession && (<AddAttendanceModal onClose={() => setNewSession(false)}/>)}
    </>
  );
}
