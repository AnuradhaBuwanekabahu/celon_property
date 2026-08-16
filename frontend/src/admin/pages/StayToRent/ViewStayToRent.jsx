
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";

import {
    getStayToRentById,
    getStayToRentGallery
} from "../../api/stayToRentApi";

import Loader from "../../components/Loader";

const ViewStayToRent = () => {

    const { id } = useParams();

    const [property, setProperty] = useState(null);
    const [gallery, setGallery] = useState([]);

    const [loading, setLoading] = useState(true);
    const [galleryLoading, setGalleryLoading] = useState(true);


    // ==========================================
    // FETCH PROPERTY
    // ==========================================

    const fetchProperty = async () => {

        try {

            setLoading(true);

            const response =
                await getStayToRentById(id);

            setProperty(
                response.data?.data || null
            );

        } catch (error) {

            console.error(
                "GET STAY TO RENT ERROR:",
                error
            );

            setProperty(null);

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // FETCH GALLERY
    // ==========================================

    const fetchGallery = async () => {

        try {

            setGalleryLoading(true);

            const response =
                await getStayToRentGallery(id);

            setGallery(
                response.data?.data || []
            );

        } catch (error) {

            console.error(
                "GET STAY TO RENT GALLERY ERROR:",
                error
            );

            setGallery([]);

        } finally {

            setGalleryLoading(false);

        }

    };


    // ==========================================
    // USE EFFECT
    // ==========================================

    useEffect(() => {

        if (id) {

            fetchProperty();
            fetchGallery();

        }

    }, [id]);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return <Loader />;

    }


    // ==========================================
    // NOT FOUND
    // ==========================================

    if (!property) {

        return (

            <div className="min-h-screen bg-[#E8EEF9] p-6 flex items-center justify-center">

                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">

                    <p className="text-[#14213D] text-lg font-semibold mb-5">
                        Stay To Rent property not found
                    </p>

                    <Link
                        to="/admin/stay-to-rent"
                        className="inline-flex items-center gap-2 bg-[#14213D] text-white px-5 py-2.5 rounded-lg hover:bg-[#E8EEF9] hover:text-[#14213D] transition"
                    >
                        <ArrowLeft size={18} />
                        Back
                    </Link>

                </div>

            </div>

        );

    }


    // ==========================================
    // JSON HELPER
    // ==========================================

    const parseJSON = (data) => {

        if (!data) {
            return [];
        }

        if (Array.isArray(data)) {
            return data;
        }

        if (typeof data === "string") {

            try {

                return JSON.parse(data);

            } catch {

                return [];

            }

        }

        return [];

    };


    const overview =
        parseJSON(property.overview);

    const highlights =
        parseJSON(property.highlights);


    // ==========================================
    // FORMAT PRICE
    // ==========================================

    const formatPrice = (price) => {

        if (
            price === null ||
            price === undefined ||
            price === ""
        ) {
            return "-";
        }

        return Number(price).toLocaleString("en-LK");

    };


    // ==========================================
    // STATUS STYLE
    // ==========================================

    const getStatusStyle = (status) => {

        switch (status?.toLowerCase()) {

            case "active":
                return "bg-green-100 text-green-700";

            case "sold":
                return "bg-red-100 text-red-700";

            case "pending":
                return "bg-yellow-100 text-yellow-700";

            default:
                return "bg-gray-100 text-gray-700";

        }

    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="min-h-screen bg-[#E8EEF9] p-4 sm:p-6 lg:p-8">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">

                <div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D]">
                        Stay To Rent Details
                    </h1>

                    

                </div>


                <div className="flex gap-3">

                    {/* BACK */}

                    <Link
                        to="/admin/stay-to-rent"
                        className="flex items-center gap-2 bg-[#14213D] text-white px-4 py-2.5 rounded-lg hover:bg-[#E8EEF9] hover:text-[#14213D] transition"
                    >

                        <ArrowLeft size={18} />

                        Back

                    </Link>


                    {/* EDIT */}

                    <Link
                        to={`/admin/stay-to-rent/edit/${property.id}`}
                        className="flex items-center gap-2 bg-[#FBBF24] text-[#14213D] px-4 py-2.5 rounded-lg font-semibold hover:bg-[#14213D] hover:text-white transition"
                    >

                        <Pencil size={18} />

                        Edit

                    </Link>

                </div>

            </div>


            {/* ==========================================
                MAIN IMAGE
            ========================================== */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">

                <h2 className="text-xl font-bold text-[#14213D] mb-4">
                    Main Image
                </h2>

                {property.main_image ? (

                    <img
                        src={`http://localhost:5000${property.main_image}`}
                        alt={property.title}
                        className="w-full h-[300px] sm:h-[400px] lg:h-[450px] object-cover rounded-xl"
                    />

                ) : (

                    <div className="w-full h-[300px] sm:h-[400px] lg:h-[450px] bg-[#E8EEF9] rounded-xl flex items-center justify-center text-gray-500">
                        No main image
                    </div>

                )}

            </div>


            {/* ==========================================
                MAIN VIDEO
            ========================================== */}

            {property.main_video && (

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">

                    <h2 className="text-xl font-bold text-[#14213D] mb-4">
                        Property Video
                    </h2>

                    <video
                        controls
                        className="w-full max-h-[500px] rounded-xl bg-black"
                    >

                        <source
                            src={`http://localhost:5000${property.main_video}`}
                            type="video/mp4"
                        />

                        Your browser does not support the video tag.

                    </video>

                </div>

            )}


            {/* ==========================================
                PROPERTY INFORMATION
            ========================================== */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">

                <h2 className="text-2xl font-bold text-[#14213D] mb-6">
                    {property.title}
                </h2>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                    <Info
                        label="Price"
                        value={`Rs. ${formatPrice(property.price)}`}
                    />


                    <Info
                        label="Price Period"
                        value={property.price_period}
                    />


                    <Info
                        label="City"
                        value={property.city}
                    />


                    <Info
                        label="Status"
                        value={
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                                    property.status
                                )}`}
                            >
                                {property.status || "Pending"}
                            </span>
                        }
                    />


                    <Info
                        label="Property Type"
                        value={property.property_type}
                    />


                    <Info
                        label="Area"
                        value={
                            property.area_sqft
                                ? `${property.area_sqft} sqft`
                                : "-"
                        }
                    />


                    <Info
                        label="Rate"
                        value={`${property.rate || 0}/5`}
                    />


                    <Info
                        label="Duration"
                        value={property.duration}
                    />


                    <Info
                        label="Location"
                        value={property.location}
                    />


                    <Info
                        label="Map Address"
                        value={property.map_address}
                    />

                </div>

            </div>


            {/* ==========================================
                DESCRIPTION
            ========================================== */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">

                <h2 className="text-xl font-bold text-[#14213D] mb-3">
                    Description
                </h2>

                <p className="text-gray-600 leading-7">

                    {property.description ||
                        "No description available."}

                </p>

            </div>


            {/* ==========================================
                OVERVIEW
            ========================================== */}

            {overview.length > 0 && (

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">

                    <h2 className="text-xl font-bold text-[#14213D] mb-4">
                        Overview
                    </h2>


                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                        {overview.map(
                            (item, index) => (

                                <div
                                    key={index}
                                    className="bg-[#E8EEF9] p-4 rounded-xl hover:opacity-90 transition"
                                >

                                    {typeof item === "object" ? (

                                        <>

                                            {item.title && (

                                                <p className="font-semibold text-[#14213D]">

                                                    {item.title}

                                                </p>

                                            )}
                                            

                                            {item.value && (

                                                <p className="text-gray-600 mt-1">

                                                    {item.value}

                                                </p>

                                            )}

                                        </>

                                    ) : (

                                        <p className="text-[#14213D]">

                                            {item}

                                        </p>

                                    )}

                                </div>

                            )
                        )}

                    </div>

                </div>

            )}


            {/* ==========================================
                HIGHLIGHTS
            ========================================== */}

            {highlights.length > 0 && (

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">

                    <h2 className="text-xl font-bold text-[#14213D] mb-4">
                        Highlights
                    </h2>


                    <div className="flex flex-wrap gap-3">

                        {highlights.map(
                            (item, index) => (

                                <span
                                    key={index}
                                    className="bg-[#E8EEF9] text-[#14213D] px-4 py-2 rounded-full font-medium"
                                >

                                    {typeof item === "object"
                                        ? item.title ||
                                          item.value ||
                                          JSON.stringify(item)
                                        : item}

                                </span>

                            )
                        )}

                    </div>

                </div>

            )}


            {/* ==========================================
                GALLERY
            ========================================== */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">

                <h2 className="text-xl font-bold text-[#14213D] mb-4">
                    Gallery
                </h2>


                {galleryLoading ? (

                    <p className="text-gray-500">
                        Loading gallery...
                    </p>

                ) : gallery.length === 0 ? (

                    <p className="text-gray-500">
                        No gallery images available.
                    </p>

                ) : (

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

                        {gallery.map(
                            (image, index) => (

                                <img
                                    key={
                                        image.id ||
                                        index
                                    }
                                    src={`http://localhost:5000${
                                        image.image ||
                                        image.url
                                    }`}
                                    alt={`${property.title} ${index + 1}`}
                                    className="h-32 sm:h-40 w-full object-cover rounded-xl border border-gray-100 hover:opacity-80 transition"
                                />

                            )
                        )}

                    </div>

                )}

            </div>


            {/* ==========================================
                BOTTOM ACTIONS
            ========================================== */}

            <div className="flex justify-end gap-3">

                <Link
                    to="/admin/stay-to-rent"
                    className="flex items-center gap-2 bg-[#14213D] text-white px-5 py-2.5 rounded-lg hover:bg-[#E8EEF9] hover:text-[#14213D] transition"
                >

                    <ArrowLeft size={18} />

                    Back

                </Link>


                <Link
                    to={`/admin/stay-to-rent/edit/${property.id}`}
                    className="flex items-center gap-2 bg-[#FBBF24] text-[#14213D] px-5 py-2.5 rounded-lg font-semibold hover:bg-[#14213D] hover:text-white transition"
                >

                    <Pencil size={18} />

                    Edit Property

                </Link>

            </div>

        </div>

    );

};


// ==========================================
// INFO COMPONENT
// ==========================================

const Info = ({ label, value }) => (

    <div className="bg-[#E8EEF9] p-4 rounded-xl">

        <p className="text-sm text-gray-500 mb-1">
            {label}
        </p>

        <div className="font-semibold text-[#14213D] break-words">
            {value || "-"}
        </div>

    </div>

);


export default ViewStayToRent;

