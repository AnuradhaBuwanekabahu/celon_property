import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Flame,
  Building2,
  Bed,
  Users,
  UserCog,
  CreditCard,
  Megaphone,
  BedDouble,
  Search,
  UserCircle,
  LogOut,
} from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";

const menus = [
  { name: "Dashboard", path: "/admin-portal/dashboard", icon: <LayoutDashboard size={20} /> },
  { name: "Hot Sales", path: "/admin-portal/hot-sales", icon: <Flame size={20} /> },
  { name: "Stay To Buy", path: "/admin-portal/stay-to-buy", icon: <Bed size={20} /> },
  { name: "Stay To Rent", path: "/admin-portal/stay-to-rent", icon: <BedDouble size={20} /> },
  { name: "Lands", path: "/admin-portal/lands", icon: <Building2 size={20} /> },
  { name: "Clients", path: "/admin-portal/clients", icon: <Users size={20} /> },
  { name: "Users", path: "/admin-portal/users", icon: <UserCog size={20} /> },
  { name: "Payments", path: "/admin-portal/payments", icon: <CreditCard size={20} /> },
  { name: "Advertisements", path: "/admin-portal/advertisements", icon: <Megaphone size={20} /> },
  { name: "Wanted", path: "/admin-portal/wanted", icon: <Search size={20} /> },
  { name: "Profile", path: "/admin-portal/profile", icon: <UserCircle size={20} /> },
];

const Sidebar = () => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin-portal/login");
  }

  return (
    <aside className="w-64 h-screen bg-[#14213D] text-white shadow-lg flex flex-col">

      {/* Header */}
      <div className="h-16 flex-shrink-0 flex items-center justify-center border-b border-gray-600">
        <h2 className="text-xl font-bold tracking-wide prata-regular">
          Admin Panel
        </h2>
      </div>

      {/* Scrollable Menu */}
      <nav className="p-2 space-y-1 overflow-y-auto flex-1">
        {menus.map((menu) => (
          <NavLink
            key={menu.name}
            to={menu.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[#FBBF24] text-[#14213D] font-semibold"
                  : "text-gray-300 hover:bg-[#1c2c52] hover:text-white"
              }`
            }
          >
            {menu.icon}
            <span className="font-medium inter">{menu.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer: admin info + logout */}
      <div className="p-4 border-t border-gray-600">
        <p className="text-xs text-gray-400 truncate inter">{admin?.name || admin?.Name}</p>
        <p className="text-xs text-gray-500 truncate inter mb-3">{admin?.email}</p>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:bg-red-700 hover:text-white transition inter text-sm"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;