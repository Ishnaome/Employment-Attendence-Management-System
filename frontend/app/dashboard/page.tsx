'use client';

import { useEffect, useState, useMemo } from 'react';
import { apiClient } from '@/lib/apiClient';

type Attendance = {
  id: number;
  employeeId: number;
  label: string;
  date: string;
  checkInTime: string;
  checkOutTime: string | null;
  status: string;
};

type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

type AttendanceWithEmployee = Attendance & {
  employee: Employee | null;
};

function getStartOfWeek(date: Date) {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

function isDateInRange(dateStr: string, filter: string) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();

  if (filter === 'today') {
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  }
  if (filter === 'week') {
    const startOfWeek = getStartOfWeek(new Date());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return d >= startOfWeek && d <= endOfWeek;
  }
  if (filter === 'month') {
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }
  return true;
}

export default function AttendedSessionsPage() {
  const [attendances, setAttendances] = useState<AttendanceWithEmployee[]>([]);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = JSON.parse(localStorage.getItem('user') || '{}');
        if (session && session.id) {
        const [attendanceData, employees] = await Promise.all([
          apiClient<Attendance[]>('/attendance/all', { method: 'GET' }),
          apiClient<Employee[]>('/employees', { method: 'GET' }),
        ]);

        const myAttendances = attendanceData
          .filter(a => a.employeeId === session.id)
          .map(a => ({
            ...a,
            employee: employees.find(emp => emp.id === a.employeeId) || null,
          }))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setAttendances(myAttendances);
        }
      } catch (err) {
        console.error('Error fetching attendance:', err);
      }
    };


      fetchData();
  }, []);

  const filtered = useMemo(() => {
    return attendances.filter(a => {
      if (!isDateInRange(a.date, dateFilter)) return false;
      if (!search) return true;
      const emp = a.employee;
      const searchLower = search.toLowerCase();
      return (
        emp?.firstName.toLowerCase().includes(searchLower) ||
        emp?.lastName.toLowerCase().includes(searchLower) ||
        emp?.email.toLowerCase().includes(searchLower)
      );
    });
  }, [attendances, search, dateFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages]);

  return (
    <>
      <title>Dashboard</title>

      <div className="min-h-screen p-6 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6 text-indigo-700">Recent Sessions</h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Search by employee..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-64 px-4 py-2 rounded border border-gray-300 focus:outline-indigo-500"
          />
          <select
            value={dateFilter}
            onChange={e => {
              setDateFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="w-full sm:w-48 px-4 py-2 rounded border border-gray-300 focus:outline-indigo-500"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.length === 0 ? (
            <div className="text-center text-gray-500 col-span-full py-8">No attendances found.</div>
          ) : (
            paginated.map(a => (
              <div key={a.id} className="bg-white p-4 rounded shadow border">
                <h2 className="text-lg font-semibold text-indigo-600">{a.label}</h2>
                <p className="text-sm text-gray-500">{new Date(a.date).toLocaleDateString()}</p>
                <div className="text-sm mt-2">
                  <p>
                    <strong>Check In:</strong> {a.checkInTime || '-'}
                  </p>
                  <p>
                    <strong>Check Out:</strong> {a.checkOutTime || '-'}
                  </p>
                </div>
                <div className="mt-3 text-sm font-semibold text-gray-600">
                  Status:{' '}
                  <span
                    className={
                      a.status === 'Present'
                        ? 'text-green-600'
                        : a.status === 'Absent'
                        ? 'text-red-600'
                        : 'text-gray-500'
                    }
                  >
                    {a.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full shadow-inner">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-full text-sm ${
                  currentPage === 1 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    currentPage === i + 1
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-full text-sm ${
                  currentPage === totalPages ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
