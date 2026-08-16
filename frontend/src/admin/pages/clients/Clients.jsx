import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Search } from "lucide-react";
import { toast } from "react-toastify";

import { getClients } from "../../api/clientApi";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";

const Clients = () => {

    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    // ==========================================
    // SEARCH
    // ==========================================

    const [search, setSearch] = useState("");

    // ==========================================
    // PAGINATION
    // ==========================================

    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;


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
    // SEARCH FILTER
    // ==========================================

    const filteredClients = useMemo(() => {

        const keyword =
            search.trim().toLowerCase();

        if (!keyword) {

            return clients;

        }

        return clients.filter((client) => {

            const fullName =
                String(
                    client.full_name || ""
                ).toLowerCase();

            const email =
                String(
                    client.email || ""
                ).toLowerCase();

            const phone =
                String(
                    client.phone_number || ""
                ).toLowerCase();

            const whatsapp =
                String(
                    client.whatsapp_number || ""
                ).toLowerCase();

            const status =
                client.is_active
                    ? "active"
                    : "blocked";

            return (
                fullName.includes(keyword) ||
                email.includes(keyword) ||
                phone.includes(keyword) ||
                whatsapp.includes(keyword) ||
                status.includes(keyword)
            );

        });

    }, [clients, search]);


    // ==========================================
    // RESET PAGE WHEN SEARCH CHANGES
    // ==========================================

    useEffect(() => {

        setCurrentPage(1);

    }, [search]);


    // ==========================================
    // PAGINATION DATA
    // ==========================================

    const totalItems =
        filteredClients.length;

    const totalPages =
        Math.ceil(
            totalItems / itemsPerPage
        );


    const startIndex =
        (currentPage - 1) *
        itemsPerPage;


    const paginatedClients =
        filteredClients.slice(
            startIndex,
            startIndex + itemsPerPage
        );


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

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="
                flex
                flex-col
                sm:flex-row
                sm:justify-between
                sm:items-center
                gap-3
                mb-6
            ">

                <div>

                    <h1 className="
                        text-2xl
                        sm:text-3xl
                        font-bold
                        text-[#14213D]
                        prata-regular
                    ">
                        Clients
                    </h1>

                    
                </div>


                <span className="
                    text-gray-600
                    font-medium
                    inter
                ">

                    Total:{" "}

                    <span className="
                        text-[#14213D]
                        font-bold
                    ">
                        {clients.length}
                    </span>

                </span>

            </div>


            {/* ==========================================
                SEARCH BAR
            ========================================== */}

            <div className="
                bg-white
                rounded-2xl
                shadow-sm
                border
                border-gray-100
                p-4
                mb-5
            ">

                <div className="relative w-full">

                    <Search
                        size={19}
                        className="
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            text-gray-400
                        "
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="
                            Search by name, email, phone, WhatsApp or status...
                        "
                        className="
                            w-full
                            h-11
                            pl-10
                            pr-4
                            border
                            border-gray-300
                            rounded-xl
                            text-sm
                            outline-none
                            focus:ring-2
                            focus:ring-[#FCA311]
                            focus:border-transparent
                        "
                    />

                </div>

            </div>


            {/* ==========================================
                TABLE
            ========================================== */}

            <div className="
                bg-white
                rounded-2xl
                shadow-sm
                border
                border-gray-100
                overflow-hidden
            ">

                <div className="overflow-x-auto">

                    <table className="
                        w-full
                        min-w-[1000px]
                    ">

                        {/* TABLE HEADER */}

                        <thead className="
                            bg-[#14213D]
                            text-white
                        ">

                            <tr>

                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                    font-semibold
                                    inter
                                ">
                                    Client
                                </th>

                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                    font-semibold
                                    inter
                                ">
                                    Email
                                </th>

                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                    font-semibold
                                    inter
                                ">
                                    Phone
                                </th>

                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                    font-semibold
                                    inter
                                ">
                                    WhatsApp
                                </th>

                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                    font-semibold
                                    inter
                                ">
                                    Status
                                </th>

                                <th className="
                                    px-5
                                    py-4
                                    text-center
                                    font-semibold
                                    inter
                                ">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        {/* TABLE BODY */}

                        <tbody>

                            {paginatedClients.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="
                                            text-center
                                            py-12
                                            text-gray-500
                                            inter
                                        "
                                    >

                                        {search
                                            ? "No clients found for your search"
                                            : "No Clients Found"
                                        }

                                    </td>

                                </tr>

                            ) : (

                                paginatedClients.map(
                                    (client) => (

                                        <tr
                                            key={client.id}
                                            className="
                                                border-t
                                                border-gray-100
                                                hover:bg-[#E8EEF9]
                                                transition
                                            "
                                        >

                                            {/* CLIENT */}

                                            <td className="
                                                px-5
                                                py-4
                                            ">

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                ">

                                                    {client.avatar ? (

                                                        <img
                                                            src={
                                                                client.avatar.startsWith("http")
                                                                    ? client.avatar
                                                                    : `http://localhost:5000${client.avatar}`
                                                            }
                                                            alt={
                                                                client.full_name
                                                            }
                                                            className="
                                                                w-11
                                                                h-11
                                                                rounded-full
                                                                object-cover
                                                                border
                                                                border-gray-200
                                                            "
                                                            onError={(e) => {

                                                                e.currentTarget.style.display =
                                                                    "none";

                                                            }}
                                                        />

                                                    ) : (

                                                        <div className="
                                                            w-11
                                                            h-11
                                                            rounded-full
                                                            bg-[#14213D]
                                                            text-white
                                                            flex
                                                            items-center
                                                            justify-center
                                                            font-semibold
                                                        ">

                                                            {client.full_name
                                                                ?.charAt(0)
                                                                ?.toUpperCase() || "C"}

                                                        </div>

                                                    )}


                                                    <div>

                                                        <p className="
                                                            font-semibold
                                                            text-[#14213D]
                                                            inter
                                                        ">
                                                            {client.full_name}
                                                        </p>

                                                        <p className="
                                                            text-xs
                                                            text-gray-400
                                                            inter
                                                        ">
                                                            ID: {client.id}
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* EMAIL */}

                                            <td className="
                                                px-5
                                                py-4
                                                text-gray-600
                                                inter
                                            ">
                                                {client.email}
                                            </td>


                                            {/* PHONE */}

                                            <td className="
                                                px-5
                                                py-4
                                                text-gray-600
                                                inter
                                            ">
                                                {client.phone_number || "-"}
                                            </td>


                                            {/* WHATSAPP */}

                                            <td className="
                                                px-5
                                                py-4
                                                text-gray-600
                                                inter
                                            ">
                                                {client.whatsapp_number || "-"}
                                            </td>


                                            {/* STATUS */}

                                            <td className="
                                                px-5
                                                py-4
                                            ">

                                                <span
                                                    className={`
                                                        px-3
                                                        py-1
                                                        rounded-full
                                                        text-sm
                                                        font-medium
                                                        inter
                                                        ${
                                                            client.is_active
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-red-100 text-red-700"
                                                        }
                                                    `}
                                                >

                                                    {client.is_active
                                                        ? "Active"
                                                        : "Blocked"
                                                    }

                                                </span>

                                            </td>


                                            {/* ACTIONS */}

                                            <td className="
                                                px-5
                                                py-4
                                            ">

                                                <div className="
                                                    flex
                                                    justify-center
                                                    gap-3
                                                ">

                                                    <Link
                                                        to={`/admin/clients/${client.id}`}
                                                        className="
                                                            bg-[#14213D]
                                                            text-white
                                                            p-2
                                                            rounded-lg
                                                            hover:bg-[#1c2c52]
                                                            transition
                                                        "
                                                        title="View Client"
                                                    >
                                                        <Eye size={18} />
                                                    </Link>


                                                    <Link
                                                        to={`/admin/clients/edit/${client.id}`}
                                                        className="
                                                            bg-[#FBBF24]
                                                            text-[#14213D]
                                                            p-2
                                                            rounded-lg
                                                            hover:bg-[#d3a120]
                                                            transition
                                                        "
                                                        title="Edit Client"
                                                    >
                                                        <Pencil size={18} />
                                                    </Link>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>


                {/* ==========================================
                    PAGINATION
                ========================================== */}

                <div className="px-5 pb-5">

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                    />

                </div>

            </div>

        </div>

    );

};


export default Clients;