import { Search, X } from "lucide-react";

const SearchBar = ({
    value,
    onChange,
    placeholder = "Search..."
}) => {

    return (

        <div className="relative w-full">

            <Search
                size={18}
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
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                placeholder={placeholder}
                className="
                    w-full
                    border
                    border-gray-300
                    rounded-xl
                    pl-10
                    pr-10
                    py-3
                    text-sm
                    outline-none
                    focus:ring-2
                    focus:ring-[#FCA311]
                "
            />

            {value && (

                <button
                    type="button"
                    onClick={() => onChange("")}
                    className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        hover:text-gray-700
                    "
                >
                    <X size={17} />
                </button>

            )}

        </div>

    );

};

export default SearchBar;