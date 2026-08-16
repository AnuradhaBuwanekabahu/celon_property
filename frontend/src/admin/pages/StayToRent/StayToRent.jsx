import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import { Link } from "react-router-dom";

import {
    Eye,
    Pencil,
    Search
} from "lucide-react";

import { getStayToRent } from "../../api/stayToRentApi";

import Loader from "../../components/Loader";

import Pagination from "../../components/Pagination";


const StayToRent = () => {

    const [properties, setProperties] = useState([]);

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
    // FETCH STAY TO RENT
    // ==========================================

    const fetchStayToRent = async () => {

        try {

            setLoading(true);

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
    // SEARCH FILTER
    // ==========================================

    const filteredProperties = useMemo(() => {

        const keyword =
            search.trim().toLowerCase();


        // Show all when search is empty

        if (!keyword) {

            return properties;

        }


        return properties.filter((property) => {

            const title =
                String(
                    property.title || ""
                ).toLowerCase();


            const city =
                String(
                    property.city || ""
                ).toLowerCase();


            const propertyType =
                String(
                    property.property_type || ""
                ).toLowerCase();


            const pricePeriod =
                String(
                    property.price_period || ""
                ).toLowerCase();


            const status =
                String(
                    property.status || ""
                ).toLowerCase();


            return (

                title.includes(keyword) ||

                city.includes(keyword) ||

                propertyType.includes(keyword) ||

                pricePeriod.includes(keyword) ||

                status.includes(keyword)

            );

        });

    }, [properties, search]);


    // ==========================================
    // RESET PAGE WHEN SEARCH CHANGES
    // ==========================================

    useEffect(() => {

        setCurrentPage(1);

    }, [search]);


    // ==========================================
    // PAGINATION
    // ==========================================

    const totalItems =
        filteredProperties.length;


    const totalPages =
        Math.ceil(
            totalItems / itemsPerPage
        );


    const startIndex =
        (currentPage - 1) *
        itemsPerPage;


    const paginatedProperties =
        filteredProperties.slice(
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
    // UI
    // ==========================================

    return (

        <div className="
            min-h-screen
            bg-[#E8EEF9]
            p-4
            sm:p-6
            lg:p-8
        ">


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
                        Stay To Rent
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
                        {properties.length}
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
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="
                            Search by title, city, property type, price period or status...
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


                        {/* ==========================================
                            TABLE HEADER
                        ========================================== */}

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
                                    Price Period
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


                        {/* ==========================================
                            TABLE BODY
                        ========================================== */}

                        <tbody>

                            {paginatedProperties.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="
                                            text-center
                                            py-12
                                            text-gray-500
                                            inter
                                        "
                                    >

                                        {search
                                            ? "No Stay To Rent Properties Found for your search"
                                            : "No Stay To Rent Properties Found"
                                        }

                                    </td>

                                </tr>

                            ) : (

                                paginatedProperties.map(
                                    (property) => (

                                        <tr
                                            key={property.id}
                                            className="
                                                border-t
                                                border-gray-100
                                                hover:bg-[#E8EEF9]
                                                transition
                                            "
                                        >


                                            {/* ==================================
                                                IMAGE
                                            ================================== */}

                                            <td className="
                                                px-5
                                                py-4
                                            ">

                                                {property.main_image ? (

                                                    <img
                                                        src={`http://localhost:5000${property.main_image}`}
                                                        alt={
                                                            property.title
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

                                                ) : (

                                                    <div className="
                                                        w-24
                                                        h-16
                                                        rounded-xl
                                                        bg-gray-100
                                                        border
                                                        border-gray-200
                                                        flex
                                                        items-center
                                                        justify-center
                                                        text-xs
                                                        text-gray-500
                                                        inter
                                                    ">
                                                        No Image
                                                    </div>

                                                )}

                                            </td>


                                            {/* ==================================
                                                TITLE
                                            ================================== */}

                                            <td className="
                                                px-5
                                                py-4
                                            ">

                                                <p className="
                                                    font-semibold
                                                    text-[#14213D]
                                                    inter
                                                ">
                                                    {property.title}
                                                </p>


                                                <p className="
                                                    text-sm
                                                    text-gray-500
                                                    mt-1
                                                    inter
                                                ">
                                                    {property.property_type || "N/A"}
                                                </p>

                                            </td>


                                            {/* ==================================
                                                PRICE
                                            ================================== */}

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
                                                        property.price || 0
                                                    ).toLocaleString(
                                                        "en-LK"
                                                    )}

                                                </span>

                                            </td>


                                            {/* ==================================
                                                CITY
                                            ================================== */}

                                            <td className="
                                                px-5
                                                py-4
                                                text-gray-600
                                                inter
                                            ">

                                                {property.city || "N/A"}

                                            </td>


                                            {/* ==================================
                                                PRICE PERIOD
                                            ================================== */}

                                            <td className="
                                                px-5
                                                py-4
                                            ">

                                                <span className="
                                                    capitalize
                                                    text-gray-600
                                                    inter
                                                ">

                                                    {
                                                        property.price_period ||
                                                        "monthly"
                                                    }

                                                </span>

                                            </td>


                                            {/* ==================================
                                                STATUS
                                            ================================== */}

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
                                                            property.status ===
                                                            "active"

                                                                ? "bg-green-100 text-green-700"

                                                                : property.status ===
                                                                  "sold"

                                                                ? "bg-red-100 text-red-700"

                                                                : "bg-[#FFF4D6] text-[#A16207]"
                                                        }
                                                    `}
                                                >

                                                    {
                                                        property.status ||
                                                        "pending"
                                                    }

                                                </span>

                                            </td>


                                            {/* ==================================
                                                ACTIONS
                                            ================================== */}

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
                                                        to={`/admin/stay-to-rent/${property.id}`}
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
                                                        to={`/admin/stay-to-rent/edit/${property.id}`}
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


                {/* ==========================================
                    PAGINATION
                ========================================== */}

                <div className="
                    px-5
                    pb-5
                ">

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


export default StayToRent;