import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { toast } from "react-toastify";

import { getLandById } from "../../api/landApi";
import Loader from "../../components/Loader";

const ViewLand = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [land, setLand] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL =
        import.meta.env.VITE_BACKEND_URL ||
        "http://localhost:5000";


    // =====================================================
    // LOAD LAND
    // =====================================================

    useEffect(() => {

        fetchLand();

    }, [id]);


    const fetchLand = async () => {

        try {

            setLoading(true);

            const response = await getLandById(id);

            console.log("LAND RESPONSE:", response.data);

            const data =
                response.data.data ||
                response.data.land;

            setLand(data);

        } catch (error) {

            console.log(
                "VIEW LAND ERROR:",
                error
            );

            toast.error(
                "Failed to load land"
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return <Loader />;

    }


    // =====================================================
    // NOT FOUND
    // =====================================================

    if (!land) {

        return (

            <div className="min-h-screen bg-[#E8EEF9] flex items-center justify-center">

                <div className="text-center">

                    <p className="text-gray-500 mb-4">
                        Land property not found
                    </p>

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 mx-auto bg-[#14213D] text-white px-5 py-2.5 rounded-xl"
                    >

                        <ArrowLeft size={18} />

                        Go Back

                    </button>

                </div>

            </div>

        );

    }


    // =====================================================
    // JSON HELPER
    // =====================================================

    const parseJSON = (data) => {

        if (!data) return [];

        if (Array.isArray(data)) {

            return data;

        }

        if (typeof data === "string") {

            try {

                const parsed =
                    JSON.parse(data);

                return Array.isArray(parsed)
                    ? parsed
                    : [];

            } catch {

                return [];

            }

        }

        return [];

    };


    const overview =
        parseJSON(land.overview);


    // =====================================================
    // MAIN IMAGE
    // =====================================================

    const getImageUrl = (image) => {

        if (!image) return null;

        if (typeof image === "string") {

            if (
                image.startsWith("http://") ||
                image.startsWith("https://") ||
                image.startsWith("data:")
            ) {

                return image;

            }

            return `${API_URL}${image}`;

        }


        // MySQL Buffer

        if (
            image.type === "Buffer" &&
            Array.isArray(image.data)
        ) {

            const bytes =
                new Uint8Array(image.data);

            let binary = "";

            bytes.forEach(byte => {

                binary += String.fromCharCode(byte);

            });

            return `data:${land.main_image_type || "image/jpeg"};base64,${btoa(binary)}`;

        }

        return null;

    };


    const mainImage =
        getImageUrl(land.main_image);


    // =====================================================
    // VIDEO
    // =====================================================

    const getVideoUrl = (video) => {

        if (!video) return null;


        if (typeof video === "string") {

            if (
                video.startsWith("http://") ||
                video.startsWith("https://") ||
                video.startsWith("data:")
            ) {

                return video;

            }

            return `${API_URL}${video}`;

        }


        // MySQL Buffer

        if (
            video.type === "Buffer" &&
            Array.isArray(video.data)
        ) {

            const bytes =
                new Uint8Array(video.data);

            let binary = "";

            bytes.forEach(byte => {

                binary += String.fromCharCode(byte);

            });

            return `data:${land.main_video_type || "video/mp4"};base64,${btoa(binary)}`;

        }

        return null;

    };


    const mainVideo =
        getVideoUrl(land.main_video);


    // =====================================================
    // GALLERY
    // =====================================================

    const gallery =
        Array.isArray(land.gallery)
            ? land.gallery
            : [];


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="min-h-screen bg-[#E8EEF9] p-4 sm:p-6 lg:p-8">

            <div className="max-w-7xl mx-auto space-y-6">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

                    <div>

                        <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D]">
                            Land Details
                        </h1>

                        <p className="text-gray-500 mt-1">
                            View complete land property information
                        </p>

                    </div>


                    <div className="flex gap-3">

                        <Link
                            to="/admin-portal/lands"
                            className="flex items-center gap-2 bg-[#14213D] hover:bg-[#1c2c52] text-white px-4 py-2.5 rounded-xl"
                        >

                            <ArrowLeft size={18} />

                            Back

                        </Link>


                        <Link
                            to={`/admin-portal/lands/edit/${land.id}`}
                            className="flex items-center gap-2 bg-[#FBBF24] hover:bg-[#d3a120] text-[#14213D] px-4 py-2.5 rounded-xl font-semibold"
                        >

                            <Pencil size={18} />

                            Edit

                        </Link>

                    </div>

                </div>


                {/* =================================================
                    MAIN IMAGE
                ================================================= */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

                    <h2 className="text-xl font-bold text-[#14213D] mb-4">
                        Main Image
                    </h2>


                    {mainImage ? (

                        <img
                            src={mainImage}
                            alt={land.title}
                            className="w-full h-[300px] sm:h-[450px] object-cover rounded-xl"
                        />

                    ) : (

                        <div className="w-full h-[300px] bg-gray-100 rounded-xl flex items-center justify-center">

                            <p className="text-gray-500">
                                No main image available
                            </p>

                        </div>

                    )}

                </div>


                {/* =================================================
                    PROPERTY INFORMATION
                ================================================= */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                    <h2 className="text-xl font-bold text-[#14213D] mb-5">
                        Land Information
                    </h2>


                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">


                        <Info
                            label="Title"
                            value={land.title}
                        />


                        <Info
                            label="Price"
                            value={`Rs. ${Number(
                                land.price || 0
                            ).toLocaleString()}`}
                        />


                        <Info
                            label="Land Size"
                            value={`${land.land_size || 0} ${land.size_unit || ""}`}
                        />


                        <Info
                            label="Rate"
                            value={`Rs. ${Number(
                                land.rate || 0
                            ).toLocaleString()}`}
                        />


                        <Info
                            label="City"
                            value={land.city}
                        />


                        <Info
                            label="Duration"
                            value={land.duration}
                        />


                        <Info
                            label="Location"
                            value={land.location}
                        />


                        <Info
                            label="Status"
                            value={
                                <span
                                    className={`
                                        inline-block
                                        px-3
                                        py-1
                                        rounded-full
                                        text-sm
                                        font-medium

                                        ${
                                            land.status === "active"
                                                ? "bg-green-100 text-green-700"
                                                : land.status === "sold"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }
                                    `}
                                >
                                    {land.status}
                                </span>
                            }
                        />

                    </div>

                </div>


                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                    <h2 className="text-xl font-bold text-[#14213D] mb-3">
                        Description
                    </h2>


                    <p className="text-gray-600 leading-relaxed">

                        {land.description ||
                            "No description available."}

                    </p>

                </div>


                {/* =================================================
                    OVERVIEW
                ================================================= */}

                {overview.length > 0 && (

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                        <h2 className="text-xl font-bold text-[#14213D] mb-4">
                            Overview
                        </h2>


                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                            {overview.map(
                                (item, index) => (

                                    <div
                                        key={index}
                                        className="bg-[#E8EEF9] p-4 rounded-xl"
                                    >

                                        <p className="text-sm text-gray-500">
                                            {item.title}
                                        </p>

                                        <p className="font-semibold text-[#14213D] mt-1">
                                            {item.value || "-"}
                                        </p>

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                )}


                {/* =================================================
                    MAP / LOCATION
                ================================================= */}

                {land.map_address && (

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                        <h2 className="text-xl font-bold text-[#14213D] mb-3">
                            Map Address
                        </h2>

                        <p className="text-gray-600">
                            {land.map_address}
                        </p>

                    </div>

                )}


                {/* =================================================
                    VIDEO
                ================================================= */}

                {mainVideo && (

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                        <h2 className="text-xl font-bold text-[#14213D] mb-4">
                            Land Video
                        </h2>


                        <video
                            controls
                            className="w-full max-h-[500px] rounded-xl bg-black"
                        >

                            <source
                                src={mainVideo}
                                type={
                                    land.main_video_type ||
                                    "video/mp4"
                                }
                            />

                            Your browser does not support
                            the video tag.

                        </video>

                    </div>

                )}


                {/* =================================================
                    GALLERY
                ================================================= */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                    <div className="flex justify-between items-center mb-5">

                        <h2 className="text-xl font-bold text-[#14213D]">
                            Gallery
                        </h2>


                        <span className="text-sm text-gray-500">
                            {gallery.length} image
                            {gallery.length !== 1
                                ? "s"
                                : ""}
                        </span>

                    </div>


                    {gallery.length > 0 ? (

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

                            {gallery.map(
                                (image, index) => {

                                    let imageUrl = null;


                                    // If backend returns image URL

                                    if (
                                        typeof image ===
                                        "string"
                                    ) {

                                        imageUrl =
                                            getImageUrl(
                                                image
                                            );

                                    }


                                    // If backend returns object

                                    else if (
                                        image?.image
                                    ) {

                                        imageUrl =
                                            getImageUrl(
                                                image.image
                                            );

                                    }


                                    if (!imageUrl) {

                                        return null;

                                    }


                                    return (

                                        <div
                                            key={
                                                image.id ||
                                                index
                                            }
                                            className="group overflow-hidden rounded-xl"
                                        >

                                            <img
                                                src={imageUrl}
                                                alt={`Land Gallery ${index + 1}`}
                                                className="w-full h-48 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                                            />

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    ) : (

                        <div className="py-12 text-center bg-gray-50 rounded-xl">

                            <p className="text-gray-500">
                                No gallery images available
                            </p>

                        </div>

                    )}

                </div>


            </div>

        </div>

    );

};


// =====================================================
// INFO COMPONENT
// =====================================================

const Info = ({ label, value }) => (

    <div className="bg-[#E8EEF9] p-4 rounded-xl">

        <p className="text-sm text-gray-500">
            {label}
        </p>

        <p className="font-semibold text-[#14213D] mt-1">
            {value || "-"}
        </p>

    </div>

);


export default ViewLand;