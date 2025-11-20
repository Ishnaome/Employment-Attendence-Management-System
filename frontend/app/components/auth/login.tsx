'use client';
import { useEffect, useState } from 'react';
import SignupModal from './signup';
import ForgotPasswordModal from './fogotPassword';
import OTPModal from './verifyOtp';
import { apiClient } from '@/lib/apiClient';

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {

  const [message, setMessage] = useState<string | null>(null);
  const [isError, setError] = useState(false);
  const [email, setEmail] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showReset, setShowReset] = useState(false);
  
  useEffect(() => {
    if (message || isError) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [message, isError]); // Fix here
  

 const handleEmailVerify = async () => {
  setError(false);

  try {
       // Format validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError(true);
      setMessage('Invalid email format.');
      return;
    }

    const users = await apiClient('/patients', { method: 'GET' }) as any[];
    const user = users.find((u: any) => u.email === email);

    if (!user || user.email !== email) {
      setError(true);
      setMessage('Email does not exists.');
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
        name: user.name,
        email: user.email,
        otp,
      }),
    });

    if (!mailRes.ok) {
      const err = await mailRes.json();
      setError(true);
      setMessage(err.message || 'Failed to send OTP.');
      return;
    }

    setEmail(user.email);
    setShowOTP(true);
  } catch (err: any) {
    setError(true);
    setError(err.message || 'Email verification failed');
  }
};

  return (
    <>
      <div className="fixed inset-0 backdrop-brightness-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm space-y-4">
          <div className='relative'>
            <i className="bi bi-x circle font-bold text-2xl -mt-3 cursor-pointer absolute right-0" onClick={onClose}></i>
            <h2 className="text-2xl font-bold text-center text-blue-700">Login</h2>
          </div>

         
          {message && (
            <div className={`p-2 text-sm text-center rounded ${isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
             {message}
            </div>
          )}

       
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded"
          />
  
          <div className="flex justify-between text-sm">
            <button onClick={() => setShowReset(true)}  className="text-yellow-600 hover:underline">Forgot email?</button>
            <button onClick={() => setShowSignup(true)} className="text-blue-600 cursor-pointer">
              Create account
            </button>
          </div>

          <div className="pt-4">
              <button
              onClick={handleEmailVerify}
              className="px-4 py-2 cursor-pointer w-full bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-no-drop"
              disabled={!email}
            >
              Login
            </button>
          </div>
        </div>
      </div>

      {showOTP && (
        <OTPModal
          type={null}
          email={email}
          onClose={() => {
            setShowOTP(false);
            onClose();
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
