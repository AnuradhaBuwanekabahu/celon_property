import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Home as HomeIcon, MapPin, Ruler, Tag, ChevronLeft, ChevronRight } from 'lucide-react'
import PropertyCard from '../components/property/PropertyCard'
import PropertyPreviewPanel from '../components/property/PropertyPreviewPanel'
import { getStayToRent } from '../Routers'
import {cityOptions} from '../../client/Assets/data.js'

function StayToRent() {
  const [propertyTypes] = useState(['Apartment', 'Bungalow', 'Villa', 'Single Family Home', 'Land'])
 
  const [hoveredProperty, setHoveredProperty] = useState(null)
  const [openFilter, setOpenFilter] = useState(null)
  const [selectedType, setSelectedType] = useState('')
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getStayToRent()
      .then((data) => setProperties(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filteredProperties = selectedType
    ? properties.filter((property) => property.tag === selectedType)
    : properties

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className={`grid grid-cols-1 gap-8 ${hoveredProperty ? 'lg:grid-cols-[280px_1fr_360px]' : 'lg:grid-cols-[280px_1fr]'}`}>
        
        {/* Sidebar Filter */}
        <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto pr-2">
  <div className="flex justify-between items-center mb-6">
    <h3 className="text-lg font-heading font-medium">Custom Filter</h3>
    <button
      type="button"
      onClick={() => setSelectedType('')}
      className="text-sm text-blue-600 hover:underline"
    >
      Clear All
    </button>
  </div>

  {/* Property Type */}
  <div className="border border-gray-300 rounded-full lg:rounded-lg mb-4 overflow-hidden">
    <button 
      onClick={() => setOpenFilter(openFilter === 'type' ? null : 'type')}
      className="w-full flex items-center gap-2 px-4 py-3 text-left"
    >
      <HomeIcon size={16} className="text-gray-500" />
      <span className="text-sm font-medium">Property Type</span>
    </button>
    {openFilter === 'type' && (
      <div className="space-y-2 max-h-32 overflow-y-auto px-4 pb-4">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full border border-gray-300 rounded-xl p-3 text-sm outline-none"
        >
          <option value="">All Types</option>
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
    )}
  </div>

  {/* Location */}
  <div className="border border-gray-300 rounded-full lg:rounded-lg mb-4 overflow-hidden">
    <button 
      onClick={() => setOpenFilter(openFilter === 'location' ? null : 'location')}
      className="w-full flex items-center gap-2 px-4 py-3 text-left"
    >
      <MapPin size={16} className="text-gray-500" />
      <span className="text-sm font-medium">Location</span>
    </button>
    {openFilter === 'location' && (
      <div className="space-y-2 max-h-32 overflow-y-auto px-4 pb-4">
        {cityOptions.map((loc) => (
          <label key={loc} className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" className="accent-secondary" />
            {loc}
          </label>
        ))}
      </div>
    )}
  </div>

  {/* Land Area */}
  <div className="border border-gray-300 rounded-full lg:rounded-lg mb-4 overflow-hidden">
    <button 
      onClick={() => setOpenFilter(openFilter === 'area' ? null : 'area')}
      className="w-full flex items-center gap-2 px-4 py-3 text-left"
    >
      <Ruler size={16} className="text-gray-500" />
      <span className="text-sm font-medium">Land Area</span>
    </button>
    {openFilter === 'area' && (
      <div className="flex gap-2 px-4 pb-4">
        <input type="text" placeholder="Min sq ft" className="w-1/2 border border-gray-200 rounded-full px-3 py-2 text-sm outline-none" />
        <input type="text" placeholder="Max sq ft" className="w-1/2 border border-gray-200 rounded-full px-3 py-2 text-sm outline-none" />
      </div>
    )}
  </div>

  {/* Price */}
  <div className="border border-gray-300 rounded-full lg:rounded-lg mb-6 overflow-hidden">
    <button 
      onClick={() => setOpenFilter(openFilter === 'price' ? null : 'price')}
      className="w-full flex items-center gap-2 px-4 py-3 text-left"
    >
      <Tag size={16} className="text-gray-500" />
      <span className="text-sm font-medium">Price</span>
    </button>
    {openFilter === 'price' && (
      <div className="space-y-2 text-sm text-gray-600 max-h-32 overflow-y-auto px-4 pb-4">
        <label className="flex items-center gap-2">
          <input type="radio" name="price" className="accent-secondary" /> Under $1,000
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="price" className="accent-secondary" /> $1,000-$15,000
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="price" className="accent-secondary" /> More than $15,000
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="price" defaultChecked className="accent-secondary" /> Custom
        </label>
      </div>
    )}
  </div>

  <div className="relative rounded-xl overflow-hidden">
    <img 
      src="/src/assets/common/homebanner.png" 
      alt="Elegant home for sale" 
      className="w-full h-56 object-cover"
    />
    <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1">
      <ChevronLeft size={16} />
    </button>
    <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1">
      <ChevronRight size={16} />
    </button>
  </div>
</aside>
        {/* Property Grid */}
        <div className={`grid grid-cols-2 ${hoveredProperty ? '' : 'xl:grid-cols-3'} gap-4 sm:gap-6`}>
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              onMouseEnter={() => setHoveredProperty(property)}
            >
              <Link to={`/rental/${property.id}`}>
                <PropertyCard property={property} />
              </Link>
            </div>
          ))}
        </div>

        {/* Preview Panel - only shows on hover */}
        {hoveredProperty && (
          <PropertyPreviewPanel 
            property={hoveredProperty} 
            onClose={() => setHoveredProperty(null)} 
          />
        )}

      </div>
    </div>
  )
}

export default StayToRent