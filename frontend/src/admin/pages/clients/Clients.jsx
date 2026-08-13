
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";
import { toast } from "react-toastify";

import { getClients } from "../../api/clientApi";
import Loader from "../../components/Loader";


const Clients = () => {

    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    // ==========================================
    // LOAD CLIENTS
    // ==========================================

    const loadClients = async () => {

        try {

            setLoading(true);

            const res = await getClients();

            setClients(
                res.data.clients || []
            );

        } catch (error) {

            console.error(
                "GET CLIENTS ERROR:",
                error
            );

            toast.error(
                "Failed loading clients"
            );

        } finally {

            setLoading(false);

        }
    };

    // ==========================================
    // USE EFFECT
    // ==========================================

    useEffect(() => {

        loadClients();

    }, []);

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return <Loader />;
    }

    // ==========================================
    // PAGE
    // ==========================================

 return (
    <div className="min-h-screen bg-[#E8EEF9] p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">

            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D] prata-regular">
                    Clients
                </h1>

                <p className="text-sm text-gray-500 mt-1 inter">
                    Manage registered clients
                </p>
            </div>

            <span className="text-gray-600 font-medium inter">
                Total:{" "}
                <span className="text-[#14213D] font-bold">
                    {clients.length}
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
                                Client
                            </th>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                Email
                            </th>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                Phone
                            </th>

                            <th className="px-5 py-4 text-left font-semibold inter">
                                WhatsApp
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

                        {clients.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="text-center py-12 text-gray-500 inter"
                                >
                                    No Clients Found
                                </td>

                            </tr>

                        ) : (

                            clients.map((client) => (

                                <tr
                                    key={client.id}
                                    className="border-t border-gray-100 hover:bg-[#E8EEF9] transition"
                                >

                                    {/* Client */}
                                    <td className="px-5 py-4">

                                        <div className="flex items-center gap-3">

                                            {client.avatar ? (

                                                <img
                                                    src={
                                                        client.avatar.startsWith("http")
                                                            ? client.avatar
                                                            : `http://localhost:5000${client.avatar}`
                                                    }
                                                    alt={client.full_name}
                                                    className="w-11 h-11 rounded-full object-cover border border-gray-200"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = "none";
                                                    }}
                                                />

                                            ) : (

                                                <div className="w-11 h-11 rounded-full bg-[#14213D] text-white flex items-center justify-center font-semibold">
                                                    {client.full_name
                                                        ?.charAt(0)
                                                        ?.toUpperCase() || "C"}
                                                </div>

                                            )}

                                            <div>

                                                <p className="font-semibold text-[#14213D] inter">
                                                    {client.full_name}
                                                </p>

                                                <p className="text-xs text-gray-400 inter">
                                                    ID: {client.id}
                                                </p>

                                            </div>

                                        </div>

                                    </td>


                                    {/* Email */}
                                    <td className="px-5 py-4 text-gray-600 inter">
                                        {client.email}
                                    </td>


                                    {/* Phone */}
                                    <td className="px-5 py-4 text-gray-600 inter">
                                        {client.phone_number || "-"}
                                    </td>


                                    {/* WhatsApp */}
                                    <td className="px-5 py-4 text-gray-600 inter">
                                        {client.whatsapp_number || "-"}
                                    </td>


                                    {/* Status */}
                                    <td className="px-5 py-4">

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium inter ${
                                                client.is_active
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {client.is_active
                                                ? "Active"
                                                : "Blocked"}
                                        </span>

                                    </td>


                                    {/* Actions */}
                                    <td className="px-5 py-4">

                                        <div className="flex justify-center gap-3">

                                            {/* View */}
                                            <Link
                                                to={`/admin-portal/clients/${client.id}`}
                                                className="bg-[#14213D] text-white p-2 rounded-lg hover:bg-[#1c2c52] transition"
                                                title="View Client"
                                            >
                                                <Eye size={18} />
                                            </Link>


                                            {/* Edit */}
                                            <Link
                                                to={`/admin-portal/clients/edit/${client.id}`}
                                                className="bg-[#FBBF24] text-[#14213D] p-2 rounded-lg hover:bg-[#d3a120] transition"
                                                title="Edit Client"
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

export default Clients;

