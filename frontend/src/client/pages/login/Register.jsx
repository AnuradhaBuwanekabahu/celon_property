import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import API from "../../api/clientapi";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async () => {
    if (
      !formData.full_name ||
      !formData.email ||
      !formData.password
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/api/clients/register", {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
      });

      alert(res.data.message);

      setFormData({
        full_name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      navigate("/client-login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-row bg-white">

      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 relative">
        <img
          src="https://i.pinimg.com/1200x/e1/f6/c0/e1f6c056a4055ff3422ee0d85a89cec1.jpg"
          alt="Register"
          className="w-full h-screen object-cover"
        />

        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-12 text-white">
          <h1 className="relative bottom-[200px] text-5xl prata-regular">
            Join Us Today
          </h1>

          <p className="inter relative bottom-[200px] mt-4 text-lg text-gray-200 max-w-md">
            Create an account to unlock personalized features and start your
            journey with us.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex justify-center items-center px-6 py-10">

        <div className="bg-[#14213D] w-full max-w-md rounded-3xl shadow-2xl p-8">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <FiUser className="text-3xl text-indigo-600" />
            </div>
          </div>

          <h2 className="inter text-3xl font-bold text-center text-white">
            Create Account
          </h2>

          <p className="inter text-center text-gray-400 mt-2">
            Sign up to get started
          </p>

          {/* Google Button */}
          <button className="mt-8 w-full border border-gray-300 bg-gray-50 rounded-xl h-12 flex items-center justify-center gap-3 hover:bg-gray-200 transition">
            <FcGoogle className="text-2xl" />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center my-7">
            <div className="flex-1 h-px bg-gray-500"></div>
            <span className="mx-4 text-sm text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-500"></div>
          </div>

          {/* Full Name */}
          <div className="relative">
            <FiUser className="absolute left-4 top-4 text-gray-400" />

            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-500 bg-transparent text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email */}
          <div className="relative mt-5">
            <FiMail className="absolute left-4 top-4 text-gray-400" />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-500 bg-transparent text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div className="relative mt-5">
            <FiLock className="absolute left-4 top-4 text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full h-12 pl-12 pr-12 rounded-xl border border-gray-500 bg-transparent text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-gray-400"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative mt-5">
            <FiLock className="absolute left-4 top-4 text-gray-400" />

            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full h-12 pl-12 pr-12 rounded-xl border border-gray-500 bg-transparent text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-4 top-3.5 text-gray-400"
            >
              {showConfirmPassword ? (
                <FiEyeOff size={20} />
              ) : (
                <FiEye size={20} />
              )}
            </button>
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2 mt-5">
            <input type="checkbox" className="accent-indigo-500" />

            <label className="text-sm text-gray-400">
              I agree to the Terms and Privacy Policy
            </label>
          </div>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="mt-8 w-full h-12 rounded-xl bg-[#FBBF24] text-black font-semibold hover:bg-[#d3a120] disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          {/* Footer */}
          <p className="mt-6 text-center text-gray-500 text-sm">
            Already have an account?
            <span
              onClick={() => navigate("/client-login")}
              className="text-[#FBBF24] font-medium cursor-pointer hover:underline ml-1"
            >
              Sign In
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}