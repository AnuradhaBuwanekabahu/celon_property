
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Search, User, Phone, Mail, MapPin, Wallet } from "lucide-react";
import { toast } from "react-toastify";

import { getWantedById } from "../../api/wantedApi";
import Loader from "../../components/Loader";

const ViewWanted = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);

    // =====================================================
    // IMAGE URL
    // =====================================================

    const getImageUrl = (image, imageType) => {

        if (!image) {
            return null;
        }

        if (
            image.type === "Buffer" &&
            Array.isArray(image.data)
        ) {

            const bytes = new Uint8Array(image.data);

            let binary = "";

            bytes.forEach((byte) => {
                binary += String.fromCharCode(byte);
            });

            return `data:${imageType || "image/jpeg"};base64,${btoa(binary)}`;
        }

        if (typeof image === "string") {
            return image;
        }

        return null;
    };

    // =====================================================
    // LOAD PROPERTY
    // =====================================================

    useEffect(() => {
        loadProperty();
    }, [id]);

    const loadProperty = async () => {

        try {

            setLoading(true);

            const res = await getWantedById(id);

            setProperty(res.data.data);

        } catch (error) {

            console.log("View Wanted Error:", error);

            toast.error("Failed to load property");

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

    if (!property) {

        return (
            <div className="min-h-screen bg-[#E8EEF9] flex items-center justify-center p-6">

                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">

                    <p className="text-[#14213D] text-lg font-semibold mb-5">
                        Property not found
                    </p>

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 mx-auto bg-[#14213D] text-white px-5 py-2.5 rounded-lg hover:bg-[#E8EEF9] hover:text-[#14213D] transition"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>

                </div>

            </div>
        );
    }

    // =====================================================
    // MAIN IMAGE
    // =====================================================

    const mainImage = getImageUrl(
        property.main_image,
        property.main_image_type
    );

    // =====================================================
    // GALLERY
    // =====================================================

    const galleryImages = property.images || [];

    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="min-h-screen bg-[#E8EEF9] p-4 sm:p-6 lg:p-8">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">

                <div>

                    <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-xl bg-[#14213D] flex items-center justify-center">

                            <Search
                                size={23}
                                className="text-white"
                            />

                        </div>

                        <div>

                            <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D]">
                                Wanted Property Details
                            </h1>

                            <p className="text-gray-500 mt-1">
                                View wanted property request
                            </p>

                        </div>

                    </div>

                </div>

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center gap-2 bg-[#14213D] text-white px-5 py-2.5 rounded-lg hover:bg-[#E8EEF9] hover:text-[#14213D] transition"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

            </div>


            {/* =================================================
                MAIN CARD
            ================================================= */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* =================================================
                        IMAGES
                    ================================================= */}

                    <div>

                        <div className="overflow-hidden rounded-xl bg-[#E8EEF9]">

                            {mainImage ? (

                                <img
                                    src={mainImage}
                                    alt={property.title}
                                    className="w-full h-[300px] sm:h-[400px] lg:h-[450px] object-cover"
                                />

                            ) : (

                                <div className="w-full h-[300px] sm:h-[400px] lg:h-[450px] flex items-center justify-center">

                                    <div className="text-center">

                                        <Search
                                            size={40}
                                            className="mx-auto text-gray-400 mb-3"
                                        />

                                        <span className="text-gray-500">
                                            No Image Available
                                        </span>

                                    </div>

                                </div>

                            )}

                        </div>


                        {/* =================================================
                            GALLERY
                        ================================================= */}

                        {galleryImages.length > 0 && (

                            <div className="mt-5">

                                <h3 className="text-lg font-bold text-[#14213D] mb-3">
                                    Gallery
                                </h3>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                                    {galleryImages.map((image) => {

                                        const imageUrl = getImageUrl(
                                            image.image,
                                            image.image_type
                                        );

                                        if (!imageUrl) {
                                            return null;
                                        }

                                        return (

                                            <div
                                                key={image.id}
                                                className="overflow-hidden rounded-lg"
                                            >

                                                <img
                                                    src={imageUrl}
                                                    alt="Wanted Property"
                                                    className="w-full h-24 sm:h-28 object-cover hover:scale-105 transition duration-300"
                                                />

                                            </div>

                                        );

                                    })}

                                </div>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        DETAILS
                    ================================================= */}

                    <div className="space-y-5">

                        {/* TITLE */}

                        <div className="bg-[#E8EEF9] rounded-xl p-5">

                            <p className="text-sm text-gray-500 mb-1">
                                Property Request
                            </p>

                            <h2 className="text-2xl font-bold text-[#14213D]">
                                {property.title}
                            </h2>

                        </div>


                        {/* BUDGET */}

                        <DetailCard
                            icon={<Wallet size={20} />}
                            label="Budget"
                            value={
                                property.budget
                                    ? `Rs. ${Number(property.budget).toLocaleString()}`
                                    : "Rs. 0"
                            }
                        />


                        {/* CITY */}

                        <DetailCard
                            icon={<MapPin size={20} />}
                            label="Preferred City"
                            value={property.preferred_city || "-"}
                        />


                        {/* PHONE */}

                        <DetailCard
                            icon={<Phone size={20} />}
                            label="Phone Number"
                            value={property.phone_number || "-"}
                        />


                        {/* CLIENT */}

                        {property.full_name && (

                            <DetailCard
                                icon={<User size={20} />}
                                label="Client"
                                value={property.full_name}
                            />

                        )}


                        {/* EMAIL */}

                        {property.email && (

                            <DetailCard
                                icon={<Mail size={20} />}
                                label="Email"
                                value={property.email}
                            />

                        )}


                        {/* STATUS */}

                        <div className="bg-white border border-gray-100 rounded-xl p-5">

                            <p className="text-sm text-gray-500 mb-2">
                                Status
                            </p>

                            <span
                                className={`
                                    inline-flex
                                    px-4
                                    py-1.5
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

                        </div>


                        {/* DESCRIPTION */}

                        <div className="bg-white border border-gray-100 rounded-xl p-5">

                            <p className="text-sm text-gray-500 mb-2">
                                Description
                            </p>

                            <p className="text-[#14213D] leading-relaxed">
                                {property.description ||
                                    "No description available."}
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                BOTTOM BACK BUTTON
            ================================================= */}

            <div className="flex justify-end mt-6">

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 bg-[#14213D] text-white px-5 py-2.5 rounded-lg hover:bg-[#E8EEF9] hover:text-[#14213D] transition"
                >
                    <ArrowLeft size={18} />
                    Back to Wanted
                </button>

            </div>

        </div>

    );
};


// =====================================================
// DETAIL CARD
// =====================================================

const DetailCard = ({ icon, label, value }) => {

    return (

        <div className="bg-white border border-gray-100 rounded-xl p-5 hover:bg-[#E8EEF9] transition">

            <div className="flex items-center gap-4">

                <div className="w-11 h-11 rounded-xl bg-[#14213D] text-white flex items-center justify-center shrink-0">

                    {icon}

                </div>

                <div className="min-w-0">

                    <p className="text-sm text-gray-500">
                        {label}
                    </p>

                    <p className="font-semibold text-[#14213D] break-words">
                        {value}
                    </p>

                </div>

            </div>

        </div>

    );
};

export default ViewWanted;

