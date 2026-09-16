import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "Client",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roles = ["Client"];

  const isValidPhone = (phone) => /^\d{10}$/.test(phone);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setFormData({ ...formData, [name]: sanitizedValue });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidPhone(formData.phone.trim())) {
      setError("Please add a valid 10-digit phone number.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      // Call backend registration API
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // FIXED: Included phone in the payload body stringify block
        body: JSON.stringify({
          name: formData.username.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! Please check your email to verify your account.");
        navigate("/login");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Failed to connect to server. Please check if backend is running.");
    } finally {
      loading && setLoading(false);
    }
  };

  const handleSignInNav = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-[#0a0f24] font-sans relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1920&q=80"
          alt="Concert Background"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0f24] via-[#0d153a]/90 to-[#0a0f24]/80"></div>
      </div>

      <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-center p-6 md:p-12 lg:gap-16 max-w-7xl mx-auto">
        <div className="hidden lg:flex flex-col text-white max-w-md space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xl">
              E
            </div>
          </div>
          <h1 className="text-5xl font-black tracking-tight uppercase leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-blue-400">
            Events <br /> That Inspire
          </h1>
          <p className="text-slate-400 text-lg">
            Create an account to discover, book, and coordinate extraordinary events around you.
          </p>
        </div>

        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-white shadow-2xl shadow-black/40">
          <div className="space-y-2 mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Get Started</h2>
            <p className="text-sm text-slate-400">
              Create your account to continue your journey with us.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Registering As
              </label>
              <div className="grid grid-cols-4 gap-1.5 bg-black/20 p-1 rounded-xl border border-white/5">
                {roles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role })}
                    className={`py-1.5 px-1 text-[11px] font-medium rounded-lg transition-all truncate ${formData.role === role
                      ? "bg-blue-600 text-white font-semibold"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Client name</label>
              <input
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ex: abc@gmail.com"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Phone Number</label>
                <input
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="1234567890"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Password</label>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
              />
            </div>

            {error && (
              <p className="text-sm text-red-100 bg-red-500/20 border border-red-300/30 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition-all text-white font-semibold text-sm rounded-xl mt-2 tracking-wide uppercase disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "CREATING ACCOUNT..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400 pt-4 border-t border-white/5">
            Already have an account?{" "}
            <button
              type="button"
              onClick={handleSignInNav}
              className="text-blue-400 hover:underline hover:text-blue-300 font-medium ml-1 bg-transparent border-none cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;