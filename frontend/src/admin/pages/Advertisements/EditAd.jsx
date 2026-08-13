
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Upload, X } from "lucide-react";


import {
    getAdById,
    updateAd
} from "../../api/adApi";
import Loader from "../../components/Loader";

const EditAd = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const API_URL =
        import.meta.env.VITE_BACKEND_URL ||
        "http://localhost:5000";


    // =======================================================
    // STATE
    // =======================================================

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        client_id: "",
        title: "",
        link_url: "",
        position: 0,
        is_active: 1
    });

    const [existingImage, setExistingImage] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");


    // =======================================================
    // GET AD BY ID
    // =======================================================

    useEffect(() => {

    const fetchAd = async () => {

        try {

            setLoading(true);

            const response = await getAdById(id);

            console.log("GET AD RESPONSE:", response.data);

            const ad = response.data?.ad;

            if (!ad) {
                toast.error("Advertisement not found");
                navigate("/admin-portal/advertisements");
                return;
            }

            setFormData({
                client_id: ad.client_id ?? "",
                title: ad.title ?? "",
                link_url: ad.link_url ?? "",
                position: ad.position ?? 0,
                is_active: ad.is_active ?? 1
            });

            if (ad.image) {

                const imageUrl = `${API_URL}${ad.image}`;

                setExistingImage(imageUrl);
                setImagePreview(imageUrl);

            }

        } catch (error) {

            console.error("GET AD ERROR:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load advertisement"
            );

        } finally {

            setLoading(false);

        }

    };

    if (id) {
        fetchAd();
    }

}, [id, navigate]);

    // =======================================================
    // HANDLE INPUT
    // =======================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData((prev) => ({

            ...prev,

            [name]: value

        }));

    };


    // =======================================================
    // IMAGE CHANGE
    // =======================================================

    const handleImageChange = (e) => {

        const file =
            e.target.files?.[0];


        if (!file) return;


        // ===================================================
        // IMAGE TYPE
        // ===================================================

        if (!file.type.startsWith("image/")) {

            toast.error(
                "Please select a valid image"
            );

            return;

        }


        // ===================================================
        // IMAGE SIZE
        // ===================================================

        if (file.size > 10 * 1024 * 1024) {

            toast.error(
                "Image size must be less than 10MB"
            );

            return;

        }


        setImage(file);


        // ===================================================
        // PREVIEW
        // ===================================================

        const previewUrl =
            URL.createObjectURL(file);

        setImagePreview(previewUrl);

    };


    // =======================================================
    // REMOVE NEW IMAGE
    // =======================================================

    const removeImage = () => {

        setImage(null);

        setImagePreview(
            existingImage || ""
        );

    };


    // =======================================================
    // SUBMIT
    // =======================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // ===================================================
        // VALIDATION
        // ===================================================

        if (!formData.client_id) {

            toast.error(
                "Client ID is required"
            );

            return;

        }


        if (!formData.title.trim()) {

            toast.error(
                "Advertisement title is required"
            );

            return;

        }


        try {

            setSaving(true);


            // ===================================================
            // FORM DATA
            // ===================================================

            const data =
                new FormData();


            data.append(
                "client_id",
                formData.client_id
            );


            data.append(
                "title",
                formData.title.trim()
            );


            data.append(
                "link_url",
                formData.link_url.trim()
            );


            data.append(
                "position",
                formData.position
            );


            data.append(
                "is_active",
                formData.is_active
            );


            // ===================================================
            // NEW IMAGE
            // ===================================================

            if (image) {

                data.append(
                    "image",
                    image
                );

            }


            // ===================================================
            // UPDATE
            // ===================================================

            const response =
                await updateAd(
                    id,
                    data
                );


            console.log(
                "UPDATE AD RESPONSE:",
                response.data
            );


            if (response.data?.success) {

                toast.success(
                    response.data.message ||
                    "Advertisement updated successfully"
                );

                navigate(
                    `/admin-portal/advertisements`
                );

            } else {

                toast.error(
                    response.data?.message ||
                    "Advertisement update failed"
                );

            }


        } catch (error) {

            console.error(
                "UPDATE AD ERROR:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Failed to update advertisement"
            );

        } finally {

            setSaving(false);

        }

    };


     // =====================================================
       // LOADING
       // =====================================================
   
       if (loading) {
   
           return <Loader />;
   
       }


    // =======================================================
    // PAGE
    // =======================================================

    return (

        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-4xl mx-auto">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="flex items-center
                                justify-between mb-6">

                    <div>

                        <h1 className="text-2xl font-bold text-gray-800">
                            Edit Advertisement
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Update advertisement details
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin-portal/advertisements"
                            )
                        }
                        className="flex items-center gap-2
                                   px-4 py-2
                                   bg-white
                                   border border-gray-300
                                   rounded-lg
                                   hover:bg-gray-50"
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
                    className="bg-white
                               rounded-xl
                               shadow-sm
                               p-6"
                >


                    {/* =================================================
                        CLIENT ID
                    ================================================= */}

                    <div className="mb-5">

                        <label
                            className="block text-sm
                                       font-medium
                                       text-gray-700 mb-2"
                        >
                            Client ID
                        </label>


                        <input
                            type="number"
                            name="client_id"
                            value={formData.client_id}
                            onChange={handleChange}
                            placeholder="Enter client ID"
                            required
                            className="w-full
                                       border border-gray-300
                                       rounded-lg
                                       px-4 py-3
                                       focus:outline-none
                                       focus:ring-2
                                       focus:ring-blue-500"
                        />

                    </div>


                    {/* =================================================
                        TITLE
                    ================================================= */}

                    <div className="mb-5">

                        <label
                            className="block text-sm
                                       font-medium
                                       text-gray-700 mb-2"
                        >
                            Advertisement Title
                        </label>


                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter advertisement title"
                            maxLength={150}
                            required
                            className="w-full
                                       border border-gray-300
                                       rounded-lg
                                       px-4 py-3
                                       focus:outline-none
                                       focus:ring-2
                                       focus:ring-blue-500"
                        />

                    </div>


                    {/* =================================================
                        LINK
                    ================================================= */}

                    <div className="mb-5">

                        <label
                            className="block text-sm
                                       font-medium
                                       text-gray-700 mb-2"
                        >
                            Link URL
                        </label>


                        <input
                            type="url"
                            name="link_url"
                            value={formData.link_url}
                            onChange={handleChange}
                            placeholder="https://example.com"
                            className="w-full
                                       border border-gray-300
                                       rounded-lg
                                       px-4 py-3
                                       focus:outline-none
                                       focus:ring-2
                                       focus:ring-blue-500"
                        />

                    </div>


                    {/* =================================================
                        POSITION
                    ================================================= */}

                    <div className="mb-5">

                        <label
                            className="block text-sm
                                       font-medium
                                       text-gray-700 mb-2"
                        >
                            Position
                        </label>


                        <input
                            type="number"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            min="0"
                            className="w-full
                                       border border-gray-300
                                       rounded-lg
                                       px-4 py-3
                                       focus:outline-none
                                       focus:ring-2
                                       focus:ring-blue-500"
                        />

                    </div>


                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <div className="mb-6">

                        <label
                            className="block text-sm
                                       font-medium
                                       text-gray-700 mb-2"
                        >
                            Status
                        </label>


                        <select
                            name="is_active"
                            value={formData.is_active}
                            onChange={handleChange}
                            className="w-full
                                       border border-gray-300
                                       rounded-lg
                                       px-4 py-3
                                       focus:outline-none
                                       focus:ring-2
                                       focus:ring-blue-500"
                        >

                            <option value="1">
                                Active
                            </option>

                            <option value="0">
                                Inactive
                            </option>

                        </select>

                    </div>


                    {/* =================================================
                        IMAGE
                    ================================================= */}

                    <div className="mb-6">

                        <label
                            className="block text-sm
                                       font-medium
                                       text-gray-700 mb-2"
                        >
                            Advertisement Image
                        </label>


                        {imagePreview ? (

                            <div className="relative
                                            w-full
                                            max-w-xl">

                                <img
                                    src={imagePreview}
                                    alt={
                                        formData.title ||
                                        "Advertisement"
                                    }
                                    className="w-full
                                               h-64
                                               object-contain
                                               border
                                               border-gray-300
                                               rounded-lg
                                               bg-gray-50"
                                    onError={(e) => {

                                        console.error(
                                            "IMAGE LOAD ERROR:",
                                            imagePreview
                                        );

                                        e.currentTarget.style.display =
                                            "none";

                                    }}
                                />


                                {image && (

                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute
                                                   top-2
                                                   right-2
                                                   bg-red-500
                                                   text-white
                                                   rounded-full
                                                   p-2
                                                   hover:bg-red-600"
                                    >

                                        <X size={18} />

                                    </button>

                                )}

                            </div>

                        ) : (

                            <div className="border
                                            border-dashed
                                            border-gray-300
                                            rounded-lg
                                            p-10
                                            text-center">

                                <Upload
                                    size={40}
                                    className="mx-auto
                                               text-gray-400"
                                />

                                <p className="mt-2 text-gray-500">
                                    No advertisement image
                                </p>

                            </div>

                        )}


                        {/* =================================================
                            UPLOAD
                        ================================================= */}

                        <div className="mt-4">

                            <label
                                className="inline-flex
                                           items-center
                                           gap-2
                                           px-4 py-2
                                           bg-gray-100
                                           border
                                           border-gray-300
                                           rounded-lg
                                           cursor-pointer
                                           hover:bg-gray-200"
                            >

                                <Upload size={18} />

                                {image
                                    ? "Change Image"
                                    : "Upload New Image"
                                }


                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />

                            </label>


                            <p className="text-xs text-gray-500 mt-2">
                                JPG, PNG or WebP. Maximum 10MB.
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        BUTTONS
                    ================================================= */}

                    <div className="flex justify-end gap-3
                                    border-t pt-5">

                        <button
                            type="button"
                            disabled={saving}
                            onClick={() =>
                                navigate(
                                    "/admin-portal/advertisements"
                                )
                            }
                            className="px-5 py-2.5
                                       border border-gray-300
                                       rounded-lg
                                       hover:bg-gray-50
                                       disabled:opacity-50"
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2.5
                                       bg-blue-600
                                       text-white
                                       rounded-lg
                                       hover:bg-blue-700
                                       disabled:opacity-50
                                       disabled:cursor-not-allowed"
                        >

                            {saving
                                ? "Updating..."
                                : "Update Advertisement"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};

export default EditAd;

