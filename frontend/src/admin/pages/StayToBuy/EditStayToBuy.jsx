
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";

import {
    getStayToBuyById,
    updateStayToBuy
} from "../../api/stayToBuyApi";

import {
    cityOptions,
    highlightOptions,
    overviewOptions
} from "../../data/propertyOption";
import Loader from "../../components/Loader";

const EditStayToBuy = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [form, setForm] = useState({
        client_id: "",

        title: "",
        description: "",
        price: "",
        property_type: "",
        rate: "",
        area_sqft: "",

        duration: "month",

        city: "",
        map_address: "",
        location: "",

        status: "pending",

        overview: [
            {
                title: "Bedrooms",
                value: ""
            }
        ],

        highlights: []
    });

    // Existing images
    const [existingMainImage, setExistingMainImage] = useState(null);
    const [existingVideo, setExistingVideo] = useState(null);
    const [existingGallery, setExistingGallery] = useState([]);

    // New files
    const [mainImage, setMainImage] = useState(null);
    const [mainVideo, setMainVideo] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);

    // =====================================================
    // LOAD STAY TO BUY
    // =====================================================

    useEffect(() => {

        const fetchProperty = async () => {

            try {

                setLoading(true);

                const response =
                    await getStayToBuyById(id);

                const property =
                    response.data.data;

                if (!property) {
                    toast.error("Property not found");
                    return;
                }

                // -----------------------------------------
                // Parse overview
                // -----------------------------------------

                let overviewData = [];

                try {

                    overviewData =
                        property.overview
                            ? typeof property.overview === "string"
                                ? JSON.parse(property.overview)
                                : property.overview
                            : [];

                } catch (error) {

                    overviewData = [];

                }

                // -----------------------------------------
                // Parse highlights
                // -----------------------------------------

                let highlightsData = [];

                try {

                    highlightsData =
                        property.highlights
                            ? typeof property.highlights === "string"
                                ? JSON.parse(property.highlights)
                                : property.highlights
                            : [];

                } catch (error) {

                    highlightsData = [];

                }

                // -----------------------------------------
                // Set form
                // -----------------------------------------

                setForm({

                    client_id:
                        property.client_id || "",

                    title:
                        property.title || "",

                    description:
                        property.description || "",

                    price:
                        property.price || "",

                    property_type:
                        property.property_type || "",

                    rate:
                        property.rate || "",

                    area_sqft:
                        property.area_sqft || "",

                    duration:
                        property.duration || "month",

                    city:
                        property.city || "",

                    map_address:
                        property.map_address || "",

                    location:
                        property.location || "",

                    status:
                        property.status || "pending",

                    overview:
                        Array.isArray(overviewData) &&
                        overviewData.length > 0
                            ? overviewData
                            : [
                                {
                                    title: "Bedrooms",
                                    value: ""
                                }
                            ],

                    highlights:
                        Array.isArray(highlightsData)
                            ? highlightsData
                            : []

                });

                // -----------------------------------------
                // Existing media
                // -----------------------------------------

                setExistingMainImage(
                    property.main_image || null
                );

                setExistingVideo(
                    property.main_video || null
                );

                // -----------------------------------------
                // Load gallery
                // -----------------------------------------

                if (property.gallery) {

                    try {

                        const galleryResponse =
                            await fetch(
                                `http://localhost:5000${property.gallery}`
                            );

                        const galleryData =
                            await galleryResponse.json();

                        if (
                            galleryData.success &&
                            Array.isArray(galleryData.data)
                        ) {

                            setExistingGallery(
                                galleryData.data
                            );

                        }

                    } catch (galleryError) {

                        console.log(
                            "GALLERY LOAD ERROR:",
                            galleryError
                        );

                    }

                }

            } catch (error) {

                console.log(
                    "LOAD STAY TO BUY ERROR:",
                    error
                );

                toast.error(
                    "Failed loading property"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchProperty();

    }, [id]);

    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    // =====================================================
    // OVERVIEW CHANGE
    // =====================================================

    const handleOverviewChange = (
        index,
        field,
        value
    ) => {

        const updatedOverview =
            [...form.overview];

        updatedOverview[index] = {
            ...updatedOverview[index],
            [field]: value
        };

        setForm({
            ...form,
            overview: updatedOverview
        });

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

        setForm({
            ...form,

            overview: [
                ...form.overview,
                {
                    title: nextOption.value,
                    value: ""
                }
            ]
        });

    };

    // =====================================================
    // REMOVE OVERVIEW
    // =====================================================

    const removeOverview = (index) => {

        const updatedOverview =
            form.overview.filter(
                (_, i) => i !== index
            );

        if (updatedOverview.length === 0) {

            setForm({
                ...form,
                overview: [
                    {
                        title: "Bedrooms",
                        value: ""
                    }
                ]
            });

            return;

        }

        setForm({
            ...form,
            overview: updatedOverview
        });

    };

    // =====================================================
    // HIGHLIGHTS
    // =====================================================

    const handleHighlightChange = (item) => {

        let updatedHighlights =
            [...form.highlights];

        if (
            updatedHighlights.includes(item)
        ) {

            updatedHighlights =
                updatedHighlights.filter(
                    x => x !== item
                );

        } else {

            updatedHighlights.push(item);

        }

        setForm({
            ...form,
            highlights: updatedHighlights
        });

    };

    // =====================================================
    // REMOVE EXISTING GALLERY IMAGE
    // =====================================================

    const removeExistingGallery = (imageId) => {

        setExistingGallery(
            existingGallery.filter(
                image => image.id !== imageId
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

            const data = new FormData();

            // -----------------------------------------
            // Basic data
            // -----------------------------------------

            data.append(
                "client_id",
                form.client_id
            );

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
                "property_type",
                form.property_type
            );

            data.append(
                "rate",
                form.rate
            );

            data.append(
                "area_sqft",
                form.area_sqft
            );

            data.append(
                "duration",
                form.duration
            );

            data.append(
                "city",
                form.city
            );

            data.append(
                "map_address",
                form.map_address
            );

            data.append(
                "location",
                form.location
            );

            data.append(
                "status",
                form.status
            );

            // -----------------------------------------
            // JSON fields
            // -----------------------------------------

            data.append(
                "overview",
                JSON.stringify(form.overview)
            );

            data.append(
                "highlights",
                JSON.stringify(form.highlights)
            );

            // -----------------------------------------
            // Main image
            // -----------------------------------------

            if (mainImage) {

                data.append(
                    "main_image",
                    mainImage
                );

            }

            // -----------------------------------------
            // Main video
            // -----------------------------------------

            if (mainVideo) {

                data.append(
                    "main_video",
                    mainVideo
                );

            }

            // -----------------------------------------
            // Existing gallery IDs to KEEP
            // -----------------------------------------

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

            // -----------------------------------------
            // New gallery images
            // -----------------------------------------

            galleryImages.forEach(
                image => {

                    data.append(
                        "images",
                        image
                    );

                }
            );

            // -----------------------------------------
            // UPDATE
            // -----------------------------------------

            await updateStayToBuy(
                id,
                data
            );

            toast.success(
                "Stay To Buy updated successfully"
            );

            navigate(
                "/admin-portal/stay-to-buy"
            );

        } catch (error) {

            console.log(
                "UPDATE STAY TO BUY ERROR:",
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

        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">

            <div className="max-w-5xl mx-auto">

                {/* =========================================
                    HEADER
                ========================================= */}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                    <div>

                        <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D]">
                            Edit Stay To Buy
                        </h1>

                        <p className="text-gray-500 text-sm mt-1">
                            Update property information and media
                        </p>

                    </div>

                    <Link
                        to="/admin-portal/stay-to-buy"
                        className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-xl"
                    >
                        <ArrowLeft size={18} />
                        Back
                    </Link>

                </div>

                {/* =========================================
                    FORM
                ========================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-7 space-y-6"
                >

                    {/* =====================================
                        BASIC DETAILS
                    ===================================== */}

                    <div>

                        <h2 className="text-lg font-semibold text-[#14213D] mb-4">
                            Basic Details
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Property title"
                                required
                                className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                            />

                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="Price (RS)"
                                required
                                className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                            />

                        </div>

                    </div>

                    {/* =====================================
                        DESCRIPTION
                    ===================================== */}

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Enter description here..."
                        className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                    />

                    {/* =====================================
                        PROPERTY TYPE / CITY
                    ===================================== */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <select
                            name="property_type"
                            value={form.property_type}
                            onChange={handleChange}
                            required
                            className="w-full h-12 px-4 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#FCA311]"
                        >

                            <option value="">
                                Select Property Type
                            </option>

                            <option value="House">
                                House
                            </option>

                            <option value="Apartment">
                                Apartment
                            </option>

                            <option value="Villa">
                                Villa
                            </option>

                            <option value="Bungalow">
                                Bungalow
                            </option>

                            <option value="Land">
                                Land
                            </option>

                        </select>

                        <select
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            required
                            className="w-full h-12 px-4 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#FCA311]"
                        >

                            <option value="">
                                Select City
                            </option>

                            {cityOptions.map(city => (

                                <option
                                    key={city}
                                    value={city}
                                >
                                    {city}
                                </option>

                            ))}

                        </select>

                    </div>

                    {/* =====================================
                        STATUS / RATE / DURATION
                    ===================================== */}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full h-12 px-4 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FCA311]"
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

                        <input
                            type="number"
                            step="0.1"
                            name="rate"
                            value={form.rate}
                            onChange={handleChange}
                            placeholder="Rate"
                            className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                        />

                        <select
                            name="duration"
                            value={form.duration}
                            onChange={handleChange}
                            className="w-full h-12 px-4 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FCA311]"
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

                    {/* =====================================
                        OVERVIEW
                    ===================================== */}

                    <div className="space-y-3 border border-gray-200 rounded-xl p-4">

                        <h3 className="font-semibold text-lg text-[#14213D]">
                            Overview
                        </h3>

                        <p className="text-xs text-gray-500">
                            Choose a title and enter the value.
                        </p>

                        {form.overview.map(
                            (item, index) => (

                                <div
                                    key={index}
                                    className="flex flex-col sm:flex-row gap-3"
                                >

                                    <select
                                        value={item.title}
                                        onChange={(e) =>
                                            handleOverviewChange(
                                                index,
                                                "title",
                                                e.target.value
                                            )
                                        }
                                        className="border border-gray-300 p-3 rounded-xl text-sm w-full sm:w-1/2"
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
                                        className="border border-gray-300 p-3 rounded-xl text-sm w-full sm:w-1/2"
                                    />

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

                        <button
                            type="button"
                            onClick={addOverview}
                            className="bg-[#FCA311] hover:bg-[#e89405] px-4 py-2 rounded-xl text-sm font-medium"
                        >
                            + Add Overview
                        </button>

                    </div>

                    {/* =====================================
                        HIGHLIGHTS
                    ===================================== */}

                    <div className="space-y-3 border border-gray-200 rounded-xl p-4">

                        <h3 className="font-semibold text-lg text-[#14213D]">
                            Highlights
                        </h3>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

                            {highlightOptions.map(item => (

                                <label
                                    key={item}
                                    className="flex items-center gap-2 border border-gray-300 p-3 rounded-xl cursor-pointer hover:bg-gray-50"
                                >

                                    <input
                                        type="checkbox"
                                        checked={
                                            form.highlights.includes(item)
                                        }
                                        onChange={() =>
                                            handleHighlightChange(item)
                                        }
                                    />

                                    <span className="text-sm">
                                        {item}
                                    </span>

                                </label>

                            ))}

                        </div>

                    </div>

                    {/* =====================================
                        AREA / MAP ADDRESS
                    ===================================== */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <input
                            type="number"
                            name="area_sqft"
                            value={form.area_sqft}
                            onChange={handleChange}
                            placeholder="Area (sqft)"
                            className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                        />

                        <input
                            type="text"
                            name="map_address"
                            value={form.map_address}
                            onChange={handleChange}
                            placeholder="Map address"
                            className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                        />

                    </div>

                    <input
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="Enter your location address"
                        className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                    />

                    {/* =====================================
                        MEDIA
                    ===================================== */}

                    <div className="space-y-5 border border-gray-200 rounded-xl p-4">

                        <h3 className="font-semibold text-lg text-[#14213D]">
                            Update Images & Video
                        </h3>

                        {/* ---------------------------------
                            CURRENT MAIN IMAGE
                        --------------------------------- */}

                        {existingMainImage && (

                            <div>

                                <p className="text-sm font-medium mb-2">
                                    Current Main Image
                                </p>

                                <img
                                    src={`http://localhost:5000${existingMainImage}`}
                                    alt={form.title}
                                    className="w-full sm:w-72 h-44 object-cover rounded-xl border"
                                />

                            </div>

                        )}

                        <div>

                            <label className="text-sm font-medium block mb-2">
                                New Main Image
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setMainImage(
                                        e.target.files?.[0] || null
                                    )
                                }
                                className="block w-full text-sm border p-3 rounded-xl"
                            />

                            {mainImage && (

                                <p className="text-xs text-green-600 mt-2">
                                    Selected: {mainImage.name}
                                </p>

                            )}

                        </div>

                        {/* ---------------------------------
                            CURRENT VIDEO
                        --------------------------------- */}

                        {existingVideo && (

                            <div>

                                <p className="text-sm font-medium mb-2">
                                    Current Video
                                </p>

                                <video
                                    controls
                                    className="w-full sm:w-96 max-h-64 rounded-xl border"
                                >
                                    <source
                                        src={`http://localhost:5000${existingVideo}`}
                                    />
                                </video>

                            </div>

                        )}

                        <div>

                            <label className="text-sm font-medium block mb-2">
                                New Main Video
                            </label>

                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) =>
                                    setMainVideo(
                                        e.target.files?.[0] || null
                                    )
                                }
                                className="block w-full text-sm border p-3 rounded-xl"
                            />

                            {mainVideo && (

                                <p className="text-xs text-green-600 mt-2">
                                    Selected: {mainVideo.name}
                                </p>

                            )}

                        </div>

                        {/* ---------------------------------
                            EXISTING GALLERY
                        --------------------------------- */}

                        {existingGallery.length > 0 && (

                            <div>

                                <p className="text-sm font-medium mb-3">
                                    Existing Gallery
                                </p>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                                    {existingGallery.map(
                                        image => (

                                            <div
                                                key={image.id}
                                                className="relative"
                                            >

                                                <img
                                                    src={`http://localhost:5000${image.image}`}
                                                    alt="Gallery"
                                                    className="w-full h-28 object-cover rounded-xl border"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeExistingGallery(
                                                            image.id
                                                        )
                                                    }
                                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-lg"
                                                >
                                                    Remove
                                                </button>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        )}

                        {/* ---------------------------------
                            NEW GALLERY
                        --------------------------------- */}

                        <div>

                            <label className="text-sm font-medium block mb-2">
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
                                className="block w-full text-sm border p-3 rounded-xl"
                            />

                            {galleryImages.length > 0 && (

                                <p className="text-xs text-green-600 mt-2">
                                    {galleryImages.length} new image(s) selected
                                </p>

                            )}

                        </div>

                    </div>

                    {/* =====================================
                        SUBMIT
                    ===================================== */}

                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin-portal/stay-to-buy"
                                )
                            }
                            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={updating}
                            className="bg-[#14213D] hover:bg-[#1c2c52] disabled:opacity-60 text-white px-8 py-3 rounded-xl font-semibold"
                        >
                            {updating
                                ? "Updating..."
                                : "Update Property"}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};

export default EditStayToBuy;
