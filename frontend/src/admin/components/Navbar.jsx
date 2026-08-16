import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function AdminNavbar() {

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
    <header className="h-16 bg-white shadow-md flex justify-between items-center px-6">

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#14213D] prata-regular">
            Admin Dashboard
        </h2>

        {/* Right Side */}
        <div className="flex items-center gap-4">

            {/* Admin Profile */}
            <Link
                to="/admin/profile"
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#E8EEF9] transition"
            >

                <FaUserCircle
                    size={35}
                    className="text-[#14213D]"
                />

                <div>
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
                className="bg-[#FBBF24] text-[#14213D] px-4 py-2 rounded-xl font-semibold hover:bg-[#d3a120] transition inter"
            >
                Logout
            </button>

        </div>

    </header>
);
}