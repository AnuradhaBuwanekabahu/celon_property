
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
    overviewOptions,
    districtOptions
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
        
        area_sqft: "",

        duration: "month",

        district: "",
city: "",
address: "",
map_address: "",

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

             

                    area_sqft:
                        property.area_sqft || "",

                    duration:
                        property.duration || "month",

                    district:
    property.district || "",

city:
    property.city || "",

address:
    property.address || "",

map_address:
    property.map_address || "",

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
// Load existing gallery
// -----------------------------------------

try {

    const galleryResponse = await fetch(
        `http://localhost:5000/api/stays-to-buy/gallery/${id}`
    );

    const galleryData = await galleryResponse.json();

    if (
        galleryData.success &&
        Array.isArray(galleryData.data)
    ) {

        setExistingGallery(
            galleryData.data
        );

    } else {

        setExistingGallery([]);

    }

} catch (galleryError) {

    console.log(
        "GALLERY LOAD ERROR:",
        galleryError
    );

    setExistingGallery([]);

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
                "area_sqft",
                form.area_sqft
            );

            data.append(
                "duration",
                form.duration
            );
            data.append(
    "district",
    form.district
);

            data.append(
                "city",
                form.city
            );
            data.append(
    "address",
    form.address
);

            data.append(
                "map_address",
                form.map_address
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
                "/admin/stay-to-buy"
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

                       

                    </div>

                    <Link
                        to="/admin/stay-to-buy"
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

                            <div>

                                 <label className="block text-sm font-medium text-[#14213D] mb-2">

                                 Title

                                </label>

                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Property title"
                                required
                                className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                            />

                            </div>

                            <div>
                                 <label className="block text-sm font-medium text-[#14213D] mb-2">

                                 price

                                </label>

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

                    </div>

                    {/* =====================================
                        DESCRIPTION
                    ===================================== */}

                    <div>

                         <label className="block text-sm font-medium text-[#14213D] mb-2">

                                 Description

                                </label>

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Enter description here..."
                        className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                    />

                    </div>



{/* =====================================
    PROPERTY TYPE / DISTRICT
===================================== */}

<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

    <div>
        <label className="block text-sm font-medium text-[#14213D] mb-2">
            Property Type
        </label>

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

            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Bungalow">Bungalow</option>
            <option value="Hotel">Hotel</option>
            <option value="WareHouse">WareHouse</option>
            <option value="Villa">Villa</option>
            <option value="Studio">Studio</option>
        </select>
    </div>


    <div>
        <label className="block text-sm font-medium text-[#14213D] mb-2">
            District
        </label>

        <select
            name="district"
            value={form.district}
            onChange={handleChange}
            required
            className="w-full h-12 px-4 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#FCA311]"
        >
            <option value="">
                Select District
            </option>

            {districtOptions.map((district) => (
                <option
                    key={district}
                    value={district}
                >
                    {district}
                </option>
            ))}
        </select>
    </div>

</div>

{/* =====================================
    CITY / ADDRESS
===================================== */}

<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

      <div>
        <label className="block text-sm font-medium text-[#14213D] mb-2">
            City
        </label>

        <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            placeholder="Enter city"
            className="w-full h-12 px-4 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#FCA311]"
        />
    </div>


    <div>
        <label className="block text-sm font-medium text-[#14213D] mb-2">
            Address
        </label>

        <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            placeholder="Enter property address"
            className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
        />
    </div>

</div>

 {/* =====================================
    STATUS / DURATION
===================================== */}

<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

    {/* Status */}

    <div>

        <label className="block text-sm font-medium text-[#14213D] mb-2">
            Status
        </label>

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

    </div>


    {/* Duration */}

    <div>

        <label className="block text-sm font-medium text-[#14213D] mb-2">
            Duration
        </label>

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

</div>

                    {/* =====================================
                        OVERVIEW
                    ===================================== */}

                    <div className="space-y-3 border border-gray-200 rounded-xl p-4">

                        <h3 className="font-semibold text-lg text-[#14213D]">
                            Overview
                        </h3>

                        

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
                            className="bg-[#FBBF24] hover:bg-[#d3a120] px-4 py-2 rounded-xl text-sm font-medium"
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
                        <div>

                         <label className="block text-sm font-medium text-[#14213D] mb-2">

                                 Area_sqft

                                </label>

                        <input
                            type="number"
                            name="area_sqft"
                            value={form.area_sqft}
                            onChange={handleChange}
                            placeholder="Area (sqft)"
                            className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                        />
                        </div>


                        <div>

                            <label className="block text-sm font-medium text-[#14213D] mb-2">

                                 Map_address

                                </label>


                        <input
                            type="text"
                            name="map_address"
                            value={form.map_address}
                            onChange={handleChange}
                            placeholder="Map address"
                            className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                        />

                        </div>

                    </div>

                    

                    {/* =====================================
                        MEDIA
                    ===================================== */}

                    <div className="space-y-3 border border-gray-200 rounded-xl p-4">

                        <h3 className="font-semibold text-lg text-[#14213D]">
                            Update Images
                        </h3>

             

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

                        <div>

                             <div className="space-y-4 border border-gray-200 rounded-xl p-4">

                                 <h3 className="font-semibold text-lg text-[#14213D]">
                        Update Main Video
                    </h3>

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

</div>


                    

                    {/* =====================================
                        SUBMIT
                    ===================================== */}

                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/stay-to-buy"
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
