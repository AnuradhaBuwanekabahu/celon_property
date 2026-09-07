import React from 'react'
import { X } from 'lucide-react'

const SearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search by name, city',
}) => {
  const [internalSearch, setInternalSearch] = React.useState('')
  const searchValue = value !== undefined ? value : internalSearch

  const handleChange = (nextValue) => {
    if (onChange) onChange(nextValue)
    else setInternalSearch(nextValue)
  }

  const handleClear = () => {
    if (onClear) onClear()
    else setInternalSearch('')
  }

  return (
    <div className="mb-5 flex justify-end">
      <div className="flex h-11 w-full max-w-md items-center rounded-full border border-[#14213D]/20 bg-white px-3 shadow-sm">

        {/* Search Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 30 30"
          fill="#6B7280"
          className="mr-2 shrink-0"
        >
          <path d="M13 3C7.489 3 3 7.489 3 13s4.489 10 10 10a9.95 9.95 0 0 0 6.322-2.264l5.971 5.971a1 1 0 1 0 1.414-1.414l-5.97-5.97A9.95 9.95 0 0 0 23 13c0-5.511-4.489-10-10-10m0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8" />
        </svg>

        {/* Input */}
        <input
          type="text"
          value={searchValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
        />

        {/* X Clear Button */}
        {searchValue && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="
              ml-2
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-full
              text-[#14213D]
              transition
              hover:bg-[#E5E5E5]
              hover:text-[#FBBF24]
            "
          >
            <X
              size={17}
              strokeWidth={2.5}
            />
          </button>
        )}

      </div>
    </div>
  )
}

export default SearchBar