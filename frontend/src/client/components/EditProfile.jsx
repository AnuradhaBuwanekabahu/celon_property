import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/clientapi";
import { clientContext } from "../context/ClientContext";

import {
  User,
  Mail,
  Phone,
  MessageCircle,
  Camera,
  Pencil,
  KeyRound,
  Trash2,
  LogOut,
} from "lucide-react";

const Field = ({ label, name, value, onChange, icon: Icon }) => (
  <div className="relative">
    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
      <Icon size={16} className="text-[#14213D]" /> {label}
    </label>

    <input
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-transparent border-b border-gray-300 focus:border-[#FCA311] outline-none py-3 pr-8 transition"
    />

    <Pencil size={16} className="absolute right-2 bottom-3 text-[#14213D]" />
  </div>
);

const EditProfile = ({ clientID }) => {
  const navigate = useNavigate();

  const { client, getclientdata } = useContext(clientContext);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    whatsapp_number: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (clientID) {
      getclientdata(clientID);
    }
  }, [clientID]);

  useEffect(() => {
    if (!client) return;

    setForm({
      full_name: client.full_name || "",
      email: client.email || "",
      phone_number: client.phone_number || "",
      whatsapp_number: client.whatsapp_number || "",
    });

    // Only fall back to the server avatar if the user hasn't picked a new
    // local file yet. Without this check, a re-fetch of `client` could
    // stomp on the blob preview the user just selected.
    if (!avatarFile) {
      setAvatarPreview(
        client.avatar ? `data:image/jpeg;base64,${client.avatar}` : null
      );
    }
  }, [client]);

  // Clean up any blob URL we created when the component unmounts or the
  // preview changes, so we don't leak memory.
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];

    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const fd = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key]) {
          fd.append(key, form[key]);
        }
      });

      if (avatarFile) {
        fd.append("avatar", avatarFile);
      }

      await API.put(`/api/clients/${clientID}`, fd);

      toast.success("Profile updated successfully");

      setAvatarFile(null);
      getclientdata(clientID);

      navigate(`/dashboard/${clientID}`);
    } catch (err) {
      console.log(err);

      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("clientToken");
    localStorage.removeItem("clientId");

    navigate("/dashboard/client-login");
  };

  const quickActions = [
    {
      key: "password",
      label: "Change Password",
      icon: KeyRound,
      action: () => navigate(`/dashboard/change-password/${clientID}`),
    },
    {
      key: "delete",
      label: "Delete Account",
      icon: Trash2,
      action: () => console.log("delete"),
    },
    {
      key: "logout",
      label: "Logout",
      icon: LogOut,
      action: handleLogout,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="bg-[#14213D] text-white px-6 py-5">
          <h1 className="text-xl font-semibold">Edit Profile</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* PROFILE IMAGE */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-[#14213D]"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-[#14213D] flex items-center justify-center">
                  <User size={40} className="text-white" />
                </div>
              )}

              <label
                htmlFor="avatar"
                className="absolute bottom-1 right-1 bg-[#FCA311] hover:bg-[#14213D] text-white p-2 rounded-full cursor-pointer transition shadow-lg"
              >
                <Camera size={18} />
              </label>

              <input
                id="avatar"
                type="file"
                accept="image/*"
                hidden
                onChange={handleFile}
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#14213D]">
                {form.full_name || "User"}
              </h2>

              <p className="text-sm text-gray-500">Client ID : {clientID}</p>
            </div>
          </div>

          {/* FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Field label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} icon={User} />
            <Field label="Email" name="email" value={form.email} onChange={handleChange} icon={Mail} />
            <Field label="Phone Number" name="phone_number" value={form.phone_number} onChange={handleChange} icon={Phone} />
            <Field
              label="WhatsApp Number"
              name="whatsapp_number"
              value={form.whatsapp_number}
              onChange={handleChange}
              icon={MessageCircle}
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-[#14213D] hover:bg-[#FCA311] text-white rounded-lg transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <div className="border-t p-6">
          <h3 className="font-semibold mb-4">Manage Account</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {quickActions.map(({ key, label, icon: Icon, action }) => (
              <button
                key={key}
                onClick={action}
                className="border rounded-xl py-4 flex flex-col items-center gap-2 hover:bg-[#14213D] hover:text-white transition"
              >
                <Icon size={20} />
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;