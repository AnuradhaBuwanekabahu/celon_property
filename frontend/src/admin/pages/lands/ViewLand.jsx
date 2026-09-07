
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ArrowLeft,
    Pencil,
    Video,
    MapPin,
    Building2,
    Ruler,
    Clock,
    Map
} from "lucide-react";
import { toast } from "react-toastify";

import { getLandById } from "../../api/landApi";
import Loader from "../../components/Loader";

const ViewLand = () => {

    const { id } = useParams();

    const [land, setLand] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL =
        import.meta.env.VITE_BACKEND_URL ||
        "http://localhost:5000";


    // =====================================================
    // LOAD LAND
    // =====================================================

    const fetchLand = async () => {

        try {

            setLoading(true);

            const response =
                await getLandById(id);

            console.log(
                "VIEW LAND RESPONSE:",
                response.data
            );

            const data =
                response.data?.data ||
                response.data?.land;

            setLand(data);

        } catch (error) {

            console.error(
                "VIEW LAND ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to load land"
            );

            setLand(null);

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // USE EFFECT
    // =====================================================

    useEffect(() => {

        if (id) {
            fetchLand();
        }

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

    if (!land) {

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
                        Land property not found
                    </p>

                    <Link
                        to="/admin/lands"
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

                        Back to Lands

                    </Link>

                </div>

            </div>

        );

    }


    // =====================================================
    // JSON HELPER
    // =====================================================

    const parseJSON = (data) => {

        if (!data) {
            return [];
        }

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


    // =====================================================
    // OVERVIEW
    // =====================================================

    const overview =
        parseJSON(land.overview);


    // =====================================================
    // IMAGE URL
    // =====================================================

    const getImageUrl = (image) => {

        if (!image) {
            return null;
        }


        // ---------------------------------------------
        // STRING URL
        // ---------------------------------------------

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


        // ---------------------------------------------
        // MYSQL BUFFER
        // ---------------------------------------------

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

            return `
                data:image/jpeg;base64,
                ${btoa(binary)}
            `.replace(/\s/g, "");

        }

        return null;

    };


    // =====================================================
    // VIDEO URL
    // =====================================================

    const getVideoUrl = (video) => {

        if (!video) {
            return null;
        }


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

        return null;

    };


    // =====================================================
    // MAIN IMAGE
    // =====================================================

    const mainImage =
        getImageUrl(
            land.main_image
        );


    // =====================================================
    // MAIN VIDEO
    // =====================================================

    const mainVideo =
        getVideoUrl(
            land.main_video
        );


    // =====================================================
    // GALLERY
    // =====================================================

    const gallery =
        Array.isArray(land.gallery)
            ? land.gallery
            : [];


    // =====================================================
    // FORMAT PRICE
    // =====================================================

    const formatPrice = (price) => {

        if (
            price === null ||
            price === undefined ||
            price === ""
        ) {

            return "-";

        }

        return Number(price)
            .toLocaleString("en-LK");

    };


    // =====================================================
    // STATUS STYLE
    // =====================================================

    const getStatusStyle = (status) => {

        switch (
            status?.toLowerCase()
        ) {

            case "active":

                return `
                    bg-green-100
                    text-green-700
                `;

            case "sold":

                return `
                    bg-red-100
                    text-red-700
                `;

            case "pending":

                return `
                    bg-yellow-100
                    text-yellow-700
                `;

            default:

                return `
                    bg-gray-100
                    text-gray-700
                `;

        }

    };


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

                        <h1 className="
                            text-2xl
                            sm:text-3xl
                            font-bold
                            text-[#14213D]
                        ">
                            Land Details
                        </h1>

                    </div>


                    <div className="
                        flex
                        gap-3
                    ">

                        {/* BACK */}

                        <Link
                            to="/admin/lands"
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

                            <ArrowLeft
                                size={18}
                            />

                            Back

                        </Link>


                        {/* EDIT */}

                        <Link
                            to={`/admin/lands/edit/${land.id}`}
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

                            <Pencil
                                size={18}
                            />

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

                    <h2 className="
                        text-xl
                        font-bold
                        text-[#14213D]
                        mb-4
                    ">
                        Main Image
                    </h2>


                    {mainImage ? (

                        <img
                            src={mainImage}
                            alt={land.title}
                            className="
                                w-full
                                h-[300px]
                                sm:h-[400px]
                                lg:h-[450px]
                                object-cover
                                rounded-xl
                            "
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
                            No Main Image Available
                        </div>

                    )}

                </div>


                {/* =================================================
                    MAIN VIDEO
                ================================================= */}

                {mainVideo && (

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
                            items-center
                            gap-2
                            mb-4
                        ">

                            <Video
                                size={22}
                                className="text-[#14213D]"
                            />

                            <h2 className="
                                text-xl
                                font-bold
                                text-[#14213D]
                            ">
                                Land Video
                            </h2>

                        </div>


                        <video
                            controls
                            preload="metadata"
                            className="
                                w-full
                                max-h-[550px]
                                rounded-xl
                                bg-black
                            "
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
                    LAND INFORMATION
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
                        Land Information
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
                            value={land.title}
                        />


                        {/* PRICE */}

                        <Info
                            label="Price"
                            value={`Rs. ${formatPrice(
                                land.price
                            )}`}
                        />


                   


                        {/* LAND SIZE */}

                        <Info
                            label="Land Size"
                            value={
                                land.land_size
                                    ? `${land.land_size} ${
                                        land.size_unit || ""
                                      }`
                                    : "-"
                            }
                        />


                        {/* SIZE UNIT */}

                        <Info
                            label="Size Unit"
                            value={
                                land.size_unit
                            }
                        />


                        {/* DISTRICT */}

                        <Info
                            label="District"
                            value={
                                land.district
                            }
                        />


                        {/* CITY */}

                        <Info
                            label="City"
                            value={
                                land.city
                            }
                        />


                        {/* ADDRESS */}

                        <Info
                            label="Address"
                            value={
                                land.address
                            }
                        />


                        {/* MAP ADDRESS */}

                        <Info
                            label="Map Address"
                            value={
                                land.map_address
                            }
                        />


                        {/* DURATION */}

                        <Info
                            label="Duration"
                            value={
                                land.duration
                            }
                        />


                        {/* STATUS */}

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
                                        ${getStatusStyle(
                                            land.status
                                        )}
                                    `}
                                >

                                    {land.status ||
                                        "Pending"}

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
                    ">

                        {land.description ||
                            "No description available."}

                    </p>

                </div>


                {/* =================================================
                    OVERVIEW
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
                        mb-4
                    ">
                        Overview
                    </h2>


                    {overview.length > 0 ? (

                        <div className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            lg:grid-cols-3
                            gap-3
                        ">

                            {overview.map(
                                (item, index) => (

                                    <div
                                        key={index}
                                        className="
                                            bg-[#E8EEF9]
                                            p-4
                                            rounded-lg
                                        "
                                    >

                                        {typeof item === "object" ? (

                                            <>

                                                <span className="
                                                    font-semibold
                                                    text-[#14213D]
                                                ">
                                                    {item.title || "-"}
                                                </span>


                                                <span className="
                                                    mx-2
                                                    text-gray-500
                                                ">
                                                    :
                                                </span>


                                                <span className="
                                                    text-gray-700
                                                ">
                                                    {item.value || "-"}
                                                </span>

                                            </>

                                        ) : (

                                            <span className="
                                                text-gray-700
                                            ">
                                                {item}
                                            </span>

                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        <p className="
                            text-gray-500
                        ">
                            No overview information available.
                        </p>

                    )}

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
                        mb-4
                    ">

                        <h2 className="
                            text-xl
                            font-bold
                            text-[#14213D]
                        ">
                            Gallery
                        </h2>

                    </div>


                    {gallery.length > 0 ? (

                        <div className="
                            grid
                            grid-cols-2
                            sm:grid-cols-3
                            lg:grid-cols-4
                            gap-4
                        ">

                            {gallery.map(
                                (image, index) => {

                                    let imageUrl = null;


                                    // --------------------------------
                                    // STRING
                                    // --------------------------------

                                    if (
                                        typeof image === "string"
                                    ) {

                                        imageUrl =
                                            getImageUrl(
                                                image
                                            );

                                    }


                                    // --------------------------------
                                    // URL
                                    // --------------------------------

                                    else if (
                                        image?.url
                                    ) {

                                        imageUrl =
                                            getImageUrl(
                                                image.url
                                            );

                                    }


                                    // --------------------------------
                                    // IMAGE
                                    // --------------------------------

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
                                            className="
                                                group
                                                overflow-hidden
                                                rounded-xl
                                            "
                                        >

                                            <img
                                                src={imageUrl}
                                                alt={`Land Gallery ${
                                                    index + 1
                                                }`}
                                                className="
                                                    h-32
                                                    sm:h-40
                                                    w-full
                                                    object-cover
                                                    rounded-xl
                                                    hover:opacity-80
                                                    transition
                                                    duration-300
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

                            <p className="
                                text-gray-500
                            ">
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
                        to="/admin/lands"
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

                        <ArrowLeft
                            size={18}
                        />

                        Back

                    </Link>


                    <Link
                        to={`/admin/lands/edit/${land.id}`}
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

                        <Pencil
                            size={18}
                        />

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


        <div className="
            font-semibold
            text-[#14213D]
            break-words
        ">
            {value || "-"}
        </div>

    </div>

);


export default ViewLand;
