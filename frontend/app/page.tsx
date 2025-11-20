'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { apiClient } from '@/lib/apiClient';
import SignupModal from './components/auth/signup';
import ForgotPasswordModal from './components/auth/fogotPassword';
import OTPModal from './components/auth/verifyOtp';

export default function AttendanceLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setError] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [message]);

const handleLogin = async () => {
  setError(false);

  if (!username || !password) {
    setError(true);
    setMessage('Username and password are required.');
    return;
  }

  try {
    // Step 1: Fetch all users and find the matching one
    const users = await apiClient('/users', { method: 'GET' }) as any[];
    const user = users.find((u: any) => u.username === username && u.password === password);

    if (!user) {
      setError(true);
      setMessage('Invalid credentials.');
      return;
    }

    // Step 2: Fetch all employees and find the one linked to the user
    const employees = await apiClient('/employees', { method: 'GET' }) as any[];
    const employee = employees.find((e: any) => e.userId === user.id);

    if (!employee) {
      setError(true);
      setMessage('User record not found for this user, please contact administrator.');
      return;
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpData = {
      value: otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    localStorage.setItem(`otp_${employee.email}`, JSON.stringify(otpData));

    const mailRes = await fetch('/api/ap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: employee.firstName,
        email: employee.email,
        otp,
      }),
    });

    if (!mailRes.ok) {
      const err = await mailRes.json();
      setError(true);
      setMessage(err.message || 'Failed to send OTP.');
      return;
    }
    setEmail(employee.email);
    setMessage(`Welcome, ${employee.firstName}`);
    setShowOTP(true);

  } catch (err) {
    setError(true);
    setMessage('Login failed. Please try again.');
  }
};


  return (
    <>
      <title>Login - Attendance System</title>
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-6">
        <div className="max-w-5xl w-full grid md:grid-cols-2 bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Login Form */}
          <div className="p-12 space-y-6">
            <h2 className="text-3xl font-bold text-indigo-700">Attendance Login</h2>
            <p className="text-gray-600 text-sm">
              Access your attendance dashboard. Enter your credentials to continue.
            </p>

            {message && (
              <div className={`p-2 rounded text-sm ${isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {message}
              </div>
            )}

            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className='flex justify-between items-center'>
              <a href="#forgot" className='text-red-500 text-sm py-1' onClick={() => setShowReset(true)}>Forgot password?</a>
              <a href="#register" className='text-indigo-500 text-sm py-1' onClick={() => setShowSignup(true)}>Create Account</a>
            </div>
            <button
              onClick={handleLogin}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded transition"
              disabled={!username || !password}
            >
              Login
            </button>
          </div>

          {/* Illustration Side */}
          <div className="hidden md:flex flex-col justify-center items-center bg-indigo-50 p-10 text-center">
            <Image src="/logo.svg" alt="Attendance Illustration" width={160} height={160} />
            <h3 className="text-2xl font-bold text-indigo-800 mt-6">Welcome to Attendance System</h3>
            <p className="text-gray-700 mt-4 max-w-sm">
              Track attendance records, manage employee data, and streamline reporting all in one place.
            </p>
          </div>
        </div>
      </div>
       {showOTP && (
              <OTPModal
                type={null}
                email={email}
                onClose={() => {
                  setShowOTP(false);
                }}
              />
            )}
      
            {showSignup && (
              <SignupModal onClose={() => setShowSignup(false)} />
            )}
      
            {showReset && (
              <ForgotPasswordModal onClose={() => setShowReset(false)} />
            )}
    </>
  );
}
