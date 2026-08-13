import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "react-toastify";

import {
    getUserById,
    updateUser
} from "../../api/userApi";
import Loader from "../../components/Loader";

const EditUser = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [updating, setUpdating] = useState(false);

    const [form, setForm] = useState({

        google_id: "",

        rate: 0

    });


    useEffect(() => {

        fetchUser();

    }, [id]);


    const fetchUser = async () => {

        try {

            const res = await getUserById(id);

            const user = res.data.user;

            setForm({

                google_id: user.google_id,

                rate: user.rate || 0

            });

        }
        catch (error) {

            console.log(error);

            toast.error("Failed to load user");

        }
        finally {

            setLoading(false);

        }

    };


    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setUpdating(true);

            await updateUser(id, {

                rate: form.rate

            });

            toast.success("User updated successfully");

            navigate("/admin-portal/users");

        }
        catch (error) {

            console.log(error);

            toast.error("Update failed");

        }
        finally {

            setUpdating(false);

        }

    };


 // =====================================================
        // LOADING
        // =====================================================
    
        if (loading) {
    
            return <Loader />;
    
        }


    return (

        <div className="space-y-6">

            {/* Header */}

            <div className="flex justify-between items-center">

                <div>

                    <h1 className="text-3xl font-bold">

                        Edit User

                    </h1>

                    <p className="text-gray-500">

                        Update user information

                    </p>

                </div>


                <button

                    onClick={() => navigate(-1)}

                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"

                >

                    <ArrowLeft size={18} />

                    Back

                </button>

            </div>


            {/* Form */}

            <form

                onSubmit={handleSubmit}

                className="bg-white rounded-xl shadow p-6 space-y-6"

            >

                <div>

                    <label className="block mb-2 font-medium">

                        Google ID

                    </label>

                    <input

                        type="text"

                        value={form.google_id}

                        readOnly

                        className="w-full border rounded-lg px-4 py-3 bg-gray-100"

                    />

                </div>


                <div>

                    <label className="block mb-2 font-medium">

                        Rate

                    </label>

                    <input

                        type="number"

                        name="rate"

                        value={form.rate}

                        onChange={handleChange}

                        className="w-full border rounded-lg px-4 py-3"

                    />

                </div>


                <button

                    type="submit"

                    disabled={updating}

                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"

                >

                    <Save size={18} />

                    {

                        updating

                            ? "Updating..."

                            : "Update User"

                    }

                </button>

            </form>

        </div>

    );

};

export default EditUser;