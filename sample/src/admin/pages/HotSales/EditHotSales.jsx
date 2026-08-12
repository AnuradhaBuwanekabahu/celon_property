
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
    getHotSaleById,
    updateHotSale
} from "../../api/hotSalesApi";

import {
    cityOptions,
    highlightOptions,
    overviewOptions
} from "../../data/propertyOption";
import Loader from "../../components/Loader";


const EditHotSale = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [updating, setUpdating] = useState(false);


    // ============================
    // FORM STATE
    // ============================

    const [form, setForm] = useState({

        client_id: "",

        title: "",
        description: "",
        price: "",
        property_type: "",

        rate: "",

        area_sqft: "",

        city: "",
        map_address: "",
        location: "",

        duration: "month",

        status: "pending",

        overview: [
            {
                title: "Bedrooms",
                value: ""
            }
        ],

        highlights: []

    });


    // ============================
    // FILE STATES
    // ============================

    const [mainImage, setMainImage] = useState(null);

    const [mainVideo, setMainVideo] = useState(null);

    const [galleryImages, setGalleryImages] = useState([]);


    // Existing media URLs
    const [existingImage, setExistingImage] = useState("");

    const [existingVideo, setExistingVideo] = useState("");


    // ============================
    // LOAD HOT SALE
    // ============================

    useEffect(() => {

        const fetchHotSale = async () => {

            try {

                const res = await getHotSaleById(id);

                const sale = res.data.hotSale;


                setForm({

                    client_id:
                        sale.client_id || "",

                    title:
                        sale.title || "",

                    description:
                        sale.description || "",

                    price:
                        sale.price || "",

                    property_type:
                        sale.property_type || "",

                    rate:
                        sale.rate || "",

                    area_sqft:
                        sale.area_sqft || "",

                    city:
                        sale.city || "",

                    map_address:
                        sale.map_address || "",

                    location:
                        sale.location || "",

                    duration:
                        sale.duration || "month",

                    status:
                        sale.status || "pending",

                    overview:
                        sale.overview
                            ? typeof sale.overview === "string"
                                ? JSON.parse(sale.overview)
                                : sale.overview
                            : [
                                {
                                    title: "Bedrooms",
                                    value: ""
                                }
                            ],

                    highlights:
                        typeof sale.highlights === "string"
                            ? JSON.parse(sale.highlights)
                            : sale.highlights || []

                });


                // Existing image
                setExistingImage(
                    sale.main_image || ""
                );


                // Existing video
                setExistingVideo(
                    sale.main_video || ""
                );


            } catch (error) {

                console.log(error);

                toast.error(
                    "Failed loading property"
                );

            } finally {

                setLoading(false);

            }

        };


        fetchHotSale();

    }, [id]);


    // ============================
    // INPUT CHANGE
    // ============================

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]:
                e.target.value

        });

    };


    // ============================
    // OVERVIEW CHANGE
    // ============================

    const handleOverviewChange = (
        index,
        field,
        value
    ) => {

        const updatedOverview =
            [...form.overview];

        updatedOverview[index][field] =
            value;


        setForm({

            ...form,

            overview:
                updatedOverview

        });

    };


    const addOverview = () => {

        const usedTitles =
            form.overview.map(
                item => item.title
            );


        const nextTitle =
            overviewOptions.find(
                option =>
                    !usedTitles.includes(
                        option.value
                    )
            )?.value
            ||
            overviewOptions[0].value;


        setForm({

            ...form,

            overview: [

                ...form.overview,

                {
                    title: nextTitle,
                    value: ""
                }

            ]

        });

    };


    const removeOverview = (index) => {

        const updatedOverview =
            form.overview.filter(
                (_, i) =>
                    i !== index
            );


        if (updatedOverview.length > 0) {

            setForm({

                ...form,

                overview:
                    updatedOverview

            });

        }

    };


    // ============================
    // HIGHLIGHTS
    // ============================

    const handleHighlightChange = (
        item
    ) => {

        let updated =
            [...form.highlights];


        if (updated.includes(item)) {

            updated =
                updated.filter(
                    x => x !== item
                );

        } else {

            updated.push(item);

        }


        setForm({

            ...form,

            highlights:
                updated

        });

    };


    // ============================
    // SUBMIT
    // ============================

    const handleSubmit = async (e) => {

        e.preventDefault();


        try {

            setUpdating(true);


            const data =
                new FormData();


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


            // ============================
            // DURATION
            // ============================

            data.append(
                "duration",
                form.duration
            );


            // ============================
            // STATUS
            // ============================

            data.append(
                "status",
                form.status
            );


            // ============================
            // OVERVIEW
            // ============================

            data.append(
                "overview",
                JSON.stringify(
                    form.overview
                )
            );


            // ============================
            // HIGHLIGHTS
            // ============================

            data.append(
                "highlights",
                JSON.stringify(
                    form.highlights
                )
            );


            // ============================
            // MAIN IMAGE
            // ============================

            if (mainImage) {

                data.append(
                    "main_image",
                    mainImage
                );

            }


            // ============================
            // MAIN VIDEO
            // ============================

            if (mainVideo) {

                data.append(
                    "main_video",
                    mainVideo
                );

            }


            // ============================
            // GALLERY IMAGES
            // ============================

            galleryImages.forEach(
                image => {

                    data.append(
                        "images",
                        image
                    );

                }
            );


            // ============================
            // UPDATE
            // ============================

            await updateHotSale(
                id,
                data
            );


            toast.success(
                "Hot sale updated successfully"
            );


            navigate(
                "/admin/hot-sales"
            );


        } catch (error) {

            console.log(error);

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

    // ============================
    // UI
    // ============================

    return (

        <div className="max-w-6xl mt-8 mx-auto p-4 sm:p-6">


            <h2 className="text-xl sm:text-2xl font-bold text-[#14213D] mb-5">

                Edit Hot Sale

            </h2>


            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >


                {/* ============================
                    BASIC DETAILS
                ============================ */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Property title"
                        className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                    />


                    <input
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="Price (RS)"
                        className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                    />


                </div>


                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Enter description here..."
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                />


                {/* ============================
                    PROPERTY TYPE / CITY
                ============================ */}

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

                        <option value="Land">
                            Land
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


                {/* ============================
                    STATUS / RATE / DURATION
                ============================ */}

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


                {/* ============================
                    OVERVIEW
                ============================ */}

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
                                    className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm"
                                >

                                    Remove

                                </button>

                            </div>

                        )
                    )}


                    <button
                        type="button"
                        onClick={addOverview}
                        className="bg-[#FCA311] px-4 py-2 rounded-xl text-sm font-medium w-full sm:w-auto"
                    >

                        + Add Overview

                    </button>


                </div>


                {/* ============================
                    HIGHLIGHTS
                ============================ */}

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


                {/* ============================
                    AREA / MAP
                ============================ */}

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


                {/* ============================
                    IMAGES
                ============================ */}

                <div className="space-y-3 border border-gray-200 rounded-xl p-4">


                    <h3 className="font-semibold text-lg text-[#14213D]">
                        Update Images
                    </h3>


                    {/* Existing Image */}

                    {existingImage && (

                        <div>

                            <label className="text-sm font-medium block mb-2">
                                Current Main Image
                            </label>

                            <img
                                src={`http://localhost:5000${existingImage}`}
                                alt="Current"
                                className="w-40 h-28 object-cover rounded-xl border"
                            />

                        </div>

                    )}


                    <label className="text-sm font-medium">
                        Replace Main Image
                    </label>


                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setMainImage(
                                e.target.files[0]
                            )
                        }
                        className="block w-full text-sm border p-3 rounded-xl"
                    />


                    <label className="text-sm font-medium">
                        Gallery Images
                    </label>


                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) =>
                            setGalleryImages(
                                [...e.target.files]
                            )
                        }
                        className="block w-full text-sm border p-3 rounded-xl"
                    />


                </div>


                {/* ============================
                    VIDEO
                ============================ */}

                <div className="space-y-4 border border-gray-200 rounded-xl p-4">


                    <h3 className="font-semibold text-lg text-[#14213D]">
                        Update Main Video
                    </h3>


                    {/* Existing Video */}

                    {existingVideo && (

                        <div>

                            <label className="text-sm font-medium block mb-2">
                                Current Main Video
                            </label>


                            <video
                                controls
                                className="w-full max-w-xl rounded-xl border"
                            >

                                <source
                                    src={`http://localhost:5000${existingVideo}`}
                                    type="video/mp4"
                                />

                                Your browser does not support video.

                            </video>

                        </div>

                    )}


                    <label className="text-sm font-medium block">
                        Replace Main Video
                    </label>


                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                            setMainVideo(
                                e.target.files[0]
                            )
                        }
                        className="block w-full text-sm border p-3 rounded-xl"
                    />


                    <p className="text-xs text-gray-500">
                        Leave empty to keep the current video.
                    </p>


                </div>


                {/* ============================
                    BUTTON
                ============================ */}

                <div className="flex justify-center">


                    <button
                        type="submit"
                        disabled={updating}
                        className="bg-[#14213D] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#1c2c52] disabled:opacity-50"
                    >

                        {updating
                            ? "Updating..."
                            : "Update Property"
                        }

                    </button>


                </div>


            </form>


        </div>

    );

};


export default EditHotSale;

