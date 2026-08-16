import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import { toast } from "react-toastify";

import {
    getWantedById,
    updateWanted
} from "../../api/wantedApi";

import { cityOptions } from "../../data/propertyOption";
import Loader from "../../components/Loader";

const EditWanted = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // =====================================================
    // FORM
    // =====================================================

    const [form, setForm] = useState({
        title: "",
        description: "",
        budget: "",
        preferred_city: "",
        phone_number: "",
        status: "pending"
    });

    // =====================================================
    // NEW IMAGES
    // =====================================================

    const [mainImage, setMainImage] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);

    // =====================================================
    // EXISTING IMAGES
    // =====================================================

    const [existingMainImage, setExistingMainImage] = useState(null);
    const [existingGalleryImages, setExistingGalleryImages] = useState([]);


    // =====================================================
    // IMAGE URL
    // =====================================================

    const getImageUrl = (image, imageType) => {

        if (!image) {
            return null;
        }

        // MySQL Buffer
        if (
            image.type === "Buffer" &&
            Array.isArray(image.data)
        ) {

            const bytes = new Uint8Array(image.data);

            let binary = "";

            bytes.forEach((byte) => {
                binary += String.fromCharCode(byte);
            });

            return `data:${imageType || "image/jpeg"};base64,${btoa(binary)}`;
        }

        // String URL
        if (typeof image === "string") {
            return image;
        }

        return null;
    };


    // =====================================================
    // LOAD WANTED PROPERTY
    // =====================================================

    useEffect(() => {

        const loadProperty = async () => {

            try {

                setLoading(true);

                const res = await getWantedById(id);

                const data = res.data.data;

                console.log("Wanted Property:", data);


                // =================================================
                // FORM DATA
                // =================================================

                setForm({
                    title: data.title || "",
                    description: data.description || "",
                    budget: data.budget || "",
                    preferred_city: data.preferred_city || "",
                    phone_number: data.phone_number || "",
                    status: data.status || "pending"
                });


                // =================================================
                // MAIN IMAGE
                // =================================================

                if (data.main_image) {

                    const imageUrl = getImageUrl(
                        data.main_image,
                        data.main_image_type
                    );

                    setExistingMainImage(imageUrl);

                } else {

                    setExistingMainImage(null);

                }


                // =================================================
                // GALLERY
                // =================================================

                if (Array.isArray(data.images)) {

                    const gallery = data.images
                        .map((image) => {

                            const imageUrl = getImageUrl(
                                image.image,
                                image.image_type
                            );

                            return {
                                id: image.id,
                                url: imageUrl
                            };

                        })
                        .filter((image) => image.url);

                    setExistingGalleryImages(gallery);

                } else {

                    setExistingGalleryImages([]);

                }

            } catch (error) {

                console.error(
                    "Load Wanted Property Error:",
                    error
                );

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to load wanted property"
                );

            } finally {

                setLoading(false);

            }

        };

        if (id) {
            loadProperty();
        }

    }, [id]);


    // =====================================================
    // HANDLE CHANGE
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
    // MAIN IMAGE CHANGE
    // =====================================================

    const handleMainImageChange = (e) => {

        const file = e.target.files?.[0];

        if (!file) {
            return;
        }


        if (!file.type.startsWith("image/")) {

            toast.error(
                "Please select a valid image"
            );

            return;
        }


        if (file.size > 10 * 1024 * 1024) {

            toast.error(
                "Main image must be less than 10MB"
            );

            return;
        }


        setMainImage(file);

    };


    // =====================================================
    // GALLERY CHANGE
    // =====================================================

    const handleGalleryChange = (e) => {

        const files = Array.from(
            e.target.files || []
        );


        const validImages = files.filter(
            (file) =>
                file.type.startsWith("image/")
        );


        if (validImages.length !== files.length) {

            toast.error(
                "Only image files are allowed"
            );

        }


        const validSizeImages = validImages.filter(
            (file) =>
                file.size <= 10 * 1024 * 1024
        );


        if (
            validSizeImages.length !==
            validImages.length
        ) {

            toast.error(
                "Each image must be less than 10MB"
            );

        }


        setGalleryImages(validSizeImages);

    };


    // =====================================================
    // REMOVE NEW MAIN IMAGE
    // =====================================================

    const removeMainImage = () => {

        setMainImage(null);

    };


    // =====================================================
    // REMOVE NEW GALLERY IMAGE
    // =====================================================

    const removeSelectedGalleryImage = (index) => {

        setGalleryImages((prev) =>
            prev.filter(
                (_, i) => i !== index
            )
        );

    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // =================================================
        // VALIDATION
        // =================================================

        if (!form.title.trim()) {

            toast.error(
                "Title is required"
            );

            return;
        }


        if (!form.phone_number.trim()) {

            toast.error(
                "Phone number is required"
            );

            return;
        }


        try {

            setUpdating(true);


            const data = new FormData();


            // =================================================
            // BASIC DATA
            // =================================================

            data.append(
                "title",
                form.title.trim()
            );


            data.append(
                "description",
                form.description
            );


            data.append(
                "budget",
                form.budget
            );


            data.append(
                "preferred_city",
                form.preferred_city
            );


            data.append(
                "phone_number",
                form.phone_number
            );


            data.append(
                "status",
                form.status
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
            // GALLERY
            // =================================================

            galleryImages.forEach(
                (image) => {

                    data.append(
                        "images",
                        image
                    );

                }
            );


            // =================================================
            // UPDATE
            // =================================================

            const response =
                await updateWanted(
                    id,
                    data
                );


            console.log(
                "UPDATE WANTED RESPONSE:",
                response.data
            );


            toast.success(
                response?.data?.message ||
                "Wanted property updated successfully"
            );


            navigate(
                "/admin/wanted"
            );


        } catch (error) {

            console.error(
                "Update Wanted Error:",
                error
            );

            console.error(
                "Server Response:",
                error?.response?.data
            );


            toast.error(
                error?.response?.data?.message ||
                "Failed to update wanted property"
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
    // UI
    // =====================================================

    return (

        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">

            <div className="max-w-5xl mx-auto">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-4
                    mb-6
                ">

                    <div>

                        <h1 className="
                            text-2xl
                            sm:text-3xl
                            font-bold
                            text-[#14213D]
                        ">
                            Edit Wanted Property
                        </h1>

                        

                    </div>


                    <Link
                        to="/admin/wanted"
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            bg-gray-600
                            hover:bg-gray-700
                            text-white
                            px-4
                            py-2.5
                            rounded-xl
                            transition
                        "
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
                    className="
                        bg-white
                        rounded-2xl
                        shadow-sm
                        border
                        border-gray-200
                        p-5
                        sm:p-7
                        space-y-6
                    "
                >


                    {/* =================================================
                        BASIC DETAILS
                    ================================================= */}

                    <div>

                        <h2 className="
                            text-lg
                            font-semibold
                            text-[#14213D]
                            mb-4
                        ">
                            Basic Details
                        </h2>


                        <div className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            gap-4
                        ">


                            {/* TITLE */}

                            <div>

                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-2
                                ">
                                    Property Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Wanted property title"
                                    className="
                                        w-full
                                        border
                                        border-gray-300
                                        p-3
                                        rounded-xl
                                        text-sm
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-[#FCA311]
                                    "
                                />

                            </div>


                            {/* BUDGET */}

                            <div>

                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-2
                                ">
                                    Budget (Rs)
                                </label>

                                <input
                                    type="number"
                                    name="budget"
                                    value={form.budget}
                                    onChange={handleChange}
                                    placeholder="Enter budget"
                                    min="0"
                                    className="
                                        w-full
                                        border
                                        border-gray-300
                                        p-3
                                        rounded-xl
                                        text-sm
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-[#FCA311]
                                    "
                                />

                            </div>


                            {/* CITY */}

                            <div>

                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-2
                                ">
                                    Preferred City
                                </label>

                                <select
                                    name="preferred_city"
                                    value={form.preferred_city}
                                    onChange={handleChange}
                                    className="
                                        w-full
                                        h-12
                                        px-4
                                        rounded-xl
                                        border
                                        border-gray-300
                                        text-sm
                                        outline-none
                                        focus:ring-2
                                        focus:ring-[#FCA311]
                                    "
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


                            {/* PHONE */}

                            <div>

                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-2
                                ">
                                    Phone Number
                                </label>

                                <input
                                    type="text"
                                    name="phone_number"
                                    value={form.phone_number}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    className="
                                        w-full
                                        border
                                        border-gray-300
                                        p-3
                                        rounded-xl
                                        text-sm
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-[#FCA311]
                                    "
                                />

                            </div>


                            {/* STATUS */}

                            <div>

                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-2
                                ">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="
                                        w-full
                                        h-12
                                        px-4
                                        rounded-xl
                                        border
                                        border-gray-300
                                        text-sm
                                        outline-none
                                        focus:ring-2
                                        focus:ring-[#FCA311]
                                    "
                                >

                                    <option value="pending">
                                        Pending
                                    </option>

                                    <option value="active">
                                        Active
                                    </option>

                                    <option value="closed">
                                        Closed
                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    <div>
                        <label className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-2
                                ">
                                    Description
                                </label>


                        
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Enter wanted property description..."
                            className="
                                w-full
                                border
                                border-gray-300
                                p-3
                                rounded-xl
                                text-sm
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[#FCA311]
                            "
                        />

                    </div>

{/* =================================================
    IMAGES
================================================= */}

<div className="space-y-3 border border-gray-200 rounded-xl p-4">

    <h3 className="font-semibold text-lg text-[#14213D]">
        Update Images
    </h3>




    {/* ============================
        NEW MAIN IMAGE
    ============================ */}

    <div>

        <label className="text-sm font-medium block mb-2">
            New Main Image
        </label>

        <input
            type="file"
            accept="image/*"
            onChange={handleMainImageChange}
            className="
                block
                w-full
                text-sm
                border
                border-gray-300
                p-3
                rounded-xl
                cursor-pointer
            "
        />

    </div>


  


    {/* ============================
        EXISTING GALLERY
    ============================ */}

    {existingGalleryImages.length > 0 && (

        <div className="mt-5">

            <p className="text-sm font-medium text-gray-700 mb-3">
                Current Gallery Images (
                {existingGalleryImages.length}
                )
            </p>

            <div className="
                grid
                grid-cols-2
                sm:grid-cols-3
                lg:grid-cols-4
                gap-4
            ">

                {existingGalleryImages.map(
                    (image) => (

                        <div
                            key={image.id}
                            className="
                                bg-gray-50
                                rounded-xl
                                overflow-hidden
                                border
                                border-gray-200
                            "
                        >

                            <img
                                src={image.url}
                                alt="Gallery"
                                className="
                                    w-full
                                    h-32
                                    object-cover
                                "
                            />

                        </div>

                    )
                )}

            </div>

        </div>

    )}


    {/* ============================
        NEW GALLERY
    ============================ */}

    <div className="mt-5">

        <label className="text-sm font-medium block mb-2">
            Add New Gallery Images
        </label>

        <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleGalleryChange}
            className="
                block
                w-full
                text-sm
                border
                border-gray-300
                p-3
                rounded-xl
                cursor-pointer
            "
        />

    </div>



</div>




                    {/* =================================================
                        BUTTONS
                    ================================================= */}

                    <div className="
                        flex
                        flex-col
                        sm:flex-row
                        justify-end
                        gap-3
                        pt-2
                    ">

                        <button
                            type="button"
                            disabled={updating}
                            onClick={() =>
                                navigate(
                                    "/admin/wanted"
                                )
                            }
                            className="
                                px-6
                                py-3
                                rounded-xl
                                border
                                border-gray-300
                                text-gray-700
                                hover:bg-gray-50
                                disabled:opacity-50
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={updating}
                            className="
                                flex
                                items-center
                                justify-center
                                gap-2
                                bg-[#14213D]
                                text-white
                                px-8
                                py-3
                                rounded-xl
                                font-semibold
                                hover:bg-[#1c2c52]
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
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

export default EditWanted;