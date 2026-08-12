import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";




import { getAdminProfile, updateAdminProfile } from "../../api/adminAuth";
import Loader from "../../components/Loader";


const EditProfile = () => {

    const navigate = useNavigate();


    const [loading, setLoading] = useState(true);

    const [updating, setUpdating] = useState(false);


    const [form, setForm] = useState({

        name: "",

        email: "",

        password: "",

        confirmPassword: ""

    });


    // ===============================
    // GET LOGGED-IN ADMIN
    // ===============================

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const res = await getAdminProfile();

                const admin = res.data.admin;


                setForm({

                    name: admin.name || "",

                    email: admin.email || "",

                    password: "",

                    confirmPassword: ""

                });


            } catch (error) {

                console.log("PROFILE ERROR:", error);

                toast.error(
                    error.response?.data?.message ||
                    "Failed to load profile"
                );

            } finally {

                setLoading(false);

            }

        };


        fetchProfile();

    }, []);


    // ===============================
    // INPUT CHANGE
    // ===============================

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };


    // ===============================
    // UPDATE
    // ===============================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!form.name.trim()) {

            toast.error("Name is required");

            return;

        }


        if (!form.email.trim()) {

            toast.error("Email is required");

            return;

        }


        if (
            form.password &&
            form.password !== form.confirmPassword
        ) {

            toast.error("Passwords do not match");

            return;

        }


        try {

            setUpdating(true);


            await updateAdminProfile({

                name: form.name,

                email: form.email,

                password: form.password

            });


            // Update localStorage admin details

            const oldAdmin =
                JSON.parse(
                    localStorage.getItem("admin") || "{}"
                );


            const updatedAdmin = {

                ...oldAdmin,

                name: form.name,

                email: form.email

            };


            localStorage.setItem(
                "admin",
                JSON.stringify(updatedAdmin)
            );


            toast.success(
                "Profile updated successfully"
            );


            navigate("/admin/profile");


        } catch (error) {

            console.log(
                "UPDATE PROFILE ERROR:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Failed to update profile"
            );

        } finally {

            setUpdating(false);

        }

    };


    if (loading) {

        return <Loader />;

    }


    return (

        <div className="max-w-3xl mx-auto mt-8 p-4 sm:p-6">

            {/* Header */}

            <div className="flex items-center gap-3 mb-6">

                <button
                    type="button"
                    onClick={() =>
                        navigate("/admin/profile")
                    }
                    className="p-2 rounded-lg hover:bg-gray-100"
                >

                    <ArrowLeft size={20} />

                </button>


                <div>

                    <h1 className="text-2xl font-bold text-[#14213D]">
                        Edit Admin Profile
                    </h1>

                    <p className="text-gray-500">
                        Update your account details
                    </p>

                </div>

            </div>


            {/* Form */}

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow border border-gray-100 p-6 space-y-5"
            >

                {/* Name */}

                <div>

                    <label className="block text-sm font-medium mb-2">
                        Name
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                        placeholder="Enter admin name"
                    />

                </div>


                {/* Email */}

                <div>

                    <label className="block text-sm font-medium mb-2">
                        Email
                    </label>

                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                        placeholder="Enter email"
                    />

                </div>


                {/* Password */}

                <div>

                    <label className="block text-sm font-medium mb-2">
                        New Password
                    </label>

                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                        placeholder="Leave empty to keep current password"
                    />

                </div>


                {/* Confirm Password */}

                <div>

                    <label className="block text-sm font-medium mb-2">
                        Confirm New Password
                    </label>

                    <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                        placeholder="Confirm new password"
                    />

                </div>


                {/* Approval */}

                <div className="bg-gray-50 border rounded-xl p-4">

                    <p className="text-sm text-gray-500">
                        Approval status
                    </p>

                    <p className="font-semibold text-green-600 mt-1">
                        Approved
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                        Approval status can only be changed by the super admin.
                    </p>

                </div>


                {/* Buttons */}

                <div className="flex justify-end gap-3 pt-3">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin/profile")
                        }
                        className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        disabled={updating}
                        className="px-6 py-3 bg-[#14213D] text-white rounded-xl font-semibold hover:bg-[#1c2c52] disabled:opacity-50"
                    >

                        {updating
                            ? "Updating..."
                            : "Save Changes"}

                    </button>

                </div>

            </form>

        </div>

    );

};

export default EditProfile;