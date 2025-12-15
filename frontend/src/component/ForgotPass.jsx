import React, { useState } from "react";

const ForgotPass = ({ isOpen, onClose, onBack }) => {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  /* ===================== HANDLERS ===================== */

  const sendOTP = async () => {
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp.trim()) {
      setError("OTP is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!passwords.password || !passwords.confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (passwords.password !== passwords.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
        const res = await fetch("http://localhost:5000/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            email,
            otp,
            newPassword: passwords.password,
            }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setSuccess("Password updated successfully !");

        setTimeout(() => {
        onClose();       // close forgot popup
        onBack();        // return to login
        }, 1500);

    } 
    catch (err) {
      setError(err.message);
    } 
    finally {
      setLoading(false);
    }
  };

  /* ===================== UI ===================== */

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
        {success && (
            <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50
                px-6 py-3 rounded-lg shadow-lg flex items-center gap-4
                bg-green-900 
                text-white transition-all duration-300 ease-out">
                {success}
            </div>
        )}

        <div className="relative bg-slate-800 w-full max-w-md p-8 max-md:m-6 rounded-2xl">

        <button
          onClick={onBack}
          className="absolute top-4 left-4 text-gray-400 hover:text-white"
        >
          ← Back
        </button>


        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-center text-white mb-6">
          Forgot Password
        </h2>

        {/* ERROR */}
        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/40"
            />
            <button
              onClick={sendOTP}
              disabled={loading}
              className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-500"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/40"
            />
            <button
              onClick={verifyOTP}
              disabled={loading}
              className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-500"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="New password"
              value={passwords.password}
              onChange={(e) =>
                setPasswords({ ...passwords, password: e.target.value })
              }
              className="w-full mb-3 px-4 py-3 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/40"
            />

            <input
              type="password"
              placeholder="Confirm password"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full mb-4 px-4 py-3 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/40"
            />

            <button
              onClick={resetPassword}
              disabled={loading}
              className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-500"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPass;
