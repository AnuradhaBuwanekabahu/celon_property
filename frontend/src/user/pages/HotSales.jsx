import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Home as HomeIcon,
  MapPin,
  Ruler,
  Tag,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import PropertyCard from '../components/property/PropertyCard'
import PropertyPreviewPanel from '../components/property/PropertyPreviewPanel'
import Loader from '../components/property/Loader'

import { getAds, getHotSales } from '../Routers'
import { districtOptions } from '../../assets/data.js'
import SearchBar from '../components/property/SearchBar'

function HotSales() {
  const location = useLocation()
  const navigate = useNavigate()

  const [propertyTypes] = useState([
    'House',
    'Apartment',
    'Bungalow',
    'Hotel',
    'WareHouse',
    'Villa',
    'Studio',
  ])

  // ---------------------------------------
  // URL filters
  // ---------------------------------------

  const queryParams = new URLSearchParams(location.search)

  const typeFromURL =
    (queryParams.get('type') || '').toLowerCase()

  const districtFromURL =
    queryParams.get('district') || ''

  const areaFromURL =
    queryParams.get('area') || ''

  const priceFromURL =
    queryParams.get('price') || ''

  const [hoveredProperty, setHoveredProperty] =
    useState(null)

  const [searchTerm, setSearchTerm] =
    useState('')

  const [openFilter, setOpenFilter] =
    useState(null)

  const [selectedType, setSelectedType] =
    useState(typeFromURL)

  const [selectedDistricts, setSelectedDistricts] =
    useState(
      districtFromURL
        ? [districtFromURL]
        : []
    )

  const [selectedAreaRange, setSelectedAreaRange] =
    useState(areaFromURL)

  const [selectedPriceRange, setSelectedPriceRange] =
    useState(priceFromURL)

  const [properties, setProperties] =
    useState([])

  const [ads, setAds] =
    useState([])

  const [currentAd, setCurrentAd] =
    useState(0)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState(null)

  // ---------------------------------------
  // Sync filters with URL
  // ---------------------------------------

  useEffect(() => {
    const params =
      new URLSearchParams(location.search)

    setSelectedType(
      (params.get('type') || '').toLowerCase()
    )

    const district =
      params.get('district') || ''

    setSelectedDistricts(
      district
        ? [district]
        : []
    )

    setSelectedAreaRange(
      params.get('area') || ''
    )

    setSelectedPriceRange(
      params.get('price') || ''
    )
  }, [location.search])

  // ---------------------------------------
  // Get Hot Sales
  // ---------------------------------------

  useEffect(() => {
    setLoading(true)
    setError(null)

    getHotSales()
      .then((data) => {
        setProperties(
          Array.isArray(data)
            ? data
            : []
        )
      })
      .catch((err) => {
        console.error(
          'Failed to fetch hot sales:',
          err
        )

        setError(
          err?.message ||
          'Failed to load properties'
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // ---------------------------------------
  // Get Advertisements
  // ---------------------------------------

  useEffect(() => {
    getAds()
      .then((data) => {
        const safeAds =
          Array.isArray(data)
            ? data
            : []

        const subPageAds =
          safeAds.filter(
            (ad) =>
              ad.position === 'sub_pages' &&
              Boolean(ad.isActive)
          )

        setAds(subPageAds)
        setCurrentAd(0)
      })
      .catch((err) => {
        console.error(
          'Failed to fetch advertisements:',
          err
        )
      })
  }, [])

  // ---------------------------------------
  // Auto change advertisement every 5 sec
  // ---------------------------------------

  useEffect(() => {
    if (ads.length <= 1) return

    const interval =
      setInterval(() => {
        setCurrentAd((prev) =>
          prev === ads.length - 1
            ? 0
            : prev + 1
        )
      }, 5000)

    return () =>
      clearInterval(interval)
  }, [ads.length])

  // ---------------------------------------
  // Filter Properties
  // ---------------------------------------

  const filteredProperties =
    properties.filter((property) => {
      const searchText =
        searchTerm
          .trim()
          .toLowerCase()

      // Search
      const matchesSearch =
        !searchText
          ? true
          : [
              property.title,
              property.location,
              property.city,
              property.district,
              property.tag,
              property.propertyType,
              property.property_type,
            ].some((value) =>
              String(value || '')
                .toLowerCase()
                .includes(searchText)
            )

      // Property Type
      const propertyType =
        String(
          property.tag ||
          property.property_type ||
          property.propertyType ||
          ''
        ).toLowerCase()

      const matchesType =
        selectedType
          ? propertyType ===
            selectedType.toLowerCase()
          : true

      // District
      const propertyDistrict =
        String(
          property.district || ''
        ).toLowerCase()

      const matchesDistrict =
        selectedDistricts.length > 0
          ? selectedDistricts.some(
              (district) =>
                propertyDistrict.includes(
                  String(district).toLowerCase()
                )
            )
          : true

      // Area
      const areaValue =
        Number(
          property.area_sqft || 0
        )

      const matchesArea =
        selectedAreaRange === 'under-1000'
          ? areaValue < 1000

          : selectedAreaRange === '1000-2500'
            ? areaValue >= 1000 &&
              areaValue <= 2500

            : selectedAreaRange === '2500-5000'
              ? areaValue > 2500 &&
                areaValue <= 5000

              : selectedAreaRange === '5000-10000'
                ? areaValue > 5000 &&
                  areaValue <= 10000

                : selectedAreaRange === 'above-10000'
                  ? areaValue > 10000

                  : true

      // Price
      const priceValue =
        Number(
          property.priceRs ||
          property.price ||
          0
        )

      const matchesPrice =
        selectedPriceRange === 'under-50'
          ? priceValue < 50000000

          : selectedPriceRange === '50-150'
            ? priceValue >= 50000000 &&
              priceValue <= 150000000

            : selectedPriceRange === 'above-150'
              ? priceValue > 150000000

              : true

      return (
        matchesSearch &&
        matchesType &&
        matchesDistrict &&
        matchesArea &&
        matchesPrice
      )
    })

  // ---------------------------------------
  // Clear Filters
  // ---------------------------------------

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedType('')
    setSelectedDistricts([])
    setSelectedAreaRange('')
    setSelectedPriceRange('')

    setHoveredProperty(null)

    navigate('/hot-sales', {
      replace: true,
    })
  }

  // ---------------------------------------
  // Property Click
  // ---------------------------------------

  const handlePropertyClick = (property) => {
    // Mobile / Tablet
    if (window.innerWidth < 1024) {
      navigate(
        `/property/hotsale/${property.id}`
      )
      return
    }

    // Desktop
    setHoveredProperty((current) =>
      current &&
      current.id === property.id
        ? null
        : property
    )
  }

  // =======================================
  // FULL SCREEN LOADER
  // =======================================

  if (loading) {
    return <Loader />
  }

  // =======================================
  // MAIN PAGE
  // =======================================

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <div
        className={`
          grid
          grid-cols-1
          gap-6
          lg:gap-8
          ${
            hoveredProperty
              ? 'lg:grid-cols-[280px_1fr_360px]'
              : 'lg:grid-cols-[280px_1fr]'
          }
        `}
      >

        {/* ===================================== */}
        {/* SIDEBAR */}
        {/* ===================================== */}

        <aside
          className="
            lg:sticky
            lg:top-24
            lg:max-h-[calc(100vh-6rem)]
            lg:overflow-y-auto
          "
        >

          {/* Search */}

          <div className="mb-5">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() =>
                setSearchTerm('')
              }
            />
          </div>

          {/* Filter Header */}

          <div className="flex items-center justify-between mb-5 px-1">

            <h3 className="text-lg font-semibold text-[#14213D]">
              Find Your Property
            </h3>

            <button
              type="button"
              onClick={clearFilters}
              className="
                text-xs
                font-semibold
                text-[#14213D]
                border
                border-[#E5E5E5]
                hover:bg-[#FBBF24]
                hover:border-[#FBBF24]
                px-3
                py-2
                rounded-lg
                transition
              "
            >
              Clear All
            </button>

          </div>

          {/* ===================================== */}
          {/* PROPERTY TYPE */}
          {/* ===================================== */}

          <div
            className="
              bg-[#FFFFFF]
              border
              border-[#E5E5E5]
              rounded-2xl
              mb-4
              overflow-hidden
              shadow-sm
            "
          >

            <button
              type="button"
              onClick={() =>
                setOpenFilter(
                  openFilter === 'type'
                    ? null
                    : 'type'
                )
              }
              className="
                w-full
                flex
                items-center
                justify-between
                px-5
                py-4
                hover:bg-[#E5E5E5]/30
                transition
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    w-9
                    h-9
                    rounded-xl
                    bg-[#14213D]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <HomeIcon
                    size={17}
                    className="text-[#FBBF24]"
                  />
                </div>

                <div className="text-left">
                  <p className="text-sm font-semibold text-[#14213D]">
                    Property Type
                  </p>
                </div>

              </div>

              <ChevronRight
                size={18}
                className={`
                  text-[#14213D]
                  transition-transform
                  duration-200
                  ${
                    openFilter === 'type'
                      ? 'rotate-90'
                      : ''
                  }
                `}
              />

            </button>

            <div
              className={`
                px-5
                pb-5
                ${
                  openFilter === 'type'
                    ? 'block'
                    : 'hidden'
                }
                lg:block
              `}
            >

              <select
                value={selectedType}
                onChange={(e) =>
                  setSelectedType(
                    e.target.value
                  )
                }
                className="
                  w-full
                  appearance-none
                  border
                  border-[#E5E5E5]
                  bg-[#FFFFFF]
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  text-[#14213D]
                  font-medium
                  outline-none
                  focus:border-[#FBBF24]
                  focus:ring-2
                  focus:ring-[#FBBF24]/30
                  transition
                  cursor-pointer
                "
              >

                <option value="">
                  All Property Types
                </option>

                {propertyTypes.map(
                  (type) => (
                    <option
                      key={type}
                      value={type.toLowerCase()}
                    >
                      {type}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

          {/* ===================================== */}
          {/* DISTRICT */}
          {/* ===================================== */}

          <div
            className="
              bg-[#FFFFFF]
              border
              border-[#E5E5E5]
              rounded-2xl
              mb-4
              overflow-hidden
              shadow-sm
            "
          >

            <button
              type="button"
              onClick={() =>
                setOpenFilter(
                  openFilter === 'district'
                    ? null
                    : 'district'
                )
              }
              className="
                w-full
                flex
                items-center
                justify-between
                px-5
                py-4
                hover:bg-[#E5E5E5]/30
                transition
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    w-9
                    h-9
                    rounded-xl
                    bg-[#14213D]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <MapPin
                    size={17}
                    className="text-[#FBBF24]"
                  />
                </div>

                <div className="text-left">
                  <p className="text-sm font-semibold text-[#14213D]">
                    District
                  </p>
                </div>

              </div>

              <ChevronRight
                size={18}
                className={`
                  text-[#14213D]
                  transition-transform
                  duration-200
                  ${
                    openFilter === 'district'
                      ? 'rotate-90'
                      : ''
                  }
                `}
              />

            </button>

            <div
              className={`
                space-y-2.5
                max-h-52
                overflow-y-auto
                px-5
                pb-5
                ${
                  openFilter === 'district'
                    ? 'block'
                    : 'hidden'
                }
                lg:block
              `}
            >

              {districtOptions.map(
                (district) => (
                  <label
                    key={district}
                    className="
                      flex
                      items-center
                      gap-3
                      text-sm
                      text-[#000000]/70
                      cursor-pointer
                      group
                    "
                  >

                    <input
                      type="checkbox"
                      checked={selectedDistricts.includes(
                        district
                      )}
                      onChange={(e) => {

                        if (e.target.checked) {

                          setSelectedDistricts(
                            (prev) => [
                              ...prev,
                              district,
                            ]
                          )

                        } else {

                          setSelectedDistricts(
                            (prev) =>
                              prev.filter(
                                (item) =>
                                  item !==
                                  district
                              )
                          )

                        }

                      }}
                      className="
                        w-4
                        h-4
                        rounded
                        border-[#E5E5E5]
                        accent-[#FBBF24]
                      "
                    />

                    <span
                      className="
                        group-hover:text-[#14213D]
                        transition
                      "
                    >
                      {district}
                    </span>

                  </label>
                )
              )}

            </div>

          </div>

          {/* ===================================== */}
          {/* PROPERTY AREA */}
          {/* ===================================== */}

          <div
            className="
              bg-[#FFFFFF]
              border
              border-[#E5E5E5]
              rounded-2xl
              mb-4
              overflow-hidden
              shadow-sm
            "
          >

            <button
              type="button"
              onClick={() =>
                setOpenFilter(
                  openFilter === 'area'
                    ? null
                    : 'area'
                )
              }
              className="
                w-full
                flex
                items-center
                justify-between
                px-5
                py-4
                hover:bg-[#E5E5E5]/30
                transition
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    w-9
                    h-9
                    rounded-xl
                    bg-[#14213D]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Ruler
                    size={17}
                    className="text-[#FBBF24]"
                  />
                </div>

                <div className="text-left">
                  <p className="text-sm font-semibold text-[#14213D]">
                    Area
                  </p>
                </div>

              </div>

              <ChevronRight
                size={18}
                className={`
                  text-[#14213D]
                  transition-transform
                  duration-200
                  ${
                    openFilter === 'area'
                      ? 'rotate-90'
                      : ''
                  }
                `}
              />

            </button>

            <div
              className={`
                px-5
                pb-5
                ${
                  openFilter === 'area'
                    ? 'block'
                    : 'hidden'
                }
                lg:block
              `}
            >

              <select
                value={selectedAreaRange}
                onChange={(e) =>
                  setSelectedAreaRange(
                    e.target.value
                  )
                }
                className="
                  w-full
                  appearance-none
                  border
                  border-[#E5E5E5]
                  bg-[#FFFFFF]
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  text-[#14213D]
                  font-medium
                  outline-none
                  focus:border-[#FBBF24]
                  focus:ring-2
                  focus:ring-[#FBBF24]/30
                  transition
                  cursor-pointer
                "
              >

                <option value="">
                  Any Area
                </option>

                <option value="under-1000">
                  Under 1,000 sq ft
                </option>

                <option value="1000-2500">
                  1,000 - 2,500 sq ft
                </option>

                <option value="2500-5000">
                  2,500 - 5,000 sq ft
                </option>

                <option value="5000-10000">
                  5,000 - 10,000 sq ft
                </option>

                <option value="above-10000">
                  Above 10,000 sq ft
                </option>

              </select>

            </div>

          </div>

          {/* ===================================== */}
          {/* PRICE */}
          {/* ===================================== */}

          <div
            className="
              bg-[#FFFFFF]
              border
              border-[#E5E5E5]
              rounded-2xl
              mb-6
              overflow-hidden
              shadow-sm
            "
          >

            <button
              type="button"
              onClick={() =>
                setOpenFilter(
                  openFilter === 'price'
                    ? null
                    : 'price'
                )
              }
              className="
                w-full
                flex
                items-center
                justify-between
                px-5
                py-4
                hover:bg-[#E5E5E5]/30
                transition
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    w-9
                    h-9
                    rounded-xl
                    bg-[#14213D]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Tag
                    size={17}
                    className="text-[#FBBF24]"
                  />
                </div>

                <div className="text-left">

                  <p className="text-sm font-semibold text-[#14213D]">
                    Price Range
                  </p>

                </div>

              </div>

              <ChevronRight
                size={18}
                className={`
                  text-[#14213D]
                  transition-transform
                  duration-200
                  ${
                    openFilter === 'price'
                      ? 'rotate-90'
                      : ''
                  }
                `}
              />

            </button>

            <div
              className={`
                space-y-2
                px-5
                pb-5
                ${
                  openFilter === 'price'
                    ? 'block'
                    : 'hidden'
                }
                lg:block
              `}
            >

              <label
                className="
                  flex
                  items-center
                  justify-between
                  p-3
                  rounded-xl
                  border
                  border-transparent
                  hover:border-[#E5E5E5]
                  hover:bg-[#E5E5E5]/30
                  cursor-pointer
                  transition
                "
              >

                <span className="text-sm text-[#000000]/70">
                  Under LKR 50M
                </span>

                <input
                  type="radio"
                  name="hotsale-price"
                  value="under-50"
                  checked={
                    selectedPriceRange ===
                    'under-50'
                  }
                  onChange={(e) =>
                    setSelectedPriceRange(
                      e.target.value
                    )
                  }
                  className="accent-[#FBBF24]"
                />

              </label>

              <label
                className="
                  flex
                  items-center
                  justify-between
                  p-3
                  rounded-xl
                  border
                  border-transparent
                  hover:border-[#E5E5E5]
                  hover:bg-[#E5E5E5]/30
                  cursor-pointer
                  transition
                "
              >

                <span className="text-sm text-[#000000]/70">
                  LKR 50M – 150M
                </span>

                <input
                  type="radio"
                  name="hotsale-price"
                  value="50-150"
                  checked={
                    selectedPriceRange ===
                    '50-150'
                  }
                  onChange={(e) =>
                    setSelectedPriceRange(
                      e.target.value
                    )
                  }
                  className="accent-[#FBBF24]"
                />

              </label>

              <label
                className="
                  flex
                  items-center
                  justify-between
                  p-3
                  rounded-xl
                  border
                  border-transparent
                  hover:border-[#E5E5E5]
                  hover:bg-[#E5E5E5]/30
                  cursor-pointer
                  transition
                "
              >

                <span className="text-sm text-[#000000]/70">
                  Above LKR 150M
                </span>

                <input
                  type="radio"
                  name="hotsale-price"
                  value="above-150"
                  checked={
                    selectedPriceRange ===
                    'above-150'
                  }
                  onChange={(e) =>
                    setSelectedPriceRange(
                      e.target.value
                    )
                  }
                  className="accent-[#FBBF24]"
                />

              </label>

              <label
                className="
                  flex
                  items-center
                  justify-between
                  p-3
                  rounded-xl
                  border
                  border-transparent
                  hover:border-[#E5E5E5]
                  hover:bg-[#E5E5E5]/30
                  cursor-pointer
                  transition
                "
              >

                <span className="text-sm font-medium text-[#14213D]">
                  All Prices
                </span>

                <input
                  type="radio"
                  name="hotsale-price"
                  value=""
                  checked={
                    selectedPriceRange === ''
                  }
                  onChange={() =>
                    setSelectedPriceRange('')
                  }
                  className="accent-[#FBBF24]"
                />

              </label>

            </div>

          </div>

          {/* ===================================== */}
          {/* ADVERTISEMENT */}
          {/* ===================================== */}

          <div
            className="
              relative
              w-full
              overflow-hidden
              rounded-2xl
              bg-[#FFFFFF]
              border
              border-[#E5E5E5]
              shadow-sm
            "
          >

            {ads.length > 0 ? (
              <>

                <a
                  href={
                    ads[currentAd]?.linkUrl ||
                    '#'
                  }
                  target={
                    ads[currentAd]?.linkUrl
                      ? '_blank'
                      : undefined
                  }
                  rel="noopener noreferrer"
                  className="
                    group
                    relative
                    flex
                    h-56
                    w-full
                    items-center
                    justify-center
                    overflow-hidden
                    sm:h-64
                    lg:h-72
                  "
                >

                  <div className="absolute inset-0 bg-[#FFFFFF]" />

                  <img
                    src={
                      ads[currentAd]?.image
                    }
                    alt={
                      ads[currentAd]?.title ||
                      'Advertisement'
                    }
                    className="
                      relative
                      z-10
                      h-full
                      w-full
                      object-contain
                      transition-transform
                      duration-500
                    "
                  />

                  {/* Label */}

                  <div
                    className="
                      absolute
                      left-4
                      top-4
                      z-30
                      flex
                      items-center
                      gap-2
                      rounded-lg
                      bg-[#14213D]
                      px-3
                      py-1.5
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-wide
                      text-[#FFFFFF]
                      shadow-lg
                    "
                  >

                    <span
                      className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-[#FBBF24]
                      "
                    />

                    Advertisement

                  </div>

                  {/* Title */}

                  {ads[currentAd]?.title && (
                    <div
                      className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        z-30
                        px-5
                        pb-5
                        pt-10
                      "
                    >

                      <p
                        className="
                          text-sm
                          font-semibold
                          text-[#14213D]
                          sm:text-base
                        "
                      >
                        {ads[currentAd].title}
                      </p>

                      {ads[currentAd]?.linkUrl && (
                        <p
                          className="
                            mt-1
                            text-xs
                            text-[#14213D]
                          "
                        >
                          Click to view
                        </p>
                      )}

                    </div>
                  )}

                </a>

                {/* Previous */}

                {ads.length > 1 && (
                  <button
                    type="button"
                    aria-label="Previous advertisement"
                    onClick={() =>
                      setCurrentAd((prev) =>
                        prev === 0
                          ? ads.length - 1
                          : prev - 1
                      )
                    }
                    className="
                      absolute
                      left-3
                      top-1/2
                      z-40
                      flex
                      h-9
                      w-9
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#E5E5E5]
                      bg-[#FFFFFF]/95
                      text-[#14213D]
                      shadow-lg
                      transition
                      hover:scale-110
                      hover:bg-[#FBBF24]
                    "
                  >
                    <ChevronLeft
                      size={18}
                      strokeWidth={2.5}
                    />
                  </button>
                )}

                {/* Next */}

                {ads.length > 1 && (
                  <button
                    type="button"
                    aria-label="Next advertisement"
                    onClick={() =>
                      setCurrentAd((prev) =>
                        prev === ads.length - 1
                          ? 0
                          : prev + 1
                      )
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      z-40
                      flex
                      h-9
                      w-9
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#E5E5E5]
                      bg-[#FFFFFF]/95
                      text-[#14213D]
                      shadow-lg
                      transition
                      hover:scale-110
                      hover:bg-[#FBBF24]
                    "
                  >
                    <ChevronRight
                      size={18}
                      strokeWidth={2.5}
                    />
                  </button>
                )}

                {/* Indicators */}

                {ads.length > 1 && (
                  <div
                    className="
                      absolute
                      bottom-3
                      left-1/2
                      z-40
                      flex
                      -translate-x-1/2
                      items-center
                      gap-1.5
                      rounded-full
                      bg-[#14213D]/75
                      px-3
                      py-1.5
                    "
                  >

                    {ads.map(
                      (ad, index) => (
                        <button
                          key={ad.id}
                          type="button"
                          aria-label={`Advertisement ${index + 1}`}
                          onClick={() =>
                            setCurrentAd(index)
                          }
                          className={`
                            h-1.5
                            rounded-full
                            transition-all
                            duration-300
                            ${
                              currentAd === index
                                ? 'w-6 bg-[#FBBF24]'
                                : 'w-1.5 bg-[#FFFFFF]/70 hover:bg-[#FFFFFF]'
                            }
                          `}
                        />
                      )
                    )}

                  </div>
                )}

              </>

            ) : (

              <div
                className="
                  flex
                  h-56
                  flex-col
                  items-center
                  justify-center
                  bg-[#14213D]
                  px-6
                  text-center
                  sm:h-64
                  lg:h-72
                "
              >

                <div
                  className="
                    mb-4
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#FBBF24]
                    text-[#14213D]
                  "
                >
                  <Tag
                    size={21}
                    strokeWidth={2.5}
                  />
                </div>

                <p
                  className="
                    text-sm
                    font-semibold
                    text-[#FFFFFF]
                    sm:text-base
                  "
                >
                  Advertise With Ceylon Property
                </p>

                <p
                  className="
                    mt-1
                    max-w-xs
                    text-xs
                    leading-relaxed
                    text-[#E5E5E5]
                  "
                >
                  Promote your property or business
                  to potential customers.
                </p>

              </div>

            )}

          </div>

        </aside>

        {/* ===================================== */}
        {/* PROPERTY GRID */}
        {/* ===================================== */}

        <main className="min-w-0 w-full">

          {error ? (

            <div className="text-center py-10">
              <p className="text-red-500">
                {error}
              </p>
            </div>

          ) : filteredProperties.length === 0 ? (

            <div className="text-center py-10">
              <p className="text-gray-500">
                No properties found.
              </p>
            </div>

          ) : (

            <div
              className={`
                grid
                grid-cols-2
                ${
                  hoveredProperty
                    ? ''
                    : 'xl:grid-cols-4'
                }
                gap-4
                sm:gap-6
              `}
            >

              {filteredProperties.map(
                (property) => (

                  <div
                    key={property.id}
                    className="
                      w-full
                      min-w-0
                      cursor-pointer
                      touch-manipulation
                      transition-transform
                      duration-200
                      active:scale-[0.98]
                    "
                    onClick={() =>
                      handlePropertyClick(
                        property
                      )
                    }
                  >

                    <PropertyCard
                      property={property}
                    />

                  </div>

                )
              )}

            </div>

          )}

        </main>

        {/* ===================================== */}
        {/* DESKTOP PREVIEW */}
        {/* ===================================== */}

        {hoveredProperty && (
          <div
            className="
              hidden
              lg:block
              min-w-0
              w-full
            "
          >
            <PropertyPreviewPanel
              property={hoveredProperty}
              propertyType="hotsale"
              onClose={() =>
                setHoveredProperty(null)
              }
            />
          </div>
        )}

      </div>

    </div>
  )
}

export default HotSales