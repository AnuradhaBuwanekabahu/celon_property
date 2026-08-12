import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import { loginSuperAdmin } from "../../api/superAdminAuth";

export default function LoginSuperAdmin() {
    const [Name, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    function handleLogin() {
        loginSuperAdmin({ Name, password })
            .then((res) => {
                console.log(res.data);
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("role", "superadmin");
                toast.success("Login successful");
                navigate("/superadmin/dashboard");
            })
            .catch((error) => {
                console.error("Error logging in:", error);
                if (error.response?.status === 401) {
                    toast.error("Invalid username or password");
                } else {
                    toast.error("Login failed");
                }
            });
    }

    return (
  <div className="w-full h-screen flex justify-center items-center bg-white px-6">

    <div className="w-[400px] bg-[#14213D] rounded-3xl shadow-2xl p-8 flex flex-col gap-5">

      {/* Logo */}
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-[#E8EEF9] flex items-center justify-center">
          <FiLock className="text-3xl text-[#14213D]" />
        </div>
      </div>

      {/* Heading */}
      <div>
        <h1 className="text-3xl text-center text-white prata-regular">
          Super Admin Login
        </h1>

        <p className="text-center text-gray-300 mt-2 inter">
          Login to access the super admin dashboard
        </p>
      </div>

      {/* Username */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-300 inter">
          Username
        </label>

        <input
          type="text"
          value={Name}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Username"
          className="w-full h-12 px-4 rounded-xl bg-transparent border border-gray-500 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-[#FBBF24] transition inter"
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-300 inter">
          Password
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full h-12 px-4 pr-12 rounded-xl bg-transparent border border-gray-500 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-[#FBBF24] transition inter"
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
      </div>

      {/* Login Button */}
      <button
        onClick={handleLogin}
        className="w-full h-12 mt-2 rounded-xl bg-[#FBBF24] text-[#14213D] font-semibold hover:bg-[#d3a120] transition inter"
      >
        Login
      </button>

    </div>

  </div>
);
}

