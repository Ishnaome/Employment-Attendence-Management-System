'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';

type User = {
  id: number;
};

type Attendance = {
  id: number;
  employeeID: number;
  label: string;
  date: string;
  checkInTime: string;
  checkOutTime: string | null;
  status: string;
};

type Role = {
  id: number;
  name: string;
};

type EmployeeRole = {
  id: number;
  employeeId: number;
  role: number; // FK to roles.id
};

type LoggedInUser = {
  role: string;
  employeeId: number;
};

export default function ReportsPage() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [totalRoles, setTotalRoles] = useState(0);

  useEffect(() => {
    async function fetchReports() {
      try {
        const currentUser: LoggedInUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const { role: userRoleName } = currentUser;

        const [users, attendance, roles, employeeRoles] = await Promise.all([
          apiClient<User[]>('/users', { method: 'GET' }),
          apiClient<Attendance[]>('/attendance/all', { method: 'GET' }),
          apiClient<Role[]>('/roles/all', { method: 'GET' }),
          apiClient<EmployeeRole[]>('/employeeRoles', { method: 'GET' }),
        ]);

        setTotalUsers(users.length);
        setTotalRoles(roles.length);

        const matchedRole = roles.find(r => r.name === userRoleName);
        if (!matchedRole) return;

        const matchedEmployeeIds = employeeRoles
          .filter(er => er.role === matchedRole.id)
          .map(er => er.employeeId);

        const filteredAttendance = attendance.filter(record =>
          matchedEmployeeIds.includes(record.employeeID)
        );

        setTotalAttendance(filteredAttendance.length);
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    }

    fetchReports();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">Reports</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
          <p className="text-3xl text-indigo-600">{totalUsers}</p>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold text-gray-700">Total Attendance</h2>
          <p className="text-3xl text-indigo-600">{totalAttendance}</p>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold text-gray-700">Total Roles</h2>
          <p className="text-3xl text-indigo-600">{totalRoles}</p>
        </div>
      </div>
    </div>
  );
}
