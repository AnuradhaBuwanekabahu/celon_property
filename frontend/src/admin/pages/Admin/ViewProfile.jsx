import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Pencil,
    ArrowLeft,
    User
} from "lucide-react";
import { toast } from "react-toastify";

import { getAdminProfile } from "../../api/adminAuth";
import Loader from "../../components/Loader";


const ViewProfile = () => {

    const navigate = useNavigate();

    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);


    // =====================================================
    // LOAD ADMIN PROFILE
    // =====================================================

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const res = await getAdminProfile();

                setAdmin(res.data.admin);

            } catch (error) {

                console.log(
                    "PROFILE ERROR:",
                    error
                );

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


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return <Loader />;

    }


    // =====================================================
    // PROFILE NOT FOUND
    // =====================================================

    if (!admin) {

        return (

            <div className="
                min-h-screen
                bg-[#E8EEF9]
                p-6
                flex
                items-center
                justify-center
            ">

                <div className="
                    bg-white
                    rounded-2xl
                    shadow-sm
                    border
                    border-gray-100
                    p-8
                    text-center
                ">

                    <User
                        size={50}
                        className="
                            mx-auto
                            text-gray-300
                            mb-4
                        "
                    />

                    <p className="
                        text-[#14213D]
                        text-lg
                        font-semibold
                    ">
                        Admin profile not found
                    </p>


                    <button
                        onClick={() => navigate(-1)}
                        className="
                            inline-flex
                            items-center
                            gap-2
                            mt-5
                            bg-[#14213D]
                            text-white
                            px-5
                            py-2.5
                            rounded-lg
                            hover:bg-[#E8EEF9]
                            hover:text-[#14213D]
                            transition
                        "
                    >

                        <ArrowLeft size={18} />

                        Back

                    </button>

                </div>

            </div>

        );

    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="
            min-h-screen
            bg-[#E8EEF9]
            p-4
            sm:p-6
            lg:p-8
        ">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="
                flex
                flex-col
                sm:flex-row
                justify-between
                sm:items-center
                gap-4
                mb-8
            ">

                <div>

                    <h1 className="
                        text-2xl
                        sm:text-3xl
                        font-bold
                        text-[#14213D]
                    ">
                        Admin Profile
                    </h1>

                    

                </div>


                {/* =================================================
                    HEADER ACTIONS
                ================================================= */}

                <div className="
                    flex
                    flex-wrap
                    gap-3
                ">


                    {/* BACK */}

                    <button
                        onClick={() => navigate(-1)}
                        className="
                            flex
                            items-center
                            gap-2
                            bg-[#14213D]
                            text-white
                            px-4
                            py-2.5
                            rounded-lg
                            hover:bg-[#E8EEF9]
                            hover:text-[#14213D]
                            transition
                        "
                    >

                        <ArrowLeft size={18} />

                        Back

                    </button>


                    {/* EDIT */}

                    <Link
                        to="/admin/profile/edit"
                        className="
                            flex
                            items-center
                            gap-2
                            bg-[#FBBF24]
                            text-[#14213D]
                            px-4
                            py-2.5
                            rounded-lg
                            font-semibold
                            hover:bg-[#14213D]
                            hover:text-white
                            transition
                        "
                    >

                        <Pencil size={18} />

                        Edit

                    </Link>

                </div>

            </div>


            {/* =================================================
                PROFILE CARD
            ================================================= */}

            <div className="
                bg-white
                rounded-2xl
                shadow-sm
                border
                border-gray-100
                overflow-hidden
                mb-6
            ">


                {/* =================================================
                    PROFILE HEADER
                ================================================= */}

                <div className="
                    bg-[#14213D]
                    px-6
                    sm:px-8
                    py-8
                ">

                    <div className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        gap-5
                    ">


                        {/* AVATAR */}

                        <div className="
                            w-20
                            h-20
                            rounded-full
                            bg-[#E8EEF9]
                            flex
                            items-center
                            justify-center
                            text-3xl
                            font-bold
                            text-[#14213D]
                            border-4
                            border-white
                            shadow-sm
                        ">

                            {admin.name
                                ? admin.name
                                    .charAt(0)
                                    .toUpperCase()
                                : "A"
                            }

                        </div>


                        {/* ADMIN NAME */}

                        <div>

                            <h2 className="
                                text-2xl
                                sm:text-3xl
                                font-bold
                                text-white
                            ">
                                {admin.name || "Admin"}
                            </h2>

                            <p className="
                                text-gray-300
                                mt-1
                            ">
                                {admin.email || "-"}
                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    DETAILS
                ================================================= */}

                <div className="p-6">

                    <div className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-3
                        gap-4
                    ">


                        {/* ADMIN ID */}

                        <InfoCard
                            label="Admin ID"
                            value={admin.id}
                        />


                        {/* NAME */}

                        <InfoCard
                            label="Name"
                            value={admin.name}
                        />


                        {/* EMAIL */}

                        <InfoCard
                            label="Email"
                            value={admin.email}
                        />


                        {/* APPROVAL STATUS */}

                        <div className="
                            bg-[#E8EEF9]
                            rounded-xl
                            p-5
                        ">

                            <p className="
                                text-sm
                                text-gray-500
                            ">
                                Approval Status
                            </p>

                            <div className="mt-2">

                                <span
                                    className={`
                                        inline-flex
                                        px-4
                                        py-1.5
                                        rounded-full
                                        text-sm
                                        font-semibold

                                        ${
                                            admin.is_approved
                                                ? "bg-green-100 text-green-700"
                                                : "bg-[#FFF4D6] text-[#A16207]"
                                        }
                                    `}
                                >

                                    {admin.is_approved
                                        ? "Approved"
                                        : "Pending"
                                    }

                                </span>

                            </div>

                        </div>


                        {/* ACCOUNT CREATED */}

                        <InfoCard
                            label="Account Created"
                            value={
                                admin.created_at
                                    ? new Date(
                                        admin.created_at
                                    ).toLocaleDateString()
                                    : "-"
                            }
                        />


                        {/* ACCOUNT TYPE */}

                        <InfoCard
                            label="Account Type"
                            value="Administrator"
                        />

                    </div>

                </div>

            </div>


            {/* =================================================
                BOTTOM ACTIONS
            ================================================= */}

            <div className="
                flex
                justify-end
                gap-3
            ">


                {/* BACK */}

                <button
                    onClick={() => navigate(-1)}
                    className="
                        flex
                        items-center
                        gap-2
                        bg-[#14213D]
                        text-white
                        px-5
                        py-2.5
                        rounded-lg
                        hover:bg-[#E8EEF9]
                        hover:text-[#14213D]
                        transition
                    "
                >

                    <ArrowLeft size={18} />

                    Back

                </button>


                {/* EDIT */}

                <Link
                    to="/admin/profile/edit"
                    className="
                        flex
                        items-center
                        gap-2
                        bg-[#FBBF24]
                        text-[#14213D]
                        px-5
                        py-2.5
                        rounded-lg
                        font-semibold
                        hover:bg-[#14213D]
                        hover:text-white
                        transition
                    "
                >

                    <Pencil size={18} />

                    Edit Profile

                </Link>

            </div>

        </div>

    );

};


// =====================================================
// INFO CARD
// =====================================================

const InfoCard = ({
    label,
    value
}) => {

    return (

        <div className="
            bg-[#E8EEF9]
            rounded-xl
            p-5
        ">

            <p className="
                text-sm
                text-gray-500
            ">
                {label}
            </p>

            <p className="
                mt-1
                font-semibold
                text-[#14213D]
                break-words
            ">
                {value || "-"}
            </p>

        </div>

    );

};


export default ViewProfile;