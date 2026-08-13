import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import { toast } from "react-toastify";

import {
    getLandById,
    updateLand
} from "../../api/landApi";

import {
    overviewOptions,
    cityOptions
} from "../../data/propertyOption";

import Loader from "../../components/Loader";

const EditLand = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const API_URL =
        import.meta.env.VITE_BACKEND_URL ||
        "http://localhost:5000";

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // =====================================================
    // FORM
    // =====================================================

    const [form, setForm] = useState({

        title: "",
        description: "",
        price: "",
        rate: "",
        land_size: "",
        size_unit: "perches",

        city: "",
        location: "",

        duration: "month",
        status: "pending",

        overview: [
    {
        title: "Land Type",
        value: ""
    }
]

    });

    // =====================================================
    // EXISTING MEDIA
    // =====================================================

    const [existingImage, setExistingImage] =
        useState(null);

    const [existingVideo, setExistingVideo] =
        useState(null);

    const [existingGallery, setExistingGallery] =
        useState([]);

    // =====================================================
    // NEW MEDIA
    // =====================================================

    const [mainImage, setMainImage] =
        useState(null);

    const [mainVideo, setMainVideo] =
        useState(null);

    const [galleryImages, setGalleryImages] =
        useState([]);

    // =====================================================
    // LOAD LAND
    // =====================================================

    useEffect(() => {

        fetchLand();

    }, [id]);

    const fetchLand = async () => {

        try {

            setLoading(true);

            const response =
                await getLandById(id);

            const land =
                response.data.data;

            if (!land) {

                toast.error("Land not found");

                return;

            }

            // =================================================
            // PARSE OVERVIEW
            // =================================================

            let overviewData = [];

            try {

                overviewData =
                    land.overview
                        ? typeof land.overview === "string"
                            ? JSON.parse(land.overview)
                            : land.overview
                        : [];

            } catch (error) {

                console.log(
                    "OVERVIEW PARSE ERROR:",
                    error
                );

                overviewData = [];

            }

            // =================================================
            // SET FORM
            // =================================================

            setForm({

                title:
                    land.title || "",

                description:
                    land.description || "",

                price:
                    land.price || "",

                rate:
                    land.rate || "",

                land_size:
                    land.land_size || "",

                size_unit:
                    land.size_unit || "perches",

                city:
                    land.city || "",

                location:
                    land.location || "",

                duration:
                    land.duration || "month",

                status:
                    land.status || "pending",

                overview:
                    Array.isArray(overviewData)
                        ? overviewData
                        : []

            });

            // =================================================
            // EXISTING MAIN IMAGE
            // =================================================

            setExistingImage(
                land.main_image || null
            );

            // =================================================
            // EXISTING VIDEO
            // =================================================

            setExistingVideo(
                land.main_video || null
            );

            // =================================================
            // EXISTING GALLERY
            // =================================================

            if (Array.isArray(land.gallery)) {

                setExistingGallery(
                    land.gallery
                );

            } else {

                setExistingGallery([]);

            }

        } catch (error) {

            console.log(
                "LOAD LAND ERROR:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to load land"
            );

        } finally {

            setLoading(false);

        }

    };

    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm((prev) => ({

            ...prev,

            [name]: value

        }));

    };

// =====================================================
// OVERVIEW CHANGE
// =====================================================

const handleOverviewChange = (
    index,
    field,
    value
) => {

    const updatedOverview = [
        ...form.overview
    ];

    updatedOverview[index] = {
        ...updatedOverview[index],
        [field]: value
    };

    setForm(prev => ({
        ...prev,
        overview: updatedOverview
    }));

};


// =====================================================
// ADD OVERVIEW
// =====================================================

const addOverview = () => {

    const usedTitles =
        form.overview.map(
            item => item.title
        );

    const nextOption =
        overviewOptions.find(
            option =>
                !usedTitles.includes(
                    option.value
                )
        );

    if (!nextOption) {

        toast.info(
            "All overview options have been added."
        );

        return;

    }

    setForm(prev => ({

        ...prev,

        overview: [
            ...prev.overview,

            {
                title: nextOption.value,
                value: ""
            }
        ]

    }));

};


// =====================================================
// REMOVE OVERVIEW
// =====================================================

