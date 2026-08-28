import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/clientapi";
import { KeyRound, Eye, EyeOff, ArrowLeft } from "lucide-react";

const PasswordField = ({ label, name, value, onChange, show, onToggleShow }) => {
  const inputId = `field-${name}`;

  return (
    <div className="relative">
      <label htmlFor={inputId} className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2 cursor-text">
        <KeyRound size={16} className="text-[#14213D]" /> {label}
      </label>

      <div className="flex items-center border-b border-gray-300 focus-within:border-[#FCA311] transition">
        <input
          id={inputId}
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete="off"
          spellCheck="false"
          className="w-full bg-transparent outline-none py-3 pr-2 text-[#14213D]"
        />

        <button
          type="button"
          onClick={onToggleShow}
          className="text-gray-400 hover:text-[#14213D] transition px-1"
          tabIndex={-1}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

const ChangePassword = ({ clientID }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState({
    current_password: false,
    new_password: false,
    confirm_password: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleShow = (name) => {
    setShowPassword((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.current_password || !form.new_password || !form.confirm_password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (form.new_password.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (form.new_password !== form.confirm_password) {
      toast.error("New password and confirm password do not match");
      return;
    }

    if (form.new_password === form.current_password) {
      toast.error("New password must be different from current password");
      return;
    }

    try {
      setLoading(true);

      await API.put(`/api/clients/${clientID}/change-password`, {
        current_password: form.current_password,
        new_password: form.new_password,
      });

      toast.success("Password changed successfully");

      setForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      navigate(`/dashboard/edit-client/${clientID}`);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-[#14213D] text-white px-6 py-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="hover:text-[#FCA311] transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold">Change Password</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <PasswordField
            label="Current Password"
            name="current_password"
            value={form.current_password}
            onChange={handleChange}
            show={showPassword.current_password}
            onToggleShow={() => toggleShow("current_password")}
          />

          <PasswordField
            label="New Password"
            name="new_password"
            value={form.new_password}
            onChange={handleChange}
            show={showPassword.new_password}
            onToggleShow={() => toggleShow("new_password")}
          />

          <PasswordField
            label="Re-enter New Password"
            name="confirm_password"
            value={form.confirm_password}
            onChange={handleChange}
            show={showPassword.confirm_password}
            onToggleShow={() => toggleShow("confirm_password")}
          />

          <button
            disabled={loading}
            className="w-full px-8 py-3 bg-[#14213D] hover:bg-[#FCA311] text-white rounded-lg transition"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;