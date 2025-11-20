'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';

interface SetRoleModalProps {
  userId: string;
  onClose: () => void;
}
interface Role{
  id: any;
  name: any;
}
export default function RoleModal({ userId, onClose }: SetRoleModalProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setError] = useState(false);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await apiClient<Role[]>('/roles/all', { method: 'GET' });
        setRoles(res);
      } catch {
        setError(true);
        setMessage('Failed to load roles.');
      }
    }

    fetchRoles();
  }, []);

  const handleSetRole = async () => {
    setError(false);
    setMessage('');

    if (!selectedRole) {
      setError(true);
      setMessage('Please select a role.');
      return;
    }

    try {
      const session = JSON.parse(localStorage.getItem('user') || '{}');
      if (session && (session.role).toLowerCase() !== 'employeer') {
        
        if( selectedRole === '45a53c58-1097-409c-b549-a508b5808890' ||  selectedRole === 'fbf9de4e-7c4b-4563-8e5d-8fa38d4e5cb4'){
          setError(true);
          setMessage("Not authorized to add this role");
          return;
        }
          
        }

      await apiClient(`/employeeRoles`, {
        method: 'POST',
        body: { roleId: selectedRole, employeeId: userId },
      });

      setMessage('Role updated successfully.');
    } catch (err: any) {
      setError(true);
      setMessage(err.message || 'Failed to update role.');
    }
  };

  return (
    <div className="fixed inset-0 backdrop-brightness-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm space-y-4">
        <div className="relative">
          <i className="bi bi-x circle text-xl font-bold cursor-pointer absolute right-0" onClick={onClose}></i>
          <h2 className="text-xl font-bold text-center text-blue-700">Set Role</h2>
        </div>

        {message && (
          <div className={`p-2 text-sm text-center rounded ${isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            {message}
          </div>
        )}

        <input
          value={userId}
          
          className="w-full px-4 py-2 border rounded bg-gray-100"
        />

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        >
          <option value="">Select Role</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>

        <button
          onClick={handleSetRole}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded mt-4"
        >
          Set Role
        </button>
      </div>
    </div>
  );
}
