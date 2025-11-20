'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';

interface OTPModalProps {
  type: string | null;
  email: string;
  onClose: () => void;
}

export default function OTPModal({ type, email, onClose }: OTPModalProps) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

const handleVerify = async () => {
  setError(false);

  if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
    setError(true);
    setMessage('Please enter a valid OTP.');
    return;
  }

  const stored = localStorage.getItem(`otp_${email}`);
  if (!stored) {
    setError(true);
    setMessage('No OTP found for this email. Please sign up again.');
    return;
  }

  try {
    const { value, expiresAt } = JSON.parse(stored);

    if (Date.now() > expiresAt) {
      localStorage.removeItem(`otp_${email}`);
      setError(true);
      setMessage('OTP has expired. Please request a new one.');
      return;
    }

    if (otp !== value) {
      setError(true);
      setMessage('Invalid OTP. Please try again.');
      return;
    }

    // OTP verified
    localStorage.removeItem(`otp_${email}`);
    setMessage('OTP verified successfully.');

    // ✅ Step 1: Find employee by email
    const employeesResponse = await apiClient('/employees', { method: 'GET' });
    const employees = Array.isArray(employeesResponse) ? employeesResponse : [];
    const employee = employees.find((e: any) => e.email === email);

    if (!employee) {
      setError(true);
      setMessage('Employee not found.');
      return;
    }

    const employeeId = employee?.id;

    // ✅ Step 2: Find role mapping from employeeRoles
    const empRolesResponse = await apiClient('/employeeRoles', { method: 'GET' });
    const empRoles = Array.isArray(empRolesResponse) ? empRolesResponse : [];
    const empRole = empRoles.find((er: any) => er.employeeId === employeeId);

    if (!empRole) {
      setError(true);
      setMessage('Role mapping not found for employee.');
      return;
    }
    
    const roleId = empRole?.roleId;

    // ✅ Step 3: Find role name from roles
    const rolesResponse = await apiClient('/roles/all', { method: 'GET' });
    const roles = Array.isArray(rolesResponse) ? rolesResponse : [];
    const role = roles.find((r: any) => r.id === roleId);

    if (!role) {
      setError(true);
      setMessage('Role not found.');
      return;
    }

    const roleName = role?.name;
    alert(roleName)
    

    // ✅ Step 4: Store session to localStorage
    localStorage.setItem('user', JSON.stringify({
      id: employeeId,
      name: employee.firstName +" "+employee.lastName,
      email,
      role: roleName,
    }));

    // ✅ Step 5: Redirect based on role
    switch (roleName.toLowerCase()) {
      case 'employeer':
        router.push('/employeer');
        break;
      case 'student':
      case 'user':
      case 'employee':
        router.push('/dashboard');
        break;
      case 'admin':
        router.push('/employeer');
        break;
      default:
        router.push('/dashboard');
        break;
    }

  } catch (err: any) {
    console.error(err);
    setError(true);
    setMessage('OTP verification failed. Please try again.');
  }
};

  return (
    <div className="fixed inset-0 backdrop-brightness-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm space-y-4">
        <div className="relative">
          <i className="bi bi-x-circle font-bold text-2xl -mt-3 cursor-pointer absolute right-0" onClick={onClose}></i>
          <h2 className="text-2xl font-bold text-center text-blue-700">Enter OTP</h2>
        </div>
        <p className="text-sm text-gray-600 mb-2 text-center">
          Sent to <span className="font-medium">{email}</span>
        </p>
        {message && (
          <div className={`p-2 text-sm text-center rounded ${error ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            {message}
          </div>
        )}
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full px-4 py-2 mb-4 border rounded"
        />
        <div className="flex">
          <button
            onClick={handleVerify}
            disabled={!otp}
            className="px-4 py-2 cursor-pointer w-full bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-no-drop"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}
