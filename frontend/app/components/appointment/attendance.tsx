'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';

interface AddAttendanceModalProps {
  onClose: () => void;
}

export default function AddAttendanceModal({ onClose }: AddAttendanceModalProps) {
  const [label, setLabel] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setError] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('user') || '{}');
    if (session && (session.role === 'employeer' || (session.role).toLowerCase() === 'admin')) {
      setUserId(Number(session.id));
    }
  }, []);

  const handleAddAttendance = async () => {
    setError(false);
    setMessage(null);

    if (!label || !date) {
      setError(true);
      setMessage('All fields are required.');
      return;
    }

    try {
    
      const session = JSON.parse(localStorage.getItem('user') || '{}');
      if (session && ((session.role).toLowerCase() === 'employeer' || (session.role).toLowerCase() === 'admin')) {
        
        await apiClient('/attendance', {
          method: 'POST',
          body: {
            label,
            date,
            employeeId: session.id,
            status: 'Attended'
          },
        });
      } else {
        setError(true); 
        setMessage("You're not authorized");
        return;
      }

      setError(false);
      setMessage('Attendance added successfully.');
    } catch (err: any) {
      setError(true);
      setMessage(err.message || 'Failed to add attendance.');
    }
  };

  return (
    <div className="fixed inset-0 backdrop-brightness-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm space-y-4">
        <div className='relative'>
          <i className="bi bi-x-circle font-bold text-2xl -mt-3 cursor-pointer absolute right-0" onClick={onClose}></i>
          <h2 className="text-2xl font-bold text-center text-blue-700">New Session</h2>
        </div>

        {message && (
          <div className={`p-2 text-sm text-center rounded ${isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            {message}
          </div>
        )}

        <input
          type="text"
          placeholder="Label (e.g., Monday Class)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />

        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />


        <div className="flex pt-4">
          <button
            onClick={handleAddAttendance}
            className="px-4 py-2 w-full bg-blue-600 text-white rounded disabled:opacity-50"
            disabled={!label || !date}
          >
            Add Attendance
          </button>
        </div>
      </div>
    </div>
  );
}
