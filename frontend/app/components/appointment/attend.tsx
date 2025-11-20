'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';

interface CheckAttendanceModalProps {
  attendanceId: number;
  onClose: () => void;
}

export default function CheckAttendanceModal({ attendanceId, onClose }: CheckAttendanceModalProps) {
  const [attendance, setAttendance] = useState<any>(null);
  const [checkinTime, setCheckinTime] = useState<Date | null>(null);
  const [checkoutTime, setCheckoutTime] = useState<Date | null>(null);
  const [status, setStatus] = useState<string>('Absent');
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [hasCheckedOut, setHasCheckedOut] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('user') || '{}');
    if (session?.id) setUserId(session.id);

    const fetchAttendance = async () => {
      try {
        const data = await apiClient('/attendance/all', { method: 'GET' }) as any[];
        const match = data.find((a: any) => a.id === attendanceId);
        setAttendance(match);
      } catch (error) {
        console.error('Failed to fetch attendance:', error);
      }
    };

    fetchAttendance();
  }, [attendanceId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasCheckedIn && attendance) {
        const start = new Date(attendance.date);
        const now = new Date();
        const diff = (now.getTime() - start.getTime()) / (1000 * 60); // minutes

        if (diff >= 30) {
          // Automatically mark as absent
          sendAttendance('Absent', null, null);
          clearInterval(interval);
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [attendance, hasCheckedIn]);

  const sendAttendance = async (status: string, checkin?: Date | null, checkout?: Date | null) => {
    try {
      await apiClient('/attendance', {
        method: 'POST',
        body: {
          date: new Date(),
          employeeId: userId,
          status,
          label: attendance.label,
          checkinTime: checkin?.toISOString() || null,
          checkoutTime: checkout?.toISOString() || null,
        },
      });
    } catch (err) {
      console.error('Failed to send attendance:', err);
    }
  };

  const handleCheckIn = () => {
    const now = new Date();
    const start = new Date(attendance.date);
    const diff = (now.getTime() - start.getTime()) / (1000 * 60);

    const newStatus = diff <= 30 ? 'Present' : 'Late';
    setStatus(newStatus);
    setCheckinTime(now);
    setHasCheckedIn(true);
    sendAttendance(newStatus, now, null);
  };

  const handleCheckOut = () => {
    const now = new Date();
    setCheckoutTime(now);
    setHasCheckedOut(true);
    sendAttendance(status, checkinTime, now);
  };

  const sessionStart = attendance ? new Date(attendance.date) : null;
  const now = new Date();
  const isAfter30Min = sessionStart && (now.getTime() - sessionStart.getTime()) / (1000 * 60) > 30;

  return (
    <div className="fixed inset-0 backdrop-brightness-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm space-y-4">
        <div className="relative">
          <i className="bi bi-x-circle text-2xl cursor-pointer absolute right-0" onClick={onClose}></i>
          <h2 className="text-xl font-bold text-center text-blue-700">Attendance</h2>
        </div>

        {attendance ? (
          <>
            <div className="text-sm">
              <p><strong>Label:</strong> {attendance.label}</p>
              <p><strong>Date:</strong> {new Date(attendance.date).toLocaleString()}</p>
              <p><strong>Status:</strong> {status}</p>
            </div>

            {!hasCheckedIn && !isAfter30Min && (
              <button onClick={handleCheckIn} className="w-full py-2 px-4 bg-blue-600 text-white rounded">
                Join / Check In
              </button>
            )}

            {hasCheckedIn && !hasCheckedOut && isAfter30Min && (
              <button onClick={handleCheckOut} className="w-full py-2 px-4 bg-green-600 text-white rounded">
                Check Out
              </button>
            )}

            {hasCheckedOut && (
              <p className="text-green-700 text-center">Checked out at {checkoutTime?.toLocaleTimeString()}</p>
            )}
          </>
        ) : (
          <p className="text-center">Loading attendance session...</p>
        )}
      </div>
    </div>
  );
}
