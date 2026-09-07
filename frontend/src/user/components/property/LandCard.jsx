import { useState } from 'react'
import {
  MapPin,
  Ruler,
  Heart,
  LandPlot
} from 'lucide-react'

const tagColors = {
  Land: 'bg-teal-600/90 text-white',
  'Land Sale': 'bg-teal-600/90 text-white',
  Sale: 'bg-emerald-600/90 text-white',
  Available: 'bg-emerald-600/90 text-white',
  Sold: 'bg-rose-500/90 text-white',
  Pending: 'bg-amber-500/90 text-white',
}

function LandCard({ land }) {
  const [isLiked, setIsLiked] = useState(false)

  // =====================================================
  // LAND DATA
  // =====================================================

  const title = land?.title || 'Untitled Land'

  const location =
    land?.location ||
    land?.city ||
    land?.preferred_city ||
    'Sri Lanka'

  const image =
    land?.image ||
    land?.main_image ||
    (land?.gallery && land.gallery[0]) ||
    (land?.images && land.images[0])

  const status =
    land?.status ||
    land?.tag ||
    'Available'

  // =====================================================
  // LAND SIZE
  // =====================================================

  const perches =
    land?.perches ??
    land?.land_size ??
    land?.landSize ??
    land?.size ??
    0

  // =====================================================
  // PRICE
  // =====================================================

  const price =
    land?.priceRs ??
    land?.price ??
    land?.total_price ??
    land?.totalPrice ??
    0

  const formattedPrice = Number(price || 0).toLocaleString('en-US')

  // =====================================================
  // RATE PER PERCH
  // =====================================================

  const rate =
    land?.rate ??
    land?.price_per_perch ??
    land?.pricePerPerch ??
    0

  const formattedRate = Number(rate || 0).toLocaleString('en-US')

  // =====================================================
  // PROPERTY TAG
  // =====================================================

  const propertyTag = land?.tag || 'Land'

  return (
    <div
      className="
        group
        relative
        rounded-2xl
        overflow-hidden
        bg-white
        shadow-md
        hover:shadow-2xl
        transition-all
        duration-300
        h-[420px]
        flex
        flex-col
        cursor-pointer
        border
        border-gray-100/80
      "
    >

      {/* =====================================================
          IMAGE
      ===================================================== */}

      <div
        className="
          relative
          w-full
          h-[58%]
          overflow-hidden
          bg-gray-100
        "
      >

        {image ? (

          <img
            src={image}
            alt={title}
            className="
              w-full
              h-full
              object-cover
              group-hover:scale-105
              transition-transform
              duration-500
              ease-out
            "
          />

        ) : (

          <div
            className="
              w-full
              h-full
              bg-slate-200
              flex
              flex-col
              items-center
              justify-center
              text-gray-400
              text-xs
              font-semibold
              gap-2
            "
          >
            <LandPlot size={35} />
            No Image
          </div>

        )}

        {/* =====================================================
            GRADIENT
        ===================================================== */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/60
            via-transparent
            to-black/20
            opacity-80
            group-hover:opacity-90
            transition-opacity
          "
        />


        {/* =====================================================
            LAND BADGE
        ===================================================== */}

        <span
          className={`
            absolute
            top-3
            left-3
            text-xs
            font-semibold
            px-3.5
            py-1.5
            rounded-full
            backdrop-blur-md
            shadow-md
            transition-all
            ${
              tagColors[propertyTag] ||
              'bg-[#14213D]/85 text-white'
            }
          `}
        >
          {propertyTag}
        </span>


        {/* =====================================================
            STATUS BADGE
        ===================================================== */}

        


        {/* =====================================================
            WISHLIST
        ===================================================== */}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setIsLiked(!isLiked)
          }}
          className="
            absolute
            top-3
            right-3
            p-2
            rounded-full
            bg-white/80
            hover:bg-white
            backdrop-blur-md
            text-gray-700
            hover:text-rose-500
            transition
            shadow-sm
          "
          title="Save land"
        >
          <Heart
            size={17}
            className={
              isLiked
                ? 'fill-rose-500 text-rose-500'
                : ''
            }
          />
        </button>

      </div>


      {/* =====================================================
          FLOATING INFORMATION CARD
      ===================================================== */}

      <div
        className="
          relative
          -mt-6
          mx-3
          mb-3
          bg-white
          rounded-xl
          p-4
          shadow-lg
          border
          border-gray-100
          flex
          flex-col
          justify-between
          flex-1
          group-hover:border-gray-200
          transition-colors
        "
      >

        <div>

          {/* =================================================
              TITLE
          ================================================= */}

          <h3
            className="
              text-gray-900
              font-bold
              text-base
              md:text-lg
              mb-1
              tracking-tight
              line-clamp-1
              group-hover:text-[#14213D]
              transition-colors
            "
          >
            {title}
          </h3>


          {/* =================================================
              LOCATION
          ================================================= */}

          <p
            className="
              text-gray-500
              text-xs
              mb-3
              flex
              items-center
              gap-1.5
              min-h-[1.25rem]
            "
          >
            <MapPin
              size={14}
              className="
                text-[#14213D]
                shrink-0
                stroke-[2]
              "
            />

            <span className="line-clamp-1">
              {location}
            </span>
          </p>


          {/* =================================================
              LAND INFORMATION
          ================================================= */}

          <div
            className="
              flex
              items-center
              gap-4
              text-xs
              text-gray-500
              pt-2
              pb-3
              border-t
              border-gray-100
            "
          >

            {/* Perches */}

            <span
              className="
                flex
                items-center
                gap-1.5
              "
            >
              <Ruler
                size={14}
                className="text-gray-400"
              />

              <span>
                {perches || '—'} Perches
              </span>
            </span>


            {/* Land Type */}

            <span
              className="
                flex
                items-center
                gap-1.5
              "
            >
              <LandPlot
                size={14}
                className="text-gray-400"
              />

              <span>
                Land
              </span>
            </span>

          </div>


          {/* =================================================
              RATE PER PERCH
          ================================================= */}

          {rate > 0 && (

            <div
              className="
                text-xs
                text-gray-500
                mb-2
              "
            >

              <span className="text-gray-400">
                Rate per perch
              </span>

              <span
                className="
                  ml-2
                  font-semibold
                  text-[#14213D]
                "
              >
                LKR {formattedRate}
              </span>

            </div>

          )}

        </div>


        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div
          className="
            flex
            justify-between
            items-end
            pt-2
            border-t
            border-gray-100/80
          "
        >

          {/* PRICE */}

          <div>

            <span
              className="
                text-[10px]
                uppercase
                font-semibold
                text-gray-400
                block
                tracking-wider
              "
            >
              Total Price
            </span>

            <p
              className="
                text-[#14213D]
                text-base
                md:text-lg
                font-extrabold
                tracking-tight
                leading-none
              "
            >
              LKR {formattedPrice}
            </p>

          </div>



        </div>

      </div>

    </div>
  )
}

export default LandCard