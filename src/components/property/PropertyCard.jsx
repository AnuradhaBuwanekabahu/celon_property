import { Star, MapPin } from 'lucide-react'

const tagColors = {
  Apartment: 'bg-blue-100 text-blue-700',
  Hotel: 'bg-yellow-100 text-yellow-700',
  Villa: 'bg-purple-100 text-purple-700',
  House: 'bg-green-100 text-green-700',
  Restaurant: 'bg-pink-100 text-pink-700',
}

function PropertyCard({ property }) {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition h-96">
      <img 
        src={property.image} 
        alt={property.title} 
        className="w-full h-full object-cover"
      />

      <span className={`absolute top-4 left-4 text-xs font-medium px-4 py-1.5 rounded-full ${tagColors[property.tag] || 'bg-white/80 text-gray-700'}`}>
        {property.tag}
      </span>

      {/* Floating white card - with side margins */}
      <div className="absolute bottom-3 left-3 right-3 bg-white rounded-xl p-4 shadow-lg">
        <h3 className="text-gray-900 font-heading font-medium text-lg mb-1">
          {property.title}
        </h3>
        <p className="text-gray-500 text-sm mb-3 flex items-start gap-1 min-h-[2.5rem]">
        <MapPin size={13} className="text-secondary shrink-0 mt-0.5" />
         <span className="line-clamp-2">{property.location}</span>
        </p>
        <div className="flex justify-between items-center">
          <p className="text-gray-900 text-base">
            <span className="font-bold">${property.price}.00</span>
            <span className="text-gray-500 text-sm"> / month</span>
          </p>
          <div className="flex items-center gap-1 text-sm text-gray-900">
            <Star size={16} className="text-secondary fill-secondary" />
            <span>{property.rating}/5</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyCard