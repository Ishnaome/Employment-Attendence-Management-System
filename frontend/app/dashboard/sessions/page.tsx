'use client';

import { useEffect, useState, useMemo } from 'react';
import { apiClient } from '@/lib/apiClient'; // Your fetch helper
import CheckAttendanceModal from '@/app/components/appointment/attend';


type Role = {
  id: number;
  name: string;
};

type EmployeeRole = {
  id: number;
  employeeId: number;
  roleId: number; // role ID
};

type Attendance = {
  id: number;
  employeeId: number;
  label: string;
  date: string; // ISO string yyyy-mm-dd or datetime
  checkInTime: string; // ISO time or datetime string
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
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday start
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
  return true; // no filter or 'all'
}

export default function Sessions() {
  const [attendances, setAttendances] = useState<AttendanceWithEmployee[]>([]);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [attend, setAttend] = useState<number | null>(null);;
  const itemsPerPage = 3;

  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('user') || '{}');
    if (session && (session.role).toLowerCase() === 'employeer') {
      setUserId(Number(session.id));
    }
  }, []);


useEffect(() => {
  async function fetchData() {
    try {
      const [attendanceData, employeeRoles, roles, employees] = await Promise.all([
        apiClient<Attendance[]>('/attendance/all', { method: 'GET' }),
        apiClient<EmployeeRole[]>('/employeeRoles', { method: 'GET' }),
        apiClient<Role[]>('/roles/all', { method: 'GET' }),
        apiClient<Employee[]>('/employees', { method: 'GET' }),
      ]);

      const employeerRole = roles.find(role => role.name.toLowerCase() === 'employeer');
      if (!employeerRole) return;

      const employeerEmployeeIds = employeeRoles
        .filter(er => er.roleId === employeerRole.id)
        .map(er => er.employeeId);

      const filteredAttendance = attendanceData.filter(a =>
        employeerEmployeeIds.includes(a.employeeId)
      );

      const now = new Date();

      const combined: AttendanceWithEmployee[] = filteredAttendance.map(a => {
        const employee = employees.find(emp => emp.id === a.employeeId) || null;

        // Automatically mark "Finished" if date + checkOutTime is in the past
        const attendanceDate = new Date(a.date);
        const fullCheckOutDate = new Date(a.date);
        if (a.checkOutTime) {
          const [hours, minutes] = a.checkOutTime.split(':').map(Number);
          fullCheckOutDate.setHours(hours);
          fullCheckOutDate.setMinutes(minutes);
        }

        const updatedStatus =
          a.checkOutTime && fullCheckOutDate < now && a.status !== 'Attended'
            ? 'Finished'
            : a.status;

        return {
          ...a,
          employee,
          status: updatedStatus,
        };
      });

      // Sort by date desc + check-in time
      combined.sort((a, b) => {
        const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (dateCompare !== 0) return dateCompare;
        return new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime();
      });

      setAttendances(combined);
    } catch (error) {
      console.error('Failed to fetch data for sessions', error);
    }
  }

  fetchData();
}, []);


  // Filter by search and date filter
  const filtered = useMemo(() => {
    return attendances.filter((a) => {
      // Filter date
      if (!isDateInRange(a.date, dateFilter)) return false;

      // Filter search by employee name or email
      if (!search) return true;
      const searchLower = search.toLowerCase();
      const emp = a.employee;
      return (
        (emp?.firstName.toLowerCase().includes(searchLower) ?? false) ||
        (emp?.lastName.toLowerCase().includes(searchLower) ?? false) ||
        (emp?.email.toLowerCase().includes(searchLower) ?? false)
      );
    });
  }, [attendances, search, dateFilter]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change safely
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

async function handleAttend(a: AttendanceWithEmployee) {
  try {
    if (!a.checkInTime) {
      // Perform check-in
      await apiClient(`/attendance/check-in/${a.id}`, { method: 'POST' });
    } else if (!a.checkOutTime) {
      // Perform check-out
      await apiClient(`/attendance/check-out/${a.id}`, { method: 'POST' });
    }
    // Refresh data
    window.location.reload(); // or better: re-fetch with `fetchData()`
  } catch (error) {
    console.error('Failed to attend', error);
    alert('Attendance failed');
  }
}

  return (
    <>
      <title>Employeer Dashboard - Recent Sessions</title>

      <div className="min-h-screen p-6 bg-gray-50">
       
        <h1 className="text-2xl font-bold mb-6 text-indigo-700">Sessions</h1>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Search by employee name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full sm:w-64 px-4 py-2 rounded border border-gray-300 focus:outline-indigo-500"
          />

          <select
            value={dateFilter}
            onChange={(e) => { setDateFilter(e.target.value as any); setCurrentPage(1); }}
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
            <div className="text-gray-500 col-span-full text-center py-8">
              No sessions found.
            </div>
          ) : (
            paginated.map((a) => {
              const hasCheckedOut = Boolean(a.checkOutTime);
              const hasCheckedIn = Boolean(a.checkInTime);

              return (
                <div
                  key={a.id}
                  className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
                >
                  <h2 className="font-semibold text-indigo-600 text-lg mb-1">
                    {a.label}
                  </h2>
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(a.date).toLocaleDateString()}
                  </p>
                  <div className="mb-2">
                    <p className="text-gray-700 font-medium">
                      {a.employee?.firstName ?? '-'} {a.employee?.lastName ?? ''}
                    </p>
                    <p className="text-sm text-gray-600">
                      {a.employee?.email ?? '-'}
                    </p>
                  </div>
                  <div className="text-sm mb-2">
                    <p>
                      <strong>Check In:</strong>{' '}
                      {new Date(a.checkInTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p>
                      <strong>Check Out:</strong>{' '}
                      {a.checkOutTime
                        ? new Date(a.checkOutTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '-'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span
                      className={`text-sm font-semibold ${
                        a.status === 'Present'
                          ? 'text-green-600'
                          : a.status === 'Absent'
                          ? 'text-red-500'
                          : 'text-gray-500'
                      }`}
                    >
                      Status: {a.status}
                    </span>

                    {/* Conditionally show attend button if applicable */}
                    {!hasCheckedIn || !hasCheckedOut ? (
                      <button
                        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        onClick={() => setAttend(a.id)}
                      >
                        Join
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">Attended</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full shadow-inner">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      {attend  && <CheckAttendanceModal attendanceId={attend} onClose={() => setAttend(null)}/>}
    </>
  );
}
