import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Search, X } from "lucide-react";

import { getAds } from "../../api/adApi";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";

const Ads = () => {

    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);

    // =================================
    // SEARCH & PAGINATION
    // =================================

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

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

            console.log(
                "GET ADS ERROR:",
                error
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchAds();

    }, []);

    // =================================
    // SEARCH
    // =================================

    const filteredAds = useMemo(() => {

        const keyword =
            search.trim().toLowerCase();

        if (!keyword) {
            return ads;
        }

        return ads.filter((ad) => {

            const title =
                String(ad.title || "")
                    .toLowerCase();

            const position =
                String(ad.position || "")
                    .toLowerCase();

            const link =
                String(ad.link_url || "")
                    .toLowerCase();

            const status =
                Number(ad.is_active) === 1
                    ? "active"
                    : "inactive";

            return (
                title.includes(keyword) ||
                position.includes(keyword) ||
                link.includes(keyword) ||
                status.includes(keyword)
            );

        });

    }, [ads, search]);

    // =================================
    // PAGINATION
    // =================================

    const totalPages =
        Math.ceil(
            filteredAds.length /
            itemsPerPage
        );

    const paginatedAds =
        filteredAds.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );

    // =================================
    // RESET PAGE WHEN SEARCH CHANGES
    // =================================

    useEffect(() => {

        setCurrentPage(1);

    }, [search]);

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

        <div className="
            min-h-screen
            bg-[#E8EEF9]
            p-4
            sm:p-6
            lg:p-8
        ">

            {/* =================================
                HEADER
            ================================= */}

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
                        Advertisements
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
                        {ads.length}
                    </span>

                </span>

            </div>


            {/* =================================
                SEARCH BAR
            ================================= */}

            <div className="
                bg-white
                rounded-2xl
                shadow-sm
                border
                border-gray-100
                p-4
                mb-6
            ">

                <div className="
                    relative
                    w-full
                ">

                    <Search
                        size={20}
                        className="
                            absolute
                            left-4
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
                            Search by title, position, link or status...
                        "
                        className="
                            w-full
                            h-12
                            pl-11
                            pr-11
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

                    {search && (

                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setCurrentPage(1);
                            }}
                            className="
                                absolute
                                right-3
                                top-1/2
                                -translate-y-1/2
                                p-1.5
                                rounded-full
                                text-gray-400
                                hover:text-gray-700
                                hover:bg-gray-100
                            "
                        >
                            <X size={18} />
                        </button>

                    )}

                </div>

            </div>


            {/* =================================
                TABLE
            ================================= */}

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
                        min-w-[900px]
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
                                    Image
                                </th>

                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                    font-semibold
                                    inter
                                ">
                                    Title
                                </th>

                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                    font-semibold
                                    inter
                                ">
                                    Position
                                </th>

                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                    font-semibold
                                    inter
                                ">
                                    Link
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

                            {paginatedAds.length === 0 ? (

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
                                            ? "No advertisements match your search"
                                            : "No Advertisements Found"
                                        }
                                    </td>

                                </tr>

                            ) : (

                                paginatedAds.map((ad) => (

                                    <tr
                                        key={ad.id}
                                        className="
                                            border-t
                                            border-gray-100
                                            hover:bg-[#E8EEF9]
                                            transition
                                        "
                                    >

                                        {/* IMAGE */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            <img
                                                src={`http://localhost:5000${ad.image}`}
                                                alt={ad.title}
                                                className="
                                                    w-24
                                                    h-16
                                                    rounded-xl
                                                    object-cover
                                                    border
                                                    border-gray-200
                                                "
                                            />

                                        </td>


                                        {/* TITLE */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            <p className="
                                                font-semibold
                                                text-[#14213D]
                                                inter
                                            ">
                                                {ad.title}
                                            </p>

                                        </td>


                                        {/* POSITION */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            <span className="
                                                text-gray-600
                                                inter
                                            ">
                                                {ad.position || "-"}
                                            </span>

                                        </td>


                                        {/* LINK */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            {ad.link_url ? (

                                                <a
                                                    href={ad.link_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="
                                                        text-[#14213D]
                                                        font-medium
                                                        hover:text-[#FBBF24]
                                                        hover:underline
                                                        inter
                                                    "
                                                >
                                                    Visit
                                                </a>

                                            ) : (

                                                <span className="
                                                    text-gray-400
                                                    inter
                                                ">
                                                    -
                                                </span>

                                            )}

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
                                                        Number(ad.is_active) === 1
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }
                                                `}
                                            >

                                                {Number(ad.is_active) === 1
                                                    ? "Active"
                                                    : "Inactive"
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

                                                {/* VIEW */}

                                                <Link
                                                    to={`/admin/advertisements/${ad.id}`}
                                                    className="
                                                        bg-[#14213D]
                                                        text-white
                                                        p-2
                                                        rounded-lg
                                                        hover:bg-[#1c2c52]
                                                        transition
                                                    "
                                                    title="View"
                                                >
                                                    <Eye size={18} />
                                                </Link>


                                                {/* EDIT */}

                                                <Link
                                                    to={`/admin/advertisements/edit/${ad.id}`}
                                                    className="
                                                        bg-[#FBBF24]
                                                        text-[#14213D]
                                                        p-2
                                                        rounded-lg
                                                        hover:bg-[#d3a120]
                                                        transition
                                                    "
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


                {/* =================================
                    PAGINATION
                ================================= */}

                <div className="px-5 pb-5">

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />

                </div>

            </div>

        </div>

    );

};

export default Ads;