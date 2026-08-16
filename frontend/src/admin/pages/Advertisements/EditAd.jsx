import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
    getAdById,
    updateAd
} from "../../api/adApi";

import Loader from "../../components/Loader";

import {
    ArrowLeft,
    Upload,
    X,
    
    Image as ImageIcon
} from "lucide-react";

const EditAd = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const API_URL =
        import.meta.env.VITE_BACKEND_URL ||
        "http://localhost:5000";


    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({

        client_id: "",
        title: "",
        link_url: "",
        position: "sub_pages",
        is_active: "1"

    });

    const [existingImage, setExistingImage] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");


    // =====================================================
    // GET ADVERTISEMENT
    // =====================================================

    useEffect(() => {

        const fetchAd = async () => {

            try {

                setLoading(true);

                const response =
                    await getAdById(id);

                console.log(
                    "GET AD RESPONSE:",
                    response.data
                );

                const ad =
                    response.data?.ad;


                if (!ad) {

                    toast.error(
                        "Advertisement not found"
                    );

                    navigate(
                        "/admin/advertisements"
                    );

                    return;

                }


                // =================================================
                // SET FORM
                // =================================================

                setFormData({

                    client_id:
                        ad.client_id ?? "",

                    title:
                        ad.title ?? "",

                    link_url:
                        ad.link_url ?? "",

                    position:
                        ad.position ||
                        "sub_pages",

                    is_active:
                        String(
                            ad.is_active ?? 1
                        )

                });


                // =================================================
                // EXISTING IMAGE
                // =================================================

                if (ad.image) {

                    const imageUrl =
                        `${API_URL}${ad.image}`;

                    setExistingImage(
                        imageUrl
                    );

                    setImagePreview(
                        imageUrl
                    );

                } else {

                    setExistingImage("");
                    setImagePreview("");

                }


            } catch (error) {

                console.error(
                    "GET AD ERROR:",
                    error
                );

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


    // =====================================================
    // INPUT CHANGE
    // =====================================================

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


    // =====================================================
    // IMAGE CHANGE
    // =====================================================

    const handleImageChange = (e) => {

        const file =
            e.target.files?.[0];


        if (!file) return;


        // =================================================
        // IMAGE TYPE
        // =================================================

        if (!file.type.startsWith("image/")) {

            toast.error(
                "Please select a valid image"
            );

            return;

        }


        // =================================================
        // IMAGE SIZE
        // =================================================

        if (
            file.size >
            10 * 1024 * 1024
        ) {

            toast.error(
                "Image size must be less than 10MB"
            );

            return;

        }


        setImage(file);


        // =================================================
        // PREVIEW
        // =================================================

        const previewUrl =
            URL.createObjectURL(file);

        setImagePreview(
            previewUrl
        );

    };


    // =====================================================
    // REMOVE NEW IMAGE
    // =====================================================

    const removeImage = () => {

        setImage(null);

        setImagePreview(
            existingImage || ""
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


        if (!formData.position) {

            toast.error(
                "Advertisement position is required"
            );

            return;

        }


        try {

            setSaving(true);


            // =================================================
            // FORM DATA
            // =================================================

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


            // =================================================
            // NEW IMAGE
            // =================================================

            if (image) {

                data.append(
                    "image",
                    image
                );

            }


            console.log(
                "UPDATING AD:",
                {
                    id,
                    client_id:
                        formData.client_id,

                    title:
                        formData.title,

                    position:
                        formData.position,

                    is_active:
                        formData.is_active,

                    hasNewImage:
                        !!image
                }
            );


            // =================================================
            // UPDATE API
            // =================================================

            const response =
                await updateAd(
                    id,
                    data
                );


            console.log(
                "UPDATE AD RESPONSE:",
                response.data
            );


            if (
                response.data?.success
            ) {

                toast.success(
                    response.data.message ||
                    "Advertisement updated successfully"
                );

                navigate(
                    "/admin/advertisements"
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


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="
            min-h-screen
            bg-gray-50
            p-4
            sm:p-6
        ">

            <div className="
                max-w-5xl
                mx-auto
            ">


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
                            Edit Advertisement
                        </h1>

                       

                    </div>


                    {/* BACK */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/advertisements"
                            )
                        }
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

                        <ArrowLeft
                            size={18}
                        />

                        Back

                    </button>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="
                        space-y-6
                    "
                >


                    {/* =================================================
                        BASIC DETAILS
                    ================================================= */}

                    <div className="
                        bg-white
                        rounded-2xl
                        shadow-sm
                        border
                        border-gray-200
                        p-5
                        sm:p-7
                    ">

                        <h2 className="
                            text-lg
                            font-semibold
                            text-[#14213D]
                            mb-5
                        ">
                            Advertisement Details
                        </h2>


                        <div className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            gap-4
                        ">


                            {/* CLIENT ID */}

                            <div>

                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-2
                                ">
                                    Client ID
                                </label>

                                <input
                                    type="number"
                                    name="client_id"
                                    value={
                                        formData.client_id
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter client ID"
                                    required
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


                            {/* TITLE */}

                            <div>

                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-2
                                ">
                                    Advertisement Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={
                                        formData.title
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Advertisement title"
                                    maxLength={150}
                                    required
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


                            {/* LINK */}

                            <div className="
                                sm:col-span-2
                            ">

                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-2
                                ">
                                    Link URL
                                </label>

                                <input
                                    type="url"
                                    name="link_url"
                                    value={
                                        formData.link_url
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="https://example.com"
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


                            {/* POSITION */}

                            <div>

                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-2
                                ">
                                    Advertisement Position
                                </label>

                                <select
                                    name="position"
                                    value={
                                        formData.position
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
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

                                    <option value="front_page_top">
                                        Front Page Top
                                    </option>

                                    <option value="front_page_bottom">
                                        Front Page Bottom
                                    </option>

                                    <option value="sub_pages">
                                        Sub Pages
                                    </option>

                                </select>

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
                                    name="is_active"
                                    value={
                                        formData.is_active
                                    }
                                    onChange={
                                        handleChange
                                    }
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

                                    <option value="1">
                                        Active
                                    </option>

                                    <option value="0">
                                        Inactive
                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        IMAGE
                    ================================================= */}

                    <div className="
                        bg-white
                        rounded-2xl
                        shadow-sm
                        border
                        border-gray-200
                        p-5
                        sm:p-7
                    ">

                        <h2 className="
                            text-lg
                            font-semibold
                            text-[#14213D]
                            mb-4
                        ">
                            Advertisement Image
                        </h2>


                        <p className="
                            text-xs
                            text-gray-500
                            mb-4
                        ">
                            Upload a new image only if you want to replace
                            the existing advertisement image.
                        </p>


                        {/* IMAGE PREVIEW */}

                        <div className="
                            w-full
                            min-h-[300px]
                            bg-[#E8EEF9]
                            rounded-xl
                            overflow-hidden
                            flex
                            items-center
                            justify-center
                            relative
                            border
                            border-gray-200
                        ">

                            {imagePreview ? (

                                <img
                                    src={imagePreview}
                                    alt={
                                        formData.title ||
                                        "Advertisement"
                                    }
                                    className="
                                        w-full
                                        max-h-[500px]
                                        object-contain
                                    "
                                    onError={(e) => {

                                        console.error(
                                            "IMAGE LOAD ERROR:",
                                            imagePreview
                                        );

                                        e.currentTarget.style.display =
                                            "none";

                                    }}
                                />

                            ) : (

                                <div className="
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    text-gray-400
                                    py-16
                                ">

                                    <ImageIcon
                                        size={50}
                                    />

                                    <p className="
                                        mt-3
                                        text-sm
                                    ">
                                        No advertisement image
                                    </p>

                                </div>

                            )}


                            {/* REMOVE NEW IMAGE */}

                            {image && (

                                <button
                                    type="button"
                                    onClick={
                                        removeImage
                                    }
                                    className="
                                        absolute
                                        top-3
                                        right-3
                                        bg-red-500
                                        hover:bg-red-600
                                        text-white
                                        rounded-full
                                        p-2
                                        shadow
                                    "
                                    title="Remove new image"
                                >

                                    <X size={18} />

                                </button>

                            )}

                        </div>


                        {/* UPLOAD */}

                        <div className="mt-4">

                            <label className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                bg-[#FBBF24]
                                hover:bg-[#14213D]
                                hover:text-white
                                text-[#14213D]
                                font-semibold
                                px-5
                                py-3
                                rounded-xl
                                cursor-pointer
                                transition
                            ">

                                <Upload
                                    size={18}
                                />

                                {image
                                    ? "Change Image"
                                    : "Upload New Image"
                                }

                                <input
                                    type="file"
                                    accept="
                                        image/jpeg,
                                        image/png,
                                        image/webp
                                    "
                                    onChange={
                                        handleImageChange
                                    }
                                    className="hidden"
                                />

                            </label>


                            <p className="
                                text-xs
                                text-gray-500
                                mt-2
                            ">
                                JPG, PNG or WebP • Maximum 10MB
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        STATUS INFORMATION
                    ================================================= */}

                    <div className="
                        bg-white
                        rounded-2xl
                        shadow-sm
                        border
                        border-gray-200
                        p-5
                        sm:p-7
                    ">

                        <h2 className="
                            text-lg
                            font-semibold
                            text-[#14213D]
                            mb-4
                        ">
                            Advertisement Status
                        </h2>


                        <div className="
                            bg-[#E8EEF9]
                            rounded-xl
                            p-4
                            flex
                            flex-col
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            gap-3
                        ">

                            <div>

                                <p className="
                                    text-sm
                                    text-gray-500
                                ">
                                    Current Status
                                </p>

                                <p className="
                                    font-semibold
                                    text-[#14213D]
                                    mt-1
                                ">

                                    {Number(
                                        formData.is_active
                                    ) === 1
                                        ? "Advertisement is Active"
                                        : "Advertisement is Inactive"
                                    }

                                </p>

                            </div>


                            <span className={`
                                inline-flex
                                w-fit
                                px-3
                                py-1
                                rounded-full
                                text-sm
                                font-semibold
                                ${
                                    Number(
                                        formData.is_active
                                    ) === 1
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }
                            `}>

                                {Number(
                                    formData.is_active
                                ) === 1
                                    ? "Active"
                                    : "Inactive"}

                            </span>

                        </div>

                    </div>


                    {/* =================================================
                        ACTION BUTTONS
                    ================================================= */}

                    <div className="
                        bg-white
                        rounded-2xl
                        shadow-sm
                        border
                        border-gray-200
                        p-5
                        flex
                        flex-col-reverse
                        sm:flex-row
                        sm:justify-end
                        gap-3
                    ">


                        {/* CANCEL */}

                        <button
                            type="button"
                            disabled={saving}
                            onClick={() =>
                                navigate(
                                    "/admin/advertisements"
                                )
                            }
                            className="
                                flex
                                items-center
                                justify-center
                                gap-2
                                px-6
                                py-3
                                rounded-xl
                                border
                                border-gray-300
                                text-gray-700
                                hover:bg-gray-50
                                transition
                                disabled:opacity-50
                            "
                        >

                           

                            Cancel

                        </button>


                        {/* UPDATE */}

                        <button
                            type="submit"
                            disabled={saving}
                            className="
                                flex
                                items-center
                                justify-center
                                gap-2
                                bg-[#14213D]
                                hover:bg-[#1c2c52]
                                text-white
                                px-8
                                py-3
                                rounded-xl
                                font-semibold
                                transition
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
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