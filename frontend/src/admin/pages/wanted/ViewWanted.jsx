import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ArrowLeft,
    Pencil,
    Search,
    User,
    Phone,
    Mail,
    MapPin,
    Wallet
} from "lucide-react";
import { toast } from "react-toastify";

import { getWantedById } from "../../api/wantedApi";
import Loader from "../../components/Loader";

const ViewWanted = () => {

    const { id } = useParams();

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL =
        import.meta.env.VITE_BACKEND_URL ||
        "http://localhost:5000";


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
    // IMAGE URL
    // =====================================================

    const getImageUrl = (image, imageType = "image/jpeg") => {

        if (!image) {
            return null;
        }


        // -----------------------------------------------
        // URL
        // -----------------------------------------------

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


        // -----------------------------------------------
        // MYSQL BUFFER
        // -----------------------------------------------

        if (
            image?.type === "Buffer" &&
            Array.isArray(image.data)
        ) {

            const bytes =
                new Uint8Array(image.data);

            let binary = "";

            bytes.forEach((byte) => {

                binary += String.fromCharCode(byte);

            });

            return `data:${
                imageType || "image/jpeg"
            };base64,${btoa(binary)}`;

        }


        return null;

    };


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

    const galleryImages =
        Array.isArray(property.images)
            ? property.images
            : Array.isArray(property.gallery)
                ? property.gallery
                : [];


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
                    MAIN IMAGE
                ================================================= */}

                <div className="
                    bg-white
                    rounded-2xl
                    shadow-sm
                    border
                    border-gray-100
                    p-5
                    mb-6
                ">

                    {mainImage ? (

                        <img
                            src={mainImage}
                            alt={property.title}
                            className="
                                w-full
                                h-[300px]
                                sm:h-[400px]
                                lg:h-[450px]
                                object-cover
                                rounded-xl
                            "
                            onError={(e) => {

                                console.error(
                                    "Main image failed:",
                                    mainImage
                                );

                                e.currentTarget.style.display =
                                    "none";

                            }}
                        />

                    ) : (

                        <div className="
                            w-full
                            h-[300px]
                            sm:h-[400px]
                            lg:h-[450px]
                            rounded-xl
                            bg-[#E8EEF9]
                            flex
                            items-center
                            justify-center
                            text-gray-500
                        ">

                            <div className="text-center">

                                <Search
                                    size={40}
                                    className="
                                        mx-auto
                                        text-gray-400
                                        mb-3
                                    "
                                />

                                No Main Image Available

                            </div>

                        </div>

                    )}

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


                        <Info
                            label="Title"
                            value={property.title}
                        />


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


                        <Info
                            label="Preferred City"
                            value={
                                property.preferred_city
                            }
                        />


                        <Info
                            label="Phone Number"
                            value={
                                property.phone_number
                            }
                        />


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


                        {property.full_name && (

                            <Info
                                label="Client"
                                value={property.full_name}
                            />

                        )}


                        {property.email && (

                            <Info
                                label="Email"
                                value={property.email}
                            />

                        )}

                    </div>

                </div>


                {/* =================================================
                    CLIENT INFORMATION
                ================================================= */}

                {(property.full_name ||
                    property.email ||
                    property.phone_number) && (

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
                            Client Information
                        </h2>


                        <div className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            lg:grid-cols-3
                            gap-4
                        ">


                            {property.full_name && (

                                <DetailCard
                                    icon={
                                        <User size={20} />
                                    }
                                    label="Client"
                                    value={
                                        property.full_name
                                    }
                                />

                            )}


                            {property.phone_number && (

                                <DetailCard
                                    icon={
                                        <Phone size={20} />
                                    }
                                    label="Phone Number"
                                    value={
                                        property.phone_number
                                    }
                                />

                            )}


                            {property.email && (

                                <DetailCard
                                    icon={
                                        <Mail size={20} />
                                    }
                                    label="Email"
                                    value={
                                        property.email
                                    }
                                />

                            )}

                        </div>

                    </div>

                )}


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
                    ">

                        {property.description ||
                            "No description available."}

                    </p>

                </div>


                {/* =================================================
                    GALLERY
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

                    <div className="
                        flex
                        justify-between
                        items-center
                        mb-5
                    ">

                        <h2 className="
                            text-xl
                            font-bold
                            text-[#14213D]
                        ">
                            Gallery
                        </h2>


                        

                    </div>


                    {galleryImages.length > 0 ? (

                        <div className="
                            grid
                            grid-cols-2
                            sm:grid-cols-3
                            lg:grid-cols-4
                            gap-4
                        ">

                            {galleryImages.map(
                                (image, index) => {

                                    /*
                                     * Supports:
                                     *
                                     * image = {
                                     *   id,
                                     *   image,
                                     *   image_type
                                     * }
                                     *
                                     * OR
                                     *
                                     * image = {
                                     *   id,
                                     *   url
                                     * }
                                     *
                                     * OR
                                     *
                                     * image = "/api/..."
                                     */

                                    let imageUrl = null;


                                    // URL string

                                    if (
                                        typeof image === "string"
                                    ) {

                                        imageUrl =
                                            getImageUrl(
                                                image
                                            );

                                    }


                                    // Backend URL object

                                    else if (
                                        image?.url
                                    ) {

                                        imageUrl =
                                            getImageUrl(
                                                image.url
                                            );

                                    }


                                    // Buffer/object

                                    else if (
                                        image?.image
                                    ) {

                                        imageUrl =
                                            getImageUrl(
                                                image.image,
                                                image.image_type
                                            );

                                    }


                                    if (!imageUrl) {
                                        return null;
                                    }


                                    return (

                                        <div
                                            key={
                                                image?.id ||
                                                index
                                            }
                                            className="
                                                group
                                                overflow-hidden
                                                rounded-xl
                                                bg-gray-100
                                            "
                                        >

                                            <img
                                                src={imageUrl}
                                                alt={`Wanted Gallery ${index + 1}`}
                                                className="
                                                    w-full
                                                    h-40
                                                    sm:h-48
                                                    object-cover
                                                    rounded-xl
                                                    transition
                                                    duration-300
                                                    hover:opacity-80
                                                "
                                                onError={(e) => {

                                                    console.error(
                                                        "Gallery image failed:",
                                                        imageUrl
                                                    );

                                                    e.currentTarget.style.display =
                                                        "none";

                                                }}
                                            />

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    ) : (

                        <div className="
                            py-12
                            text-center
                            bg-gray-50
                            rounded-xl
                        ">

                            <Search
                                size={35}
                                className="
                                    mx-auto
                                    text-gray-400
                                    mb-3
                                "
                            />

                            <p className="text-gray-500">
                                No gallery images available.
                            </p>

                        </div>

                    )}

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


// =====================================================
// DETAIL CARD
// =====================================================

const DetailCard = ({
    icon,
    label,
    value
}) => (

    <div className="
        bg-white
        border
        border-gray-100
        rounded-xl
        p-5
        hover:bg-[#E8EEF9]
        transition
    ">

        <div className="
            flex
            items-center
            gap-4
        ">

            <div className="
                w-11
                h-11
                rounded-xl
                bg-[#14213D]
                text-white
                flex
                items-center
                justify-center
                shrink-0
            ">

                {icon}

            </div>


            <div className="min-w-0">

                <p className="
                    text-sm
                    text-gray-500
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

        </div>

    </div>

);


export default ViewWanted;