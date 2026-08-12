import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Plus } from "lucide-react";
import { toast } from "react-toastify";

import { getLands } from "../../api/landApi";
import Loader from "../../components/Loader";

const Lands = () => {

    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        fetchLands();
    }, []);

    const fetchLands = async () => {

        try {

            const res = await getLands();

            console.log("Lands:", res.data);

            setLands(res.data.data || []);

        } catch (error) {

            console.error(error);

            toast.error("Failed to load lands");

        } finally {

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
                    Lands
                </h1>

                <p className="text-sm text-gray-500 mt-1 inter">
                    Manage all land properties
                </p>
            </div>

            <span className="text-gray-600 font-medium inter">
                Total:{" "}
                <span className="text-[#14213D] font-bold">
                    {lands.length}
                </span>
            </span>

        </div>


        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            <div className="overflow-x-auto">

                <table className="w-full min-w-[900px]">

                    <thead className="bg-[#14213D] text-white">

                        <tr>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                Image
                            </th>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                Title
                            </th>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                Price
                            </th>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                Land Size
                            </th>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                City
                            </th>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                Status
                            </th>

                            <th className="px-5 py-4 text-center font-semibold inter">
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {lands.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="7"
                                    className="text-center py-12 text-gray-500 inter"
                                >
                                    No Lands Found
                                </td>

                            </tr>

                        ) : (

                            lands.map((land) => (

                                <tr
                                    key={land.id}
                                    className="border-t border-gray-100 hover:bg-[#E8EEF9] transition"
                                >

                                    {/* Image */}
                                    <td className="px-5 py-4">

                                        <img
                                            src={
                                                land.main_image
                                                    ? `${API_URL}${land.main_image}`
                                                    : "/no-image.png"
                                            }
                                            alt={land.title}
                                            className="w-24 h-16 rounded-xl object-cover border border-gray-200"
                                        />

                                    </td>


                                    {/* Title */}
                                    <td className="px-5 py-4">

                                        <p className="font-semibold text-[#14213D] inter">
                                            {land.title}
                                        </p>

                                    </td>


                                    {/* Price */}
                                    <td className="px-5 py-4">

                                        <span className="font-semibold text-[#14213D] inter">
                                            Rs.{" "}
                                            {Number(
                                                land.price || 0
                                            ).toLocaleString()}
                                        </span>

                                    </td>


                                    {/* Land Size */}
                                    <td className="px-5 py-4">

                                        <span className="text-gray-600 inter">
                                            {land.land_size || 0}{" "}
                                            {land.size_unit || ""}
                                        </span>

                                    </td>


                                    {/* City */}
                                    <td className="px-5 py-4 text-gray-600 inter">
                                        {land.city || "-"}
                                    </td>


                                    {/* Status */}
                                    <td className="px-5 py-4">

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium inter ${
                                                land.status === "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : land.status === "sold"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-[#FFF4D6] text-[#A16207]"
                                            }`}
                                        >
                                            {land.status || "pending"}
                                        </span>

                                    </td>


                                    {/* Actions */}
                                    <td className="px-5 py-4">

                                        <div className="flex justify-center gap-3">

                                            {/* View */}
                                            <Link
                                                to={`/admin/lands/${land.id}`}
                                                className="bg-[#14213D] text-white p-2 rounded-lg hover:bg-[#1c2c52] transition"
                                                title="View"
                                            >
                                                <Eye size={18} />
                                            </Link>


                                            {/* Edit */}
                                            <Link
                                                to={`/admin/lands/edit/${land.id}`}
                                                className="bg-[#FBBF24] text-[#14213D] p-2 rounded-lg hover:bg-[#d3a120] transition"
                                                title="Edit"
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

export default Lands;