import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Flame,
  Building2,
  Bed,
  Users,
  Megaphone,
  Settings,
  BedDouble,
  Map,
  Search,
  UserCircle,
} from "lucide-react";

const menus = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    name: "Hot Sales",
    path: "/admin/hot-sales",
    icon: <Flame size={20} />,
  },
  {
    name: "Stay To Buy",
    path: "/admin/stay-to-buy",
    icon: <Bed size={20} />,
},
{
    name: "Stay To Rent",
    path: "/admin/stay-to-rent",
    icon: <BedDouble size={20} />,
},

  {
    name: "Lands",
    path: "/admin/lands",
    icon: <Building2 size={20} />,
  },
  {
    name: "Clients",
    path: "/admin/clients",
    icon: <Users size={20} />,
  },
  {
    name: "Advertisements",
    path: "/admin/advertisements",
    icon: <Megaphone size={20} />,
  },
  {
    name: "Wanted",
    path: "/admin/wanted",
    icon: <Search size={20} />
},
  {
    name: "Profile",
    path: "/admin/profile",
    icon: <UserCircle size={20} />,
  },
];

const Sidebar = () => {
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
                    end={menu.path === "/admin"}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            isActive
                                ? "bg-[#FBBF24] text-[#14213D] font-semibold"
                                : "text-gray-300 hover:bg-[#1c2c52] hover:text-white"
                        }`
                    }
                >
                    {menu.icon}

                    <span className="font-medium inter">
                        {menu.name}
                    </span>
                </NavLink>
            ))}

        </nav>

    </aside>
);
};

export default Sidebar;