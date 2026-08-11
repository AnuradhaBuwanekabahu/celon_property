import React, { useContext, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  MessageCircle,
  Megaphone,
  Pencil,
  KeyRound,
  Trash2,
  LogOut,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { clientContext } from "../context/ClientContext";

/**
 * ShowClientDetails — profile panel, themed in navy (#14213D) / amber (#FCA311),
 * wired to clientContext.
 */

function ShowClientDetails({ clientID }) {
  const { client, getclientdata } = useContext(clientContext);
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const resolvedId = clientID || routeId || localStorage.getItem("clientId");

  useEffect(() => {
    if (resolvedId) {
      getclientdata(resolvedId);
    }
  }, [resolvedId]);

  const clientData = {
    id: resolvedId || "",
    full_name: client?.full_name || "Unknown",
    email: client?.email || "",
    avatar: client?.avatar
      ? `data:image/jpeg;base64,${client.avatar}`
      : null,
    phone_number: client?.phone_number || "",
    whatsapp_number: client?.whatsapp_number || "",
    ads_count: client?.ads_count || 0,
  };

  const {
    id,
    full_name,
    email,
    avatar,
    phone_number,
    whatsapp_number,
    ads_count,
  } = clientData;

  const handleLogout = () => {
    localStorage.removeItem("clientToken");
    localStorage.removeItem("clientId");
    navigate("/client-login");
  };

  const quickActions = [
    {
      key: "edit",
      label: "Edit Profile",
      icon: Pencil,
      action: () => navigate(`/dashboard/edit-client/${resolvedId}`),
    },
    {
      key: "password",
      label: "Change Password",
      icon: KeyRound,
      action: () => navigate(`/dashboard/change-password/${resolvedId}`),
    },
    {
      key: "delete",
      label: "Delete Account",
      icon: Trash2,
      action: () => console.log("Delete Account"),
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
      <div className="w-full max-w-6xl bg-white rounded-2xl sm:shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 sm:px-8 pt-6 pb-2 bg-[#14213D] text-white flex items-center justify-between">
          <h1 className="text-xl .prata-regular">Welcome {full_name}!</h1>
        </div>

        <div className="mt-5 border-t border-gray-100" />

        <div className="flex flex-col">
          {/* Main content */}
          <main className="flex-1 px-6 sm:px-8 py-6">
            <>
              {/* Avatar + name */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={full_name}
                    className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover border-4 "
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-black flex items-center justify-center border-4 ">
                    <User className="text-white" size={32} />
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-bold .poppins-regular ">
                    {full_name}
                  </h2>
                  <p className="text-xs text-gray-500">Client ID: {id}</p>
                </div>

                <div className="ml-auto flex items-center gap-2 bg-[#FCA311]/10 border border-[#FCA311]/30 rounded-full px-3.5 py-1.5">
                  <Megaphone size={14} className="text-[#FCA311]" />
                  <span className="text-xs font-semibold text-[#14213D]">
                    {ads_count} Ads posted
                  </span>
                </div>
              </div>

              {/* Contact fields — Email, Phone, WhatsApp share one row so
                  WhatsApp no longer stretches full width on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <Field label="Email" value={email || "—"} icon={Mail} className=".inter" />
                <Field
                  label="Phone Number"
                  value={phone_number || "—"}
                  icon={Phone}
                  href={phone_number ? `tel:${phone_number}` : null}
                  className=".inter"
                />
                <Field
                  label="WhatsApp Number"
                  value={whatsapp_number || "—"}
                  icon={MessageCircle}
                  href={
                    whatsapp_number
                      ? `https://wa.me/${whatsapp_number.replace(/\D/g, "")}`
                      : null
                  }
                  className=".inter"
                />
              </div>

              {/* Quick actions row, styled after the reference bottom card */}
              <div className="border border-gray-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-[#14213D] mb-3 .inter">
                  Manage Account
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {quickActions.map(({ key, label, icon: Icon, action }) => (
                    <button
                      key={key}
                      onClick={action}
                      style={{ WebkitTapHighlightColor: "transparent" }}
                      className="flex flex-col items-center justify-center gap-1.5 border border-gray-200 rounded-lg px-2 py-3 text-center bg-white text-[#14213D] outline-none hover:bg-[#FCA311]/5 hover:border-[#FCA311] focus-visible:ring-2 focus-visible:ring-[#FCA311]/50 active:bg-[#FCA311]/10 transition-colors"
                    >
                      <Icon size={16} className="text-[#14213D]" />
                      <span className="text-[11px] font-medium text-[#14213D] leading-tight .inter">
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          </main>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, icon: Icon, href, className }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
        {label}
      </label>
      <div className="flex items-center gap-2 bg-[#EAF0FB] rounded-xl px-4 py-3">
        {Icon && <Icon size={16} className="text-[#14213D]/50 shrink-0" />}
        {href ? (
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="text-sm font-medium text-[#14213D] truncate hover:text-[#FCA311]"
          >
            {value}
          </a>
        ) : (
          <span className="text-sm font-medium text-[#14213D] truncate">
            {value}
          </span>
        )}
      </div>
    </div>
  );
}

export default ShowClientDetails;