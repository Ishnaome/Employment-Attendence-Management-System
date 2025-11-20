'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import RoleModal from '@/app/components/appointment/role';
import SignupModal from '@/app/components/auth/signup';

type User = {
  id: number;
  username: string;
};

type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  userId: number;
};

type EmployeeRole = {
  employeeId: number;
  roleId: number;
};

type Role = {
  id: number;
  name: string;
};

type CombinedUser = {
  id: number;
  username: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
};

export default function UserPage() {
  const [combinedUsers, setCombinedUsers] = useState<CombinedUser[]>([]);
  const [search, setSearch] = useState('');
  const [addRole, setAddRole] = useState<string | null>(null);
  const [addUser, setAddUser] = useState(false);


  useEffect(() => {
    async function fetchData() {
      try {
        const [usersResponse, employeesResponse, rolesResponse, empRolesResponse] = await Promise.all([
          apiClient('/users', { method: 'GET' }),
          apiClient('/employees', { method: 'GET' }),
          apiClient('/roles/all', { method: 'GET' }),
          apiClient('/employeeRoles', { method: 'GET' }),
        ]);

        const users: User[] = Array.isArray(usersResponse) ? usersResponse : [];
        const employees: Employee[] = Array.isArray(employeesResponse) ? employeesResponse : [];
        const roles: Role[] = Array.isArray(rolesResponse) ? rolesResponse : [];
        const empRoles: EmployeeRole[] = Array.isArray(empRolesResponse) ? empRolesResponse : [];


        const userMap = Object.fromEntries(users.map(user => [user.id, user.username]));
        const roleMap = Object.fromEntries(roles.map(role => [role.id, role.name]));

        const empRoleMap: Record<number, number | null> = {};
        empRoles.forEach(er => {
          empRoleMap[er.employeeId] = er.roleId;
        });

        const combined: CombinedUser[] = employees
          .filter(emp => userMap[emp.userId])
          .map(emp => ({
            id: emp.id,
            username: userMap[emp.userId],
            role: roleMap[empRoleMap[emp.id] ?? -1] ?? 'Unassigned',
            firstName: emp.firstName,
            lastName: emp.lastName,
            email: emp.email,
            phone: emp.phone,
            address: emp.address,
          }));

        setCombinedUsers(combined);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setCombinedUsers([]);
      }
    }

    fetchData();
  }, []);

  const filteredUsers = combinedUsers.filter(user => {
    const term = search.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(term) ||
      user.lastName.toLowerCase().includes(term) ||
      user.username.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  });

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await apiClient(`/employees/${id}`, { method: 'DELETE' });
      setCombinedUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };



  return (
    <>
      <title>Users</title>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-indigo-700">Users</h1>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name, username, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded focus:outline-indigo-500"
          />
          <button
            onClick={() => setAddUser(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            + New User
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead className="bg-indigo-100 text-indigo-800">
              <tr>
                <th className="px-4 py-2 border">Username</th>
                <th className="px-4 py-2 border">Role</th>
                <th className="px-4 py-2 border">First Name</th>
                <th className="px-4 py-2 border">Last Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Address</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-gray-500 py-4">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-indigo-50">
                    <td className="px-4 py-2 border">{user.username}</td>
                    <td className="px-4 py-2 border">{user.role}</td>
                    <td className="px-4 py-2 border">{user.firstName}</td>
                    <td className="px-4 py-2 border">{user.lastName}</td>
                    <td className="px-4 py-2 border">{user.email}</td>
                    <td className="px-4 py-2 border">{user.phone}</td>
                    <td className="px-4 py-2 border">{user.address}</td>
                    <td className="px-4 py-2 border flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => setAddRole(String(user.id))}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                      >
                        Set Role
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {addUser && <SignupModal onClose={() => setAddUser(false)}/>}
      {addRole && <RoleModal userId={addRole} onClose={() => setAddRole(null)} />}
    </>
  );
}
