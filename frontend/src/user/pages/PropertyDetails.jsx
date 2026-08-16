import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, MapPin, BedDouble, Bath, ChefHat, Trees, Home as HomeIcon, ArrowRight } from 'lucide-react'
import { getHotSaleById, getLandById, getStayToBuyById } from '../Routers'

function PropertyDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProperty() {
      setLoading(true)
      setError(null)

      const fetchers = [getHotSaleById, getLandById, getStayToBuyById]
      let fetched = null

      for (const fetcher of fetchers) {
        try {
          const result = await fetcher(id)
          if (result && result.id) {
            fetched = result
            break
          }
        } catch (err) {
          // ignore failed source and try next
        }
      }

      if (!fetched) {
        setError('Property not found.')
      }

      setProperty(fetched)
      setLoading(false)
    }

    fetchProperty()
  }, [id])

  if (loading) {
    return <p className="text-center mt-20">Loading property details...</p>
  }

  if (error || !property) {
    return <p className="text-center mt-20">{error || 'Property not found.'}</p>
  }

  const gallery = property.gallery || [property.image, property.image, property.image, property.image]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-700 hover:text-black mb-6"
      >
        <ChevronLeft size={20} />
        <span className="font-medium">Back</span>
      </button>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-3 mb-10">
        <img 
          src={gallery[0]} 
          alt={property.title} 
          className="w-full h-[280px] md:h-[420px] object-cover rounded-xl"
        />
        <div className="grid grid-cols-2 gap-3">
          <img src={gallery[1]} alt="" className="w-full h-[200px] object-cover rounded-xl" />
          <img src={gallery[2]} alt="" className="w-full h-[200px] object-cover rounded-xl" />
          <img src={gallery[3]} alt="" className="w-full h-[200px] object-cover rounded-xl" />
          <div className="relative rounded-xl overflow-hidden">
            <img src={gallery[3]} alt="" className="w-full h-[200px] object-cover" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-between px-4">
              <span className="text-white font-medium">see More</span>
              <div className="bg-white rounded-full p-2">
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info + Contact Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10">
        
        {/* Left - Property Info */}
        <div>
          <h1 className="text-3xl font-heading font-medium mb-3">{property.title}</h1>

          <p className="flex items-center gap-2 text-gray-700 mb-4">
            <MapPin size={18} className="text-blue-600" />
            {property.location}
          </p>

          <p className="mb-2">
            <span className="font-bold">Price:</span> Rs. {property.priceRs}
            {property.priceGbp && <span className="text-gray-500"> (£ {property.priceGbp})</span>}
          </p>

          <p className="mb-6">
            <span className="font-bold">Area Of Land:</span> {property.landArea}
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm">
              <HomeIcon size={16} /> {property.rooms} Rooms
            </div>
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm">
              <BedDouble size={16} /> {property.beds} Beds
            </div>
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm">
              <Bath size={16} /> {property.bathrooms} Bathroom
            </div>
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm">
              <ChefHat size={16} /> {property.kitchen} Kitchen
            </div>
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm">
              <Trees size={16} /> {property.garden} Garden
            </div>
          </div>

          <h3 className="text-xl font-heading font-semibold mb-3">Description</h3>
          <p className="text-gray-600 leading-relaxed">{property.description}</p>
        </div>

        {/* Right - Contact Form */}
        <div className="bg-navy rounded-2xl p-8 text-white h-fit">
          <p className="font-medium mb-4">Contact Us On:</p>

          <div className="flex gap-4 mb-6">
            <a href="#" className="w-11 h-11 rounded-full bg-[#25D366] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.61 14.02c-.24.66-1.18 1.22-1.94 1.38-.53.11-1.22.2-3.55-.76-2.98-1.23-4.9-4.24-5.05-4.44-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.29.59-.36.79-.36.2 0 .39.001.56.008.18.008.42-.068.66.5.24.58.82 2 .89 2.14.07.15.12.32.02.51-.09.2-.14.32-.28.49-.14.17-.29.38-.42.51-.14.14-.28.29-.12.57.15.28.68 1.12 1.46 1.82 1.01.9 1.86 1.18 2.14 1.31.28.14.44.11.6-.07.17-.17.7-.82.89-1.1.19-.28.38-.23.63-.14.26.09 1.65.78 1.93.92.28.14.47.21.53.33.07.12.07.68-.17 1.34z"/>
              </svg>
            </a>
            <a href="#" className="w-11 h-11 rounded-full bg-indigo-500 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
            </a>
            <a href="#" className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </a>
          </div>

          <label className="block text-sm mb-2">E-mail</label>
          <input 
            type="email" 
            placeholder="@gmail.com"
            className="w-full bg-gray-200 text-black rounded-md px-3 py-2.5 mb-4 outline-none placeholder:text-gray-500"
          />

          <label className="block text-sm mb-2">Contact Number</label>
          <input 
            type="text" 
            className="w-full bg-gray-200 text-black rounded-md px-3 py-2.5 mb-4 outline-none"
          />

          <label className="block text-sm mb-2">message</label>
          <textarea 
            rows={5}
            className="w-full bg-gray-200 text-black rounded-md px-3 py-2.5 mb-5 outline-none"
          />

          <button className="bg-secondary text-black font-semibold px-8 py-2.5 rounded-md hover:opacity-90 transition">
            Send
          </button>
        </div>

      </div>
    </div>
  )
}

export default PropertyDetails