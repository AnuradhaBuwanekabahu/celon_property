import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import {
    ArrowLeft,
    Pencil,
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


// =====================================================
// VIEW CLIENT
// =====================================================

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
                    res.data?.message ||
                    "Client not found"
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
                        size={55}
                        className="mx-auto text-gray-300 mb-4"
                    />

                    <p className="
                        text-[#14213D]
                        text-lg
                        font-semibold
                    ">
                        Client not found
                    </p>

                    <p className="
                        text-gray-500
                        mt-2
                    ">
                        The requested client does not exist.
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
    // PROPERTY COUNTS
    // =====================================================

    const propertyCount =
        client.propertyCount || {};


    // =====================================================
    // RENDER
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
                        Client Details
                    </h1>

                   

                </div>


                {/* ACTION BUTTONS */}

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
                        to={`/admin/clients/edit/${client.id}`}
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
                CLIENT PROFILE
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


                {/* COVER */}

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


                    {/* =================================================
                        AVATAR
                    ================================================= */}

                    <div className="
                        -mt-14
                        sm:-mt-16
                        mb-5
                    ">

                        {client.avatar ? (

                            <img
                                src={`http://localhost:5000/api/admin/clients/${client.id}/avatar`}
                                alt={
                                    client.full_name ||
                                    "Client"
                                }
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


                    {/* =================================================
                        NAME + STATUS
                    ================================================= */}

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
                                sm:text-3xl
                                font-bold
                                text-[#14213D]
                            ">
                                {client.full_name || "-"}
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
                                    {client.email || "-"}
                                </span>

                            </div>

                        </div>


                        {/* STATUS */}

                        <span className={`
                            w-fit
                            px-4
                            py-2
                            rounded-full
                            text-sm
                            font-semibold

                            ${
                                client.is_active
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }
                        `}>

                            {client.is_active
                                ? "Active"
                                : "Blocked"
                            }

                        </span>

                    </div>


                    {/* =================================================
                        CLIENT INFORMATION
                    ================================================= */}

                    <div className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-3
                        gap-4
                        mt-7
                    ">

                        <InfoCard
                            icon={<Phone size={20} />}
                            label="Phone Number"
                            value={
                                client.phone_number || "-"
                            }
                        />


                        <InfoCard
                            icon={
                                <MessageCircle size={20} />
                            }
                            label="WhatsApp Number"
                            value={
                                client.whatsapp_number || "-"
                            }
                        />


                        <InfoCard
                            icon={<Mail size={20} />}
                            label="Email"
                            value={
                                client.email || "-"
                            }
                        />


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


                        <InfoCard
                            icon={<User size={20} />}
                            label="Client ID"
                            value={client.id}
                        />


                        <InfoCard
                            icon={
                                client.is_active
                                    ? <UserCheck size={20} />
                                    : <UserX size={20} />
                            }
                            label="Account Status"
                            value={
                                client.is_active
                                    ? "Active"
                                    : "Blocked"
                            }
                        />

                    </div>


                    {/* =================================================
                        STATUS ACTION
                    ================================================= */}

                    <div className="mt-7">

                        <button
                            disabled={updating}
                            onClick={changeStatus}
                            className={`
                                flex
                                items-center
                                justify-center
                                gap-2
                                px-6
                                py-3
                                rounded-lg
                                text-white
                                font-semibold
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


            {/* =================================================
                CLIENT PROPERTIES
            ================================================= */}

            <div className="
                bg-white
                rounded-2xl
                shadow-sm
                border
                border-gray-100
                p-6
                mb-6
            ">

                <h2 className="
                    text-xl
                    sm:text-2xl
                    font-bold
                    text-[#14213D]
                    mb-5
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


                    {/* HOT SALES */}

                    <PropertyCard
                        icon={<Home size={24} />}
                        title="Hot Sales"
                        count={
                            Number(
                                propertyCount.hotSales
                            ) || 0
                        }
                    />


                    {/* STAY TO BUY */}

                    <PropertyCard
                        icon={
                            <Building2 size={24} />
                        }
                        title="Stay To Buy"
                        count={
                            Number(
                                propertyCount.stayToBuy
                            ) || 0
                        }
                    />


                    {/* STAY TO RENT */}

                    <PropertyCard
                        icon={<Map size={24} />}
                        title="Stay To Rent"
                        count={
                            Number(
                                propertyCount.stayToRent
                            ) || 0
                        }
                    />


                    {/* LANDS */}

                    <PropertyCard
                        icon={
                            <LandPlot size={24} />
                        }
                        title="Lands"
                        count={
                            Number(
                                propertyCount.lands
                            ) || 0
                        }
                    />


                    {/* ADVERTISEMENTS */}

                    <PropertyCard
                        icon={
                            <Megaphone size={24} />
                        }
                        title="Advertisements"
                        count={
                            Number(
                                propertyCount.advertisements
                            ) || 0
                        }
                    />

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


                <Link
                    to={`/admin/clients/edit/${client.id}`}
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

                    Edit Client

                </Link>

            </div>

        </div>

    );

};


// =====================================================
// INFO CARD
// =====================================================

const InfoCard = ({
    icon,
    label,
    value
}) => {

    return (

        <div className="
            bg-[#E8EEF9]
            p-4
            rounded-xl
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


// =====================================================
// PROPERTY CARD
// =====================================================

const PropertyCard = ({
    icon,
    title,
    count
}) => {

    return (

        <div className="
            bg-[#E8EEF9]
            rounded-xl
            p-5
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
                bg-white
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