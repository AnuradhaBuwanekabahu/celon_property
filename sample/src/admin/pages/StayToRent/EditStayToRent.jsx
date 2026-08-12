import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";

import {
    getStayToRentById,
    getStayToRentGallery,
    updateStayToRent
} from "../../api/stayToRentApi";

import {
    cityOptions,
    highlightOptions,
    overviewOptions
} from "../../data/propertyOption";
import Loader from "../../components/Loader";

const EditStayToRent = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // ============================================
    // FORM
    // ============================================

    const [form, setForm] = useState({
        client_id: "",

        title: "",
        description: "",
        price: "",

        duration: "month",
        property_type: "",
        price_period: "monthly",

        rate: "",
        area_sqft: "",

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

    // ============================================
    // IMAGES
    // ============================================

    const [mainImage, setMainImage] = useState(null);
    const [mainVideo, setMainVideo] = useState(null);

    const [existingGallery, setExistingGallery] = useState([]);
    const [galleryImages, setGalleryImages] = useState([]);

    // ============================================
    // LOAD PROPERTY
    // ============================================

    useEffect(() => {

        const fetchProperty = async () => {

            try {

                setLoading(true);

                const response =
                    await getStayToRentById(id);

                const property =
                    response.data?.data;

                if (!property) {

                    toast.error(
                        "Property not found"
                    );

                    return;
                }

                // ====================================
                // PARSE OVERVIEW
                // ====================================

                let overviewData = [];

                if (property.overview) {

                    try {

                        overviewData =
                            typeof property.overview === "string"
                                ? JSON.parse(property.overview)
                                : property.overview;

                    } catch {

                        overviewData = [];
                    }
                }

                // ====================================
                // PARSE HIGHLIGHTS
                // ====================================

                let highlightsData = [];

                if (property.highlights) {

                    try {

                        highlightsData =
                            typeof property.highlights === "string"
                                ? JSON.parse(property.highlights)
                                : property.highlights;

                    } catch {

                        highlightsData = [];
                    }
                }

                // ====================================
                // SET FORM
                // ====================================

                setForm({

                    client_id:
                        property.client_id || "",

                    title:
                        property.title || "",

                    description:
                        property.description || "",

                    price:
                        property.price || "",

                    duration:
                        property.duration || "month",

                    property_type:
                        property.property_type || "",

                    price_period:
                        property.price_period || "monthly",

                    rate:
                        property.rate || "",

                    area_sqft:
                        property.area_sqft || "",

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

                // ====================================
                // LOAD GALLERY
                // ====================================

                if (property.gallery) {

                    if (Array.isArray(property.gallery)) {

                        setExistingGallery(
                            property.gallery
                        );

                    }

                } else {

                    try {

                        const galleryResponse =
                            await getStayToRentGallery(id);

                        setExistingGallery(
                            galleryResponse.data?.data || []
                        );

                    } catch {

                        setExistingGallery([]);
                    }
                }

            } catch (error) {

                console.error(
                    "GET STAY TO RENT ERROR:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Failed loading property"
                );

            } finally {

                setLoading(false);
            }
        };

        if (id) {
            fetchProperty();
        }

    }, [id]);

    // ============================================
    // INPUT CHANGE
    // ============================================

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

    // ============================================
    // OVERVIEW CHANGE
    // ============================================

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

        setForm((prev) => ({
            ...prev,
            overview: updatedOverview
        }));
    };

    // ============================================
    // ADD OVERVIEW
    // ============================================

    const addOverview = () => {

        const usedTitles =
            form.overview.map(
                (item) => item.title
            );

        const nextOption =
            overviewOptions.find(
                (option) =>
                    !usedTitles.includes(
                        option.value
                    )
            );

        const nextTitle =
            nextOption?.value ||
            overviewOptions[0]?.value ||
            "";

        setForm((prev) => ({
            ...prev,

            overview: [
                ...prev.overview,

                {
                    title: nextTitle,
                    value: ""
                }
            ]
        }));
    };

    // ============================================
    // REMOVE OVERVIEW
    // ============================================

    const removeOverview = (index) => {

        const updatedOverview =
            form.overview.filter(
                (_, i) => i !== index
            );

        if (updatedOverview.length === 0) {

            setForm((prev) => ({
                ...prev,

                overview: [
                    {
                        title: "Bedrooms",
                        value: ""
                    }
                ]
            }));

            return;
        }

        setForm((prev) => ({
            ...prev,
            overview: updatedOverview
        }));
    };

    // ============================================
    // HIGHLIGHT CHANGE
    // ============================================

    const handleHighlightChange = (item) => {

        let updatedHighlights =
            [...form.highlights];

        if (
            updatedHighlights.includes(item)
        ) {

            updatedHighlights =
                updatedHighlights.filter(
                    (x) => x !== item
                );

        } else {

            updatedHighlights.push(item);
        }

        setForm((prev) => ({
            ...prev,
            highlights: updatedHighlights
        }));
    };

    // ============================================
    // REMOVE EXISTING GALLERY IMAGE
    // ============================================

    const removeExistingGallery = (imageId) => {

        setExistingGallery((prev) =>
            prev.filter(
                (image) =>
                    Number(image.id) !==
                    Number(imageId)
            )
        );
    };

    // ============================================
    // SUBMIT
    // ============================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setUpdating(true);

            // ========================================
            // VALIDATION
            // ========================================

            if (
                !form.title ||
                !form.price ||
                !form.property_type ||
                !form.city
            ) {

                toast.error(
                    "Title, price, property type and city are required."
                );

                setUpdating(false);

                return;
            }

            // ========================================
            // FORM DATA
            // ========================================

            const data = new FormData();

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
                "duration",
                form.duration
            );

            data.append(
                "property_type",
                form.property_type
            );

            data.append(
                "price_period",
                form.price_period
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

            data.append(
                "overview",
                JSON.stringify(
                    form.overview
                )
            );

            data.append(
                "highlights",
                JSON.stringify(
                    form.highlights
                )
            );

            // ========================================
            // KEEP EXISTING GALLERY
            // ========================================

            const keepGalleryIds =
                existingGallery.map(
                    (image) => image.id
                );

            data.append(
                "keep_gallery",
                JSON.stringify(
                    keepGalleryIds
                )
            );

            // ========================================
            // NEW MAIN IMAGE
            // ========================================

            if (mainImage) {

                data.append(
                    "main_image",
                    mainImage
                );
            }

            // ========================================
            // NEW MAIN VIDEO
            // ========================================

            if (mainVideo) {

                data.append(
                    "main_video",
                    mainVideo
                );
            }

            // ========================================
            // NEW GALLERY IMAGES
            // ========================================

            galleryImages.forEach(
                (image) => {

                    data.append(
                        "images",
                        image
                    );
                }
            );

            // ========================================
            // UPDATE
            // ========================================

            await updateStayToRent(
                id,
                data
            );

            toast.success(
                "Stay To Rent updated successfully"
            );

            navigate(
                "/admin/stay-to-rent"
            );

        } catch (error) {

            console.error(
                "UPDATE STAY TO RENT ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
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

    // ============================================
    // UI
    // ============================================

    return (

        <div className="max-w-5xl mx-auto p-6">

            {/* =====================================
                HEADER
            ===================================== */}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">

                <div>

                    <h1 className="text-3xl font-bold text-[#14213D]">
                        Edit Stay To Rent
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Update property information
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/admin/stay-to-rent"
                        )
                    }
                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >

                    <ArrowLeft size={18} />

                    Back

                </button>

            </div>


            {/* =====================================
                FORM
            ===================================== */}

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-sm p-6 space-y-6"
            >

                {/* =================================
                    BASIC DETAILS
                ================================= */}

                <div>

                    <h2 className="text-xl font-semibold text-[#14213D] mb-4">
                        Basic Details
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Property title"
                            className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                        />

                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="Price (RS)"
                            className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                        />

                    </div>

                </div>


                {/* =================================
                    DESCRIPTION
                ================================= */}

                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Enter description here..."
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                />


                {/* =================================
                    PROPERTY TYPE + CITY
                ================================= */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <select
                        name="property_type"
                        value={form.property_type}
                        onChange={handleChange}
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

                    </select>


                    <select
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#FCA311]"
                    >

                        <option value="">
                            Select City
                        </option>

                        {cityOptions.map(
                            (city) => (

                                <option
                                    key={city}
                                    value={city}
                                >
                                    {city}
                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* =================================
                    RENT DETAILS
                ================================= */}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    {/* Duration */}

                    <select
                        name="duration"
                        value={form.duration}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#FCA311]"
                    >

                        <option value="permanent">
                            Permanent
                        </option>

                        <option value="year">
                            Year
                        </option>

                        <option value="month">
                            Month
                        </option>

                        <option value="week">
                            Week
                        </option>

                        <option value="day">
                            Day
                        </option>

                    </select>


                    {/* Price Period */}

                    <select
                        name="price_period"
                        value={form.price_period}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#FCA311]"
                    >

                        <option value="monthly">
                            Monthly
                        </option>

                        <option value="yearly">
                            Yearly
                        </option>

                    </select>


                    {/* Rate */}

                    <input
                        type="number"
                        step="0.1"
                        name="rate"
                        value={form.rate}
                        onChange={handleChange}
                        placeholder="Rate"
                        className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                    />

                </div>


                {/* =================================
                    STATUS + AREA
                ================================= */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

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
                        name="area_sqft"
                        value={form.area_sqft}
                        onChange={handleChange}
                        placeholder="Area (sqft)"
                        className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                    />

                </div>


                {/* =================================
                    OVERVIEW
                ================================= */}

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
                                        (option) => (

                                            <option
                                                key={
                                                    option.value
                                                }
                                                value={
                                                    option.value
                                                }
                                            >
                                                {option.label}
                                            </option>

                                        )
                                    )}

                                </select>


                                <input
                                    type="text"
                                    value={
                                        item.value || ""
                                    }
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
                                        removeOverview(
                                            index
                                        )
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
                        className="bg-[#FCA311] hover:bg-[#e69500] px-4 py-2 rounded-xl text-sm font-medium"
                    >
                        + Add Overview
                    </button>

                </div>


                {/* =================================
                    HIGHLIGHTS
                ================================= */}

                <div className="space-y-3 border border-gray-200 rounded-xl p-4">

                    <h3 className="font-semibold text-lg text-[#14213D]">
                        Highlights
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

                        {highlightOptions.map(
                            (item) => (

                                <label
                                    key={item}
                                    className="flex items-center gap-2 border border-gray-300 p-3 rounded-xl cursor-pointer hover:bg-gray-50"
                                >

                                    <input
                                        type="checkbox"
                                        checked={
                                            form.highlights.includes(
                                                item
                                            )
                                        }
                                        onChange={() =>
                                            handleHighlightChange(
                                                item
                                            )
                                        }
                                    />

                                    <span className="text-sm">
                                        {item}
                                    </span>

                                </label>

                            )
                        )}

                    </div>

                </div>


                {/* =================================
                    LOCATION
                ================================= */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <input
                        type="text"
                        name="map_address"
                        value={form.map_address}
                        onChange={handleChange}
                        placeholder="Map address"
                        className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                    />


                    <input
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="Enter your location address"
                        className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                    />

                </div>


                {/* =================================
                    CURRENT GALLERY
                ================================= */}

                <div className="space-y-3 border border-gray-200 rounded-xl p-4">

                    <h3 className="font-semibold text-lg text-[#14213D]">
                        Existing Gallery
                    </h3>

                    {existingGallery.length === 0 ? (

                        <p className="text-sm text-gray-500">
                            No existing gallery images.
                        </p>

                    ) : (

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                            {existingGallery.map(
                                (image) => (

                                    <div
                                        key={image.id}
                                        className="relative"
                                    >

                                        <img
                                            src={
                                                image.image ||
                                                image.url
                                            }
                                            alt="Gallery"
                                            className="w-full h-32 object-cover rounded-xl border"
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

                    )}

                </div>


                {/* =================================
                    UPDATE IMAGES
                ================================= */}

                <div className="space-y-4 border border-gray-200 rounded-xl p-4">

                    <h3 className="font-semibold text-lg text-[#14213D]">
                        Update Images & Video
                    </h3>


                    {/* Main Image */}

                    <div>

                        <label className="text-sm font-medium block mb-2">
                            Replace Main Image
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
                            className="block w-full text-sm border p-3 rounded-xl"
                        />

                    </div>


                    {/* Main Video */}

                    <div>

                        <label className="text-sm font-medium block mb-2">
                            Replace Main Video
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
                            className="block w-full text-sm border p-3 rounded-xl"
                        />

                    </div>


                    {/* Gallery */}

                    <div>

                        <label className="text-sm font-medium block mb-2">
                            Add New Gallery Images
                        </label>

                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) =>
                                setGalleryImages([
                                    ...e.target.files
                                ])
                            }
                            className="block w-full text-sm border p-3 rounded-xl"
                        />

                    </div>

                </div>


                {/* =================================
                    BUTTONS
                ================================= */}

                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/stay-to-rent"
                            )
                        }
                        className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-semibold"
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        disabled={updating}
                        className="bg-[#14213D] hover:bg-[#1c2c52] text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-50"
                    >

                        {updating
                            ? "Updating..."
                            : "Update Property"}

                    </button>

                </div>

            </form>

        </div>
    );
};

export default EditStayToRent;