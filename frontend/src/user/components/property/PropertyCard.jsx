import { useState } from 'react'
import { Star, MapPin, Bed, Bath, Heart } from 'lucide-react'

const tagColors = {
  Apartment: 'bg-blue-500/90 text-white',
  Hotel: 'bg-amber-500/90 text-white',
  Villa: 'bg-purple-500/90 text-white',
  House: 'bg-emerald-600/90 text-white',
  Land: 'bg-teal-600/90 text-white',
  'Hot Sales': 'bg-rose-500/90 text-white',
  Hotsale: 'bg-rose-500/90 text-white',
}

function PropertyCard({ property }) {
  const [isLiked, setIsLiked] = useState(false)

  const propertyTag = property.tag || property.property_type || 'Property'
  const formattedPrice = Number(property.priceRs ?? property.price ?? 0).toLocaleString('en-US')

  const propertyImage = property.image || property.main_image || (property.gallery && property.gallery[0])

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300 h-[400px] flex flex-col cursor-pointer border border-gray-100/80">
      {/* Image Container with Zoom Effect */}
      <div className="relative w-full h-[58%] overflow-hidden bg-gray-100">
        {propertyImage ? (
          <img
            src={propertyImage}
            alt={property.title || 'Property'}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center text-gray-400 text-xs font-semibold">
            No Image
          </div>
        )}

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top-Left Category Badge */}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-md transition-all ${tagColors[propertyTag] || 'bg-[#14213D]/80 text-white'}`}>
          {propertyTag}
        </span>

        {/* Top-Right Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsLiked(!isLiked)
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-gray-700 hover:text-rose-500 transition shadow-sm"
          title="Save property"
        >
          <Heart size={16} className={isLiked ? 'fill-rose-500 text-rose-500' : ''} />
        </button>
      </div>

      {/* Floating Info Container */}
      <div className="relative -mt-6 mx-3 mb-3 bg-white rounded-xl p-4 shadow-lg border border-gray-100 flex flex-col justify-between flex-1 group-hover:border-gray-200 transition-colors">
        <div>
          <h3 className="text-gray-900 font-bold text-base md:text-lg mb-1 tracking-tight line-clamp-1 group-hover:text-[#14213D] transition-colors">
            {property.title || 'Untitled Property'}
          </h3>

          <p className="text-gray-500 text-xs mb-3 flex items-center gap-1.5 min-h-[1.25rem]">
            <MapPin size={14} className="text-[#14213D] shrink-0 stroke-[2]" />
            <span className="line-clamp-1">{property.location || property.city || 'Sri Lanka'}</span>
          </p>

          {/* Quick Amenities Row */}
          {(property.beds > 0 || property.bathrooms > 0 || property.rooms > 0) && (
            <div className="flex items-center gap-3 text-xs text-gray-500 pt-1 pb-2 border-t border-gray-100">
              {property.beds > 0 && (
                <span className="flex items-center gap-1">
                  <Bed size={13} className="text-gray-400" /> {property.beds} Beds
                </span>
              )}
              {property.bathrooms > 0 && (
                <span className="flex items-center gap-1">
                  <Bath size={13} className="text-gray-400" /> {property.bathrooms} Baths
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer: Price & Rating */}
        <div className="flex justify-between items-end pt-2 border-t border-gray-100/80">
          <div>
            <span className="text-[10px] uppercase font-semibold text-gray-400 block tracking-wider">Price</span>
            <p className="text-[#14213D] text-base md:text-lg font-extrabold tracking-tight leading-none">
              LKR {formattedPrice}
            </p>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-gray-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">
            <Star size={13} className="text-amber-500 fill-amber-500" />
            <span>{property.rating || '4.5'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyCard