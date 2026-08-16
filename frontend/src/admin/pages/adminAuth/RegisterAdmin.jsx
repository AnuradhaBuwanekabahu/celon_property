import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiLock,
  FiUserPlus,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { registerAdmin } from "../../api/adminAuth";

export default function RegisterAdmin() {
    const [Name, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

function handleRegister(){

    if(password!==confirmPassword){

        toast.error("Passwords do not match");

        return;

    }

    registerAdmin({

        Name,
        email,
        password

    })

    .then(()=>{

        toast.success(
            "Registered Successfully.\nWaiting for Super Admin Approval."
        );

        navigate("/admin/login");

    })

    .catch((err)=>{

        toast.error(
            err.response?.data?.message
        );

    });

}

    return (
  <div className="min-h-screen flex items-center justify-center bg-white px-6">

    <div className="w-full max-w-md bg-[#14213D] rounded-3xl shadow-2xl p-8">

      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-[#E8EEF9] flex items-center justify-center">
          <FiUserPlus className="text-3xl text-[#14213D]" />
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-3xl text-center text-white prata-regular">
        Admin Registration
      </h2>

      <p className="text-center text-gray-300 mt-2 text-sm inter">
        Your account requires super admin approval before you can log in.
      </p>

      {/* Username */}
      <div className="relative mt-8">
        <FiUser className="absolute left-4 top-4 text-gray-400" />

        <input
          type="text"
          value={Name}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Username"
          className="w-full h-12 pl-12 pr-4 rounded-xl bg-transparent border border-gray-500 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-[#FBBF24] transition inter"
        />
      </div>

      {/* Email */}
      <div className="relative mt-5">
        <FiMail className="absolute left-4 top-4 text-gray-400" />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="w-full h-12 pl-12 pr-4 rounded-xl bg-transparent border border-gray-500 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-[#FBBF24] transition inter"
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
          className="w-full h-12 pl-12 pr-12 rounded-xl bg-transparent border border-gray-500 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-[#FBBF24] transition inter"
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

      {/* Confirm Password */}
      <div className="relative mt-5">
        <FiLock className="absolute left-4 top-4 text-gray-400" />

        <input
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="w-full h-12 pl-12 pr-12 rounded-xl bg-transparent border border-gray-500 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-[#FBBF24] transition inter"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          aria-label={showConfirmPassword ? "Hide confirmed password" : "Show confirmed password"}
          title={showConfirmPassword ? "Hide confirmed password" : "Show confirmed password"}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
      

      {/* Register Button */}
      <button
        onClick={handleRegister}
        className="mt-8 w-full h-12 rounded-xl bg-[#FBBF24] text-[#14213D] font-semibold hover:bg-[#d3a120] transition inter"
      >
        Register
      </button>

      {/* Footer */}
      <p className="mt-6 text-center text-gray-300 text-sm inter">
        Already have an account?
        <Link
          to="/admin/login"
          className="text-[#FBBF24] font-semibold hover:underline ml-1"
        >
          Login
        </Link>
      </p>

    </div>

  </div>
);
}
