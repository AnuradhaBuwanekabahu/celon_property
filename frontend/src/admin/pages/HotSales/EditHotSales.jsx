
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { ArrowLeft } from "lucide-react";


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

        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-5xl mx-auto">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                        <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D]">
                            Edit Hot Sales
                        </h1>

                        <Link
                        to="/admin/hot-sales"
                        className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-xl"
                    >
                        <ArrowLeft size={18} />
                        Back
                    </Link>

                </div>


            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-7 space-y-6"
            >


                {/* ============================
                    BASIC DETAILS
                ============================ */}

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
                        className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                    />
                    </div>

                    <div>

                        <label className="block text-sm font-medium text-[#14213D] mb-2">

                    Price

                    </label>


                    <input
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="Price (RS)"
                        className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                    />

                    </div>


                </div>

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


                {/* ============================
                    PROPERTY TYPE / CITY
                ============================ */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>
                        <label className="block text-sm font-medium text-[#14213D] mb-2">

                    Proprty_type

                    </label>


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

                    </div>

                    <div>

                        <label className="block text-sm font-medium text-[#14213D] mb-2">

                    City

                    </label>


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


                </div>


                {/* ============================
                    STATUS / RATE / DURATION
                ============================ */}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

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

                    <div>
                        <label className="block text-sm font-medium text-[#14213D] mb-2">

                    Rate

                    </label>


                    <input
                        type="number"
                        name="rate"
                        value={form.rate}
                        onChange={handleChange}
                        placeholder="Rate"
                        className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                    />

                    </div>

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


                {/* ============================
                    OVERVIEW
                ============================ */}

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
                        className="bg-[#FBBF24] hover:bg-[#d3a120] px-4 py-2 rounded-xl text-sm font-medium w-full sm:w-auto"
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


              


                    <label className="text-sm font-medium block mb-2">
                        New Main Image
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


                    <label className="text-sm font-medium block mb-2">
                       Add New Gallery Images
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


                


                    <label className="text-sm font-medium block mb-2">
                        New Main Video
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


                   


                </div>


                {/* ============================
                    BUTTON
                ============================ */}

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">

                      <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/hot-sales"
                                )
                            }
                            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>


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


            </div>


        

    );

};


export default EditHotSale;

