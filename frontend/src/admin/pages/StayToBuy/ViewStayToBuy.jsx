
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";

import { getStayToBuyById } from "../../api/stayToBuyApi";
import Loader from "../../components/Loader";

const ViewStayToBuy = () => {

    const { id } = useParams();

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);

    // ======================================================
    // FETCH PROPERTY
    // ======================================================

    const fetchProperty = async () => {

        try {

            setLoading(true);

            const response = await getStayToBuyById(id);

            setProperty(
                response.data?.data ||
                response.data?.property ||
                response.data?.stayToBuy ||
                null
            );

        } catch (error) {

            console.error(
                "GET STAY TO BUY ERROR:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    // ======================================================
    // LOAD
    // ======================================================

    useEffect(() => {

        fetchProperty();

    }, [id]);


    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {

        return <Loader />;

    }


    // ======================================================
    // NOT FOUND
    // ======================================================

    if (!property) {

        return (

            <div className="min-h-screen bg-[#E8EEF9] flex items-center justify-center p-6">

                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">

                    <p className="text-[#14213D] text-lg font-semibold">
                        Property not found
                    </p>

                    <Link
                        to="/admin-portal/stay-to-buy"
                        className="inline-flex items-center gap-2 mt-5 bg-[#14213D] text-white px-5 py-2.5 rounded-lg hover:bg-[#E8EEF9] hover:text-[#14213D] transition"
                    >

                        <ArrowLeft size={18} />

                        Back to Stay To Buy

                    </Link>

                </div>

            </div>

        );

    }


    // ======================================================
    // JSON HELPER
    // ======================================================

    const parseJSON = (data) => {

        if (!data) return [];

        if (typeof data === "string") {

            try {

                const parsed = JSON.parse(data);

                return Array.isArray(parsed)
                    ? parsed
                    : [];

            } catch {

                return [];

            }

        }

        return Array.isArray(data)
            ? data
            : [];

    };


    const overview =
        parseJSON(property.overview);

    const highlights =
        parseJSON(property.highlights);


    // ======================================================
    // MAIN IMAGE
    // ======================================================

    const mainImage = property.main_image
        ? `http://localhost:5000${property.main_image}`
        : null;


    // ======================================================
    // MAIN VIDEO
    // ======================================================

    const mainVideo = property.main_video
        ? `http://localhost:5000${property.main_video}`
        : null;


    // ======================================================
    // GALLERY
    // ======================================================

    const gallery = Array.isArray(property.images)
        ? property.images
        : property.gallery
            ? [property.gallery]
            : [];


    // ======================================================
    // RENDER
    // ======================================================

    return (

        <div className="min-h-screen bg-[#E8EEF9] p-4 sm:p-6 lg:p-8">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

                <div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D]">

                        Stay To Buy Details

                    </h1>

                    <p className="text-gray-500 mt-1">

                        View property information

                    </p>

                </div>


                <div className="flex gap-3">

                    {/* BACK */}

                    <Link
                        to="/admin-portal/stay-to-buy"
                        className="flex items-center gap-2 bg-[#14213D] text-white px-4 py-2.5 rounded-lg hover:bg-[#E8EEF9] hover:text-[#14213D] transition"
                    >

                        <ArrowLeft size={18} />

                        Back

                    </Link>


                    {/* EDIT */}

                    <Link
                        to={`/admin-portal/stay-to-buy/edit/${property.id}`}
                        className="flex items-center gap-2 bg-[#FBBF24] text-[#14213D] px-4 py-2.5 rounded-lg font-semibold hover:bg-[#14213D] hover:text-white transition"
                    >

                        <Pencil size={18} />

                        Edit

                    </Link>

                </div>

            </div>


            <div className="space-y-6">


                {/* ==================================================
                    MAIN IMAGE
                ================================================== */}

                {mainImage && (

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

                        <img
                            src={mainImage}
                            alt={property.title}
                            className="w-full h-[300px] sm:h-[400px] lg:h-[450px] object-cover rounded-xl"
                        />

                    </div>

                )}


                {/* ==================================================
                    MAIN VIDEO
                ================================================== */}

                {mainVideo && (

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                        <h2 className="text-xl font-bold text-[#14213D] mb-4">

                            Property Video

                        </h2>

                        <video
                            src={mainVideo}
                            controls
                            className="w-full max-h-[500px] rounded-xl"
                        />

                    </div>

                )}


                {/* ==================================================
                    PROPERTY INFORMATION
                ================================================== */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                    <h2 className="text-xl font-bold text-[#14213D] mb-5">

                        Property Information

                    </h2>


                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                        <Info
                            label="Title"
                            value={property.title}
                        />

                        <Info
                            label="Price"
                            value={`Rs. ${Number(
                                property.price || 0
                            ).toLocaleString()}`}
                        />

                        <Info
                            label="City"
                            value={property.city}
                        />

                        <Info
                            label="Status"
                            value={property.status}
                        />

                        <Info
                            label="Property Type"
                            value={property.property_type}
                        />

                        <Info
                            label="Area"
                            value={`${property.area_sqft || 0} sqft`}
                        />

                        <Info
                            label="Rating"
                            value={`${property.rate || 0}/5`}
                        />

                        <Info
                            label="Duration"
                            value={property.duration}
                        />

                        <Info
                            label="Map Address"
                            value={property.map_address}
                        />

                        <Info
                            label="Location"
                            value={property.location}
                        />

                    </div>

                </div>


                {/* ==================================================
                    DESCRIPTION
                ================================================== */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                    <h2 className="text-xl font-bold text-[#14213D] mb-3">

                        Description

                    </h2>

                    <p className="text-gray-600 leading-7">

                        {property.description ||
                            "No description available."}

                    </p>

                </div>


                {/* ==================================================
                    OVERVIEW
                ================================================== */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                    <h2 className="text-xl font-bold text-[#14213D] mb-4">

                        Overview

                    </h2>


                    {overview.length === 0 ? (

                        <p className="text-gray-500">

                            No overview information available.

                        </p>

                    ) : (

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                            {overview.map((item, index) => (

                                <div
                                    key={index}
                                    className="bg-[#E8EEF9] p-4 rounded-xl hover:bg-[#E8EEF9] transition"
                                >

                                    <p className="text-sm text-gray-500">

                                        {item.title}

                                    </p>

                                    <p className="font-semibold text-[#14213D] mt-1">

                                        {item.value}

                                    </p>

                                </div>

                            ))}

                        </div>

                    )}

                </div>


                {/* ==================================================
                    HIGHLIGHTS
                ================================================== */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                    <h2 className="text-xl font-bold text-[#14213D] mb-4">

                        Highlights

                    </h2>


                    {highlights.length === 0 ? (

                        <p className="text-gray-500">

                            No highlights available.

                        </p>

                    ) : (

                        <div className="flex flex-wrap gap-3">

                            {highlights.map((item, index) => (

                                <span
                                    key={index}
                                    className="bg-[#E8EEF9] text-[#14213D] px-4 py-2 rounded-full text-sm font-medium"
                                >

                                    {item}

                                </span>

                            ))}

                        </div>

                    )}

                </div>


                {/* ==================================================
                    GALLERY
                ================================================== */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                    <h2 className="text-xl font-bold text-[#14213D] mb-4">

                        Gallery

                    </h2>


                    {gallery.length > 0 ? (

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

                            {gallery.map((image, index) => (

                                <img
                                    key={index}
                                    src={`http://localhost:5000${image}`}
                                    alt={`Gallery ${index + 1}`}
                                    className="h-32 sm:h-40 w-full object-cover rounded-xl hover:opacity-80 transition"
                                />

                            ))}

                        </div>

                    ) : (

                        <p className="text-gray-500">

                            No gallery images available.

                        </p>

                    )}

                </div>


                {/* ==================================================
                    BOTTOM ACTIONS
                ================================================== */}

                <div className="flex justify-end gap-3">

                    <Link
                        to="/admin-portal/stay-to-buy"
                        className="flex items-center gap-2 bg-[#14213D] text-white px-5 py-2.5 rounded-lg hover:bg-[#E8EEF9] hover:text-[#14213D] transition"
                    >

                        <ArrowLeft size={18} />

                        Back

                    </Link>


                    <Link
                        to={`/admin-portal/stay-to-buy/edit/${property.id}`}
                        className="flex items-center gap-2 bg-[#FBBF24] text-[#14213D] px-5 py-2.5 rounded-lg font-semibold hover:bg-[#14213D] hover:text-white transition"
                    >

                        <Pencil size={18} />

                        Edit Property

                    </Link>

                </div>

            </div>

        </div>

    );
};


// ======================================================
// INFO COMPONENT
// ======================================================

const Info = ({ label, value }) => (

    <div className="bg-[#E8EEF9] p-4 rounded-xl">

        <p className="text-sm text-gray-500 mb-1">

            {label}

        </p>

        <p className="font-semibold text-[#14213D] break-words">

            {value || "-"}

        </p>

    </div>

);


export default ViewStayToBuy;

