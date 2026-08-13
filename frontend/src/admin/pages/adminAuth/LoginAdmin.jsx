import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff, FiLock, FiUser } from "react-icons/fi";
import { useAdminAuth } from "../../context/AdminAuthContext";

const API_BASE =
    import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

export default function LoginAdmin() {
    const [Name, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAdminAuth();

    async function handleLogin() {
        if (!Name || !password) {
            toast.error("Please enter username and password");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/admins/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Name, password }),
            });

            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                toast.error(text || "Login failed. Is the backend running on port 5000?");
                return;
            }

            if (!res.ok || !data.success) {
                toast.error(data.message || "Login Failed");
                return;
            }

            const adminData = data.admin || data.data?.admin;
            const token = data.token || data.data?.token;

            // Block super admins from using Normal Admin portal
            if (adminData?.role === "super_admin") {
                toast.error("Super Admins must use the Super Admin portal.");
                return;
            }

            login(token, adminData);
            toast.success("Login Successful");
            navigate("/admin-portal/dashboard");
        } catch (err) {
            toast.error("Login Failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-6">
            <div className="w-full max-w-md bg-[#14213D] rounded-3xl shadow-2xl p-8">

                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-[#E8EEF9] flex items-center justify-center">
                        <FiLock className="text-3xl text-[#14213D]" />
                    </div>
                </div>

                {/* Heading */}
                <h2 className="text-3xl font-bold text-center text-white prata-regular">
                    Admin Login
                </h2>
                <p className="text-center text-gray-300 mt-2 inter">
                    Login to access the admin dashboard
                </p>

                {/* Username */}
                <div className="relative mt-8">
                    <FiUser className="absolute left-4 top-4 text-gray-400" />
                    <input
                        type="text"
                        value={Name}
                        onChange={(e) => setUserName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        placeholder="Username"
                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-transparent text-white border border-gray-300 outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-[#FBBF24] transition inter"
                    />
                </div>

                {/* Password */}
                <div className="relative mt-5">
                    <FiLock className="absolute left-4 top-4 text-gray-400" />
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        placeholder="Password"
                        className="w-full h-12 pl-12 pr-12 rounded-xl bg-transparent text-white border border-gray-300 outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-[#FBBF24] transition inter"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        title={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                </div>

                {/* Login Button */}
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="mt-8 w-full h-12 rounded-xl bg-[#FBBF24] text-[#14213D] font-semibold hover:bg-[#d3a120] transition inter disabled:opacity-60"
                >
                    {loading ? "Logging in…" : "Login"}
                </button>

                {/* Register link */}
                <p className="mt-6 text-center text-gray-300 text-sm inter">
                    Don't have an account?
                    <Link
                        to="/admin-portal/register"
                        className="text-[#FBBF24] font-semibold hover:underline ml-1"
                    >
                        Register
                    </Link>
                </p>

                {/* Super Admin link */}
                <p className="mt-3 text-center text-gray-500 text-xs inter">
                    Are you a Super Admin?{" "}
                    <Link to="/admin/login" className="text-gray-400 hover:text-white underline">
                        Login here
                    </Link>
                </p>

            </div>
        </div>
    );
}
