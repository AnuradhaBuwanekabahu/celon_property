import { useState } from 'react'
import {
  X,
  BedDouble,
  Bath,
  ChefHat,
  Home,
  Trees,
  Sofa,
  Building2,
  Landmark,
  Ruler,
  Car,
  Layers,
  Hash,
  Calendar,
  Compass,
  Route,
  Droplet,
  Zap,
  Shapes,
  MapPin,
  Map as MapIcon,
  Flag,
  MailCheck,
  Sofa as LivingIcon,
  UtensilsCrossed,
  PanelTop,
  Waves,
  Warehouse,
  Wallet,
  Building,
  MapPinned,
  ArrowUpRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'

/* =========================================================
   OVERVIEW ICON MAP
========================================================= */

const OVERVIEW_ICON_MAP = {
  bedrooms: BedDouble,
  bathrooms: Bath,
  availability: Calendar,
  'furnishing status': Sofa,
  'property type': Building2,

  'area of land': Ruler,
  'land area': Ruler,
  'floor area': Ruler,

  'parking space': Car,
  parking: Car,

  'no. of floors': Layers,
  floors: Layers,

  'floor number': Hash,

  'age of building': Building,
  'year built': Calendar,

  'facing direction': Compass,
  'road access': Route,

  'water supply': Droplet,
  'electricity supply': Zap,

  'land shape': Shapes,
  'land type': Landmark,

  location: MapPin,
  city: MapIcon,
  district: Flag,
  'postal code': MailCheck,

  'living rooms': LivingIcon,
  'living room': LivingIcon,

  'dining area': UtensilsCrossed,
  'dining room': UtensilsCrossed,

  'kitchen type': ChefHat,
  kitchen: ChefHat,

  balconies: PanelTop,
  balcony: PanelTop,

  'garden area': Trees,
  garden: Trees,

  'swimming pool': Waves,
  pool: Waves,

  garage: Warehouse,

  'monthly maintenance fee': Wallet,

  'nearby facilities': MapPin,
}

/* =========================================================
   NORMALIZE TITLE
========================================================= */

const normalizeTitle = (title = '') => {
  return String(title)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}

/* =========================================================
   GET ICON
========================================================= */

const getOverviewIcon = (title = '') => {
  const key = normalizeTitle(title)

  // Exact match
  if (OVERVIEW_ICON_MAP[key]) {
    return OVERVIEW_ICON_MAP[key]
  }

  // Flexible matching

  if (key.includes('bedroom')) {
    return BedDouble
  }

  if (key.includes('bathroom')) {
    return Bath
  }

  if (key.includes('availability')) {
    return Calendar
  }

  if (key.includes('furnish')) {
    return Sofa
  }

  if (key.includes('property type')) {
    return Building2
  }

  if (
    key.includes('area of land') ||
    key.includes('land area')
  ) {
    return Ruler
  }

  if (key.includes('floor area')) {
    return Ruler
  }

  if (key.includes('parking')) {
    return Car
  }

  if (
    key.includes('no. of floor') ||
    key.includes('number of floor')
  ) {
    return Layers
  }

  if (key.includes('floor number')) {
    return Hash
  }

  if (
    key.includes('age of building') ||
    key.includes('building age')
  ) {
    return Building
  }

  if (key.includes('year built')) {
    return Calendar
  }

  if (
    key.includes('facing') ||
    key.includes('direction')
  ) {
    return Compass
  }

  if (key.includes('road access')) {
    return Route
  }

  if (key.includes('water')) {
    return Droplet
  }

  if (
    key.includes('electricity') ||
    key.includes('electric')
  ) {
    return Zap
  }

  if (key.includes('shape')) {
    return Shapes
  }

  if (key.includes('land type')) {
    return Landmark
  }

  if (key.includes('location')) {
    return MapPin
  }

  if (key.includes('city')) {
    return MapIcon
  }

  if (key.includes('district')) {
    return Flag
  }

  if (key.includes('postal')) {
    return MailCheck
  }

  if (key.includes('living')) {
    return LivingIcon
  }

  if (key.includes('dining')) {
    return UtensilsCrossed
  }

  if (key.includes('kitchen')) {
    return ChefHat
  }

  if (key.includes('balcon')) {
    return PanelTop
  }

  if (key.includes('garden')) {
    return Trees
  }

  if (
    key.includes('swimming') ||
    key.includes('pool')
  ) {
    return Waves
  }

  if (key.includes('garage')) {
    return Warehouse
  }

  if (key.includes('maintenance')) {
    return Wallet
  }

  if (key.includes('nearby')) {
    return MapPin
  }

  return Home
}

/* =========================================================
   GET OVERVIEW DATA
========================================================= */

const getOverviewData = (overview) => {
  if (!overview) {
    return []
  }

  // Already array
  if (Array.isArray(overview)) {
    return overview
  }

  // JSON string
  if (typeof overview === 'string') {
    try {
      const parsed = JSON.parse(overview)

      if (Array.isArray(parsed)) {
        return parsed
      }

      return []
    } catch (error) {
      console.error('Overview JSON parse error:', error)
      return []
    }
  }

  return []
}

/* =========================================================
   GET VALUE
========================================================= */

const getOverviewValue = (item) => {
  if (!item) {
    return ''
  }

  return (
    item.value ??
    item.count ??
    item.qty ??
    item.amount ??
    ''
  )
}

/* =========================================================
   GET TITLE
========================================================= */

const getOverviewTitle = (item) => {
  if (!item) {
    return ''
  }

  return (
    item.title ??
    item.label ??
    item.name ??
    ''
  )
}

/* =========================================================
   PROPERTY PREVIEW PANEL
========================================================= */

function PropertyPreviewPanel({
  property,
   propertyType,
  onClose,
}) {
  const [expanded, setExpanded] = useState(false)

  if (!property) {
    return null
  }

  /* =======================================================
     OVERVIEW
  ======================================================= */

  const overviewData = getOverviewData(
    property.overview
  )

  console.log(
    'PROPERTY OVERVIEW:',
    property.overview
  )

  console.log(
    'PARSED OVERVIEW:',
    overviewData
  )

  /* Remove empty values */

  const overviewItems = overviewData.filter(
    (item) => {
      const value = getOverviewValue(item)

      return (
        String(value).trim() !== ''
      )
    }
  )

  return (
  
  <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">

    <div
      className="
        rounded-2xl
        border
        border-[#E5E5E5]
        bg-white
        shadow-lg
      "
    >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-[#E5E5E5]
            px-5
            py-4
          "
        >

          <div>

            <p
              className="
                text-sm
                font-semibold
                uppercase
                tracking-wider
                text-[#14213D]
              "
            >
              Property Preview
            </p>

            

          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-[#E5E5E5]
              text-gray-400
              transition
              hover:border-[#14213D]
              hover:bg-[#14213D]
              hover:text-white
            "
          >
            <X size={18} />
          </button>

        </div>

        {/* =================================================
            IMAGE
        ================================================= */}

        <div
          className="
            relative
            mx-5
            mt-5
            overflow-hidden
            rounded-xl
            bg-[#E5E5E5]
          "
        >

          {property.image ? (
            <img
              src={property.image}
              alt={
                property.title ||
                'Property'
              }
              className="
                h-48
                w-full
                object-cover
                transition-transform
                duration-500
                hover:scale-[1.02]
              "
            />
          ) : (
            <div
              className="
                flex
                h-48
                w-full
                items-center
                justify-center
              "
            >
              <Home
                size={40}
                className="text-gray-400"
              />
            </div>
          )}

          {property.tag && (
            <div
              className="
                absolute
                left-3
                top-3
                rounded-full
                bg-[#14213D]/90
                px-3
                py-1.5
                text-[10px]
                font-semibold
                uppercase
                tracking-wide
                text-white
              "
            >
              {property.tag}
            </div>
          )}

        </div>

        {/* =================================================
            MAIN DETAILS
        ================================================= */}

        <div className="px-5 pt-5">

          <div
            className="
              flex
              items-start
              justify-between
              gap-3
            "
          >

            <div className="min-w-0">

              <h3
                className="
                  truncate
                  text-lg
                  font-semibold
                  text-[#14213D]
                "
              >
                {property.title ||
                  'Untitled Property'}
              </h3>

              <div
                className="
                  mt-1.5
                  flex
                  items-center
                  gap-1.5
                  text-sm
                  text-gray-500
                "
              >

                <MapPin
                  size={14}
                  className="
                    shrink-0
                    text-[#FBBF24]
                  "
                />

                <span className="truncate">
                  {property.location ||
                    property.city ||
                    'Location unavailable'}
                </span>

              </div>

            </div>

            <div
              className="
                shrink-0
                text-right
              "
            >

              <p className="text-xs text-gray-400">
                Price
              </p>

              <p
                className="
                  text-sm
                  font-bold
                  text-[#14213D]
                "
              >
                LKR{' '}
                {property.priceRs ??
                  property.price ??
                  '0'}

                  
              </p>
<p
  className="
    text-sm
    font-bold
    text-[#14213D]
  "
>
 {Number(property.priceRs ?? property.price ?? 0) >= 1000000 && (
  <p
    className="
      text-sm
      font-bold
      text-[#14213D]
    "
  >
    {(Number(property.priceRs ?? property.price ?? 0) / 1000000).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}{' '}
    MILLION
  </p>
)}
</p>
              {/* Stay To Rent Price Period */}
    {property.pricePeriod && (
      <span className="text-gray-500 text-base">
        / {property.pricePeriod}
      </span>
    )}

            </div>

          </div>

        </div>

        {/* =================================================
            OVERVIEW
        ================================================= */}

        {overviewItems.length > 0 && (

          <div className="px-5 pt-5">

            <div
              className="
                mb-3
                flex
                items-center
                justify-between
              "
            >

              <h4
                className="
                  text-sm
                  font-semibold
                  text-[#14213D]
                "
              >
                Property Details
              </h4>

              <span
                className="
                  text-[11px]
                  text-gray-400
                "
              >
                {overviewItems.length}{' '}
                {overviewItems.length === 1
                  ? 'detail'
                  : 'details'}
              </span>

            </div>

            <div
              className="
                grid
                grid-cols-2
                gap-2
              "
            >

              {overviewItems.map(
                (item, index) => {

                  const title =
                    getOverviewTitle(item)

                  const value =
                    getOverviewValue(item)

                  const Icon =
                    getOverviewIcon(title)

                  return (
                    <div
                      key={`${title}-${index}`}
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-2.5
                        rounded-xl
                        border
                        border-[#E5E5E5]
                        bg-[#FAFAFA]
                        px-3
                        py-2.5
                        transition
                        hover:border-[#FBBF24]
                        hover:bg-[#FFFBEB]
                      "
                    >

                      {/* ICON */}

                      <div
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-[#14213D]
                        "
                      >

                        <Icon
                          size={18}
                          strokeWidth={2}
                          className="text-[#FBBF24]"
                        />

                      </div>

                      {/* TEXT */}

                      <div className="min-w-0">

                        <p
                          className="
                            truncate
                            text-xs
                            font-semibold
                            text-[#14213D]
                          "
                          title={String(value)}
                        >
                          {value}
                        </p>

                        <p
                          className="
                            truncate
                            text-[10px]
                            text-gray-500
                          "
                          title={String(title)}
                        >
                          {title}
                        </p>

                      </div>

                    </div>
                  )
                }
              )}

            </div>

          </div>
        )}

        {/* =================================================
            NO OVERVIEW MESSAGE
        ================================================= */}

        {overviewItems.length === 0 && (

          <div className="px-5 pt-5">

            <div
              className="
                rounded-xl
                border
                border-dashed
                border-[#E5E5E5]
                bg-[#FAFAFA]
                px-4
                py-5
                text-center
              "
            >

              <Home
                size={24}
                className="
                  mx-auto
                  mb-2
                  text-gray-300
                "
              />

              <p
                className="
                  text-xs
                  text-gray-400
                "
              >
                No property details available
              </p>

            </div>

          </div>
        )}

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        {property.description && (

          <div className="px-5 pt-5">

            <h4
              className="
                mb-2
                text-sm
                font-semibold
                text-[#14213D]
              "
            >
              Description
            </h4>

            <p
              className={`
                text-sm
                leading-relaxed
                text-gray-500
                ${
                  expanded
                    ? ''
                    : 'line-clamp-3'
                }
              `}
            >
              {property.description}
            </p>

            {String(
              property.description
            ).length > 150 && (

              <button
                type="button"
                onClick={() =>
                  setExpanded(!expanded)
                }
                className="
                  mt-2
                  text-xs
                  font-semibold
                  text-[#14213D]
                  transition
                  hover:text-[#FBBF24]
                "
              >
                {expanded
                  ? 'Show Less'
                  : 'Read More'}
              </button>

            )}

          </div>
        )}

        {/* =================================================
            VIEW PROPERTY
        ================================================= */}

        <div className="px-5 pt-5">

          <Link
            to={`/property/${propertyType}/${property.id}`}
            className="
              group
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#14213D]
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition-all
              duration-200
              hover:bg-[#FBBF24]
              hover:text-[#14213D]
            "
          >

            View Full Property

            <ArrowUpRight
              size={16}
              className="
                transition-transform
                duration-200
                group-hover:translate-x-0.5
                group-hover:-translate-y-0.5
              "
            />

          </Link>

        </div>

        {/* =================================================
            MAP
        ================================================= */}

        <div
          className="
            px-5
            pb-5
            pt-5
          "
        >

          <div
            className="
              mb-3
              flex
              items-center
              gap-2
            "
          >

            <MapPinned
              size={17}
              className="text-[#FBBF24]"
            />

            <div>

              <h4
                className="
                  text-sm
                  font-semibold
                  text-[#14213D]
                "
              >
                Property Location
              </h4>

              <p
                className="
                  text-[10px]
                  text-gray-400
                "
              >
                Map location
              </p>

            </div>

          </div>

          <div
            className="
              h-44
              w-full
              overflow-hidden
              rounded-xl
              border
              border-[#E5E5E5]
              bg-[#E5E5E5]
            "
          >

            {property.map_address ||
            property.location ||
            property.city ? (

              <iframe
                title="Property Location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  property.map_address ||
                  property.location ||
                  property.city
                )}&output=embed`}
                className="
                  h-full
                  w-full
                  border-0
                "
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

            ) : (

              <div
                className="
                  flex
                  h-full
                  items-center
                  justify-center
                  text-xs
                  text-gray-400
                "
              >
                Location not available
              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  )
}

export default PropertyPreviewPanel