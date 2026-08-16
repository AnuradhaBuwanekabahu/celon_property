import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Home as HomeIcon, MapPin, Ruler, Tag, ChevronLeft, ChevronRight } from 'lucide-react'
import PropertyCard from '../components/property/PropertyCard'
import PropertyPreviewPanel from '../components/property/PropertyPreviewPanel'
import { getStayToBuy } from '../Routers'
import {cityOptions} from '../../client/Assets/data.js'
function StayToBuy() {
  const [propertyTypes] = useState(['Apartment', 'Bungalow', 'Villa', 'House', 'Land'])

  const [hoveredProperty, setHoveredProperty] = useState(null)
  const [openFilter, setOpenFilter] = useState(null)
  const [selectedType, setSelectedType] = useState('')
  const [selectedLocations, setSelectedLocations] = useState([])
  const [selectedPriceRange, setSelectedPriceRange] = useState('')
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getStayToBuy()
      .then((data) => setProperties(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filteredProperties = properties.filter((property) => {
    const matchesType = selectedType ? property.tag === selectedType : true
    const matchesLocation = selectedLocations.length > 0
      ? selectedLocations.some((loc) => property.location?.includes(loc))
      : true
    const priceValue = Number(property.priceRs || property.price || 0)
    const matchesPrice = selectedPriceRange
      ? selectedPriceRange === 'under-50'
        ? priceValue < 50000000
        : selectedPriceRange === '50-150'
          ? priceValue >= 50000000 && priceValue <= 150000000
          : selectedPriceRange === 'above-150'
            ? priceValue > 150000000
            : true
      : true

    return matchesType && matchesLocation && matchesPrice
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className={`grid grid-cols-1 gap-6 lg:gap-8 ${hoveredProperty ? 'lg:grid-cols-[280px_1fr_360px]' : 'lg:grid-cols-[280px_1fr]'}`}>
        
        {/* Sidebar Filter */}
        <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-heading font-medium">Custom Filter</h3>
            <button
              type="button"
              onClick={() => {
                setSelectedType('')
                setSelectedLocations([])
                setSelectedPriceRange('')
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="border border-gray-300 rounded-full lg:rounded-lg mb-4 overflow-hidden">
            <button 
              onClick={() => setOpenFilter(openFilter === 'type' ? null : 'type')}
              className="w-full flex items-center gap-2 px-4 py-3 text-left"
            >
              <HomeIcon size={16} className="text-gray-500" />
              <span className="text-sm font-medium">Property Type</span>
            </button>
            <div className={`space-y-2 max-h-32 overflow-y-auto px-4 pb-4 ${openFilter === 'type' ? 'block' : 'hidden'} lg:block`}>
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
          </div>

          <div className="border border-gray-300 rounded-full lg:rounded-lg mb-4 overflow-hidden">
            <button 
              onClick={() => setOpenFilter(openFilter === 'location' ? null : 'location')}
              className="w-full flex items-center gap-2 px-4 py-3 text-left"
            >
              <MapPin size={16} className="text-gray-500" />
              <span className="text-sm font-medium">Location</span>
            </button>
            <div className={`space-y-2 max-h-32 overflow-y-auto px-4 pb-4 ${openFilter === 'location' ? 'block' : 'hidden'} lg:block`}>
              {cityOptions.map((loc) => (
                <label key={loc} className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(loc)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLocations((prev) => [...prev, loc])
                      } else {
                        setSelectedLocations((prev) => prev.filter((item) => item !== loc))
                      }
                    }}
                    className="accent-secondary"
                  />
                  {loc}
                </label>
              ))}
            </div>
          </div>

          <div className="border border-gray-300 rounded-full lg:rounded-lg mb-4 overflow-hidden">
            <button 
              onClick={() => setOpenFilter(openFilter === 'area' ? null : 'area')}
              className="w-full flex items-center gap-2 px-4 py-3 text-left"
            >
              <Ruler size={16} className="text-gray-500" />
              <span className="text-sm font-medium">Land Area</span>
            </button>
            <div className={`flex gap-2 px-4 pb-4 ${openFilter === 'area' ? 'flex' : 'hidden'} lg:flex`}>
              <input type="text" placeholder="Min sq ft" className="w-1/2 border border-gray-200 rounded-full px-3 py-2 text-sm outline-none" />
              <input type="text" placeholder="Max sq ft" className="w-1/2 border border-gray-200 rounded-full px-3 py-2 text-sm outline-none" />
            </div>
          </div>

          <div className="border border-gray-300 rounded-full lg:rounded-lg mb-6 overflow-hidden">
            <button 
              onClick={() => setOpenFilter(openFilter === 'price' ? null : 'price')}
              className="w-full flex items-center gap-2 px-4 py-3 text-left"
            >
              <Tag size={16} className="text-gray-500" />
              <span className="text-sm font-medium">Price Range</span>
            </button>
            <div className={`space-y-2 text-sm text-gray-600 max-h-32 overflow-y-auto px-4 pb-4 ${openFilter === 'price' ? 'block' : 'hidden'} lg:block`}>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="price"
                  value="under-50"
                  checked={selectedPriceRange === 'under-50'}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="accent-secondary"
                />
                Under LKR 50M
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="price"
                  value="50-150"
                  checked={selectedPriceRange === '50-150'}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="accent-secondary"
                />
                LKR 50M - 150M
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="price"
                  value="above-150"
                  checked={selectedPriceRange === 'above-150'}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="accent-secondary"
                />
                Above LKR 150M
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="price"
                  value=""
                  checked={selectedPriceRange === ''}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="accent-secondary"
                />
                All prices
              </label>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden">
            <img 
              src="/src/assets/properties/ad-banner.jpg" 
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

          <div className="space-y-4">
            {(selectedType || selectedLocations.length > 0 || selectedPriceRange) && (
              <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-3">
                <span className="text-sm text-gray-700">Active filters:</span>
                {selectedType && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-gray-700 shadow-sm">
                    <span className="font-medium">Type:</span>
                    <span>{selectedType}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedType('')}
                      className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                      aria-label="Remove type filter"
                    >
                      ×
                    </button>
                  </div>
                )}
                {selectedLocations.length > 0 && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-gray-700 shadow-sm">
                    <span className="font-medium">Location:</span>
                    <span>{selectedLocations.join(', ')}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedLocations([])}
                      className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                      aria-label="Remove location filters"
                    >
                      ×
                    </button>
                  </div>
                )}
                {selectedPriceRange && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-gray-700 shadow-sm">
                    <span className="font-medium">Price:</span>
                    <span>{selectedPriceRange === 'under-50' ? 'Under LKR 50M' : selectedPriceRange === '50-150' ? 'LKR 50M - 150M' : 'Above LKR 150M'}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedPriceRange('')}
                      className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                      aria-label="Remove price filter"
                    >
                      ×
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedType('')
                    setSelectedLocations([])
                    setSelectedPriceRange('')
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}

            {loading ? (
              <p className="text-center py-10 col-span-full">Loading properties...</p>
            ) : error ? (
              <p className="text-center py-10 text-red-500 col-span-full">Error: {error}</p>
            ) : filteredProperties.length === 0 ? (
              <p className="text-center py-10 text-gray-500 col-span-full">No properties found.</p>
            ) : (
              <div className={`grid grid-cols-2 ${hoveredProperty ? '' : 'xl:grid-cols-3'} gap-4 sm:gap-6`}>
                {filteredProperties.map((property) => (
                  <div key={property.id} onMouseEnter={() => setHoveredProperty(property)}>
                    <Link to={`/property/${property.id}`}>
                      <PropertyCard property={property} />
                    </Link>
                  </div>
                ))}
              </div>
            )}

          </div>

          {hoveredProperty && (
            <PropertyPreviewPanel property={hoveredProperty} onClose={() => setHoveredProperty(null)} />
          )}

      </div>
    </div>
  )
}

export default StayToBuy
