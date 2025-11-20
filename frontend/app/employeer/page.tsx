'use client';

import { useEffect, useState, useMemo } from 'react';
import { apiClient } from '@/lib/apiClient'; // Your fetch helper
import Link from 'next/link';


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

export default function EmployeerDashboard() {
  const [attendances, setAttendances] = useState<AttendanceWithEmployee[]>([]);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('user') || '{}');
    if (session && (session.role).toLowerCase() === 'employeer') {
      setUserId(Number(session.id));
    }
  }, []);


  useEffect(() => {
    if (userId === null) return;

    async function fetchData() {
      try {
        const [attendanceData, employeeRoles, roles] = await Promise.all([
          apiClient<Attendance[]>('/attendance/all', { method: 'GET' }),
          apiClient<EmployeeRole[]>('/employeeRoles', { method: 'GET' }),
          apiClient<Role[]>('/roles/all', { method: 'GET' }),
        ]);

        const userSession = JSON.parse(localStorage.getItem('user') || '{}');
        const loggedRole = userSession?.role;

        if (!loggedRole) return;

        // ✅ Step 1: Find matching role by name
        const matchingRole = roles.find(r => r.name === loggedRole);
        if (!matchingRole) return;
        
        // ✅ Step 2: Filter employeeRoles by roleId
        const allowedEmployeeIds = employeeRoles
          .filter(er => er.roleId === matchingRole.id)
          .map(er => er.employeeId);
        
        // ✅ Step 3: Filter attendance records for allowed employees
        const filteredAttendance = attendanceData.filter(
          a => allowedEmployeeIds.includes(a.employeeId)
        );

        const employeeIds = Array.from(new Set(filteredAttendance.map(a => a.employeeId)));
        const employeesMap: Record<number, Employee | null> = {};

      try {
        const allEmployees = await apiClient<Employee[]>('/employees', { method: 'GET' });

        employeeIds.forEach(id => {
          const emp = allEmployees.find(em => em.id === id);
          employeesMap[id] = emp || null;
        });
      } catch (err) {
        console.error('Failed to fetch employees', err);
      }


        // ✅ Step 4: Combine attendance with employee info
        const combined = filteredAttendance.map(a => ({
          ...a,
          employee: employeesMap[a.employeeId] || null,
        }));

        // ✅ Step 5: Sort by date and check-in time
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
  }, [userId]);

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

  return (
    <>
      <title>Employeer Dashboard - Recent Sessions</title>

      <div className="min-h-screen p-6 bg-gray-50">
        <div className="py-6">
            <h1 className="text-2xl font-bold text-indigo-700 mb-4">Welcome, Employeer</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/employeer/sessions">
                <div className="p-6 bg-white shadow rounded-xl hover:bg-indigo-50 transition cursor-pointer text-center">
                  <i className="bi bi-clock text-indigo-600 text-3xl"></i>
                  <p className="mt-2 font-semibold">Sessions</p>
                </div>
              </Link>
              <Link href="/employeer/users">
                <div className="p-6 bg-white shadow rounded-xl hover:bg-indigo-50 transition cursor-pointer text-center">
                  <i className="bi bi-people text-indigo-600 text-3xl"></i>
                  <p className="mt-2 font-semibold">Users</p>
                </div>
              </Link>
              <Link href="/employeer/roles">
                <div className="p-6 bg-white shadow rounded-xl hover:bg-indigo-50 transition cursor-pointer text-center">
                  <i className="bi bi-person-badge text-indigo-600 text-3xl"></i>
                  <p className="mt-2 font-semibold">Roles</p>
                </div>
              </Link>
              <Link href="/employeer/reports">
                <div className="p-6 bg-white shadow rounded-xl hover:bg-indigo-50 transition cursor-pointer text-center">
                  <i className="bi bi-bar-chart text-indigo-600 text-3xl"></i>
                  <p className="mt-2 font-semibold">Reports</p>
                </div>
              </Link>
            </div>
          </div>
       
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

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead className="bg-indigo-100 text-indigo-800">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Label</th>
                <th className="border border-gray-300 px-4 py-2 text-left">User Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">User Email</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Check In</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Check Out</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    No sessions found.
                  </td>
                </tr>
              )}
              {paginated.map((a) => (
                <tr key={a.id} className="hover:bg-indigo-50">
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                    {new Date(a.date).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">{a.label }</td>    
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">{a.employee?.firstName ?? '-'} {a.employee?.lastName }</td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">{a.employee?.email ?? '-'}</td>
                                    <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                    {new Date(a.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                    {a.checkOutTime
                      ? new Date(a.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : '-'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </>
  );
}
