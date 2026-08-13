import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

import { getUserById } from "../../api/userApi";
import Loader from "../../components/Loader";

const ViewUser = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchUser();

    }, [id]);

    const fetchUser = async () => {

        try {

            const res = await getUserById(id);

            setUser(res.data.user);

        }
        catch (error) {

            console.log(error);

            toast.error("Failed to load user");

        }
        finally {

            setLoading(false);

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
                        User Details
                    </h1>

                    <p className="text-gray-500">
                        View user information
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

            {/* Details */}

            <div className="bg-white rounded-xl shadow p-6">

                <div className="grid grid-cols-2 gap-6">

                    <div>

                        <label className="font-semibold text-gray-600">
                            User ID
                        </label>

                        <p className="mt-1">
                            {user.id}
                        </p>

                    </div>

                    <div>

                        <label className="font-semibold text-gray-600">
                            Google ID
                        </label>

                        <p className="mt-1 break-all">
                            {user.google_id}
                        </p>

                    </div>

                    <div>

                        <label className="font-semibold text-gray-600">
                            Rate
                        </label>

                        <p className="mt-1">
                            {user.rate}
                        </p>

                    </div>

                    <div>

                        <label className="font-semibold text-gray-600">
                            Joined Date
                        </label>

                        <p className="mt-1">
                            {new Date(user.created_at).toLocaleString()}
                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default ViewUser;