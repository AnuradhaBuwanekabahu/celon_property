const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage
}) => {

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="
            flex
            items-center
            justify-center
            gap-2
            mt-6
            mb-6
            pt-5
            border-t
            border-gray-200
        ">

            {/* PREVIOUS */}
            <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                    onPageChange(currentPage - 1)
                }
                className="
                    px-4
                    py-2
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    text-sm
                    font-medium
                    text-gray-700
                    hover:bg-gray-50
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    transition
                "
            >
                Previous
            </button>


            {/* PAGE NUMBERS */}
            <div className="flex items-center gap-2">

                {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                ).map((page) => (

                    <button
                        key={page}
                        type="button"
                        onClick={() =>
                            onPageChange(page)
                        }
                        className={`
                            min-w-[40px]
                            h-10
                            px-3
                            rounded-lg
                            text-sm
                            font-medium
                            transition
                            ${
                                currentPage === page
                                    ? "bg-[#14213D] text-white shadow-sm"
                                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            }
                        `}
                    >
                        {page}
                    </button>

                ))}

            </div>


            {/* NEXT */}
            <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                    onPageChange(currentPage + 1)
                }
                className="
                    px-4
                    py-2
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    text-sm
                    font-medium
                    text-gray-700
                    hover:bg-gray-50
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    transition
                "
            >
                Next
            </button>

        </div>
    );
};

export default Pagination;