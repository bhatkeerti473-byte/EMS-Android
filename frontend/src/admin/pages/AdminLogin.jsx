import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);

    const images = useMemo(
        () => [
            "https://images.unsplash.com/photo-1552664730-d307ca884978",
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
            "https://images.unsplash.com/photo-1552664730-d307ca884978",
            "https://images.unsplash.com/photo-1516534775068-bb6c2dc8e90e",
        ],
        []
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Hardcoded admin credentials validation
            if (email === "admin@gmail.com" && password === "admin@123") {
                // Store admin session
                localStorage.setItem("adminToken", "admin_token_" + Date.now());
                localStorage.setItem("adminEmail", email);
                setLoading(false);
                navigate("/admin/dashboard");
            } else {
                setError("Invalid email or password. Use admin@gmail.com / admin@123");
                setLoading(false);
            }
        } catch (err) {
            setError("Login failed. Please try again.");
            setLoading(false);
        }
    };

    return (
        <main
            className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative overflow-hidden"
            style={{
                backgroundImage: `url(${images[currentImage]})`,
                transition: "background-image 1s ease-in-out",
            }}
        >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/70"></div>

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row items-center justify-between px-6">

                {/* LEFT SIDE */}
                <div className="text-white md:w-1/2 mb-10 md:mb-0">
                    <h1 className="text-6xl font-extrabold leading-tight">
                        ADMIN
                        <br />
                        <span className="text-amber-400">CONTROL CENTER</span>
                    </h1>
                    <p className="mt-6 text-xl text-gray-200 max-w-lg">
                        Manage events, staff, vendors, and all event operations from a single platform.
                    </p>
                </div>

                {/* RIGHT SIDE - LOGIN FORM */}
                <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[35px] p-10 shadow-2xl">
                    <h2 className="text-4xl font-bold text-white mb-2 text-center">
                        Admin Login
                    </h2>
                    <p className="text-gray-200 mb-8 text-center text-sm">
                        Enter your admin credentials
                    </p>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-5 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <label className="text-white block mb-2 font-semibold">Email</label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-4 rounded-xl mb-5 outline-none text-black placeholder-gray-500"
                            required
                        />

                        <label className="text-white block mb-2 font-semibold">Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 rounded-xl mb-6 outline-none text-black placeholder-gray-500"
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-amber-600 hover:bg-amber-700 transition-all text-white p-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "SIGNING IN..." : "SIGN IN"}
                        </button>
                    </form>


                </div>
            </div>
        </main>
    );
}

export default AdminLogin;
