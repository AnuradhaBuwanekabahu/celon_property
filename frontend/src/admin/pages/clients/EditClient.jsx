
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    User,
    Upload
} from "lucide-react";
import { toast } from "react-toastify";

import {
    getClientById,
    updateClient
} from "../../api/clientApi";
import Loader from "../../components/Loader";



const EditClient = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [client, setClient] = useState(null);

    const [form, setForm] = useState({
        full_name: "",
        email: "",
        phone_number: "",
        whatsapp_number: "",
        password: ""
    });

    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);


    // =====================================================
    // LOAD CLIENT
    // =====================================================

    const loadClient = async () => {

        try {

            setLoading(true);

            const res = await getClientById(id);

            if (!res.data?.success) {

                toast.error(
                    res.data?.message ||
                    "Client not found"
                );

                return;
            }

            const data = res.data.client;

            setClient(data);

            setForm({
                full_name: data.full_name || "",
                email: data.email || "",
                phone_number: data.phone_number || "",
                whatsapp_number: data.whatsapp_number || "",
                password: ""
            });

            // Existing avatar

            if (data.avatar) {

                setAvatarPreview(
                    `http://localhost:5000/api/clients/${id}/avatar`
                );

            } else {

                setAvatarPreview(null);

            }

        } catch (error) {

            console.error(
                "LOAD CLIENT ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed loading client"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadClient();

    }, [id]);


    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));

    };


    // =====================================================
    // AVATAR CHANGE
    // =====================================================

    const handleAvatarChange = (e) => {

        const file = e.target.files?.[0];

        if (!file) return;


        // Check image

        if (!file.type.startsWith("image/")) {

            toast.error(
                "Please select an image file"
            );

            return;

        }


        // 5MB frontend validation

        if (file.size > 5 * 1024 * 1024) {

            toast.error(
                "Avatar must be less than 5MB"
            );

            return;

        }


        setAvatar(file);

        setAvatarPreview(
            URL.createObjectURL(file)
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

            data.append(
                "full_name",
                form.full_name
            );

            data.append(
                "email",
                form.email
            );

            data.append(
                "phone_number",
                form.phone_number
            );

            data.append(
                "whatsapp_number",
                form.whatsapp_number
            );


            // Only send password when changed

            if (
                form.password &&
                form.password.trim() !== ""
            ) {

                data.append(
                    "password",
                    form.password
                );

            }


            // Avatar

            if (avatar) {

                data.append(
                    "avatar",
                    avatar
                );

            }


            const response =
                await updateClient(
                    id,
                    data
                );


            if (response.data?.success) {

                toast.success(
                    "Client updated successfully"
                );

                navigate(
                    `/admin-portal/clients/${id}`
                );

            } else {

                toast.error(
                    response.data?.message ||
                    "Update failed"
                );

            }

        } catch (error) {

            console.error(
                "UPDATE CLIENT ERROR:",
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


    // =====================================================
    // CLIENT NOT FOUND
    // =====================================================

    if (!client) {

        return (

            <div className="
                min-h-[400px]
                flex
                flex-col
                items-center
                justify-center
            ">

                <User
                    size={60}
                    className="text-gray-300 mb-4"
                />

                <h2 className="
                    text-xl
                    font-semibold
                    text-gray-700
                ">
                    Client not found
                </h2>

                <button
                    onClick={() => navigate(-1)}
                    className="
                        mt-5
                        flex
                        items-center
                        gap-2
                        bg-gray-600
                        hover:bg-gray-700
                        text-white
                        px-5
                        py-2.5
                        rounded-lg
                    "
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

            </div>

        );

    }


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="
            p-4
            sm:p-6
            max-w-4xl
            mx-auto
        ">

            {/* ==========================================
                HEADER
            ========================================== */}

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
                        Edit Client
                    </h1>

                    <p className="
                        text-gray-500
                        mt-1
                    ">
                        Update client information
                    </p>

                </div>


                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="
                        w-fit
                        flex
                        items-center
                        gap-2
                        bg-gray-600
                        hover:bg-gray-700
                        text-white
                        px-4
                        py-2.5
                        rounded-lg
                    "
                >

                    <ArrowLeft size={18} />

                    Back

                </button>

            </div>


            {/* ==========================================
                FORM
            ========================================== */}

            <form
                onSubmit={handleSubmit}
                className="
                    bg-white
                    border
                    border-gray-200
                    shadow-sm
                    rounded-2xl
                    p-5
                    sm:p-7
                    space-y-7
                "
            >

                {/* ======================================
                    AVATAR
                ====================================== */}

                <div>

                    <h2 className="
                        text-lg
                        font-semibold
                        text-[#14213D]
                        mb-4
                    ">
                        Profile Avatar
                    </h2>


                    <div className="
                        flex
                        flex-col
                        sm:flex-row
                        items-center
                        gap-5
                    ">

                        {/* Preview */}

                        {avatarPreview ? (

                            <img
                                src={avatarPreview}
                                alt="Client avatar"
                                className="
                                    w-28
                                    h-28
                                    rounded-full
                                    object-cover
                                    border-4
                                    border-gray-100
                                    shadow
                                "
                            />

                        ) : (

                            <div className="
                                w-28
                                h-28
                                rounded-full
                                bg-gray-100
                                border
                                border-gray-200
                                flex
                                items-center
                                justify-center
                            ">

                                <User
                                    size={50}
                                    className="text-gray-400"
                                />

                            </div>

                        )}


                        {/* Upload */}

                        <div>

                            <label
                                htmlFor="avatar"
                                className="
                                    cursor-pointer
                                    flex
                                    items-center
                                    gap-2
                                    bg-[#FCA311]
                                    hover:bg-[#e99508]
                                    text-[#14213D]
                                    px-5
                                    py-3
                                    rounded-lg
                                    font-medium
                                "
                            >

                                <Upload size={18} />

                                Change Avatar

                            </label>

                            <input
                                id="avatar"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />

                            <p className="
                                text-xs
                                text-gray-500
                                mt-2
                            ">
                                JPG, PNG or WEBP. Maximum 5MB.
                            </p>

                        </div>

                    </div>

                </div>


                {/* ======================================
                    BASIC INFORMATION
                ====================================== */}

                <div>

                    <h2 className="
                        text-lg
                        font-semibold
                        text-[#14213D]
                        mb-4
                    ">
                        Basic Information
                    </h2>


                    <div className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        gap-5
                    ">

                        {/* Full Name */}

                        <div>

                            <label className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-2
                            ">
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="full_name"
                                value={form.full_name}
                                onChange={handleChange}
                                required
                                placeholder="Enter full name"
                                className="
                                    w-full
                                    border
                                    border-gray-300
                                    p-3
                                    rounded-xl
                                    text-sm
                                    outline-none
                                    focus:ring-2
                                    focus:ring-[#FCA311]
                                "
                            />

                        </div>


                        {/* Email */}

                        <div>

                            <label className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-2
                            ">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter email"
                                className="
                                    w-full
                                    border
                                    border-gray-300
                                    p-3
                                    rounded-xl
                                    text-sm
                                    outline-none
                                    focus:ring-2
                                    focus:ring-[#FCA311]
                                "
                            />

                        </div>


                        {/* Phone */}

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
                                    outline-none
                                    focus:ring-2
                                    focus:ring-[#FCA311]
                                "
                            />

                        </div>


                        {/* WhatsApp */}

                        <div>

                            <label className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-2
                            ">
                                WhatsApp Number
                            </label>

                            <input
                                type="text"
                                name="whatsapp_number"
                                value={form.whatsapp_number}
                                onChange={handleChange}
                                placeholder="Enter WhatsApp number"
                                className="
                                    w-full
                                    border
                                    border-gray-300
                                    p-3
                                    rounded-xl
                                    text-sm
                                    outline-none
                                    focus:ring-2
                                    focus:ring-[#FCA311]
                                "
                            />

                        </div>

                    </div>

                </div>


                {/* ======================================
                    PASSWORD
                ====================================== */}

                <div>

                    <h2 className="
                        text-lg
                        font-semibold
                        text-[#14213D]
                        mb-4
                    ">
                        Change Password
                    </h2>


                    <label className="
                        block
                        text-sm
                        font-medium
                        text-gray-700
                        mb-2
                    ">
                        New Password
                    </label>

                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Leave blank to keep current password"
                        className="
                            w-full
                            border
                            border-gray-300
                            p-3
                            rounded-xl
                            text-sm
                            outline-none
                            focus:ring-2
                            focus:ring-[#FCA311]
                        "
                    />

                    <p className="
                        text-xs
                        text-gray-500
                        mt-2
                    ">
                        Leave this field empty if you do not want
                        to change the password.
                    </p>

                </div>


                {/* ======================================
                    BUTTONS
                ====================================== */}

                <div className="
                    flex
                    flex-col-reverse
                    sm:flex-row
                    sm:justify-end
                    gap-3
                    pt-2
                    border-t
                    border-gray-200
                ">

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="
                            px-6
                            py-3
                            rounded-lg
                            border
                            border-gray-300
                            text-gray-700
                            hover:bg-gray-50
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
                            hover:bg-[#1c2c52]
                            disabled:opacity-60
                            disabled:cursor-not-allowed
                            text-white
                            px-6
                            py-3
                            rounded-lg
                            font-medium
                        "
                    >

                        <Save size={18} />

                        {updating
                            ? "Updating..."
                            : "Update Client"
                        }

                    </button>

                </div>

            </form>

        </div>

    );

};

export default EditClient;

