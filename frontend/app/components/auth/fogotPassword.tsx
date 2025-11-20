'use client';
import { useState } from 'react';
import OTPModal from './verifyOtp';
import { apiClient } from '@/lib/apiClient';

interface ForgotPasswordModalProps {
  onClose: () => void;
}

export default function ForgotPasswordModal({ onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setError] = useState(false);
 
  const handleEmailVerify = async () => {
  setError(false);

  try {
       // Format validation
    if (!email) {
      setError(true);
      setMessage('Invalid phone number.');
      return;
    }

    const users = await apiClient('/employees', { method: 'GET' }) as any[];
    const user = users.find((u: any) => u.email === email);

    if (!user) {
      setError(true);
      setMessage('Email not found.');
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpData = {
      value: otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    localStorage.setItem(`otp_${user.email}`, JSON.stringify(otpData));

    const mailRes = await fetch('/api/ap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: user.firstName, 
        email: user.email,
        otp,
      }),
    });

    if (!mailRes.ok) {
      const err = await mailRes.json();
      setError(true);
      setMessage(err.message || 'Failed to verify.');
    }

    setShowOTP(true);
  } catch (err: any) {
    setError(true);
    setError(err.message || 'Phone verification failed');
  }
};

  return (
    <>
      <div className="fixed inset-0 backdrop-brightness-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm space-y-4">
          <div className='relative'>
            <i className="bi bi-x circle font-bold text-2xl -mt-3 cursor-pointer absolute right-0" onClick={onClose}></i>
            <h2 className="text-2xl font-bold text-center text-blue-700">Forgot password</h2>
          </div>

          {message && (
            <div className={`p-2 text-sm text-center rounded ${isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
             {message}
            </div>
          )}

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />

          <div className="flex pt-4">
            <button
              onClick={handleEmailVerify}
              className="px-4 py-2 cursor-pointer w-full bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-no-drop"
              disabled={!email}
            >
              Verify
            </button>
          </div>
        </div>
      </div>

      {showOTP && email && (
        <OTPModal
         type={"forgot"}
          email={email}
          onClose={() => {
            setShowOTP(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
