import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import API from "../../api/clientapi.js";


export default function Login() {


  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setloading] = useState(false);

  const [formData, setformData] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e) => {

    setformData((prev) =>
    ({
      ...prev,
      [e.target.name]: e.target.value
    }))

  }


  const handleLogin = async () => {

    if (!formData.password || !formData.email) {
      alert("please fill all fields")
    }

    try {

      setloading(true);

      const response = await API.post("/api/clients/login", {
        email: formData.email,
        password: formData.password
      }
      )

      const clientData = response.data.client || { id: response.data.clientId };

      localStorage.setItem(
        "client",
        JSON.stringify(clientData)
      );
      navigate('/dashboard')

    }

    catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
    finally {
      setloading(false);
    }

  }


  return (
    <div className="min-h-screen w-full flex flex-row bg-white">

      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 relative">
        <img
          src="https://i.pinimg.com/1200x/e1/f6/c0/e1f6c056a4055ff3422ee0d85a89cec1.jpg"
          alt="Login"
          className="w-full h-screen object-cover"
        />

        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-12 text-white prata-regular">
          <h1 className=" relative bottom-[200px] text-5xl .prata-regular">
            Welcome Back
          </h1>

          <p className=".inter relative bottom-[200px] mt-4 text-lg text-gray-200 max-w-md">
            Manage your account, explore new opportunities, and stay connected
            with everything in one secure place.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex justify-center items-center px-6 py-10">

        <div className="bg-[#14213D] w-full max-w-md rounded-3xl shadow-2xl p-8">

          {/* Logo */}

          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <FiLock className="text-3xl text-indigo-600" />
            </div>
          </div>

          <h2 className="text-3xl .inter font-bold text-center text-black">
            Sign In
          </h2>

          <p className=".inter text-center text-gray-500 mt-2">
            Login to access your dashboard
          </p>

          {/* Google */}

          <button
            className="mt-8 w-full border border-gray-300 bg-gray-50 rounded-xl h-12 flex items-center justify-center gap-3 hover:bg-gray-500 transition"
          >
            <FcGoogle className="text-2xl" />
            Continue with Google
          </button>

          {/* Divider */}

          <div className="flex items-center my-7">
            <div className="flex-1 h-px bg-gray-300"></div>

            <span className="mx-4 text-sm text-gray-400">
              OR
            </span>

            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Email */}

          <div className="relative">
            <FiMail className="absolute left-4 top-4 text-gray-400" />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
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
              className="w-full h-12 pl-12 pr-12 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-gray-500"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          {/* Remember */}

          <div className="flex justify-between items-center mt-5">



            <button
              className="text-sm text-indigo-300 hover:underline"
            >
              Forgot Password?
            </button>

          </div>

          {/* Login */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-8 w-full h-12 rounded-xl bg-[#FBBF24] text-black font-semibold hover:bg-[#d3a120] disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Footer */}

          <p className="mt-6 text-center text-gray-500 text-sm">
            Don't have an account?
            <span className="text-[#FBBF24] font-medium cursor-pointer hover:underline ml-1"
              onClick={() => navigate('/client-register')}>
              Create Account
            </span>
          </p>

        </div>

      </div>

    </div>
  );
}