import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Search } from "lucide-react";

import { getHotSales } from "../../api/hotSalesApi";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";

const HotSales = () => {

    const [hotSales, setHotSales] = useState([]);
    const [loading, setLoading] = useState(true);

    // =====================================================
    // SEARCH
    // =====================================================

    const [search, setSearch] = useState("");

    // =====================================================
    // PAGINATION
    // =====================================================

    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;


    // =====================================================
    // FETCH HOT SALES
    // =====================================================

    const fetchHotSales = async () => {

        try {

            setLoading(true);

            const res = await getHotSales();

            setHotSales(
                res.data.hotSales || []
            );

        } catch (error) {

            console.log(
                "GET HOT SALES ERROR:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // USE EFFECT
    // =====================================================

    useEffect(() => {

        fetchHotSales();

    }, []);


    // =====================================================
    // SEARCH
    // Search by:
    // title
    // city
    // property type
    // status
    // =====================================================

    const searchText =
        search.trim().toLowerCase();


    const filteredHotSales =
        hotSales.filter((sale) => {

            if (!searchText) {
                return true;
            }

            const title =
                String(
                    sale.title || ""
                ).toLowerCase();

            const city =
                String(
                    sale.city || ""
                ).toLowerCase();

            const propertyType =
                String(
                    sale.property_type || ""
                ).toLowerCase();

            const status =
                String(
                    sale.status || ""
                ).toLowerCase();

            return (
                title.includes(searchText) ||
                city.includes(searchText) ||
                propertyType.includes(searchText) ||
                status.includes(searchText)
            );

        });


    // =====================================================
    // RESET PAGE WHEN SEARCH CHANGES
    // =====================================================

    useEffect(() => {

        setCurrentPage(1);

    }, [search]);


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalItems =
        filteredHotSales.length;


    const totalPages =
        Math.ceil(
            totalItems / itemsPerPage
        );


    const startIndex =
        (currentPage - 1) *
        itemsPerPage;


    const paginatedHotSales =
        filteredHotSales.slice(
            startIndex,
            startIndex + itemsPerPage
        );


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return <Loader />;

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="
            min-h-screen
            bg-[#E8EEF9]
            p-4
            sm:p-6
            lg:p-8
        ">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="
                flex
                flex-col
                lg:flex-row
                lg:justify-between
                lg:items-center
                gap-4
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
                        Hot Sales
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
                        {hotSales.length}
                    </span>

                </span>

            </div>


            {/* =====================================================
                SEARCH BAR
            ===================================================== */}

            <div className="
                bg-white
                rounded-2xl
                shadow-sm
                border
                border-gray-100
                p-4
                mb-5
            ">

                <div className="
                    relative
                    w-full
                    
                ">

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
                            Search by title, city, property type or status...
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


            {/* =====================================================
                TABLE
            ===================================================== */}

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
                        min-w-[800px]
                    ">

                        {/* =====================================================
                            TABLE HEADER
                        ===================================================== */}

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
                                    Price
                                </th>

                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                    font-semibold
                                    inter
                                ">
                                    City
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


                        {/* =====================================================
                            TABLE BODY
                        ===================================================== */}

                        <tbody>

                            {paginatedHotSales.length === 0 ? (

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

                                        {searchText
                                            ? "No Hot Sales Found for your search"
                                            : "No Hot Sales Found"
                                        }

                                    </td>

                                </tr>

                            ) : (

                                paginatedHotSales.map(
                                    (sale) => (

                                        <tr
                                            key={sale.id}
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
                                                    src={
                                                        `http://localhost:5000${sale.main_image}`
                                                    }
                                                    alt={
                                                        sale.title
                                                    }
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
                                                    {sale.title}
                                                </p>

                                            </td>


                                            {/* PRICE */}

                                            <td className="
                                                px-5
                                                py-4
                                            ">

                                                <span className="
                                                    font-semibold
                                                    text-[#14213D]
                                                    inter
                                                ">

                                                    Rs.{" "}

                                                    {Number(
                                                        sale.price
                                                    ).toLocaleString()}

                                                </span>

                                            </td>


                                            {/* CITY */}

                                            <td className="
                                                px-5
                                                py-4
                                                text-gray-600
                                                inter
                                            ">
                                                {sale.city}
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
                                                            sale.status === "active"

                                                                ? "bg-green-100 text-green-700"

                                                                : sale.status === "sold"

                                                                ? "bg-red-100 text-red-700"

                                                                : "bg-[#FFF4D6] text-[#A16207]"
                                                        }
                                                    `}
                                                >

                                                    {sale.status}

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
                                                        to={`/admin/hot-sales/${sale.id}`}
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

                                                        <Eye
                                                            size={18}
                                                        />

                                                    </Link>


                                                    {/* EDIT */}

                                                    <Link
                                                        to={`/admin/hot-sales/edit/${sale.id}`}
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

                                                        <Pencil
                                                            size={18}
                                                        />

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


                {/* =====================================================
                    PAGINATION
                ===================================================== */}

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

export default HotSales;