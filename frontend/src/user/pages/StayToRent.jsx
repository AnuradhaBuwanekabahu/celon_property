import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  Home as HomeIcon,
  MapPin,
  Tag,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

import PropertyCard from '../components/property/PropertyCard'
import PropertyPreviewPanel from '../components/property/PropertyPreviewPanel'

import { getAds, getStayToRent } from '../Routers'

import { districtOptions } from '../../assets/data.js'

import SearchBar from '../components/property/SearchBar'
import Loader from '../components/property/Loader.jsx'


function StayToRent() {

  // =====================================================
  // LOCATION / NAVIGATION
  // =====================================================

  const location = useLocation()
  const navigate = useNavigate()

  const queryParams =
    new URLSearchParams(location.search)

  const typeFromURL =
    (queryParams.get('type') || '').toLowerCase()

  const districtFromURL =
    queryParams.get('district') || ''

  const cityFromURL =
    queryParams.get('city') || ''

  const areaFromURL =
    queryParams.get('area') || ''

  const priceFromURL =
    queryParams.get('price') || ''


  // =====================================================
  // PROPERTY TYPES
  // =====================================================

  const [propertyTypes] = useState([
    'House',
    'Apartment',
    'Bungalow',
    'Hotel',
    'WareHouse',
    'Villa',
    'Studio'
  ])


  // =====================================================
  // STATES
  // =====================================================

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

  const [selectedCity, setSelectedCity] =
    useState(cityFromURL)

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


  // =====================================================
  // GET STAY TO RENT
  // =====================================================

  useEffect(() => {

    setLoading(true)
    setError(null)

    getStayToRent()

      .then((data) => {

        console.log(
          'Stay To Rent Data:',
          data
        )

        setProperties(
          Array.isArray(data)
            ? data
            : []
        )

      })

      .catch((err) => {

        console.error(
          'Failed to fetch stay to rent:',
          err
        )

        setError(
          err.message ||
          'Failed to load properties'
        )

      })

      .finally(() => {

        setLoading(false)

      })

  }, [])


  // =====================================================
  // GET URL FILTERS
  // =====================================================

  useEffect(() => {

    const params =
      new URLSearchParams(location.search)


    // Property Type

    setSelectedType(
      (params.get('type') || '').toLowerCase()
    )


    // District

    const district =
      params.get('district') || ''

    setSelectedDistricts(
      district
        ? [district]
        : []
    )

    setSelectedCity(
      params.get('city') || ''
    )


    // Area

    setSelectedAreaRange(
      params.get('area') || ''
    )


    // Price

    setSelectedPriceRange(
      params.get('price') || ''
    )

  }, [location.search])


  // =====================================================
  // GET ADVERTISEMENTS
  // =====================================================

  useEffect(() => {

    getAds()

      .then((data) => {

        const subPageAds =
          Array.isArray(data)
            ? data.filter(
                (ad) =>
                  ad.position === 'sub_pages' &&
                  Boolean(ad.isActive)
              )
            : []

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


  // =====================================================
  // AUTO CHANGE ADVERTISEMENT
  // =====================================================

  useEffect(() => {

    if (ads.length <= 1) {
      return
    }

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


  // =====================================================
  // FILTER PROPERTIES
  // =====================================================

  const filteredProperties =
    properties.filter((property) => {


      // =================================================
      // SEARCH
      // =================================================

      const searchText =
        searchTerm
          .trim()
          .toLowerCase()


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
              property.property_type
            ].some(
              (value) =>
                String(value || '')
                  .toLowerCase()
                  .includes(searchText)
            )


      // =================================================
      // PROPERTY TYPE
      // =================================================

      const typeFields = [

        property.property_type,
        property.propertyType,
        property.tag,
        property.category,
        property.type

      ].map(
        (value) =>
          String(value || '')
            .toLowerCase()
      )


      const matchesType =
        selectedType
          ? typeFields.some(
              (field) =>
                field.includes(selectedType)
            )
          : true


      // =================================================
      // DISTRICT
      // =================================================

      const propertyDistrict =
        String(
          property.district || ''
        ).toLowerCase()


      const matchesDistrict =
        selectedDistricts.length > 0

          ? selectedDistricts.some(
              (district) =>
                propertyDistrict.includes(
                  String(district)
                    .toLowerCase()
                )
            )

          : true

      const matchesCity =
        selectedCity
          ? String(property.city || '').toLowerCase().includes(
              selectedCity.toLowerCase()
            )
          : true


      // =================================================
      // PROPERTY AREA
      // DATABASE FIELD:
      // area_sqft DECIMAL(10,2)
      // =================================================

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


      // =================================================
      // PRICE
      // =================================================

      const priceValue =
        Number(
          property.priceRs ||
          property.price ||
          0
        )


      const matchesPrice =

        selectedPriceRange

          ? selectedPriceRange === 'under-10'

            ? priceValue < 10000000

            : selectedPriceRange === '10-30'

              ? priceValue >= 10000000 &&
                priceValue <= 30000000

              : selectedPriceRange === '30-60'

                ? priceValue > 30000000 &&
                  priceValue <= 60000000

                : selectedPriceRange === 'above-60'

                  ? priceValue > 60000000

                  : true

          : true


      // =================================================
      // FINAL RESULT
      // =================================================

      return (

        matchesSearch &&
        matchesType &&
        matchesDistrict &&
        matchesCity &&
        matchesArea &&
        matchesPrice

      )

    })


  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {

    setSearchTerm('')
    setSelectedType('')
    setSelectedDistricts([])
    setSelectedCity('')
    setSelectedAreaRange('')
    setSelectedPriceRange('')

  }


  // =====================================================
  // PROPERTY CLICK
  // =====================================================

  const handlePropertyClick = (property) => {

    /*
      MOBILE / TABLET
      ----------------
      Go directly to property details.

      DESKTOP
      ----------------
      Open preview panel.
    */

    if (window.innerWidth < 1024) {

      navigate(
        `/property/staytorent/${property.id}`
      )

      return

    }


    setHoveredProperty((current) =>

      current &&
      current.id === property.id

        ? null
        : property

    )

  }


  // =====================================================
  // FULL SCREEN LOADER
  // =====================================================

  if (loading) {
    return <Loader />
  }


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div
      className="
        w-full
        max-w-7xl
        mx-auto
        px-0
        sm:px-6
        lg:px-8
        py-6
        sm:py-8
      "
    >

      <div
        className={`
          grid
          grid-cols-1
          gap-5
          sm:gap-6
          lg:gap-8
          ${
            hoveredProperty
              ? 'lg:grid-cols-[280px_minmax(0,1fr)_360px]'
              : 'lg:grid-cols-[280px_minmax(0,1fr)]'
          }
        `}
      >

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside
          className="
            w-full
            min-w-0
            lg:sticky
            lg:top-24
            lg:max-h-[calc(100vh-6rem)]
            lg:overflow-y-auto
          "
        >

          {/* SEARCH */}

          <div className="mb-5">

            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() =>
                setSearchTerm('')
              }
            />

          </div>


          {/* FILTER HEADER */}

          <div
            className="
              flex
              items-center
              justify-between
              mb-5
              px-1
              gap-3
            "
          >

            <h3
              className="
                text-base
                sm:text-lg
                font-semibold
                text-[#14213D]
              "
            >
              Find Your Property
            </h3>


            <button
              type="button"
              onClick={clearFilters}
              className="
                shrink-0
                touch-manipulation
                text-xs
                font-semibold
                text-[#14213D]
                border
                border-[#E5E5E5]
                hover:bg-[#FBBF24]
                hover:border-[#FBBF24]
                active:scale-95
                px-3
                py-2
                rounded-lg
                transition
              "
            >
              Clear All
            </button>

          </div>


          {/* =================================================
              PROPERTY TYPE
          ================================================= */}

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
                touch-manipulation
                hover:bg-[#E5E5E5]/30
                active:bg-[#E5E5E5]/50
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
                    shrink-0
                  "
                >

                  <HomeIcon
                    size={17}
                    className="text-[#FBBF24]"
                  />

                </div>

                <p
                  className="
                    text-sm
                    font-semibold
                    text-[#14213D]
                  "
                >
                  Property Type
                </p>

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
                  touch-manipulation
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


          {/* =================================================
              DISTRICT
          ================================================= */}

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

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-[#14213D]
                    "
                  >
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
                              district
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


          {/* =================================================
              PROPERTY AREA
          ================================================= */}

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

            {/* HEADER */}

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
                lg:cursor-default
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
                    shrink-0
                  "
                >

                  <HomeIcon
                    size={17}
                    className="text-[#FBBF24]"
                  />

                </div>

                <div className="text-left">

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-[#14213D]
                    "
                  >
                    Property Area
                  </p>

                </div>

              </div>


              {/* Arrow - mobile only */}

              <ChevronRight
                size={18}
                className={`
                  text-[#14213D]
                  transition-transform
                  duration-200
                  lg:hidden
                  ${
                    openFilter === 'area'
                      ? 'rotate-90'
                      : ''
                  }
                `}
              />

            </button>


            {/* CONTENT */}

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
                  touch-manipulation
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


          {/* =================================================
              PRICE
          ================================================= */}

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
                touch-manipulation
                hover:bg-[#E5E5E5]/30
                active:bg-[#E5E5E5]/50
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
                    shrink-0
                  "
                >

                  <Tag
                    size={17}
                    className="text-[#FBBF24]"
                  />

                </div>


                <div className="text-left">

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-[#14213D]
                    "
                  >
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

              {[
                ['under-10', 'Under LKR 10M'],
                ['10-30', 'LKR 10M – 30M'],
                ['30-60', 'LKR 30M – 60M'],
                ['above-60', 'Above LKR 60M'],
                ['', 'All Prices']
              ].map(
                ([value, label]) => (

                  <label
                    key={value || 'all'}
                    className="
                      flex
                      items-center
                      justify-between
                      p-3
                      min-h-[48px]
                      rounded-xl
                      border
                      border-transparent
                      hover:border-[#E5E5E5]
                      hover:bg-[#E5E5E5]/30
                      active:bg-[#E5E5E5]/50
                      cursor-pointer
                      touch-manipulation
                      transition
                    "
                  >

                    <span
                      className={`
                        text-sm
                        ${
                          value === ''
                            ? 'font-medium text-[#14213D]'
                            : 'text-[#000000]/70'
                        }
                      `}
                    >
                      {label}
                    </span>


                    <input
                      type="radio"
                      name="price"
                      value={value}
                      checked={
                        selectedPriceRange === value
                      }
                      onChange={() =>
                        setSelectedPriceRange(value)
                      }
                      className="
                        accent-[#FBBF24]
                        w-4
                        h-4
                      "
                    />

                  </label>

                )
              )}

            </div>

          </div>


          {/* =================================================
              ADVERTISEMENT
          ================================================= */}

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
                    ads[currentAd]?.linkUrl || '#'
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
                    touch-manipulation
                  "
                >

                  <div
                    className="
                      absolute
                      inset-0
                      bg-[#FFFFFF]
                    "
                  />


                  <img
                    src={ads[currentAd]?.image}
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
                    "
                  />


                  {/* ADVERTISEMENT LABEL */}

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


                  {/* AD TITLE */}

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


                {/* PREVIOUS */}

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
                      h-10
                      w-10
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#E5E5E5]
                      bg-[#FFFFFF]/95
                      text-[#14213D]
                      shadow-lg
                      transition-all
                      hover:scale-110
                      hover:bg-[#FBBF24]
                      active:scale-95
                      touch-manipulation
                    "
                  >

                    <ChevronLeft
                      size={18}
                      strokeWidth={2.5}
                    />

                  </button>

                )}


                {/* NEXT */}

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
                      h-10
                      w-10
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#E5E5E5]
                      bg-[#FFFFFF]/95
                      text-[#14213D]
                      shadow-lg
                      transition-all
                      hover:scale-110
                      hover:bg-[#FBBF24]
                      active:scale-95
                      touch-manipulation
                    "
                  >

                    <ChevronRight
                      size={18}
                      strokeWidth={2.5}
                    />

                  </button>

                )}


                {/* INDICATORS */}

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
                          aria-label={
                            `Advertisement ${index + 1}`
                          }
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
                                : 'w-1.5 bg-[#FFFFFF]/70'
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


        {/* =================================================
            PROPERTY GRID
        ================================================= */}

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
                gap-3
                sm:gap-5
                ${
                  hoveredProperty
                    ? 'xl:grid-cols-3'
                    : 'xl:grid-cols-4'
                }
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
                      handlePropertyClick(property)
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


        {/* =================================================
            DESKTOP PROPERTY PREVIEW
        ================================================= */}

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
              propertyType="staytorent"
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


export default StayToRent