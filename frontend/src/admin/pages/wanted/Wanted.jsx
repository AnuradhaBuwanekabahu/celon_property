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

import { toast } from "react-toastify";

import { getWanted } from "../../api/wantedApi";

import Loader from "../../components/Loader";

import Pagination from "../../components/Pagination";


const Wanted = () => {

    const [properties, setProperties] = useState([]);

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
    // LOAD WANTED
    // =====================================================

    useEffect(() => {

        loadWanted();

    }, []);


    const loadWanted = async () => {

        try {

            setLoading(true);

            const res = await getWanted();

            console.log(
                "WANTED API RESPONSE:",
                res.data
            );

            setProperties(
                Array.isArray(res.data?.data)
                    ? res.data.data
                    : []
            );

        } catch (error) {

            console.error(
                "GET WANTED ERROR:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to load wanted properties"
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // SEARCH FILTER
    // =====================================================

    const filteredProperties = useMemo(() => {

        const keyword =
            search.trim().toLowerCase();

        if (!keyword) {

            return properties;

        }

        return properties.filter(
            (property) => {

                const title =
                    String(
                        property.title || ""
                    ).toLowerCase();

                const city =
                    String(
                        property.preferred_city || ""
                    ).toLowerCase();

                const phone =
                    String(
                        property.phone_number || ""
                    ).toLowerCase();

                const status =
                    String(
                        property.status || ""
                    ).toLowerCase();

                const fullName =
                    String(
                        property.full_name || ""
                    ).toLowerCase();

                const budget =
                    String(
                        property.budget || ""
                    ).toLowerCase();

                return (
                    title.includes(keyword) ||
                    city.includes(keyword) ||
                    phone.includes(keyword) ||
                    status.includes(keyword) ||
                    fullName.includes(keyword) ||
                    budget.includes(keyword)
                );

            }
        );

    }, [properties, search]);


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


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return <Loader />;

    }


    // =====================================================
    // PAGE
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
                        Wanted Properties
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
                            Search by title, city, phone, name, budget or status...
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
                                ">
                                    Title
                                </th>


                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                ">
                                    Budget
                                </th>


                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                ">
                                    City
                                </th>


                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                ">
                                    Phone
                                </th>


                                <th className="
                                    px-5
                                    py-4
                                    text-left
                                ">
                                    Status
                                </th>


                                <th className="
                                    px-5
                                    py-4
                                    text-center
                                ">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        {/* TABLE BODY */}

                        <tbody>

                            {paginatedProperties.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="
                                            text-center
                                            py-12
                                            text-gray-500
                                        "
                                    >

                                        {search
                                            ? "No wanted properties found for your search"
                                            : "No Wanted Properties Found"
                                        }

                                    </td>

                                </tr>

                            ) : (

                                paginatedProperties.map(
                                    (property) => {

                                        


                                        return (

                                            <tr
                                                key={property.id}
                                                className="
                                                    border-t
                                                    border-gray-100
                                                    hover:bg-[#E8EEF9]
                                                    transition
                                                "
                                            >


                                         



                                                {/* TITLE */}

                                                <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                    <p className="
                                                        font-semibold
                                                        text-[#14213D]
                                                    ">
                                                        {property.title || "-"}
                                                    </p>


                                                    

                                                </td>


                                                {/* BUDGET */}

                                                <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                    {property.budget ? (

                                                        <span className="
                                                            font-semibold
                                                            text-[#14213D]
                                                        ">

                                                            Rs.{" "}

                                                            {Number(
                                                                property.budget
                                                            ).toLocaleString()}

                                                        </span>

                                                    ) : (

                                                        <span className="
                                                            text-gray-500
                                                        ">
                                                            -
                                                        </span>

                                                    )}

                                                </td>


                                                {/* CITY */}

                                                <td className="
                                                    px-5
                                                    py-4
                                                    text-gray-600
                                                ">
                                                    {property.preferred_city || "-"}
                                                </td>


                                                {/* PHONE */}

                                                <td className="
                                                    px-5
                                                    py-4
                                                    text-gray-600
                                                ">
                                                    {property.phone_number || "-"}
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

                                                            ${
                                                                property.status === "active"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : property.status === "closed"
                                                                    ? "bg-red-100 text-red-700"
                                                                    : "bg-[#FFF4D6] text-[#A16207]"
                                                            }
                                                        `}
                                                    >

                                                        {property.status ||
                                                            "pending"
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
                                                            to={`/admin/wanted/${property.id}`}
                                                            title="View"
                                                            className="
                                                                bg-[#14213D]
                                                                text-white
                                                                p-2
                                                                rounded-lg
                                                                hover:bg-[#1c2c52]
                                                                transition
                                                            "
                                                        >
                                                            <Eye size={18} />
                                                        </Link>


                                                        <Link
                                                            to={`/admin/wanted/edit/${property.id}`}
                                                            title="Edit"
                                                            className="
                                                                bg-[#FBBF24]
                                                                text-[#14213D]
                                                                p-2
                                                                rounded-lg
                                                                hover:bg-[#d3a120]
                                                                transition
                                                            "
                                                        >
                                                            <Pencil size={18} />
                                                        </Link>

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )

                            )}

                        </tbody>

                    </table>

                </div>


                {/* =====================================================
                    PAGINATION
                ===================================================== */}

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


export default Wanted;