import React, { useState } from "react";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // Step 1: Send OTP, Step 2: Verify & Reset
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // STEP 1: Request OTP Email
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const contentType = res.headers.get('content-type') || '';
      let data = {};

      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        setError(text || 'Invalid server response.');
        return;
      }

      if (res.ok && data.success) {
        setMessage(data.message || 'Verification code sent to email.');
        setStep(2); // Safely advance to OTP layout
      } else {
        setError(data?.message || 'Failed to send verification code.');
      }
    } catch (err) {
      console.error('Request OTP failed:', err);
      setError('Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP and Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!otp || !newPassword) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
          password: newPassword
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage(data.message || 'Password reset successfully!');
        setOtp("");
        setNewPassword("");
      } else {
        setError(data?.message || 'Failed to reset password.');
      }
    } catch (err) {
      console.error('Reset password failed:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617]">
      <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[35px] p-10 shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>

        {/* Step 1: Requesting OTP Form */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp}>
            <label className="block text-white mb-3 text-lg">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 mb-4 bg-transparent border border-white/20 rounded-2xl text-white placeholder:text-gray-400 outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
              disabled={loading}
            />
            {error && <div className="bg-red-600 text-white px-4 py-2 rounded-xl mb-4 text-center font-semibold">{error}</div>}
            {message && <div className="bg-green-600 text-white px-4 py-2 rounded-xl mb-4 text-center font-semibold">{message}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 transition py-3 rounded-2xl text-white font-bold text-lg mt-2 shadow-lg disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        {/* Step 2: Entering OTP & New Password Form */}
        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <label className="block text-white mb-2 text-lg">Verification Code</label>
            <input
              type="text"
              maxLength="6"
              autoComplete="one-time-code"
              className="w-full px-4 py-3 mb-4 bg-transparent border border-white/20 rounded-2xl text-white placeholder:text-gray-400 text-center tracking-widest font-bold text-xl outline-none"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              disabled={loading}
            />

            <label className="block text-white mb-2 text-lg">New Password</label>
            <input
              type="password"
              autoComplete="new-password"
              className="w-full px-4 py-3 mb-4 bg-transparent border border-white/20 rounded-2xl text-white placeholder:text-gray-400 outline-none"
              placeholder="Enter new password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              disabled={loading}
            />

            {error && <div className="bg-red-600 text-white px-4 py-2 rounded-xl mb-4 text-center font-semibold">{error}</div>}
            {message && <div className="bg-green-600 text-white px-4 py-2 rounded-xl mb-4 text-center font-semibold">{message}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:opacity-90 transition py-3 rounded-2xl text-white font-bold text-lg mt-2 shadow-lg disabled:opacity-50"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setMessage("");
                setError("");
              }}
              className="w-full text-gray-400 hover:text-white transition mt-4 text-center text-sm"
            >
              ← Back to Change Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;