import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";

import { getStayToRent } from "../../api/stayToRentApi";
import Loader from "../../components/Loader";


const StayToRent = () => {

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    // ==========================================
    // FETCH STAY TO RENT
    // ==========================================

    const fetchStayToRent = async () => {

        try {

            const res = await getStayToRent();

            setProperties(
                res.data?.data || []
            );

        } catch (error) {

            console.error(
                "GET STAY TO RENT ERROR:",
                error
            );

            setProperties([]);

        } finally {

            setLoading(false);

        }
    };

    // ==========================================
    // USE EFFECT
    // ==========================================

    useEffect(() => {

        fetchStayToRent();

    }, []);

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return <Loader />;

    }

    // ==========================================
    // STATUS STYLE
    // ==========================================

    const getStatusStyle = (status) => {

        switch (status?.toLowerCase()) {

            case "active":
                return "bg-green-100 text-green-700";

            case "sold":
                return "bg-red-100 text-red-700";

            case "pending":
                return "bg-yellow-100 text-yellow-700";

            default:
                return "bg-gray-100 text-gray-700";

        }
    };

    // ==========================================
    // FORMAT STATUS
    // ==========================================

    const getStatusText = (status) => {

        if (!status) {
            return "Pending";
        }

        return (
            status.charAt(0).toUpperCase() +
            status.slice(1).toLowerCase()
        );

    };

    // ==========================================
    // FORMAT PRICE
    // ==========================================

    const formatPrice = (price) => {

        if (
            price === null ||
            price === undefined ||
            price === ""
        ) {
            return "N/A";
        }

        return Number(price).toLocaleString("en-LK");

    };

    // ==========================================
    // UI
    // ==========================================

      return (
    <div className="min-h-screen bg-[#E8EEF9] p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">

            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D] prata-regular">
                    Stay To Rent
                </h1>

                <p className="text-sm text-gray-500 mt-1 inter">
                    Manage all stay to rent properties
                </p>
            </div>

            <span className="text-gray-600 font-medium inter">
                Total:{" "}
                <span className="text-[#14213D] font-bold">
                    {properties.length}
                </span>
            </span>

        </div>


        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            <div className="overflow-x-auto">

                <table className="w-full min-w-[1000px]">

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
                                City
                            </th>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                Price Period
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

                        {properties.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="7"
                                    className="text-center py-12 text-gray-500 inter"
                                >
                                    No Stay To Rent Properties Found
                                </td>

                            </tr>

                        ) : (

                            properties.map((property) => (

                                <tr
                                    key={property.id}
                                    className="border-t border-gray-100 hover:bg-[#E8EEF9] transition"
                                >

                                    {/* Image */}
                                    <td className="px-5 py-4">

                                        {property.main_image ? (

                                            <img
                                                src={`http://localhost:5000${property.main_image}`}
                                                alt={property.title}
                                                className="w-24 h-16 rounded-xl object-cover border border-gray-200"
                                            />

                                        ) : (

                                            <div className="w-24 h-16 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-500 inter">
                                                No Image
                                            </div>

                                        )}

                                    </td>


                                    {/* Title */}
                                    <td className="px-5 py-4">

                                        <p className="font-semibold text-[#14213D] inter">
                                            {property.title}
                                        </p>

                                        <p className="text-sm text-gray-500 mt-1 inter">
                                            {property.property_type || "N/A"}
                                        </p>

                                    </td>


                                    {/* Price */}
                                    <td className="px-5 py-4">

                                        <span className="font-semibold text-[#14213D] inter">
                                            Rs.{" "}
                                            {Number(
                                                property.price || 0
                                            ).toLocaleString()}
                                        </span>

                                    </td>


                                    {/* City */}
                                    <td className="px-5 py-4 text-gray-600 inter">
                                        {property.city || "N/A"}
                                    </td>


                                    {/* Price Period */}
                                    <td className="px-5 py-4">

                                        <span className="capitalize text-gray-600 inter">
                                            {property.price_period || "monthly"}
                                        </span>

                                    </td>


                                    {/* Status */}
                                    <td className="px-5 py-4">

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium inter ${
                                                property.status === "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : property.status === "sold"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-[#FFF4D6] text-[#A16207]"
                                            }`}
                                        >
                                            {property.status || "pending"}
                                        </span>

                                    </td>


                                    {/* Actions */}
                                    <td className="px-5 py-4">

                                        <div className="flex justify-center gap-3">

                                            {/* View */}
                                            <Link
                                                to={`/admin/stay-to-rent/${property.id}`}
                                                className="bg-[#14213D] text-white p-2 rounded-lg hover:bg-[#1c2c52] transition"
                                                title="View"
                                            >
                                                <Eye size={18} />
                                            </Link>


                                            {/* Edit */}
                                            <Link
                                                to={`/admin/stay-to-rent/edit/${property.id}`}
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

export default StayToRent;