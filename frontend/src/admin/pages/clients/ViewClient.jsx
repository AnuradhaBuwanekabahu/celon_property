
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    UserCheck,
    UserX,
    User,
    Phone,
    Mail,
    MessageCircle,
    Calendar,
    Home,
    Building2,
    Map,
    LandPlot,
    Megaphone
} from "lucide-react";
import { toast } from "react-toastify";

import {
    getClientById,
    updateClientStatus
} from "../../api/clientApi";
import Loader from "../../components/Loader";



const ViewClient = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // =====================================================
    // LOAD CLIENT
    // =====================================================

    const loadClient = async () => {

        try {

            setLoading(true);

            const res = await getClientById(id);

            if (res.data?.success) {

                setClient(res.data.client);

            } else {

                toast.error(
                    res.data?.message || "Client not found"
                );

            }

        } catch (error) {

            console.error(
                "LOAD CLIENT ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed loading client"
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadClient();

    }, [id]);

    // =====================================================
    // CHANGE STATUS
    // =====================================================

    const changeStatus = async () => {

        if (!client) return;

        try {

            setUpdating(true);

            const newStatus =
                client.is_active ? 0 : 1;

            const response =
                await updateClientStatus(
                    id,
                    {
                        is_active: newStatus
                    }
                );

            if (response.data?.success) {

                setClient(prev => ({
                    ...prev,
                    is_active: newStatus
                }));

                toast.success(
                    newStatus
                        ? "Client activated successfully"
                        : "Client deactivated successfully"
                );

            } else {

                toast.error(
                    response.data?.message ||
                    "Status update failed"
                );

            }

        } catch (error) {

            console.error(
                "CHANGE CLIENT STATUS ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Status update failed"
            );

        } finally {

            setUpdating(false);

        }

    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return <Loader />;

    }

    // =====================================================
    // CLIENT NOT FOUND
    // =====================================================

    if (!client) {

        return (

            <div className="min-h-[400px] flex flex-col items-center justify-center">

                <User
                    size={60}
                    className="text-gray-300 mb-4"
                />

                <h2 className="text-xl font-semibold text-gray-700">
                    Client not found
                </h2>

                <p className="text-gray-500 mt-2">
                    The requested client does not exist.
                </p>

                <button
                    onClick={() => navigate(-1)}
                    className="
                        mt-5
                        flex items-center gap-2
                        bg-gray-600
                        hover:bg-gray-700
                        text-white
                        px-5 py-2.5
                        rounded-lg
                    "
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

            </div>

        );

    }

    // =====================================================
    // PROPERTY COUNTS
    // =====================================================

    const propertyCount =
        client.propertyCount || {};

        

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="p-4 sm:p-6 space-y-6">

            {/* ============================================
                HEADER
            ============================================ */}

            <div className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-4
            ">

                <div>

                    <h1 className="
                        text-2xl
                        sm:text-3xl
                        font-bold
                        text-[#14213D]
                    ">
                        Client Details
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View client information and properties
                    </p>

                </div>

                <button
                    onClick={() => navigate(-1)}
                    className="
                        w-fit
                        flex items-center gap-2
                        bg-gray-600
                        hover:bg-gray-700
                        text-white
                        px-4 py-2.5
                        rounded-lg
                    "
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

            </div>


            {/* ============================================
                CLIENT PROFILE CARD
            ============================================ */}

            <div className="
                bg-white
                rounded-2xl
                shadow-sm
                border border-gray-200
                overflow-hidden
            ">

                <div className="
                    bg-[#14213D]
                    h-28
                    sm:h-36
                " />

                <div className="
                    px-5
                    sm:px-8
                    pb-7
                ">

                    {/* Avatar */}

                    <div className="-mt-14 sm:-mt-16 mb-5">

                        {client.avatar ? (

                            <img
                                src={`http://localhost:5000/api/clients/${client.id}/avatar`}
                                alt={client.full_name}
                                className="
                                    w-28
                                    h-28
                                    sm:w-32
                                    sm:h-32
                                    rounded-full
                                    object-cover
                                    border-4
                                    border-white
                                    shadow-md
                                    bg-gray-100
                                "
                            />

                        ) : (

                            <div className="
                                w-28
                                h-28
                                sm:w-32
                                sm:h-32
                                rounded-full
                                border-4
                                border-white
                                shadow-md
                                bg-gray-200
                                flex
                                items-center
                                justify-center
                            ">

                                <User
                                    size={55}
                                    className="text-gray-400"
                                />

                            </div>

                        )}

                    </div>


                    {/* Name / Email / Status */}

                    <div className="
                        flex
                        flex-col
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                        gap-4
                    ">

                        <div>

                            <h2 className="
                                text-2xl
                                font-bold
                                text-[#14213D]
                            ">
                                {client.full_name}
                            </h2>

                            <div className="
                                flex
                                items-center
                                gap-2
                                text-gray-500
                                mt-2
                            ">

                                <Mail size={17} />

                                <span>
                                    {client.email}
                                </span>

                            </div>

                        </div>


                        {/* Status */}

                        <span
                            className={`
                                w-fit
                                px-4 py-2
                                rounded-full
                                text-sm
                                font-semibold

                                ${
                                    client.is_active
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }
                            `}
                        >

                            {client.is_active
                                ? "Active"
                                : "Blocked"
                            }

                        </span>

                    </div>


                    {/* Client Information */}

                    <div className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-3
                        gap-4
                        mt-7
                    ">

                        {/* Phone */}

                        <InfoCard
                            icon={<Phone size={20} />}
                            label="Phone Number"
                            value={
                                client.phone_number || "-"
                            }
                        />


                        {/* WhatsApp */}

                        <InfoCard
                            icon={
                                <MessageCircle size={20} />
                            }
                            label="WhatsApp Number"
                            value={
                                client.whatsapp_number || "-"
                            }
                        />


                        {/* Registered Date */}

                        <InfoCard
                            icon={<Calendar size={20} />}
                            label="Registered Date"
                            value={
                                client.created_at
                                    ? new Date(
                                        client.created_at
                                    ).toLocaleDateString()
                                    : "-"
                            }
                        />

                    </div>


                    {/* Status Button */}

                    <div className="mt-7">

                        <button
                            disabled={updating}
                            onClick={changeStatus}
                            className={`
                                flex
                                items-center
                                justify-center
                                gap-2
                                px-6 py-3
                                rounded-lg
                                text-white
                                font-medium
                                transition

                                ${
                                    client.is_active
                                        ? `
                                            bg-red-600
                                            hover:bg-red-700
                                        `
                                        : `
                                            bg-green-600
                                            hover:bg-green-700
                                        `
                                }

                                ${
                                    updating
                                        ? "opacity-60 cursor-not-allowed"
                                        : ""
                                }
                            `}
                        >

                            {client.is_active ? (
                                <>
                                    <UserX size={18} />
                                    Deactivate Client
                                </>
                            ) : (
                                <>
                                    <UserCheck size={18} />
                                    Activate Client
                                </>
                            )}

                        </button>

                    </div>

                </div>

            </div>


            {/* ============================================
                PROPERTY COUNT
            ============================================ */}

            <div>

                <h2 className="
                    text-xl
                    sm:text-2xl
                    font-bold
                    text-[#14213D]
                    mb-4
                ">
                    Client Properties
                </h2>


                <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-5
                    gap-4
                ">

                    {/* Hot Sales */}

                    <PropertyCard
                        icon={<Home size={24} />}
                        title="Hot Sales"
                        count={
                           Number(propertyCount.hotSales) || 0
                        }
                    />


                    {/* Stay To Buy */}

                    <PropertyCard
                        icon={<Building2 size={24} />}
                        title="Stay To Buy"
                        count={
                           Number(propertyCount.stayToBuy) || 0
                        }
                    />


                    {/* Stay To Rent */}

                    <PropertyCard
                        icon={<Map size={24} />}
                        title="Stay To Rent"
                        count={
                            Number(propertyCount.stayToRent) || 0
                        }
                    />


                    {/* Lands */}

                    <PropertyCard
                        icon={<LandPlot size={24} />}
                        title="Lands"
                        count={
                            Number(propertyCount.lands) || 0
                        }
                    />

                    <PropertyCard
                        icon={<Megaphone size={24} />}
                        title="Advertisements"
                        count={
                                  Number(propertyCount.advertisements) || 0
    }
/>

                </div>

            </div>

        </div>

    );

};


// ======================================================
// INFO CARD
// ======================================================

const InfoCard = ({
    icon,
    label,
    value
}) => {

    return (

        <div className="
            border
            border-gray-200
            rounded-xl
            p-4
            bg-gray-50
        ">

            <div className="
                flex
                items-center
                gap-2
                text-gray-500
                mb-2
            ">

                {icon}

                <span className="text-sm">
                    {label}
                </span>

            </div>

            <p className="
                font-semibold
                text-[#14213D]
                break-words
            ">
                {value}
            </p>

        </div>

    );

};


// ======================================================
// PROPERTY CARD
// ======================================================

const PropertyCard = ({
    icon,
    title,
    count
}) => {

    return (

        <div className="
            bg-white
            border
            border-gray-200
            rounded-xl
            p-5
            shadow-sm
            flex
            items-center
            justify-between
        ">

            <div>

                <p className="
                    text-gray-500
                    text-sm
                ">
                    {title}
                </p>

                <p className="
                    text-3xl
                    font-bold
                    text-[#14213D]
                    mt-1
                ">
                    {count}
                </p>

            </div>

            <div className="
                w-12
                h-12
                rounded-xl
                bg-[#FCA311]/10
                text-[#FCA311]
                flex
                items-center
                justify-center
            ">
                {icon}
            </div>

        </div>

    );

};


export default ViewClient;

