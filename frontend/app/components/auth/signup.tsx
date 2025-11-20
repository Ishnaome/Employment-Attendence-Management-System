'use client';

import { apiClient } from '@/lib/apiClient';
import { useState } from 'react';
import OTPModal from './verifyOtp';

interface SignupModalProps {
  onClose: () => void;
}

export default function SignupModal({ onClose }: SignupModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [verify, setVerify] = useState(false);

const handleSignup = async () => {
  setIsError(false);
  setMessage('');

  // Validate fields
  if (!firstName || !lastName || !email || !address || !phoneNumber || !username || !password) {
    setIsError(true);
    setMessage('All fields are required.');
    return;
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    setIsError(true);
    setMessage('Invalid email format.');
    return;
  }

  if (!/^\d{10}$/.test(phoneNumber)) {
    setIsError(true);
    setMessage('Phone number must be 10 digits.');
    return;
  }

try {
    const [userRes, employeeRes] = await Promise.all([
      apiClient('/users', { method: 'GET' }),
      apiClient('/employees', { method: 'GET' }),
    ]);

    const existingUsers = Array.isArray(userRes) ? userRes : [];
    const existingEmployees = Array.isArray(employeeRes) ? employeeRes : [];

    const usernameExists = existingUsers.some((u: any) => u.username === username);
    const emailExists = existingEmployees.some((e: any) => e.email === email);
    const phoneExists = existingEmployees.some((e: any) => e.phone === phoneNumber);

    if (usernameExists) {
      setIsError(true);
      setMessage('Username already exists.');
      return;
    }

    if (emailExists) {
      setIsError(true);
      setMessage('Email already exists.');
      return;
    }

    if (phoneExists) {
      setIsError(true);
      setMessage('Phone number already exists.');
      return;
    }

    // Step 1: Save to /users
    await apiClient('/users', {
      method: 'POST',
      body: { role: 'User', username, password },
    });

    // Step 2: Fetch the newly created user
    const users = await apiClient('/users', { method: 'GET' }) as any[];
    const user = users.find((u: any) => u.username === username);

    if (!user) {
      setIsError(true);
      setMessage('User creation failed.');
      return;
    }

    // Step 3: Save to /employees
    await apiClient('/employees', {
      method: 'POST',
      body: {
        firstName,
        lastName,
        email,
        phone: phoneNumber,
        address,
        userId: user.id,
        department_id: ''
      },
    });

    // Step 4: Generate OTP and send email
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem(`otp_${email}`, JSON.stringify({
      value: otp,
      expiresAt: Date.now() + 10 * 60 * 1000
    }));

    const mailRes = await fetch('/api/ap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name: `${firstName} ${lastName}`, otp }),
    });

    if (!mailRes.ok) {
      throw new Error('Failed to send OTP.');
    }

    setMessage('Account created. OTP sent.');
    setVerify(true);
  } catch (err: any) {
    setIsError(true);
    setMessage(err.message || 'Signup failed.');
  }
};

  return (
    <>
      <div className="fixed inset-0 backdrop-brightness-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm space-y-4">
          <div className="relative">
            <i className="bi bi-x-circle font-bold text-2xl -mt-3 cursor-pointer absolute right-0" onClick={onClose}></i>
            <h2 className="text-2xl font-bold text-center text-blue-700">Create Account</h2>
          </div>

          {message && (
            <div className={`p-2 text-sm text-center rounded ${isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {message}
            </div>
          )}

          <input type="text" placeholder="First Name" className="w-full px-4 py-2 border rounded" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input type="text" placeholder="Last Name" className="w-full px-4 py-2 border rounded" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="text" placeholder="Phone Number" className="w-full px-4 py-2 border rounded" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          <input type="text" placeholder="Address" className="w-full px-4 py-2 border rounded" value={address} onChange={(e) => setAddress(e.target.value)} />
          <input type="text" placeholder="Username" className="w-full px-4 py-2 border rounded" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full px-4 py-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button onClick={handleSignup} className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Register
          </button>
        </div>
      </div>

      {verify && (
        <OTPModal type={null} email={email} onClose={() => setVerify(false)} />
      )}
    </>
  );
}