const removeOverview = (index) => {

    const updatedOverview =
        form.overview.filter(
            (_, i) => i !== index
        );

    setForm(prev => ({

        ...prev,

        overview:
            updatedOverview.length > 0
                ? updatedOverview
                : [
                    {
                        title: overviewOptions[0]?.value || "",
                        value: ""
                    }
                ]

    }));

};

    // =====================================================
    // REMOVE EXISTING GALLERY
    // =====================================================

    const removeExistingGallery = (imageId) => {

        setExistingGallery(
            prev =>
                prev.filter(
                    image =>
                        image.id !== imageId
                )
        );

    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setUpdating(true);

            const data =
                new FormData();

            // =================================================
            // BASIC DATA
            // =================================================

            data.append(
                "title",
                form.title
            );

            data.append(
                "description",
                form.description
            );

            data.append(
                "price",
                form.price
            );

            data.append(
                "rate",
                form.rate
            );

            data.append(
                "land_size",
                form.land_size
            );

            data.append(
                "size_unit",
                form.size_unit
            );

            data.append(
                "city",
                form.city
            );

            data.append(
                "location",
                form.location
            );

            data.append(
                "duration",
                form.duration
            );

            data.append(
                "status",
                form.status
            );

            // =================================================
            // OVERVIEW
            // =================================================

            data.append(
                "overview",
                JSON.stringify(
                    form.overview
                )
            );

            // =================================================
            // MAIN IMAGE
            // =================================================

            if (mainImage) {

                data.append(
                    "main_image",
                    mainImage
                );

            }

            // =================================================
            // MAIN VIDEO
            // =================================================

            if (mainVideo) {

                data.append(
                    "main_video",
                    mainVideo
                );

            }

            // =================================================
            // EXISTING GALLERY TO KEEP
            // =================================================

            const keepGalleryIds =
                existingGallery.map(
                    image => image.id
                );

            data.append(
                "keep_gallery",
                JSON.stringify(
                    keepGalleryIds
                )
            );

            // =================================================
            // NEW GALLERY IMAGES
            // =================================================

            galleryImages.forEach(
                image => {

                    data.append(
                        "images",
                        image
                    );

                }
            );

            // =================================================
            // UPDATE
            // =================================================

            await updateLand(
                id,
                data
            );

            toast.success(
                "Land updated successfully"
            );

            navigate(
                "/admin-portal/lands"
            );

        } catch (error) {

            console.log(
                "UPDATE LAND ERROR:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Update failed"
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
    // PAGE
    // =====================================================

    return (

        <div className="min-h-screen bg-[#E8EEF9] p-4 sm:p-6">

            <div className="max-w-5xl mx-auto">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                    <div>

                        <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D] prata-regular">

                            Edit Land

                        </h1>

                        <p className="text-gray-500 text-sm mt-1 inter">

                            Update land information and media

                        </p>

                    </div>

                    <Link
                        to="/admin-portal/lands"
                        className="flex items-center justify-center gap-2 bg-[#14213D] hover:bg-[#1c2c52] text-white px-4 py-2.5 rounded-xl transition"
                    >

                        <ArrowLeft size={18} />

                        Back

                    </Link>

                </div>

                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-7 space-y-7"
                >

                    {/* =================================================
                        BASIC DETAILS
                    ================================================= */}

                    <div>

                        <h2 className="text-lg font-semibold text-[#14213D] mb-4">

                            Basic Details

                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* TITLE */}

                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Land title"
                                required
                                className="w-full border border-gray-300 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-[#FBBF24]"
                            />

                            {/* PRICE */}

                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="Price (Rs.)"
                                required
                                className="w-full border border-gray-300 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-[#FBBF24]"
                            />

                        </div>

                    </div>

                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    <div>

                        <label className="block text-sm font-medium text-[#14213D] mb-2">

                            Description

                        </label>

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Enter land description..."
                            className="w-full border border-gray-300 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-[#FBBF24]"
                        />

                    </div>

                    {/* =================================================
                        LAND INFORMATION
                    ================================================= */}

                    <div>

                        <h2 className="text-lg font-semibold text-[#14213D] mb-4">

                            Land Information

                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                            {/* RATE */}

                            <input
                                type="number"
                                step="0.01"
                                name="rate"
                                value={form.rate}
                                onChange={handleChange}
                                placeholder="Rate"
                                className="w-full border border-gray-300 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-[#FBBF24]"
                            />

                            {/* LAND SIZE */}

                            <input
                                type="number"
                                step="0.01"
                                name="land_size"
                                value={form.land_size}
                                onChange={handleChange}
                                placeholder="Land Size"
                                required
                                className="w-full border border-gray-300 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FBBF24] focus:border-[#FBBF24]"
                            />

                            {/* SIZE UNIT */}

                            <select
                                name="size_unit"
                                value={form.size_unit}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#FBBF24]"
                            >

                                <option value="perches">
                                    Perches
                                </option>

                                <option value="acres">
                                    Acres
                                </option>

                                <option value="sqft">
                                    Sqft
                                </option>

                            </select>

                        </div>

                    </div>

                    {/* =================================================
                        LOCATION
                    ================================================= */}

                    <div>

                        <h2 className="text-lg font-semibold text-[#14213D] mb-4">

                            Location

                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* CITY */}

                            <select
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                required
                                className="w-full h-12 px-4 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#FBBF24]"
                            >

                                <option value="">
                                    Select City
                                </option>

                                {cityOptions.map(
                                    city => (

                                        <option
                                            key={city}
                                            value={city}
                                        >
                                            {city}
                                        </option>

                                    )
                                )}

                            </select>

                            {/* LOCATION */}

                            <input
                                type="text"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="Location address"
                                className="w-full border border-gray-300 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FBBF24]"
                            />

                        </div>

                    </div>

                    {/* =================================================
                        STATUS / DURATION
                    ================================================= */}

                    <div>

                        <h2 className="text-lg font-semibold text-[#14213D] mb-4">

                            Property Status

                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#FBBF24]"
                            >

                                <option value="pending">
                                    Pending
                                </option>

                                <option value="active">
                                    Active
                                </option>

                                <option value="sold">
                                    Sold
                                </option>

                            </select>

                            <select
                                name="duration"
                                value={form.duration}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#FBBF24]"
                            >

                                <option value="permanent">
                                    Permanent
                                </option>

                                <option value="month">
                                    Month
                                </option>

                                <option value="year">
                                    Year
                                </option>

                                <option value="week">
                                    Week
                                </option>

                                <option value="day">
                                    Day
                                </option>

                            </select>

                        </div>

                    </div>

