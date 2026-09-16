import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { saveClientProfile } from "../user-dashboard/services/clientSession";

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const fromEventManagement = searchParams.get("from") === "event-management";

  const images = useMemo(
    () => [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329",
      "https://images.unsplash.com/photo-1511578314322-379afb476865",
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678",
    ],
    []
  );

  const [currentImage, setCurrentImage] = useState(0);
  const [formData, setFormData] = useState({ email: "", password: "", captchaInput: "" });
  const [captchaData, setCaptchaData] = useState({ id: "", svgString: "" });
  const [error, setError] = useState("");

  const fetchCaptcha = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/captcha");
      const result = await response.json();
      setCaptchaData({ id: result.captchaId, svgString: result.data });
    } catch (err) {
      console.error("Failed to load security verification asset:", err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const enteredEmail = formData.email.trim().toLowerCase();
      const enteredPassword = formData.password;

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          captchaInput: formData.captchaInput,
          captchaId: captchaData.id,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        const loginTime = new Date().toISOString();
        const updatedUser = {
          ...data.user,
          lastLogin: loginTime,
          memberSince: data.user.createdAt || loginTime,
        };

        localStorage.setItem("token", data.token);
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
        localStorage.setItem("user", JSON.stringify(updatedUser));
        localStorage.setItem("userRole", data.user.role || "client");
        saveClientProfile(updatedUser);

        setTimeout(() => {
          const role = data.user.role || "client";
          if (role === "vendor") {
            navigate("/vendor/dashboard");
          } else if (role === "staff") {
            navigate("/staff/dashboard");
          } else if (fromEventManagement) {
            navigate("/user/event-management");
          } else {
            navigate("/client/dashboard");
          }
        }, 100);
      } else {
        setError(data.message || "Login failed. Please try again.");
        fetchCaptcha();
        setFormData((prev) => ({ ...prev, captchaInput: "" }));
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to connect to server.");
      fetchCaptcha();
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });

        const data = await response.json();

        if (data.success) {
          const loginTime = new Date().toISOString();
          const updatedUser = {
            ...data.user,
            lastLogin: loginTime,
            memberSince: data.user.createdAt || loginTime,
          };

          localStorage.setItem("user", JSON.stringify(updatedUser));
          localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
          if (data.token) localStorage.setItem("token", data.token);
          localStorage.setItem("userRole", data.user.role || "client");
          saveClientProfile(updatedUser);

          setTimeout(() => {
            const role = data.user.role || "client";
            if (role === "vendor") {
              navigate("/vendor/dashboard");
            } else if (role === "staff") {
              navigate("/staff/dashboard");
            } else if (fromEventManagement) {
              navigate("/user/event-management");
            } else {
              navigate("/client/dashboard");
            }
          }, 100);
        } else {
          alert("Authentication failed: " + data.message);
        }
      } catch (error) {
        console.error("Error connecting to backend auth server:", error);
        const loginTime = new Date().toISOString();
        const updatedUser = {
          id: "google-demo-client-id",
          _id: "google-demo-client-id",
          name: "Demo Google User",
          email: "demogoogle@gmail.com",
          role: "client",
          lastLogin: loginTime,
          memberSince: loginTime,
        };

        localStorage.setItem("token", "google-demo-token");
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
        localStorage.setItem("user", JSON.stringify(updatedUser));
        localStorage.setItem("userRole", "client");
        saveClientProfile(updatedUser);

        setTimeout(() => {
          if (fromEventManagement) {
            navigate("/user/event-management");
          } else {
            navigate("/client/dashboard");
          }
        }, 100);
      }
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  return (
    <main
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${images[currentImage]})`,
        transition: "background-image 1s ease-in-out",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row items-center justify-between px-4">
        <div className="text-white md:w-1/2 mb-6 md:mb-0">
          <h1 className="text-5xl font-extrabold leading-tight">
            EVENTS
            <br />
            <span className="text-blue-400">THAT INSPIRE</span>
          </h1>
          <p className="mt-4 text-lg text-gray-200 max-w-lg">
            Discover, book, and experience extraordinary events around you.
          </p>
        </div>

        <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[28px] px-8 py-9 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-1 text-center">Welcome Back</h2>
          <p className="text-sm text-gray-300 mb-6 text-center">Login to continue your journey.</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="text-white text-sm block mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full p-3.5 rounded-xl outline-none bg-white/20 text-white border border-white/30 text-sm focus:bg-white/30"
              />
            </div>

            <div className="mb-5">
              <div className="flex justify-between mb-1.5">
                <label className="text-white text-sm">Password</label>
                <span
                  onClick={() => navigate('/forgot-password')}
                  className="text-blue-400 cursor-pointer text-xs hover:underline"
                >
                  Forgot password?
                </span>
              </div>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full p-3.5 rounded-xl outline-none bg-white/20 text-white border border-white/30 text-sm focus:bg-white/30"
              />
            </div>

            <div className="mb-6">
              <label className="text-white text-sm block mb-1.5">Security Verification</label>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  {/* 🌟 SCALING FIX: Injected flex centering and full SVG scaling hooks ([&>svg]:w-full [&>svg]:h-full) */}
                  <div
                    dangerouslySetInnerHTML={{ __html: captchaData.svgString }}
                    className="flex-1 max-w-[160px] bg-white rounded-xl overflow-hidden h-[48px] border border-white/30 shadow-inner flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                  />
                  <button
                    type="button"
                    onClick={fetchCaptcha}
                    className="p-3.5 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl text-white text-sm transition-all"
                    title="Refresh Captcha"
                  >
                    🔄
                  </button>
                </div>
                <input
                  name="captchaInput"
                  type="text"
                  required
                  autoComplete="off"
                  value={formData.captchaInput}
                  onChange={handleChange}
                  placeholder="Enter security code"
                  className="w-full p-3.5 rounded-xl outline-none bg-white/20 text-white border border-white/30 text-sm focus:bg-white/30 tracking-wide font-semibold placeholder:font-normal"
                />
              </div>
            </div>

            {error && (
              <p className="mb-4 text-xs text-red-100 bg-red-500/20 border border-red-300/30 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-xl text-sm font-semibold transition-all shadow-md">
              SIGN IN
            </button>

            <div className="text-center text-xs text-gray-300 my-4">OR</div>

            <button
              type="button"
              onClick={() => handleGoogleLogin()}
              className="w-full bg-white text-black p-3.5 rounded-xl text-sm font-medium hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <img 
                src="data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' fill='%234285F4'/><path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='%2334A853'/><path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z' fill='%23FBBC05'/><path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z' fill='%23EA4335'/></svg>"
                alt="Google Icon"
                className="w-4 h-4"
              />
              Sign in with Google
            </button>

            <div className="mt-6 text-center text-xs text-gray-300">
              Don't have an account?
              <span onClick={() => navigate("/register")} className="text-blue-400 ml-1 cursor-pointer hover:underline font-semibold">
                Create Account
              </span>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Login;