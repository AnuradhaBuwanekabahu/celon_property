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
    cityOptions,
    districtOptions
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
        client_id: "",

        title: "",
        description: "",
        price: "",
        
        land_size: "",
        size_unit: "perches",
        address: "",
district: "",

        city: "",
        map_address: "",
    

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
                client_id:
                        land.client_id || "",


                title:
                    land.title || "",

                description:
                    land.description || "",

                price:
                    land.price || "",

              

                land_size:
                    land.land_size || "",

                size_unit:
                    land.size_unit || "perches",
                address:
                    land.address || "",

                district:
                    land.district || "",

                city:
                    land.city || "",
                map_address: land.map_address || "",

               

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
                "land_size",
                form.land_size
            );

            data.append(
                "size_unit",
                form.size_unit
            );

            data.append(
    "address",
    form.address
);

data.append(
    "district",
    form.district
);

            data.append(
                "city",
                form.city
            );
            data.append("map_address", form.map_address);



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
                "/admin/lands"
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

                

                    </div>

                    <Link
                        to="/admin/lands"
                        className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-xl transition"
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

                            <div>
                            <label className="block text-sm font-medium text-[#14213D] mb-2">

                            Title

                            </label>

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
                            </div>

                            {/* PRICE */}
                            <div>

                            <label className="block text-sm font-medium text-[#14213D] mb-2">

                            Price

                            </label>

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

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* LAND SIZE */}
        <div>
            <label className="block text-sm font-medium text-[#14213D] mb-2">
                Land Size
            </label>

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
        </div>

        {/* SIZE UNIT */}
        <div>
            <label className="block text-sm font-medium text-[#14213D] mb-2">
                Size Unit
            </label>

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

</div>

                    {/* =================================================
    LOCATION
================================================= */}

<div>

   

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* ADDRESS */}
        <div>

            <label className="block text-sm font-medium text-[#14213D] mb-2">
                Address
            </label>

            <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Property address"
                required
                className="w-full border border-gray-300 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FBBF24]"
            />

        </div>


        {/* DISTRICT */}
        <div>

            <label className="block text-sm font-medium text-[#14213D] mb-2">
                District
            </label>

            <select
                name="district"
                value={form.district}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#FBBF24]"
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


        {/* CITY */}
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
                className="w-full h-12 px-4 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#FBBF24]"
            />

        </div>

        {/* MAP ADDRESS */}
        <div>

            <label className="block text-sm font-medium text-[#14213D] mb-2">
                Map Address
            </label>

            <input
                type="text"
                name="map_address"
                value={form.map_address}
                onChange={handleChange}
                placeholder="Google Maps address / location"
                className="w-full border border-gray-300 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FBBF24]"
            />

        </div>

    </div>

</div>





                    {/* =================================================
                        STATUS / DURATION
                    ================================================= */}

                    <div>
                        


                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>

                               <label className="block text-sm font-medium text-[#14213D] mb-2">

                                 Status

                                </label>

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

                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#14213D] mb-2">

                                 Duration

                                </label>

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

                    </div>

{/* =================================================
    OVERVIEW
================================================= */}

<div className="space-y-4 border border-gray-200 rounded-xl p-4">

    <div>

        <h3 className="font-semibold text-lg text-[#14213D]">

            Overview

        </h3>

        

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
        className="bg-[#FBBF24] hover:bg-[#d3a120] px-4 py-2 rounded-xl text-sm font-medium w-full sm:w-auto"
    >

        + Add Overview

    </button>

</div>

                    {/* =================================================
                        MEDIA
                    ================================================= */}

                    <div className="space-y-3 border border-gray-200 rounded-xl p-4">

                        <h3 className="text-lg font-semibold text-[#14213D]">

                            Update Images 

                        </h3>

   

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
                            NEW VIDEO
                        ================================================= */}

                        <div className="space-y-4 border border-gray-200 rounded-xl p-4">

                             <h3 className="font-semibold text-lg text-[#14213D]">
                             Update Main Video
                             </h3>

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
                        SUBMIT
                    ================================================= */}

                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/lands"
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

export default EditLand;