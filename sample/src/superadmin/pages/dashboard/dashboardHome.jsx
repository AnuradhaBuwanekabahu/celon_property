import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { IoLogOutOutline } from "react-icons/io5";
import { BiPlus, BiTrash } from "react-icons/bi";
import Loader from "../../components/loader";
import ToggleSwitch from "../../components/ToggleSwitch";
import {
    addAdmin,
    deleteAdmin,
    getAllAdmins,
    setAdminApproval,
} from "../../api/superAdminAuth";

export default function SuperAdminDashboard() {
    const [admins, setAdmins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    const [Name, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (isLoading) {
            getAllAdmins(token)
                .then((res) => {
                    setAdmins(res.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching admins:", error);
                    toast.error("Failed to load admins");
                    setIsLoading(false);
                });
        }
    }, [isLoading]);

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/superadmin/login");
    }

    function handleAddAdmin() {
        addAdmin({ Name, email, password }, token)
            .then((res) => {
                console.log(res.data);
                toast.success("Admin added — approve them below to let them log in");
                setUserName("");
                setEmail("");
                setPassword("");
                setShowAddForm(false);
                setIsLoading(true);
            })
            .catch((error) => {
                console.error("Error adding admin:", error);
                toast.error(error.response?.data?.message || "Failed to add admin");
            });
    }

    function handleToggle(admin, nextValue) {
        // optimistic update
        setAdmins((prev) =>
            prev.map((a) =>
                a.id === admin.id ? { ...a, is_approved: nextValue } : a
            )
        );

        setAdminApproval(admin.id, nextValue, token)
            .then(() => {
                toast.success(nextValue ? "Admin approved" : "Admin blocked");
            })
            .catch((error) => {
                console.error("Error updating approval:", error);
                toast.error("Failed to update admin");
                // roll back
                setAdmins((prev) =>
                    prev.map((a) =>
                        a.id === admin.id ? { ...a, is_approved: admin.is_approved } : a
                    )
                );
            });
    }

    function handleDelete(admin) {
        if (!window.confirm("Delete " + admin.Name + "? This can't be undone.")) {
            return;
        }

        deleteAdmin(admin.id, token)
            .then(() => {
                toast.success("Admin deleted");
                setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
            })
            .catch((error) => {
                console.error("Error deleting admin:", error);
                toast.error("Failed to delete admin");
            });
    }

    return (
        <div className="w-full h-screen flex flex-col">
            <div className="w-full h-[70px] border-b-[3px] flex justify-between items-center px-[25px]">
                <span className="text-xl font-bold">Ceylon Property — Super Admin</span>
                <button
                    onClick={handleLogout}
                    className="flex flex-row items-center gap-[8px] text-sm"
                >
                    <IoLogOutOutline className="text-xl" />
                    Logout
                </button>
            </div>

            <div className="w-full flex-1 p-[25px]">
                <div className="w-full flex justify-between items-center mb-[15px]">
                    <h2 className="text-xl font-semibold">Admins</h2>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="flex flex-row items-center gap-[8px] bg-black text-white px-[15px] h-[40px] rounded-md"
                    >
                        <BiPlus className="text-lg" />
                        Add Admin
                    </button>
                </div>

                {showAddForm && (
                    <div className="w-full border-[3px] rounded-[15px] p-[20px] mb-[20px] flex flex-wrap gap-[15px]">
                        <div className="w-[220px] flex flex-col gap-[5px]">
                            <label className="text-sm font-semibold">Username</label>
                            <input
                                type="text"
                                value={Name}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full border-[1px] h-[40px] rounded-md px-[10px]"
                            />
                        </div>
                        <div className="w-[260px] flex flex-col gap-[5px]">
                            <label className="text-sm font-semibold">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border-[1px] h-[40px] rounded-md px-[10px]"
                            />
                        </div>
                        <div className="w-[220px] flex flex-col gap-[5px]">
                            <label className="text-sm font-semibold">Temporary Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border-[1px] h-[40px] rounded-md px-[10px]"
                            />
                        </div>
                        <div className="w-full flex justify-end">
                            <button
                                onClick={handleAddAdmin}
                                className="bg-black text-white px-[20px] h-[40px] rounded-md"
                            >
                                Add Admin
                            </button>
                        </div>
                    </div>
                )}

                {isLoading ? (
                    <Loader />
                ) : (
                    <table className="w-full border-[3px]">
                        <thead>
                            <tr className="border-[3px]">
                                <th className="p-[10px]">Username</th>
                                <th className="p-[10px]">Email</th>
                                <th className="p-[10px]">Created</th>
                                <th className="p-[10px]">Approved / Blocked</th>
                                <th className="p-[10px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map((admin) => (
                                <tr key={admin.id} className="border-b-[1px]">
                                    <td className="p-[10px] text-center">{admin.Name}</td>
                                    <td className="p-[10px] text-center">{admin.email}</td>
                                    <td className="p-[10px] text-center">
                                        {new Date(admin.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-[10px] flex justify-center">
                                        <ToggleSwitch
                                            checked={admin.is_approved}
                                            onChange={(next) => handleToggle(admin, next)}
                                        />
                                    </td>
                                    <td className="p-[10px] text-center">
                                        <BiTrash
                                            onClick={() => handleDelete(admin)}
                                            className="bg-red-500 p-[7px] text-3xl rounded-full text-white cursor-pointer inline-block"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
