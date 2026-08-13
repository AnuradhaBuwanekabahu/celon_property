import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";
import { FiChevronDown, FiX, FiUser } from "react-icons/fi";
import { IoReorderThreeOutline } from "react-icons/io5";
import { clientContext } from "../context/ClientContext";

export default function DashboardSidebar({ clientID }) {
  const { id: routeId } = useParams();
  const { client, getclientdata } = useContext(clientContext);
  const navigate = useNavigate();
  const id = clientID || routeId || localStorage.getItem("clientId");
  const validId = id && !["profile", "edit-client", "change-password", "edit-hotsales-profile", "stays-buy", "stays-buy-profile", "stays-buy-edit"].includes(id) ? id : null;

  useEffect(() => {
    if (validId) {
      getclientdata(validId);
    }
  }, [validId]);

  const [activeMenu, setActiveMenu] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const menuItems = [
    {
      name: "Hot Sales",
      children: [
        { title: "Create Hot Sale", path: "/dashboard/add-hotsales" },
        { title: "View Hot Sales", path: `/dashboard/show-hotsales/${validId}` },
        { title: "Edit Hot Sale", path: `/dashboard/edit-hotsales/${validId}` },
        { title: "Delete Hot Sale", path: `/dashboard/delete-hotsales/${validId}` },
      ],
    },
    {
      name: "Stays To Buy",
      children: [
        { title: "Create Stay", path: `/dashboard/add-stay-to-buy/${validId}` },
        { title: "View Stays", path: `/dashboard/stays-buy/view/${validId}` },
        { title: "Edit Stay", path: `/dashboard/stays-buy/edit/${validId}` },
        { title: "Delete Stay", path: `/dashboard/stays-buy/delete/${validId}` },
      ],
    },
    {
      name: "Stays To Rent",
      children: [
        { title: "Create Rent", path: `/dashboard/stay-to-rent/${validId}` },
        { title: "View Rents", path: `/dashboard/stays-rent/view/${validId}` },
        { title: "Edit Rent", path: `/dashboard/stays-rent/edit/${validId}` },
        { title: "Delete Rent", path: `/dashboard/stays-rent/delete/${validId}` },
      ],
    },
    {
      name: "Lands",
      children: [
        { title: "Create Land", path:`/dashboard/add-lands/${validId}` },
        { title: "View Lands", path: `/dashboard/lands/view/${validId}` },
        { title: "Edit Land", path: `/dashboard/lands/edit/${validId}` },
        { title: "Delete Land", path: `/dashboard/lands/delete/${validId}` },
      ],
    },
    {
      name: "Advertisement",
      children: [
        { title: "Create Advertisement", path: `/dashboard/create-ads/${validId}` },
        { title: "View Advertisements", path: `/dashboard/ads/view/${validId}` },
        { title: "Edit Advertisement", path: `/dashboard/ads/edit/${validId}` },
        { title: "Delete Advertisement", path: `/dashboard/ads/delete/${validId}` },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Top Bar — full width, always fixed, own stacking layer */}
      <div className="sm:hidden fixed top-0 left-0 w-full h-16 bg-[#14213D] text-white flex items-center justify-between px-5 shadow-md z-50">
        <h1 className="text-lg font-bold">Ceylone Property</h1>
        <button onClick={() => setShowMenu(!showMenu)}>
          {showMenu ? (
            <FiX className="text-3xl" />
          ) : (
            <IoReorderThreeOutline className="text-3xl" />
          )}
        </button>
      </div>

      {/* Mobile backdrop, shown only when drawer is open */}
      {showMenu && (
        <div
          className="sm:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}

      {/* Sidebar / Drawer */}
      <aside
        className={`
          fixed top-16 left-0 w-72 h-[calc(100vh-4rem)] bg-[#14213D] text-white
          overflow-y-auto z-50
          transform transition-transform duration-300
          ${showMenu ? "translate-x-0" : "-translate-x-full"}
          sm:translate-x-0 sm:top-0 sm:h-screen
        `}
      >
        {/* Desktop Header */}
        <div className="hidden sm:block p-5 border-b border-gray-600">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">Ceylone Property</h1>
            </div>
            <IoIosNotifications className="text-3xl" />
          </div>

          <div className="flex items-center gap-3 mt-5">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-[#FCA311] flex items-center justify-center shrink-0">
              {client?.avatar ? (
                <img
                  src={`data:image/jpeg;base64,${client.avatar}`}
                  alt={client?.full_name || "avatar"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiUser className="text-[#14213D]" />
              )}
            </div>

            <div>
              <h3 className="font-semibold">{client?.full_name || "unknown"}</h3>
              <button
                className="text-xs text-yellow-300 underline hover:text-white"
                onClick={() => navigate(validId ? `/dashboard/profile/${validId}` : "/dashboard")}
                type="button"
              >
                Profile details
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Profile */}
        <div className="sm:hidden p-5 border-b border-gray-600">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-[#FCA311] flex items-center justify-center shrink-0">
              {client?.avatar ? (
                <img
                  src={`data:image/jpeg;base64,${client.avatar}`}
                  alt={client?.full_name || "avatar"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiUser className="text-[#14213D]" />
              )}
            </div>

            <div>
              <h3 className="font-semibold">{client?.full_name || "Admin"}</h3>
              <p className="text-xs text-gray-300">Online</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-5">Dashboard</h2>

          <div
            className="mb-2 cursor-pointer"
            onClick={() => {
              navigate(validId ? `/dashboard/${validId}` : "/dashboard");
              setShowMenu(false);
            }}
          >
            <span
              className="flex items-center justify-between
              w-full px-4 py-3 rounded-lg
              hover:bg-[#FCA311] hover:text-black transition"
            >
              Home
            </span>
          </div>

          {menuItems.map((item, index) => (
            <div key={index} className="mb-2">
              {/* Main Menu */}
              <button
                onClick={() => setActiveMenu(activeMenu === index ? null : index)}
                className="
                flex items-center justify-between
                w-full px-4 py-3 rounded-lg
                hover:bg-[#23345d]
                transition
                "
              >
                <span>{item.name}</span>

                <FiChevronDown
                  className={`
                  transition-transform
                  ${activeMenu === index ? "rotate-180" : ""}
                  `}
                />
              </button>

              {/* Child Menu */}
              {activeMenu === index && (
                <div className="ml-5 mt-2 space-y-1">
                  {item.children.map((child, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        navigate(child.path);
                        setShowMenu(false);
                      }}
                      className="
                      block w-full text-left
                      text-sm px-3 py-2
                      rounded text-gray-200
                      hover:bg-[#FCA311]
                      hover:text-black
                      transition
                      "
                    >
                      {child.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}