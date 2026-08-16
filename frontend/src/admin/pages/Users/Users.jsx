import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";
import { toast } from "react-toastify";

import { getUsers } from "../../api/userApi";
import Loader from "../../components/Loader";

const Users = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadUsers();

    }, []);

    const loadUsers = async () => {

        try {

            const res = await getUsers();

            setUsers(
                res.data.users || []
            );

        }
        catch (error) {

            console.log(error);

            toast.error("Failed to load users");

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
    <div className="min-h-screen bg-[#E8EEF9] p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">

            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D] prata-regular">
                    Users
                </h1>

                <p className="text-sm text-gray-500 mt-1 inter">
                    Manage registered Google users
                </p>
            </div>

            <span className="text-gray-600 font-medium inter">
                Total:{" "}
                <span className="text-[#14213D] font-bold">
                    {users.length}
                </span>
            </span>

        </div>


        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            <div className="overflow-x-auto">

                <table className="w-full min-w-[800px]">

                    <thead className="bg-[#14213D] text-white">

                        <tr>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                ID
                            </th>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                Google ID
                            </th>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                Rate
                            </th>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                Joined
                            </th>

                            <th className="px-5 py-4 text-center font-semibold inter">
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {users.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="5"
                                    className="text-center py-12 text-gray-500 inter"
                                >
                                    No Users Found
                                </td>

                            </tr>

                        ) : (

                            users.map((user) => (

                                <tr
                                    key={user.id}
                                    className="border-t border-gray-100 hover:bg-[#E8EEF9] transition"
                                >

                                    {/* ID */}
                                    <td className="px-5 py-4">

                                        <span className="font-semibold text-[#14213D] inter">
                                            #{user.id}
                                        </span>

                                    </td>


                                    {/* Google ID */}
                                    <td className="px-5 py-4">

                                        <span className="text-gray-700 inter">
                                            {user.google_id}
                                        </span>

                                    </td>


                                    {/* Rate */}
                                    <td className="px-5 py-4">

                                        <span className="font-semibold text-[#14213D] inter">
                                            {user.rate ?? 0}
                                        </span>

                                    </td>


                                    {/* Joined */}
                                    <td className="px-5 py-4">

                                        <span className="text-gray-600 inter">
                                            {user.created_at
                                                ? new Date(
                                                      user.created_at
                                                  ).toLocaleDateString()
                                                : "-"}
                                        </span>

                                    </td>


                                    {/* Actions */}
                                    <td className="px-5 py-4">

                                        <div className="flex justify-center gap-3">

                                            {/* View */}
                                            <Link
                                                to={`/admin/users/${user.id}`}
                                                className="bg-[#14213D] text-white p-2 rounded-lg hover:bg-[#1c2c52] transition"
                                                title="View User"
                                            >
                                                <Eye size={18} />
                                            </Link>


                                            {/* Edit */}
                                            <Link
                                                to={`/admin/users/edit/${user.id}`}
                                                className="bg-[#FBBF24] text-[#14213D] p-2 rounded-lg hover:bg-[#d3a120] transition"
                                                title="Edit User"
                                            >
                                                <Pencil size={18} />
                                            </Link>

                                        </div>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    </div>
); 

};

export default Users;