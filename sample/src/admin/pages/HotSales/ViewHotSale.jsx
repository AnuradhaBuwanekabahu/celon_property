import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Pencil, Video } from "lucide-react";

import { getHotSaleById } from "../../api/hotSalesApi";
import Loader from "../../components/Loader";

const ViewHotSale = () => {

    const { id } = useParams();

    const [sale, setSale] = useState(null);
    const [loading, setLoading] = useState(true);

    // =====================================================
    // LOAD HOT SALE
    // =====================================================

    const fetchHotSale = async () => {

        try {

            setLoading(true);

            const response = await getHotSaleById(id);

            setSale(response.data.hotSale);

        } catch (error) {

            console.log(
                "VIEW HOT SALE ERROR:",
                error
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchHotSale();

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

    if (!sale) {

        return (

            <div className="min-h-screen bg-[#E8EEF9] p-6 flex items-center justify-center">

                <div className="bg-white rounded-2xl shadow p-8 text-center">

                    <p className="text-[#14213D] text-lg font-semibold">
                        Property not found
                    </p>

                    <Link
                        to="/admin/hot-sales"
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
                        Back to Hot Sales
                    </Link>

                </div>

            </div>

        );

    }


    // =====================================================
    // JSON HELPER
    // =====================================================

    const parseJSON = (data) => {

        if (!data) return [];

        if (typeof data === "string") {

            try {

                return JSON.parse(data);

            } catch {

                return [];

            }

        }

        return Array.isArray(data) ? data : [];

    };


    const overview = parseJSON(
        sale.overview
    );

    const highlights = parseJSON(
        sale.highlights
    );


    // =====================================================
    // VIDEO URL
    // =====================================================

    /*
       Your backend should return something like:

       main_video:
       "/api/hotsales/video/1"

       OR

       video:
       "/api/hotsales/video/1"

       This supports both.
    */

    const videoUrl =
        sale.main_video ||
        sale.video ||
        null;


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="min-h-screen bg-[#E8EEF9] p-4 sm:p-6 lg:p-8">


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
                        Hot Sale Details
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View property information
                    </p>

                </div>


                <div className="flex gap-3">

                    {/* BACK */}

                    <Link
                        to="/admin/hot-sales"
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


                    {/* EDIT */}

                    <Link
                        to={`/admin/hot-sales/edit/${sale.id}`}
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

                {sale.main_image ? (

                    <img
                        src={`http://localhost:5000${sale.main_image}`}
                        alt={sale.title}
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

            {videoUrl && (

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
                            Property Video
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
                            src={`http://localhost:5000${videoUrl}`}
                            type={sale.main_video_type || "video/mp4"}
                        />

                        Your browser does not support
                        the video tag.

                    </video>

                </div>

            )}


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
                        value={sale.title}
                    />


                    <Info
                        label="Price"
                        value={`Rs. ${Number(
                            sale.price || 0
                        ).toLocaleString()}`}
                    />


                    <Info
                        label="City"
                        value={sale.city}
                    />


                    <Info
                        label="Status"
                        value={sale.status}
                    />


                    <Info
                        label="Property Type"
                        value={sale.property_type}
                    />


                    <Info
                        label="Area"
                        value={`${sale.area_sqft || 0} sqft`}
                    />


                    <Info
                        label="Rating"
                        value={`${sale.rate || 0}/5`}
                    />


                    <Info
                        label="Duration"
                        value={sale.duration}
                    />


                    <Info
                        label="Location"
                        value={sale.location}
                    />


                    <Info
                        label="Map Address"
                        value={sale.map_address}
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

                    {sale.description ||
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

                                    <span className="
                                        font-semibold
                                        text-[#14213D]
                                    ">
                                        {item.title}
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
                                        {item.value}
                                    </span>

                                </div>

                            )
                        )}

                    </div>

                ) : (

                    <p className="text-gray-500">
                        No overview information available.
                    </p>

                )}

            </div>


            {/* =================================================
                HIGHLIGHTS
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
                    Highlights
                </h2>


                {highlights.length > 0 ? (

                    <div className="
                        flex
                        flex-wrap
                        gap-3
                    ">

                        {highlights.map(
                            (item, index) => (

                                <span
                                    key={index}
                                    className="
                                        bg-[#E8EEF9]
                                        text-[#14213D]
                                        px-4
                                        py-2
                                        rounded-full
                                        font-medium
                                    "
                                >
                                    {item}
                                </span>

                            )
                        )}

                    </div>

                ) : (

                    <p className="text-gray-500">
                        No highlights available.
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

                <h2 className="
                    text-xl
                    font-bold
                    text-[#14213D]
                    mb-4
                ">
                    Gallery
                </h2>


                {sale.images?.length > 0 ? (

                    <div className="
                        grid
                        grid-cols-2
                        sm:grid-cols-3
                        lg:grid-cols-4
                        gap-4
                    ">

                        {sale.images.map(
                            (image, index) => (

                                <img
                                    key={index}
                                    src={`http://localhost:5000${image}`}
                                    alt={`Gallery ${index + 1}`}
                                    className="
                                        h-32
                                        sm:h-40
                                        w-full
                                        object-cover
                                        rounded-lg
                                        hover:opacity-80
                                        transition
                                    "
                                />

                            )
                        )}

                    </div>

                ) : (

                    <p className="text-gray-500">
                        No gallery images available.
                    </p>

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
                    to="/admin/hot-sales"
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
                    to={`/admin/hot-sales/edit/${sale.id}`}
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


export default ViewHotSale;