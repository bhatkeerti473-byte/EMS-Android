import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("verifying"); // verifying, success, error
    const [message, setMessage] = useState("");

    const token = searchParams.get("token");

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setStatus("error");
                setMessage("Invalid verification link.");
                return;
            }

            try {
                // Calling backend verification endpoint
                // FIXED: Hits your explicit backend path layout perfectly
                const response = await fetch(`http://localhost:5000/api/auth/verify-email/${token}`);
                const data = await response.json();

                if (response.ok || data.success) {
                    setStatus("success");
                    setMessage("Your email has been verified successfully!");
                } else {
                    setStatus("error");
                    setMessage(data.message || "Verification failed or token expired.");
                }
            } catch (error) {
                setStatus("error");
                setMessage("Failed to connect to the authentication server.");
            }
        };

        verifyToken();
    }, [token]);

    return (
        <div className="min-h-screen flex bg-[#0a0f24] font-sans items-center justify-center p-6 relative overflow-hidden">
            {/* Background Concert Image with Overlay to match style guide */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1920&q=80"
                    alt="Concert Background"
                    className="w-full h-full object-cover opacity-10"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0f24] via-[#0d153a]/90 to-[#0a0f24]/80"></div>
            </div>

            <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-white text-center shadow-2xl shadow-black/40">

                {/* --- STATE: VERIFYING --- */}
                {status === "verifying" && (
                    <div className="space-y-4 py-4">
                        <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <h2 className="text-xl font-bold tracking-tight">Verifying your email...</h2>
                        <p className="text-sm text-slate-400">Please wait while we validate your activation token.</p>
                    </div>
                )}

                {/* --- STATE: SUCCESS --- */}
                {status === "success" && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="h-16 w-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 text-3xl font-light">
                            ✓
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold tracking-tight text-emerald-400">Email Verified!</h2>
                            <p className="text-sm text-slate-400">{message}</p>
                        </div>
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition-all text-white font-semibold text-sm rounded-xl uppercase tracking-wide shadow-lg shadow-blue-600/20"
                        >
                            Go to Sign In
                        </button>
                    </div>
                )}

                {/* --- STATE: ERROR --- */}
                {status === "error" && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="h-16 w-16 bg-red-500/20 border border-red-500/40 rounded-full flex items-center justify-center mx-auto text-red-400 text-2xl font-light">
                            ✕
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold tracking-tight text-red-400">Verification Failed</h2>
                            <p className="text-sm text-slate-400">{message}</p>
                        </div>
                        <button
                            onClick={() => navigate("/register")}
                            className="w-full py-3 bg-white/10 hover:bg-white/20 active:scale-[0.99] transition-all text-white font-semibold text-sm rounded-xl uppercase tracking-wide"
                        >
                            Back to Registration
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default VerifyEmail;