import { useState } from 'react'
import { X, BedDouble, Bath, ChefHat, Home, Trees } from 'lucide-react'

function PropertyPreviewPanel({ property, onClose }) {
  const [expanded, setExpanded] = useState(false)

  if (!property) return null

  return (
    <div className="sticky top-24 border-l border-gray-200 pl-6 h-fit">
      <div className="flex justify-end mb-2">
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>

      <img 
        src={property.image} 
        alt={property.title} 
        className="w-full h-48 object-cover rounded-xl mb-4"
      />

      <div className="flex justify-between items-start mb-1">
        <h3 className="text-lg font-heading font-medium">{property.title}</h3>
        <span className="text-sm font-semibold whitespace-nowrap">${property.price}/month</span>
      </div>

      <p className="text-sm text-gray-500 mb-4">{property.location}</p>

      <div className="grid grid-cols-3 gap-y-3 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1.5">
          <Home size={15} /> {property.rooms} Rooms
        </div>
        <div className="flex items-center gap-1.5">
          <Bath size={15} /> {property.bathrooms} Bathrooms
        </div>
        <div className="flex items-center gap-1.5">
          <ChefHat size={15} /> {property.kitchen} Kitchen
        </div>
        <div className="flex items-center gap-1.5">
          <Trees size={15} /> {property.garden} Garden
        </div>
        <div className="flex items-center gap-1.5">
          <BedDouble size={15} /> {property.beds} Beds
        </div>
      </div>

      <h4 className="font-medium mb-2">Description</h4>
      <p className={`text-sm text-gray-500 mb-2 leading-relaxed ${expanded ? '' : 'line-clamp-4'}`}>
        {property.description}
      </p>
      <button 
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-blue-600 hover:underline mb-4"
      >
        {expanded ? 'Show Less' : 'Read More'}
      </button>

      <button className="bg-navy text-white text-sm px-6 py-2.5 rounded-md hover:opacity-90 transition mb-4 mt-2 block">
        View All
      </button>

      <img 
        src="https://placehold.co/400x220/e2e8f0/64748b?text=Map+View" 
        alt="Map location" 
        className="w-full h-40 object-cover rounded-xl"
      />
    </div>
  )
}

export default PropertyPreviewPanel