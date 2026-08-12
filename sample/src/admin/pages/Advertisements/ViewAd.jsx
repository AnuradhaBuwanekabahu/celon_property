
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";

import { getAdById } from "../../api/adApi";
import Loader from "../../components/Loader";

const ViewAd = () => {

    const { id } = useParams();

    const API_URL =
        import.meta.env.VITE_BACKEND_URL ||
        "http://localhost:5000";

    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);


    // =====================================================
    // GET AD
    // =====================================================

    useEffect(() => {

        const fetchAd = async () => {

            try {

                setLoading(true);
                setNotFound(false);

                const response = await getAdById(id);

                console.log("View Ad Response:", response.data);

                if (response.data?.ad) {

                    setAd(response.data.ad);

                } else {

                    setNotFound(true);

                }

            } catch (error) {

                console.error("VIEW AD ERROR:", error);

                if (error.response?.status === 404) {
                    setNotFound(true);
                }

            } finally {

                setLoading(false);

            }

        };

        fetchAd();

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

    if (notFound || !ad) {

        return (

            <div className="min-h-screen bg-[#E8EEF9] p-6">

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">

                    <h2 className="text-xl font-semibold text-[#14213D]">
                        Advertisement Not Found
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Advertisement ID: {id}
                    </p>

                    <Link
                        to="/admin/advertisements"
                        className="
                            inline-flex items-center gap-2
                            mt-6
                            bg-[#14213D]
                            hover:bg-[#E8EEF9]
                            hover:text-[#14213D]
                            text-white
                            px-5 py-2.5
                            rounded-lg
                            transition
                        "
                    >
                        <ArrowLeft size={18} />
                        Back to Advertisements
                    </Link>

                </div>

            </div>

        );

    }


    // =====================================================
    // IMAGE URL
    // =====================================================

    const imageUrl = ad.image
        ? `${API_URL}${ad.image}`
        : null;


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="min-h-screen bg-[#E8EEF9] p-4 sm:p-6 lg:p-8">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="
                flex flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-4
                mb-8
            ">

                <div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D]">
                        Advertisement Details
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View advertisement information
                    </p>

                </div>


                <div className="flex gap-3">

                    {/* BACK */}

                    <Link
                        to="/admin/advertisements"
                        className="
                            flex items-center gap-2
                            bg-[#14213D]
                            hover:bg-[#E8EEF9]
                            hover:text-[#14213D]
                            text-white
                            px-4 py-2.5
                            rounded-lg
                            transition
                        "
                    >
                        <ArrowLeft size={18} />
                        Back
                    </Link>


                    {/* EDIT */}

                    <Link
                        to={`/admin/advertisements/edit/${ad.id}`}
                        className="
                            flex items-center gap-2
                            bg-[#FBBF24]
                            hover:bg-[#14213D]
                            hover:text-white
                            text-[#14213D]
                            font-semibold
                            px-4 py-2.5
                            rounded-lg
                            transition
                        "
                    >
                        <Pencil size={18} />
                        Edit
                    </Link>

                </div>

            </div>


            {/* =================================================
                IMAGE CARD
            ================================================= */}

            <div className="
                bg-white
                rounded-2xl
                shadow-sm
                border border-gray-100
                p-5
                mb-6
            ">

                <h2 className="text-xl font-bold text-[#14213D] mb-5">
                    Advertisement Image
                </h2>


                <div className="
                    w-full
                    bg-[#E8EEF9]
                    rounded-xl
                    overflow-hidden
                    flex
                    items-center
                    justify-center
                    min-h-[300px]
                ">

                    {imageUrl ? (

                        <img
                            src={imageUrl}
                            alt={ad.title || "Advertisement"}
                            className="
                                w-full
                                max-h-[500px]
                                object-contain
                                rounded-xl
                            "
                            onError={(e) => {

                                console.error(
                                    "Advertisement image failed:",
                                    imageUrl
                                );

                                e.currentTarget.style.display = "none";

                            }}
                        />

                    ) : (

                        <div className="text-gray-500 py-20">
                            No advertisement image
                        </div>

                    )}

                </div>

            </div>


            {/* =================================================
                ADVERTISEMENT INFORMATION
            ================================================= */}

            <div className="
                bg-white
                rounded-2xl
                shadow-sm
                border border-gray-100
                p-6
                mb-6
            ">

                <h2 className="text-xl font-bold text-[#14213D] mb-6">
                    Advertisement Information
                </h2>


                <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-3
                    gap-4
                ">


                    <Info
                        label="Advertisement ID"
                        value={ad.id}
                    />


                    <Info
                        label="Client ID"
                        value={ad.client_id}
                    />


                    <Info
                        label="Title"
                        value={ad.title}
                    />


                    <Info
                        label="Position"
                        value={ad.position}
                    />



                    {/* STATUS */}

                    <div className="bg-[#E8EEF9] p-4 rounded-xl">

                        <p className="text-sm text-gray-500 mb-1">
                            Status
                        </p>

                        <span
                            className={`
                                inline-flex
                                px-3 py-1
                                rounded-full
                                text-sm
                                font-semibold
                                ${
                                    Number(ad.is_active) === 1
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }
                            `}
                        >

                            {Number(ad.is_active) === 1
                                ? "Active"
                                : "Inactive"}

                        </span>

                    </div>


                    {/* LINK */}

                    <div className="
                        sm:col-span-2
                        lg:col-span-3
                        bg-[#E8EEF9]
                        p-4
                        rounded-xl
                    ">

                        <p className="text-sm text-gray-500 mb-1">
                            Link URL
                        </p>


                        {ad.link_url ? (

                            <a
                                href={ad.link_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                    text-[#14213D]
                                    font-semibold
                                    hover:underline
                                    break-all
                                "
                            >
                                {ad.link_url}
                            </a>

                        ) : (

                            <p className="font-semibold text-gray-700">
                                No Link
                            </p>

                        )}

                    </div>


                    {/* CREATED */}

                    <Info
                        label="Created Date"
                        value={
                            ad.created_at
                                ? new Date(
                                    ad.created_at
                                ).toLocaleString()
                                : "-"
                        }
                    />

                </div>

            </div>


            {/* =================================================
                BOTTOM ACTIONS
            ================================================= */}

            <div className="flex justify-end gap-3">

                <Link
                    to="/admin/advertisements"
                    className="
                        flex items-center gap-2
                        bg-[#14213D]
                        text-white
                        px-5 py-2.5
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
                    to={`/admin/advertisements/edit/${ad.id}`}
                    className="
                        flex items-center gap-2
                        bg-[#FBBF24]
                        text-[#14213D]
                        font-semibold
                        px-5 py-2.5
                        rounded-lg
                        hover:bg-[#14213D]
                        hover:text-white
                        transition
                    "
                >
                    <Pencil size={18} />
                    Edit Advertisement
                </Link>

            </div>

        </div>

    );

};


// =====================================================
// INFO COMPONENT
// =====================================================

const Info = ({ label, value }) => {

    return (

        <div className="bg-[#E8EEF9] p-4 rounded-xl">

            <p className="text-sm text-gray-500 mb-1">
                {label}
            </p>

            <p className="font-semibold text-[#14213D] break-all">
                {value ?? "-"}
            </p>

        </div>

    );

};


export default ViewAd;

