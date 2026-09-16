import { FaUserCircle } from "react-icons/fa";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminNavbar({
    sidebarOpen,
    setSidebarOpen
}) {

    const navigate = useNavigate();

    const admin = JSON.parse(
        localStorage.getItem("admin") || "{}"
    );

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("admin");

        navigate("/admin/login");
    };

    return (
        <header className="h-16 bg-white shadow-md flex justify-between items-center px-4 sm:px-6 z-50">

            {/* Left Side */}
            <div className="flex items-center gap-3">

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#E8EEF9] text-[#14213D] transition"
                    aria-label="Toggle sidebar"
                >
                    {sidebarOpen ? (
                        <X size={24} />
                    ) : (
                        <Menu size={24} />
                    )}
                </button>

                {/* Title */}
                <h2 className="text-lg sm:text-2xl font-bold text-[#14213D] prata-regular">
                    Admin Dashboard
                </h2>

            </div>


            {/* Right Side */}
            <div className="flex items-center gap-2 sm:gap-4">

                {/* Admin Profile */}
                <Link
                    to="/admin/profile"
                    className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-xl hover:bg-[#E8EEF9] transition"
                >

                    <FaUserCircle
                        size={32}
                        className="text-[#14213D]"
                    />

                    {/* Hide details on mobile */}
                    <div className="hidden sm:block">

                        <h3 className="font-semibold text-[#14213D] inter">
                            {admin.name || "Admin"}
                        </h3>

                        <p className="text-sm text-gray-500 inter">
                            {admin.email || ""}
                        </p>

                    </div>

                </Link>


                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="bg-[#FBBF24] text-[#14213D] px-3 sm:px-4 py-2 rounded-xl font-semibold text-sm sm:text-base hover:bg-[#d3a120] transition inter"
                >
                    Logout
                </button>

            </div>

        </header>
    );
}