import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";



import { getAdminProfile } from "../../api/adminAuth";
import Loader from "../../components/Loader";

const ViewProfile = () => {

    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const res = await getAdminProfile();

                setAdmin(res.data.admin);

            } catch (error) {

                console.log("PROFILE ERROR:", error);

                toast.error(
                    error.response?.data?.message ||
                    "Failed to load admin profile"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchProfile();

    }, []);


    if (loading) {
        return <Loader />;
    }


    if (!admin) {
        return (
            <div className="p-6 text-center text-gray-500">
                Admin profile not found
            </div>
        );
    }



return (
    <div className="min-h-screen bg-[#E8EEF9] p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">

            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D] prata-regular">
                    Admin Profile
                </h1>

                <p className="text-sm text-gray-500 mt-1 inter">
                    View your administrator details
                </p>
            </div>

            <Link
                to="/admin/profile/edit"
                className="inline-flex items-center justify-center gap-2
                bg-[#FBBF24] text-[#14213D]
                px-5 py-2.5 rounded-xl
                font-semibold inter
                hover:bg-[#d3a120] transition"
            >
                <Pencil size={18} />
                Edit Profile
            </Link>

        </div>


        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Profile Header */}
            <div className="bg-[#14213D] px-6 py-8">

                <div className="flex flex-col sm:flex-row sm:items-center gap-5">

                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full bg-[#E8EEF9]
                        flex items-center justify-center
                        text-3xl font-bold text-[#14213D]
                        border-4 border-white">

                        {admin.name
                            ? admin.name.charAt(0).toUpperCase()
                            : "A"}

                    </div>


                    {/* Admin Name */}
                    <div>

                        <h2 className="text-2xl font-bold text-white prata-regular">
                            {admin.name || "Admin"}
                        </h2>

                        <p className="text-gray-300 mt-1 inter">
                            {admin.email || "-"}
                        </p>

                    </div>

                </div>

            </div>


            {/* Details */}
            <div className="p-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Admin ID */}
                    <div className="bg-[#E8EEF9] rounded-xl p-5">

                        <p className="text-sm text-gray-500 inter">
                            Admin ID
                        </p>

                        <p className="mt-1 font-semibold text-[#14213D] inter">
                            {admin.id || "-"}
                        </p>

                    </div>


                    {/* Name */}
                    <div className="bg-[#E8EEF9] rounded-xl p-5">

                        <p className="text-sm text-gray-500 inter">
                            Name
                        </p>

                        <p className="mt-1 font-semibold text-[#14213D] inter">
                            {admin.name || "-"}
                        </p>

                    </div>


                    {/* Email */}
                    <div className="bg-[#E8EEF9] rounded-xl p-5">

                        <p className="text-sm text-gray-500 inter">
                            Email
                        </p>

                        <p className="mt-1 font-semibold text-[#14213D] break-words inter">
                            {admin.email || "-"}
                        </p>

                    </div>


                    {/* Approval Status */}
                    <div className="bg-[#E8EEF9] rounded-xl p-5">

                        <p className="text-sm text-gray-500 inter">
                            Approval Status
                        </p>

                        <div className="mt-2">

                            <span
                                className={`inline-flex px-3 py-1 rounded-full
                                text-sm font-medium inter
                                ${
                                    admin.is_approved
                                        ? "bg-green-100 text-green-700"
                                        : "bg-[#FFF4D6] text-[#A16207]"
                                }`}
                            >
                                {admin.is_approved
                                    ? "Approved"
                                    : "Pending"}
                            </span>

                        </div>

                    </div>


                    {/* Created Date */}
                    <div className="bg-[#E8EEF9] rounded-xl p-5 md:col-span-2">

                        <p className="text-sm text-gray-500 inter">
                            Account Created
                        </p>

                        <p className="mt-1 font-semibold text-[#14213D] inter">

                            {admin.created_at
                                ? new Date(
                                    admin.created_at
                                ).toLocaleDateString()
                                : "-"}

                        </p>

                    </div>

                </div>

            </div>

        </div>


        {/* Back to Dashboard */}
        <div className="mt-5">

            <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-2
                text-gray-600 hover:text-[#14213D]
                font-medium inter"
            >
                <ArrowLeft size={18} />
                Back to Dashboard
            </Link>

        </div>

    </div>
);



};

export default ViewProfile;