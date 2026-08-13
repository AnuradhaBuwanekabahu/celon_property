
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";

import { getAds } from "../../api/adApi";
import Loader from "../../components/Loader";


const Ads = () => {

    const [ads, setAds] = useState([]);

    const [loading, setLoading] = useState(true);


    // =================================
    // FETCH ADS
    // =================================

    const fetchAds = async () => {

        try {

            setLoading(true);

            const res = await getAds();

            console.log("ADS RESPONSE:", res.data);

            setAds(
                res.data.ads || []
            );

        } catch (error) {

            console.log("GET ADS ERROR:", error);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchAds();

    }, []);


    // =================================
    // LOADING
    // =================================

    if (loading) {

        return <Loader />;

    }


    // =================================
    // UI
    // =================================

  return (
    <div className="min-h-screen bg-[#E8EEF9] p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">

            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D] prata-regular">
                    Advertisements
                </h1>

                <p className="text-sm text-gray-500 mt-1 inter">
                    Manage all advertisements
                </p>
            </div>

            <span className="text-gray-600 font-medium inter">
                Total:{" "}
                <span className="text-[#14213D] font-bold">
                    {ads.length}
                </span>
            </span>

        </div>


        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            <div className="overflow-x-auto">

                <table className="w-full min-w-[900px]">

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
                                Position
                            </th>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                Link
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

                        {ads.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="text-center py-12 text-gray-500 inter"
                                >
                                    No Advertisements Found
                                </td>

                            </tr>

                        ) : (

                            ads.map((ad) => (

                                <tr
                                    key={ad.id}
                                    className="border-t border-gray-100 hover:bg-[#E8EEF9] transition"
                                >

                                    {/* Image */}
                                    <td className="px-5 py-4">

                                        <img
                                            src={`http://localhost:5000${ad.image}`}
                                            alt={ad.title}
                                            className="w-24 h-16 rounded-xl object-cover border border-gray-200"
                                        />

                                    </td>


                                    {/* Title */}
                                    <td className="px-5 py-4">

                                        <p className="font-semibold text-[#14213D] inter">
                                            {ad.title}
                                        </p>

                                    </td>


                                    {/* Position */}
                                    <td className="px-5 py-4">

                                        <span className="text-gray-600 inter">
                                            {ad.position || "-"}
                                        </span>

                                    </td>


                                    {/* Link */}
                                    <td className="px-5 py-4">

                                        {ad.link_url ? (

                                            <a
                                                href={ad.link_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[#14213D] font-medium hover:text-[#FBBF24] hover:underline inter"
                                            >
                                                Visit
                                            </a>

                                        ) : (

                                            <span className="text-gray-400 inter">
                                                -
                                            </span>

                                        )}

                                    </td>


                                    {/* Status */}
                                    <td className="px-5 py-4">

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium inter ${
                                                Number(ad.is_active) === 1
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {Number(ad.is_active) === 1
                                                ? "Active"
                                                : "Inactive"}
                                        </span>

                                    </td>


                                    {/* Actions */}
                                    <td className="px-5 py-4">

                                        <div className="flex justify-center gap-3">

                                            {/* View */}
                                            <Link
                                                to={`/admin-portal/advertisements/${ad.id}`}
                                                className="bg-[#14213D] text-white p-2 rounded-lg hover:bg-[#1c2c52] transition"
                                                title="View"
                                            >
                                                <Eye size={18} />
                                            </Link>


                                            {/* Edit */}
                                            <Link
                                                to={`/admin-portal/advertisements/edit/${ad.id}`}
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

export default Ads;
