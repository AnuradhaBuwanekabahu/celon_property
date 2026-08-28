import React, { useEffect, useState } from "react";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import API from "../../api/clientapi";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState("form"); // "form" | "otp"

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");

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

      // Move to OTP step instead of navigating away
      setStep("otp");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      alert("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setOtpLoading(true);

      const res = await API.post("/api/clients/verify-otp", {
        email: formData.email,
        otp,
      });

      localStorage.setItem("clientToken", res.data.token);
      localStorage.setItem("clientId", res.data.client.id);
      localStorage.setItem("client", JSON.stringify(res.data.client));

      alert(res.data.message);
      navigate(`/dashboard/${res.data.client.id}`);
    } catch (error) {
      alert(error.response?.data?.message || "OTP verification failed.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendLoading(true);

      const res = await API.post("/api/clients/resend-otp", {
        email: formData.email,
      });

      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoogleRegister = async (response) => {
    if (!response?.credential) {
      alert("Google registration failed. Please try again.");
      return;
    }

    try {
      setLoading(true);
      const result = await API.post("/api/clients/google", {
        id_token: response.credential,
      });
      const client = result.data.client;

      localStorage.setItem("clientToken", result.data.token);
      localStorage.setItem("clientId", client.id);
      localStorage.setItem("client", JSON.stringify(client));
      navigate(`/dashboard/${client.id}`);
    } catch (error) {
      alert(error.response?.data?.message || "Google registration failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const initializeGoogle = () => {
      const button = document.getElementById("client-google-register-button");
      if (!window.google?.accounts?.id || !button) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleRegister,
      });
      window.google.accounts.id.renderButton(button, {
        theme: "outline",
        size: "large",
        width: 360,
        text: "continue_with",
      });
    };

    initializeGoogle();
    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        initializeGoogle();
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

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
          <h1 className="relative bottom-50 text-5xl prata-regular">
            Join Us Today
          </h1>

          <p className="inter relative bottom-50 mt-4 text-lg text-gray-200 max-w-md">
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

          {step === "form" ? (
            <>
              <h2 className="inter text-3xl font-bold text-center text-white">
                Create Account
              </h2>

              <p className="inter text-center text-gray-400 mt-2">
                Sign up to get started
              </p>

              {/* Google Button */}
              <div id="client-google-register-button" className="mt-8 flex justify-center min-h-12"></div>
              {!GOOGLE_CLIENT_ID && (
                <p className="mt-2 text-center text-sm text-red-300">
                  Google registration is not configured.
                </p>
              )}

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
            </>
          ) : (
            <>
              <h2 className="inter text-3xl font-bold text-center text-white">
                Verify Your Email
              </h2>

              <p className="inter text-center text-gray-400 mt-2">
                Enter the 6-digit code sent to{" "}
                <span className="text-white">{formData.email}</span>
              </p>

              {/* OTP Input */}
              <div className="relative mt-8">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter OTP"
                  className="w-full h-12 px-4 rounded-xl border border-gray-500 bg-transparent text-white text-center tracking-[0.5em] placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerifyOtp}
                disabled={otpLoading}
                className="mt-6 w-full h-12 rounded-xl bg-[#FBBF24] text-black font-semibold hover:bg-[#d3a120] disabled:opacity-50"
              >
                {otpLoading ? "Verifying..." : "Verify Email"}
              </button>

              {/* Resend */}
              <p className="mt-6 text-center text-gray-500 text-sm">
                Didn't receive the code?
                <span
                  onClick={!resendLoading ? handleResendOtp : undefined}
                  className="text-[#FBBF24] font-medium cursor-pointer hover:underline ml-1"
                >
                  {resendLoading ? "Resending..." : "Resend OTP"}
                </span>
              </p>

              {/* Back */}
              <p
                onClick={() => setStep("form")}
                className="mt-3 text-center text-gray-500 text-sm cursor-pointer hover:underline"
              >
                Back to registration
              </p>
            </>
          )}

        </div>
      </div>
    </div>
  );
}