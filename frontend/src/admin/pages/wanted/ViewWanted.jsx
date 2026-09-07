
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
    ArrowLeft,
    Pencil,
    Search
} from "lucide-react";

import { toast } from "react-toastify";

import { getWantedById } from "../../api/wantedApi";

import Loader from "../../components/Loader";


const ViewWanted = () => {

    const { id } = useParams();

    const [property, setProperty] = useState(null);

    const [loading, setLoading] = useState(true);


    // =====================================================
    // LOAD WANTED PROPERTY
    // =====================================================

    const fetchWanted = async () => {

        try {

            setLoading(true);

            const response =
                await getWantedById(id);

            console.log(
                "VIEW WANTED RESPONSE:",
                response.data
            );

            const data =
                response.data?.data ||
                response.data?.wanted ||
                response.data?.property;

            setProperty(data);

        } catch (error) {

            console.error(
                "VIEW WANTED ERROR:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to load wanted property"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchWanted();

    }, [id]);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return <Loader />;

    }


    // =====================================================
    // NOT FOUND
    // =====================================================

    if (!property) {

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
                    shadow
                    p-8
                    text-center
                ">

                    <p className="
                        text-[#14213D]
                        text-lg
                        font-semibold
                    ">
                        Wanted property not found
                    </p>


                    <Link
                        to="/admin/wanted"
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

                        Back to Wanted

                    </Link>

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

            <div className="max-w-7xl mx-auto">


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

                        <div className="
                            flex
                            items-center
                            gap-3
                        ">

                            <div className="
                                w-11
                                h-11
                                rounded-xl
                                bg-[#14213D]
                                flex
                                items-center
                                justify-center
                            ">

                                <Search
                                    size={23}
                                    className="text-white"
                                />

                            </div>


                            <div>

                                <h1 className="
                                    text-2xl
                                    sm:text-3xl
                                    font-bold
                                    text-[#14213D]
                                ">
                                    Wanted Property Details
                                </h1>

                            </div>

                        </div>

                    </div>


                    {/* HEADER ACTIONS */}

                    <div className="flex gap-3">

                        <Link
                            to="/admin/wanted"
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

                        </Link>


                        <Link
                            to={`/admin/wanted/edit/${property.id}`}
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
                    PROPERTY INFORMATION
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
                        font-bold
                        text-[#14213D]
                        mb-5
                    ">
                        Property Information
                    </h2>


                    <div className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-3
                        gap-4
                    ">


                        {/* TITLE */}

                        <Info
                            label="Title"
                            value={property.title}
                        />


                        {/* BUDGET */}

                        <Info
                            label="Budget"
                            value={
                                property.budget
                                    ? `Rs. ${Number(
                                        property.budget
                                    ).toLocaleString()}`
                                    : "Rs. 0"
                            }
                        />


                        {/* PREFERRED CITY */}

                        <Info
                            label="Preferred City"
                            value={
                                property.preferred_city
                            }
                        />


                        {/* PHONE NUMBER */}

                        <Info
                            label="Phone Number"
                            value={
                                property.phone_number
                            }
                        />


                        {/* STATUS */}

                        <Info
                            label="Status"
                            value={
                                <span
                                    className={`
                                        inline-flex
                                        px-3
                                        py-1
                                        rounded-full
                                        text-sm
                                        font-semibold

                                        ${
                                            property.status === "active"
                                                ? "bg-green-100 text-green-700"
                                                : property.status === "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                        }
                                    `}
                                >
                                    {property.status || "pending"}
                                </span>
                            }
                        />

                    </div>

                </div>


                {/* =================================================
                    DESCRIPTION
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
                        font-bold
                        text-[#14213D]
                        mb-3
                    ">
                        Description
                    </h2>


                    <p className="
                        text-gray-600
                        leading-relaxed
                        whitespace-pre-line
                    ">

                        {property.description ||
                            "No description available."}

                    </p>

                </div>


                {/* =================================================
                    BOTTOM ACTIONS
                ================================================= */}

                <div className="
                    flex
                    justify-end
                    gap-3
                ">

                    <Link
                        to="/admin/wanted"
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

                    </Link>


                    <Link
                        to={`/admin/wanted/edit/${property.id}`}
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

                        Edit Property

                    </Link>

                </div>

            </div>

        </div>

    );

};


// =====================================================
// INFO COMPONENT
// =====================================================

const Info = ({ label, value }) => (

    <div className="
        bg-[#E8EEF9]
        p-4
        rounded-xl
    ">

        <p className="
            text-sm
            text-gray-500
            mb-1
        ">
            {label}
        </p>


        <p className="
            font-semibold
            text-[#14213D]
            break-words
        ">
            {value || "-"}
        </p>

    </div>

);


export default ViewWanted;