{/* =================================================
    OVERVIEW
================================================= */}

<div className="space-y-4 border border-gray-200 rounded-xl p-4">

    <div>

        <h3 className="font-semibold text-lg text-[#14213D]">

            Overview

        </h3>

        <p className="text-xs text-gray-500 mt-1">

            Choose an overview option and enter its value.

        </p>

    </div>


    {form.overview.map(
        (item, index) => (

            <div
                key={index}
                className="flex flex-col sm:flex-row gap-3"
            >

                {/* =================================
                    OPTION
                ================================= */}

                <select
                    value={item.title}
                    onChange={(e) =>
                        handleOverviewChange(
                            index,
                            "title",
                            e.target.value
                        )
                    }
                    className="border border-gray-300 p-3 rounded-xl text-sm w-full sm:w-1/2 outline-none focus:ring-2 focus:ring-[#FBBF24]"
                >

                    {overviewOptions.map(
                        option => (

                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>

                        )
                    )}

                </select>


                {/* =================================
                    VALUE
                ================================= */}

                <input
                    type="text"
                    value={item.value}
                    placeholder="Enter value"
                    onChange={(e) =>
                        handleOverviewChange(
                            index,
                            "value",
                            e.target.value
                        )
                    }
                    className="border border-gray-300 p-3 rounded-xl text-sm w-full sm:w-1/2 outline-none focus:ring-2 focus:ring-[#FBBF24]"
                />


                {/* =================================
                    REMOVE
                ================================= */}

                <button
                    type="button"
                    onClick={() =>
                        removeOverview(index)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm"
                >

                    Remove

                </button>

            </div>

        )
    )}


    {/* =============================================
        ADD OVERVIEW
    ============================================= */}

    <button
        type="button"
        onClick={addOverview}
        className="bg-[#FBBF24] hover:bg-[#d3a120] text-[#14213D] px-4 py-2 rounded-xl text-sm font-semibold transition"
    >

        + Add Overview

    </button>

</div>

                    {/* =================================================
                        MEDIA
                    ================================================= */}

                    <div className="border border-gray-200 rounded-xl p-4 space-y-5">

                        <h2 className="text-lg font-semibold text-[#14213D]">

                            Update Images & Video

                        </h2>

                        {/* =================================================
                            CURRENT MAIN IMAGE
                        ================================================= */}

                        {existingImage && (

                            <div>

                                <p className="text-sm font-medium text-gray-700 mb-2">

                                    Current Main Image

                                </p>

                                <img
                                    src={
                                        existingImage.startsWith("http")
                                            ? existingImage
                                            : `${API_URL}${existingImage}`
                                    }
                                    alt={form.title}
                                    className="w-full sm:w-80 h-48 object-cover rounded-xl border"
                                />

                            </div>

                        )}

                        {/* =================================================
                            NEW MAIN IMAGE
                        ================================================= */}

                        <div>

                            <label className="text-sm font-medium text-gray-700 block mb-2">

                                New Main Image

                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setMainImage(
                                        e.target.files?.[0] ||
                                        null
                                    )
                                }
                                className="block w-full text-sm border border-gray-300 p-3 rounded-xl"
                            />

                            {mainImage && (

                                <p className="text-xs text-green-600 mt-2">

                                    Selected: {mainImage.name}

                                </p>

                            )}

                        </div>

                        {/* =================================================
                            CURRENT VIDEO
                        ================================================= */}

                        {existingVideo && (

                            <div>

                                <p className="text-sm font-medium text-gray-700 mb-2">

                                    Current Video

                                </p>

                                <video
                                    controls
                                    className="w-full sm:w-96 max-h-64 rounded-xl border"
                                >

                                    <source
                                        src={
                                            existingVideo.startsWith("http")
                                                ? existingVideo
                                                : `${API_URL}${existingVideo}`
                                        }
                                    />

                                </video>

                            </div>

                        )}

                        {/* =================================================
                            NEW VIDEO
                        ================================================= */}

                        <div>

                            <label className="text-sm font-medium text-gray-700 block mb-2">

                                New Main Video

                            </label>

                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) =>
                                    setMainVideo(
                                        e.target.files?.[0] ||
                                        null
                                    )
                                }
                                className="block w-full text-sm border border-gray-300 p-3 rounded-xl"
                            />

                            {mainVideo && (

                                <p className="text-xs text-green-600 mt-2">

                                    Selected: {mainVideo.name}

                                </p>

                            )}

                        </div>

                        {/* =================================================
                            EXISTING GALLERY
                        ================================================= */}

                        {existingGallery.length > 0 && (

                            <div>

                                <p className="text-sm font-medium text-gray-700 mb-3">

                                    Existing Gallery

                                </p>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                                    {existingGallery.map(
                                        image => (

                                            <div
                                                key={image.id}
                                                className="relative group"
                                            >

                                                <img
                                                    src={
                                                        `${API_URL}/api/lands/gallery-image/${image.id}`
                                                    }
                                                    alt="Land gallery"
                                                    className="w-full h-28 object-cover rounded-xl border"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeExistingGallery(
                                                            image.id
                                                        )
                                                    }
                                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg"
                                                    title="Remove image"
                                                >

                                                    <X size={15} />

                                                </button>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        )}

                        {/* =================================================
                            NEW GALLERY
                        ================================================= */}

                        <div>

                            <label className="text-sm font-medium text-gray-700 block mb-2">

                                Add New Gallery Images

                            </label>

                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) =>
                                    setGalleryImages(
                                        Array.from(
                                            e.target.files || []
                                        )
                                    )
                                }
                                className="block w-full text-sm border border-gray-300 p-3 rounded-xl"
                            />

                            {galleryImages.length > 0 && (

                                <p className="text-xs text-green-600 mt-2">

                                    {galleryImages.length} new image(s) selected

                                </p>

                            )}

                        </div>

                    </div>

                    {/* =================================================
                        SUBMIT
                    ================================================= */}

                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/admin-portal/lands")
                            }
                            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-[#E8EEF9] transition"
                        >

                            Cancel

                        </button>

                        <button
                            type="submit"
                            disabled={updating}
                            className="flex items-center justify-center gap-2 bg-[#14213D] hover:bg-[#1c2c52] disabled:opacity-60 text-white px-8 py-3 rounded-xl font-semibold transition"
                        >

                            <Upload size={18} />

                            {updating
                                ? "Updating..."
                                : "Update Land"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};

export default EditLand;