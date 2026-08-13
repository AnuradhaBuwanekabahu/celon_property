import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";
import { toast } from "react-toastify";
import { getWanted } from "../../api/wantedApi";
import Loader from "../../components/Loader";



const Wanted = () => {

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    // =====================================================
    // Convert MySQL LONGBLOB Buffer to Image URL
    // =====================================================

    const getImageUrl = (image, imageType) => {

        if (!image) {
            return null;
        }

        // MySQL returns LONGBLOB as:
        // { type: "Buffer", data: [...] }

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

        // If backend already returns a string
        if (typeof image === "string") {
            return image;
        }

        return null;
    };

    // =====================================================
    // Load Wanted Properties
    // =====================================================

    useEffect(() => {
        loadWanted();
    }, []);

    const loadWanted = async () => {

        try {

            setLoading(true);

            const res = await getWanted();

            console.log("Wanted API Response:", res.data);

            setProperties(
                Array.isArray(res.data?.data)
                    ? res.data.data
                    : []
            );

        } catch (error) {

            console.error("Get Wanted Error:", error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to load wanted properties"
            );

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

    // =====================================================
    // Page
    // =====================================================

    

return (
    <div className="min-h-screen bg-[#E8EEF9] p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">

            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D] prata-regular">
                    Wanted Properties
                </h1>

                <p className="text-sm text-gray-500 mt-1 inter">
                    Manage all wanted property requests
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

                    {/* Table Header */}
                    <thead className="bg-[#14213D] text-white">

                        <tr>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                Image
                            </th>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                Title
                            </th>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                Budget
                            </th>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                City
                            </th>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                Phone
                            </th>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                Status
                            </th>

                            <th className="px-5 py-4 text-center font-semibold inter">
                                Actions
                            </th>

                        </tr>

                    </thead>


                    {/* Table Body */}
                    <tbody>

                        {properties.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="7"
                                    className="text-center py-12 text-gray-500 inter"
                                >
                                    No Wanted Properties Found
                                </td>

                            </tr>

                        ) : (

                            properties.map((property) => {

                                const imageUrl = getImageUrl(
                                    property.main_image,
                                    property.main_image_type
                                );

                                return (

                                    <tr
                                        key={property.id}
                                        className="border-t border-gray-100 hover:bg-[#E8EEF9] transition"
                                    >

                                        {/* Image */}
                                        <td className="px-5 py-4">

                                            {imageUrl ? (

                                                <img
                                                    src={imageUrl}
                                                    alt={
                                                        property.title ||
                                                        "Wanted Property"
                                                    }
                                                    className="w-24 h-16 rounded-xl object-cover border border-gray-200"
                                                />

                                            ) : (

                                                <div className="w-24 h-16 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">

                                                    <span className="text-xs text-gray-500 inter">
                                                        No Image
                                                    </span>

                                                </div>

                                            )}

                                        </td>


                                        {/* Title */}
                                        <td className="px-5 py-4">

                                            <p className="font-semibold text-[#14213D] inter">
                                                {property.title || "-"}
                                            </p>

                                            {property.full_name && (

                                                <p className="text-sm text-gray-500 mt-1 inter">
                                                    {property.full_name}
                                                </p>

                                            )}

                                        </td>


                                        {/* Budget */}
                                        <td className="px-5 py-4">

                                            {property.budget !== null &&
                                            property.budget !== undefined &&
                                            property.budget !== "" ? (

                                                <span className="font-semibold text-[#14213D] inter">
                                                    Rs.{" "}
                                                    {Number(
                                                        property.budget
                                                    ).toLocaleString()}
                                                </span>

                                            ) : (

                                                <span className="text-gray-500 inter">
                                                    -
                                                </span>

                                            )}

                                        </td>


                                        {/* City */}
                                        <td className="px-5 py-4 text-gray-600 inter">
                                            {property.preferred_city || "-"}
                                        </td>


                                        {/* Phone */}
                                        <td className="px-5 py-4 text-gray-600 inter">
                                            {property.phone_number || "-"}
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
                                                    to={`/admin-portal/wanted/${property.id}`}
                                                    title="View"
                                                    className="bg-[#14213D] text-white p-2 rounded-lg hover:bg-[#1c2c52] transition"
                                                >
                                                    <Eye size={18} />
                                                </Link>


                                                {/* Edit */}
                                                <Link
                                                    to={`/admin-portal/wanted/edit/${property.id}`}
                                                    title="Edit"
                                                    className="bg-[#FBBF24] text-[#14213D] p-2 rounded-lg hover:bg-[#d3a120] transition"
                                                >
                                                    <Pencil size={18} />
                                                </Link>

                                            </div>

                                        </td>

                                    </tr>

                                );

                            })

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    </div>
);


};

export default Wanted;