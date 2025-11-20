'use client';

import { apiClient } from '@/lib/apiClient';
import React, { useEffect, useState } from 'react';


type Role = {
  id: number;
  name: string;
};

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('user') || '{}');
    if (session) {
      setUserId(session.role);
    }
  }, []);

  const fetchRoles = async () => {
    try {
      const roles = await apiClient('/roles/all', { method: 'GET' }) as Role[];
      setRoles(roles);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const addRole = async () => {
    if (!newRole.trim()) return;
    try {
      setLoading(true);
      await apiClient('/roles', {method: 'POST', body: { name: newRole }});
      setNewRole('');
      fetchRoles(); // refresh the list
    } catch (error) {
      console.error('Failed to add role:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-indigo-700">Roles Management</h1>

      <div className="mb-6 flex items-center gap-2">
        <input
          type="text"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          placeholder="Enter role name"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <button
          onClick={addRole}
          disabled={loading || userId.toLowerCase() !== 'admin'}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Role'}
        </button>
      </div>

      <table className="w-full border border-collapse border-gray-300">
        <thead className="bg-indigo-100 text-indigo-800">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Role Name</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{role.id}</td>
              <td className="px-4 py-2 border">{role.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
