import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Search,
  X,
  SlidersHorizontal,
} from 'lucide-react'

import LandCard from '../components/property/LandCard'

import { getLands } from '../Routers'
import { cityOptions } from '../../assets/data.js'

import landsHero from '../assets/properties/landHero.jpeg'
import Loader from '../components/property/Loader.jsx'

function Lands() {

  // =========================================================
  // LAND DATA
  // =========================================================

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // =========================================================
  // FILTER PANEL
  // =========================================================

  const [showFilters, setShowFilters] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // =========================================================
  // SELECTED FILTER VALUES
  // =========================================================

  const [selectedCity, setSelectedCity] = useState('')
  const [selectedPrice, setSelectedPrice] = useState('')
  const [selectedLandSize, setSelectedLandSize] = useState('')
  const [selectedUnit, setSelectedUnit] = useState('')

  // =========================================================
  // APPLIED FILTERS
  // =========================================================

  const [filters, setFilters] = useState({
    city: '',
    price: '',
    landSize: '',
    unit: '',
  })

  // =========================================================
  // GET LANDS
  // =========================================================

  useEffect(() => {
    const fetchLands = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await getLands()

        console.log('TRANSFORMED LAND DATA:', data)

        setProperties(
          Array.isArray(data)
            ? data
            : []
        )

      } catch (err) {

        console.error(
          'Failed to fetch lands:',
          err
        )

        setError(
          err.message ||
          'Failed to fetch lands'
        )

      } finally {
        setLoading(false)
      }
    }

    fetchLands()
  }, [])

  // =========================================================
  // CITY OPTIONS
  // =========================================================

  const cities = (cityOptions || [])
    .map((city) => {

      if (typeof city === 'string') {
        return {
          label: city,
          value: city,
        }
      }

      return {
        label:
          city.label ||
          city.name ||
          city.value,

        value:
          city.value ||
          city.name ||
          city.label,
      }

    })
    .filter(
      (city) =>
        city.label &&
        city.value
    )

  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearch = () => {

    console.log(
      'APPLYING FILTERS:',
      {
        city: selectedCity,
        price: selectedPrice,
        landSize: selectedLandSize,
        unit: selectedUnit,
      }
    )

    setFilters({
      city: selectedCity,
      price: selectedPrice,
      landSize: selectedLandSize,
      unit: selectedUnit,
    })

    setShowFilters(false)
  }

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const handleClearFilters = () => {

    setSelectedCity('')
    setSelectedPrice('')
    setSelectedLandSize('')
    setSelectedUnit('')

    setFilters({
      city: '',
      price: '',
      landSize: '',
      unit: '',
    })

    console.log('FILTERS CLEARED')
  }

  // =========================================================
  // CHECK IF FILTERS ARE ACTIVE
  // =========================================================

  const hasFilters =
    filters.city ||
    filters.price ||
    filters.landSize ||
    filters.unit

  // =========================================================
  // FILTER LAND DATA
  // =========================================================

  const filteredProperties =
    properties.filter((land) => {

      // =====================================================
      // SEARCH
      // =====================================================

      const searchText =
        searchTerm
          .trim()
          .toLowerCase()

      const matchesSearch =
        !searchText
          ? true
          : [
              land.title,
              land.location,
              land.city,
              land.tag,
              land.property_type,
              land.propertyType,
            ].some(
              (value) =>
                String(value || '')
                  .toLowerCase()
                  .includes(searchText)
            )

      if (!matchesSearch) {
        return false
      }

      // =====================================================
      // CITY FILTER
      // =====================================================

      if (filters.city) {

        const landCity =
          String(land.city || '')
            .trim()
            .toLowerCase()

        const selectedCity =
          String(filters.city)
            .trim()
            .toLowerCase()

        if (
          landCity !==
          selectedCity
        ) {
          return false
        }
      }

      // =====================================================
      // SIZE UNIT FILTER
      // =====================================================

      if (filters.unit) {

        const landUnit =
          String(
            land.size_unit || ''
          )
            .trim()
            .toLowerCase()

        if (
          landUnit !==
          filters.unit.toLowerCase()
        ) {
          return false
        }
      }

      // =====================================================
      // LAND SIZE FILTER
      // =====================================================

      if (filters.landSize) {

        const size =
          Number(
            land.perches ||
            land.land_size ||
            0
          )

        if (
          filters.landSize ===
          'under10'
        ) {

          if (size >= 10) {
            return false
          }

        }

        if (
          filters.landSize ===
          '10to30'
        ) {

          if (
            size < 10 ||
            size > 30
          ) {
            return false
          }

        }

        if (
          filters.landSize ===
          'above30'
        ) {

          if (size <= 30) {
            return false
          }

        }
      }

      // =====================================================
      // PRICE FILTER
      // =====================================================

      if (filters.price) {

        const price =
          Number(
            land.priceRs ||
            land.price ||
            0
          )

        if (
          filters.price ===
          'under1m'
        ) {

          if (price >= 1000000) {
            return false
          }

        }

        if (
          filters.price ===
          '1mto5m'
        ) {

          if (
            price < 1000000 ||
            price > 5000000
          ) {
            return false
          }

        }

        if (
          filters.price ===
          '5mto10m'
        ) {

          if (
            price < 5000000 ||
            price > 10000000
          ) {
            return false
          }

        }

        if (
          filters.price ===
          '10mto25m'
        ) {

          if (
            price < 10000000 ||
            price > 25000000
          ) {
            return false
          }

        }

        if (
          filters.price ===
          'above25m'
        ) {

          if (price <= 25000000) {
            return false
          }

        }
      }

      // =====================================================
      // PROPERTY PASSED ALL FILTERS
      // =====================================================

      return true
    })

  // =========================================================
  // FULL SCREEN LOADER
  // =========================================================

  if (loading) {
    return <Loader />
  }

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="
          relative
          h-[600px]
          bg-cover
          bg-center
          flex
          flex-col
          justify-center
        "
        style={{
          backgroundImage:
            `url(${landsHero})`,
        }}
      >

        {/* Overlay */}

        <div
          className="
            absolute
            inset-0
            bg-black/25
          "
        />

        <div
          className="
            relative
            max-w-7xl
            mx-auto
            px-4
            w-full
          "
        >

          {/* HERO TITLE */}

          <h1
            className="
              text-white
              text-5xl
              md:text-6xl
              leading-tight
              mb-4
            "
            style={{
              fontFamily:
                'var(--font-hero)',
            }}
          >
            Buy Sell & Invest In
            <br />
            Premium Lands
          </h1>

          {/* HERO DESCRIPTION */}

          <p
            className="
              text-white/90
              text-lg
              mb-10
            "
          >
            Discover verified lands
            in the best locations
            at the best prices
          </p>

          {/* =================================================
              SEARCH BOX
          ================================================= */}

          <div
            className="
              bg-white
              rounded-xl
              p-5
              md:p-6
              shadow-lg
            "
          >

            {/* FILTER HEADER */}

            <div
              className="
                flex
                justify-between
                items-center
                mb-4
              "
            >

              <div>

                <h3
                  className="
                    font-semibold
                    text-[#14213D]
                  "
                >
                  Search Lands
                </h3>

              </div>

              {/* FILTER BUTTON */}

              <button
                type="button"
                onClick={() =>
                  setShowFilters(
                    !showFilters
                  )
                }
                className="
                  flex
                  items-center
                  gap-2
                  border
                  border-gray-300
                  px-4
                  py-2
                  rounded-md
                  text-sm
                  hover:bg-gray-50
                  transition
                "
              >

                <SlidersHorizontal
                  size={16}
                />

                {showFilters
                  ? 'Hide Filters'
                  : 'Filter'}

              </button>

            </div>

            {/* =================================================
                FILTER AREA
            ================================================= */}

            {showFilters && (

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  lg:grid-cols-4
                  gap-5
                "
              >

                {/* =================================================
                    CITY
                ================================================= */}

                <div>

                  <label
                    className="
                      block
                      text-sm
                      font-medium
                      mb-1
                    "
                  >
                    City
                  </label>

                  <input
                    type="text"
                    value={selectedCity}
                    onChange={(e) =>
                      setSelectedCity(
                        e.target.value
                      )
                    }
                    placeholder="Type city e.g. Colombo"
                    className="
                      w-full
                      border
                      border-gray-200
                      rounded-md
                      px-3
                      py-2.5
                      text-sm
                      outline-none
                      focus:border-[#14213D]
                    "
                  />

                </div>

                {/* =================================================
                    PRICE
                ================================================= */}

                <div>

                  <label
                    className="
                      block
                      text-sm
                      font-medium
                      mb-1
                    "
                  >
                    Price Range
                  </label>

                  <select
                    value={selectedPrice}
                    onChange={(e) =>
                      setSelectedPrice(
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      border
                      border-gray-200
                      rounded-md
                      px-3
                      py-2.5
                      text-sm
                      outline-none
                      focus:border-[#14213D]
                    "
                  >

                    <option value="">
                      Any Price
                    </option>

                    <option value="under1m">
                      Under Rs. 1 Million
                    </option>

                    <option value="1mto5m">
                      Rs. 1M - 5M
                    </option>

                    <option value="5mto10m">
                      Rs. 5M - 10M
                    </option>

                    <option value="10mto25m">
                      Rs. 10M - 25M
                    </option>

                    <option value="above25m">
                      Above Rs. 25M
                    </option>

                  </select>

                </div>

                {/* =================================================
                    LAND SIZE
                ================================================= */}

                <div>

                  <label
                    className="
                      block
                      text-sm
                      font-medium
                      mb-1
                    "
                  >
                    Land Size
                  </label>

                  <select
                    value={selectedLandSize}
                    onChange={(e) =>
                      setSelectedLandSize(
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      border
                      border-gray-200
                      rounded-md
                      px-3
                      py-2.5
                      text-sm
                      outline-none
                      focus:border-[#14213D]
                    "
                  >

                    <option value="">
                      Any Size
                    </option>

                    <option value="under10">
                      Under 10
                    </option>

                    <option value="10to30">
                      10 - 30
                    </option>

                    <option value="above30">
                      Above 30
                    </option>

                  </select>

                </div>

                {/* =================================================
                    SIZE UNIT
                ================================================= */}

                <div>

                  <label
                    className="
                      block
                      text-sm
                      font-medium
                      mb-1
                    "
                  >
                    Size Unit
                  </label>

                  <select
                    value={selectedUnit}
                    onChange={(e) =>
                      setSelectedUnit(
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      border
                      border-gray-200
                      rounded-md
                      px-3
                      py-2.5
                      text-sm
                      outline-none
                      focus:border-[#14213D]
                    "
                  >

                    <option value="">
                      All Units
                    </option>

                    <option value="perches">
                      Perches
                    </option>

                    <option value="acres">
                      Acres
                    </option>

                    <option value="sqft">
                      Square Feet
                    </option>

                  </select>

                </div>

              </div>

            )}

            {/* =================================================
                BUTTONS
            ================================================= */}

            <div
              className="
                flex
                flex-col
                sm:flex-row
                justify-end
                gap-3
                mt-5
              "
            >

              {/* CLEAR */}

              <button
                type="button"
                onClick={
                  handleClearFilters
                }
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  border
                  border-gray-300
                  text-gray-700
                  px-6
                  py-2.5
                  rounded-md
                  hover:bg-gray-50
                  transition
                "
              >

                <X size={16} />

                Clear

              </button>

              {/* SEARCH */}

              <button
                type="button"
                onClick={handleSearch}
                className="
                  bg-[#14213D]
                  text-white
                  flex
                  items-center
                  justify-center
                  gap-2
                  px-7
                  py-2.5
                  rounded-md
                  hover:opacity-90
                  transition
                "
              >

                <Search size={17} />

                Search Land

              </button>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FEATURED LANDS
      ===================================================== */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          py-14
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
            mb-2
          "
        >

          <h2
            className="
              text-2xl
              font-heading
              font-bold
            "
          >
            Featured Lands
          </h2>

          <ArrowRight size={22} />

        </div>

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-3
            mb-8
          "
        >

          <p className="text-gray-500">
            Handpicked premium lands
            from trusted sellers.
          </p>

          {/* FILTER RESULT */}

          {!error && (

            <p
              className="
                text-sm
                text-gray-500
              "
            >

              Showing{' '}

              <span
                className="
                  font-semibold
                  text-[#14213D]
                "
              >
                {filteredProperties.length}
              </span>

              {' '}of{' '}

              <span className="font-semibold">
                {properties.length}
              </span>

              {' '}lands

            </p>

          )}

        </div>

        {/* ===================================================
            ACTIVE FILTERS
        =================================================== */}

        {hasFilters && (

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
              mb-6
            "
          >

            <span
              className="
                text-sm
                text-gray-500
              "
            >
              Active filters:
            </span>

            {filters.city && (

              <span
                className="
                  bg-gray-100
                  px-3
                  py-1
                  rounded-full
                  text-xs
                "
              >
                City: {filters.city}
              </span>

            )}

            {filters.price && (

              <span
                className="
                  bg-gray-100
                  px-3
                  py-1
                  rounded-full
                  text-xs
                "
              >
                Price selected
              </span>

            )}

            {filters.landSize && (

              <span
                className="
                  bg-gray-100
                  px-3
                  py-1
                  rounded-full
                  text-xs
                "
              >
                Land size selected
              </span>

            )}

            {filters.unit && (

              <span
                className="
                  bg-gray-100
                  px-3
                  py-1
                  rounded-full
                  text-xs
                "
              >
                Unit: {filters.unit}
              </span>

            )}

            <button
              type="button"
              onClick={
                handleClearFilters
              }
              className="
                text-xs
                text-red-500
                hover:text-red-600
                ml-2
              "
            >
              Clear all
            </button>

          </div>

        )}

        {/* ===================================================
            LAND GRID
        =================================================== */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-6
          "
        >

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div
              className="
                col-span-full
                text-center
                py-10
                text-red-500
              "
            >
              Error: {error}
            </div>

          )}

          {/* =================================================
              NO RESULTS
          ================================================= */}

          {!error &&
            filteredProperties.length === 0 && (

              <div
                className="
                  col-span-full
                  text-center
                  py-10
                "
              >

                <p
                  className="
                    text-gray-500
                    mb-3
                  "
                >
                  No lands match your
                  current filters.
                </p>

                <button
                  type="button"
                  onClick={
                    handleClearFilters
                  }
                  className="
                    text-sm
                    text-[#14213D]
                    underline
                  "
                >
                  Clear filters
                </button>

              </div>

            )}

          {/* =================================================
              LAND CARDS
          ================================================= */}

          {!error &&
            filteredProperties.map(
              (land) => (

                <Link
                  key={land.id}
                  to={`/property/land/${land.id}`}
                >
                  <LandCard
                    land={land}
                  />
                </Link>

              )
            )}

        </div>

      </section>

      {/* =====================================================
          WANT TO SELL YOUR LAND CTA
      ===================================================== */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          pb-16
        "
      >

        <div
          className="
            bg-[#14213D]
            rounded-2xl
            overflow-hidden
            grid
            grid-cols-1
            md:grid-cols-2
            min-h-[300px]
          "
        >

          {/* =========================
              LEFT SIDE - CONTENT
          ========================= */}

          <div
            className="
              flex
              flex-col
              justify-center
              px-8
              py-12
              md:px-12
            "
          >

            <h2
              className="
                text-white
                text-3xl
                md:text-4xl
                font-medium
                mb-4
              "
              style={{
                fontFamily:
                  'var(--font-hero)',
              }}
            >
              Want To Sell Your Land?
            </h2>

            <p
              className="
                text-white/80
                text-base
                md:text-lg
                leading-relaxed
                mb-7
                max-w-lg
              "
            >
              Post your property and
              reach thousands of potential
              buyers today.
            </p>

            <div>

              <Link
                to="/dashboard/client-login"
                className="
                  inline-flex
                  items-center
                  gap-2
                  bg-[#FBBF24]
                  text-[#14213D]
                  font-semibold
                  px-6
                  py-3
                  rounded-lg
                  hover:opacity-90
                  transition
                "
              >
                Post Your Land

                <ArrowRight size={18} />

              </Link>

            </div>

          </div>

          {/* =========================
              RIGHT SIDE - IMAGE
          ========================= */}

          <div
            className="
              relative
              min-h-[280px]
              md:min-h-full
            "
          >

            <img
              src="/src/user/assets/properties/landsBanner.png"
              alt="Sell your land"
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
              "
            />

            {/* Image overlay */}

            <div
              className="
                absolute
                inset-0
                bg-black/10
              "
            />

          </div>

        </div>

      </section>

    </div>
  )
}

export default Lands