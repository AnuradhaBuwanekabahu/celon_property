import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

    const [form, setForm] = useState({
        title: "",
        description: "",
        budget: "",
        preferred_city: "",
        phone_number: "",
        status: "pending"
    });

    // New images
    const [mainImage, setMainImage] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);

    // Existing images
    const [existingMainImage, setExistingMainImage] = useState(null);
    const [existingGalleryImages, setExistingGalleryImages] = useState([]);

    // =====================================================
    // Convert MySQL Buffer to Image URL
    // =====================================================

    const getImageUrl = (image, imageType) => {

        if (!image) {
            return null;
        }

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

        if (typeof image === "string") {
            return image;
        }

        return null;
    };

    // =====================================================
    // Load Wanted Property
    // =====================================================

    useEffect(() => {
        loadProperty();
    }, [id]);

    const loadProperty = async () => {

        try {

            setLoading(true);

            const res = await getWantedById(id);

            const data = res.data.data;

            console.log("Wanted Property:", data);

            // -----------------------------
            // Form
            // -----------------------------

            setForm({
                title: data.title || "",
                description: data.description || "",
                budget: data.budget || "",
                preferred_city: data.preferred_city || "",
                phone_number: data.phone_number || "",
                status: data.status || "pending"
            });

            // -----------------------------
            // Main image
            // -----------------------------

            if (data.main_image) {

                const imageUrl = getImageUrl(
                    data.main_image,
                    data.main_image_type
                );

                setExistingMainImage(imageUrl);

            } else {

                setExistingMainImage(null);

            }

            // -----------------------------
            // Gallery images
            // -----------------------------

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

    // =====================================================
    // Handle Form Change
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
    // Main Image
    // =====================================================

    const handleMainImageChange = (e) => {

        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {

            toast.error("Please select an image");

            return;
        }

        setMainImage(file);

    };

    // =====================================================
    // Gallery Images
    // =====================================================

    const handleGalleryChange = (e) => {

        const files = Array.from(
            e.target.files || []
        );

        const validImages = files.filter(
            (file) => file.type.startsWith("image/")
        );

        if (validImages.length !== files.length) {

            toast.error(
                "Only image files are allowed"
            );

        }

        setGalleryImages(validImages);

    };

    // =====================================================
    // Remove Selected Gallery Image
    // =====================================================

    const removeSelectedGalleryImage = (index) => {

        setGalleryImages((prev) =>
            prev.filter((_, i) => i !== index)
        );

    };

    // =====================================================
    // Submit
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!form.title.trim()) {

            toast.error("Title is required");

            return;
        }

        if (!form.phone_number.trim()) {

            toast.error("Phone number is required");

            return;
        }

        try {

            setUpdating(true);

            const data = new FormData();

            // -----------------------------
            // Text fields
            // -----------------------------

            data.append(
                "title",
                form.title
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

            // -----------------------------
            // Main image
            // -----------------------------

            if (mainImage) {

                data.append(
                    "main_image",
                    mainImage
                );

            }

            // -----------------------------
            // Gallery images
            // -----------------------------

            galleryImages.forEach((image) => {

                data.append(
                    "images",
                    image
                );

            });

            // -----------------------------
            // API request
            // -----------------------------

            await updateWanted(
                id,
                data
            );

            toast.success(
                "Wanted property updated successfully"
            );

            navigate("/admin-portal/wanted");

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
    // Page
    // =====================================================

    return (

        <div className="space-y-6">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex justify-between items-center">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Edit Wanted Property
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Update wanted property request
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >

                    <ArrowLeft size={18} />

                    Back

                </button>

            </div>


            {/* =================================================
                FORM
            ================================================= */}

            <form
                onSubmit={handleSubmit}
                className="bg-white shadow rounded-xl p-6 space-y-6"
            >

                {/* =================================================
                    BASIC INFORMATION
                ================================================= */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* TITLE */}

                    <div>

                        <label className="block mb-2 font-medium text-gray-700">
                            Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Enter wanted property title"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* BUDGET */}

                    <div>

                        <label className="block mb-2 font-medium text-gray-700">
                            Budget
                        </label>

                        <input
                            type="number"
                            name="budget"
                            value={form.budget}
                            onChange={handleChange}
                            placeholder="Enter budget"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* CITY */}

                    <div>

                        <label className="block mb-2 font-medium text-gray-700">
                            Preferred City
                        </label>

                        <select
                            name="preferred_city"
                            value={form.preferred_city}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >

                            <option value="">
                                Select City
                            </option>

                            {cityOptions.map((city) => (

                                <option
                                    key={city}
                                    value={city}
                                >
                                    {city}
                                </option>

                            ))}

                        </select>

                    </div>


                    {/* PHONE */}

                    <div>

                        <label className="block mb-2 font-medium text-gray-700">
                            Phone Number
                        </label>

                        <input
                            type="text"
                            name="phone_number"
                            value={form.phone_number}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* STATUS */}

                    <div>

                        <label className="block mb-2 font-medium text-gray-700">
                            Status
                        </label>

                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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


                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                <div>

                    <label className="block mb-2 font-medium text-gray-700">
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Enter wanted property description"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>


                {/* =================================================
                    CURRENT MAIN IMAGE
                ================================================= */}

                <div>

                    <label className="block mb-3 font-medium text-gray-700">
                        Current Main Image
                    </label>

                    {existingMainImage ? (

                        <img
                            src={existingMainImage}
                            alt="Current Main"
                            className="w-72 h-44 object-cover rounded-lg border"
                        />

                    ) : (

                        <div className="w-72 h-44 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                            No Main Image
                        </div>

                    )}

                </div>


                {/* =================================================
                    REPLACE MAIN IMAGE
                ================================================= */}

                <div>

                    <label className="block mb-3 font-medium text-gray-700">
                        Replace Main Image
                    </label>

                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">

                        <Upload
                            size={28}
                            className="text-gray-400 mb-2"
                        />

                        <span className="text-sm text-gray-500">
                            Click to select a new main image
                        </span>

                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handleMainImageChange}
                        />

                    </label>

                    {mainImage && (

                        <div className="mt-3">

                            <p className="text-sm text-green-600">
                                New image selected:
                            </p>

                            <p className="text-sm text-gray-600">
                                {mainImage.name}
                            </p>

                        </div>

                    )}

                </div>


                {/* =================================================
                    CURRENT GALLERY
                ================================================= */}

                {existingGalleryImages.length > 0 && (

                    <div>

                        <label className="block mb-3 font-medium text-gray-700">
                            Current Gallery Images
                        </label>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                            {existingGalleryImages.map((image) => (

                                <div
                                    key={image.id}
                                    className="relative"
                                >

                                    <img
                                        src={image.url}
                                        alt="Gallery"
                                        className="w-full h-28 object-cover rounded-lg border"
                                    />

                                </div>

                            ))}

                        </div>

                    </div>

                )}


                {/* =================================================
                    ADD GALLERY IMAGES
                ================================================= */}

                <div>

                    <label className="block mb-3 font-medium text-gray-700">
                        Add Gallery Images
                    </label>

                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">

                        <Upload
                            size={28}
                            className="text-gray-400 mb-2"
                        />

                        <span className="text-sm text-gray-500">
                            Click to select gallery images
                        </span>

                        <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handleGalleryChange}
                        />

                    </label>


                    {/* Selected Gallery Images */}

                    {galleryImages.length > 0 && (

                        <div className="mt-4">

                            <p className="text-sm font-medium text-gray-700 mb-3">
                                New Gallery Images ({galleryImages.length})
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                                {galleryImages.map(
                                    (image, index) => {

                                        const previewUrl =
                                            URL.createObjectURL(
                                                image
                                            );

                                        return (

                                            <div
                                                key={`${image.name}-${index}`}
                                                className="relative"
                                            >

                                                <img
                                                    src={previewUrl}
                                                    alt={image.name}
                                                    className="w-full h-28 object-cover rounded-lg border"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeSelectedGalleryImage(
                                                            index
                                                        )
                                                    }
                                                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
                                                >

                                                    <X size={14} />

                                                </button>

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        </div>

                    )}

                </div>


                {/* =================================================
                    BUTTONS
                ================================================= */}

                <div className="flex gap-3 pt-4">

                    <button
                        type="button"
                        disabled={updating}
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={updating}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg"
                    >

                        <Upload size={18} />

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

export default EditWanted;