import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FiEye, FiEyeOff, FiLock, FiUser } from "react-icons/fi";
import { loginAdmins } from "../../api/adminAuth";
import { toast, ToastContainer } from "react-toastify";


export default function LoginAdmins() {
    const [Name, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

function handleLogin() {

    loginAdmins({
        Name,
        password
    })

    .then((res)=>{

        localStorage.setItem(
            "token",
            res.data.token
        );

        localStorage.setItem(
            "admin",
            JSON.stringify(res.data.admin)
        );

        toast.success("Login Successful");

        navigate("/admin");

    })

    .catch((err)=>{

        toast.error(
            err.response?.data?.message ||
            "Login Failed"
        );

    });

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

      {/* Forgot Password */}
      <div className="flex justify-end mt-4">
        <button
          type="button"
          className="text-sm text-[#FBBF24] hover:underline inter"
        >
          Forgot Password?
        </button>
      </div>

      {/* Login Button */}
      <button
        onClick={handleLogin}
        className="mt-8 w-full h-12 rounded-xl bg-[#FBBF24] text-[#14213D] font-semibold hover:bg-[#d3a120] transition inter"
      >
        Login
      </button>

      {/* Register */}
      <p className="mt-6 text-center text-gray-300 text-sm inter">
        Don't have an account?
        <Link
          to="/admin/register"
          className="text-[#FBBF24] font-semibold hover:underline ml-1"
        >
          Register
        </Link>
      </p>

    </div>

  </div>
);
}
