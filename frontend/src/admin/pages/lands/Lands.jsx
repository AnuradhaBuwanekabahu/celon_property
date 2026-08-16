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

import { getLands } from "../../api/landApi";

import Loader from "../../components/Loader";

import Pagination from "../../components/Pagination";


const Lands = () => {

    // =====================================================
    // STATE
    // =====================================================

    const [lands, setLands] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);


    // =====================================================
    // CONFIG
    // =====================================================

    const API_URL =
        import.meta.env.VITE_BACKEND_URL;

    const itemsPerPage = 10;


    // =====================================================
    // FETCH LANDS
    // =====================================================

    const fetchLands = async () => {

        try {

            setLoading(true);

            const res = await getLands();

            console.log(
                "Lands:",
                res.data
            );

            setLands(
                res.data.data || []
            );

        } catch (error) {

            console.error(error);

            toast.error(
                "Failed to load lands"
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // USE EFFECT
    // =====================================================

    useEffect(() => {

        fetchLands();

    }, []);


    // =====================================================
    // SEARCH FILTER
    // =====================================================

    const filteredLands = useMemo(() => {

        const keyword =
            search
                .trim()
                .toLowerCase();

        // No search
        if (!keyword) {

            return lands;

        }


        return lands.filter((land) => {

            const title =
                String(
                    land.title || ""
                ).toLowerCase();


            const city =
                String(
                    land.city || ""
                ).toLowerCase();


            const status =
                String(
                    land.status || ""
                ).toLowerCase();


            const landSize =
                String(
                    land.land_size || ""
                ).toLowerCase();


            const sizeUnit =
                String(
                    land.size_unit || ""
                ).toLowerCase();


            const location =
                String(
                    land.location || ""
                ).toLowerCase();


            const description =
                String(
                    land.description || ""
                ).toLowerCase();


            return (

                title.includes(keyword) ||

                city.includes(keyword) ||

                status.includes(keyword) ||

                landSize.includes(keyword) ||

                sizeUnit.includes(keyword) ||

                location.includes(keyword) ||

                description.includes(keyword)

            );

        });

    }, [lands, search]);


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
        filteredLands.length;


    const totalPages =
        Math.ceil(
            totalItems /
            itemsPerPage
        );


    const startIndex =
        (currentPage - 1) *
        itemsPerPage;


    const paginatedLands =
        filteredLands.slice(
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
                        Lands
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
                        {lands.length}
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
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="
                            Search by title, city, status, size or location...
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


                        {/* =================================================
                            TABLE HEADER
                        ================================================= */}

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
                                    Land Size
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


                        {/* =================================================
                            TABLE BODY
                        ================================================= */}

                        <tbody>

                            {paginatedLands.length === 0 ? (

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
                                            ? "No lands found for your search"
                                            : "No Lands Found"
                                        }

                                    </td>

                                </tr>

                            ) : (

                                paginatedLands.map(
                                    (land) => (

                                        <tr
                                            key={land.id}
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
                                                        land.main_image
                                                            ? `${API_URL}${land.main_image}`
                                                            : "/no-image.png"
                                                    }
                                                    alt={
                                                        land.title
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
                                                    {land.title}
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
                                                        land.price || 0
                                                    ).toLocaleString()}

                                                </span>

                                            </td>


                                            {/* LAND SIZE */}

                                            <td className="
                                                px-5
                                                py-4
                                            ">

                                                <span className="
                                                    text-gray-600
                                                    inter
                                                ">

                                                    {land.land_size || 0}{" "}

                                                    {land.size_unit || ""}

                                                </span>

                                            </td>


                                            {/* CITY */}

                                            <td className="
                                                px-5
                                                py-4
                                                text-gray-600
                                                inter
                                            ">

                                                {land.city || "-"}

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
                                                            land.status === "active"
                                                                ? "bg-green-100 text-green-700"
                                                                : land.status === "sold"
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-[#FFF4D6] text-[#A16207]"
                                                        }
                                                    `}
                                                >

                                                    {land.status ||
                                                        "pending"}

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
                                                        to={`/admin/lands/${land.id}`}
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
                                                        to={`/admin/lands/edit/${land.id}`}
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


export default Lands;