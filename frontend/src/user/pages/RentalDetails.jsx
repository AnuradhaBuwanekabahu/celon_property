import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ChevronLeft, MapPin, BedDouble, Bath, ChefHat, Trees, Home as HomeIcon, ArrowRight, Phone, X } from 'lucide-react'
import { getPropertyById, allProperties } from '../data/properties'
import PropertyCard from '../components/property/PropertyCard'

function RentalDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const property = getPropertyById(id)
  const [showContactForm, setShowContactForm] = useState(false)

  if (!property) {
    return <p className="text-center mt-20">Property not found.</p>
  }

  const gallery = property.gallery || [property.image, property.image, property.image, property.image]

  const sameTag = allProperties.filter((p) => p.id !== property.id && p.tag === property.tag)
  const others = allProperties.filter((p) => p.id !== property.id && p.tag !== property.tag)
  const similarProperties = [...sameTag, ...others].slice(0, 4)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-700 hover:text-black mb-6"
      >
        <ChevronLeft size={20} />
        <span className="font-medium">Back</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-3 mb-4">
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

      <div className="bg-navy text-white rounded-lg px-6 py-4 mb-8 flex flex-wrap items-center justify-between gap-4 relative">
        <div className="flex items-center gap-3">
        <button onClick={() => setShowContactForm(true)} className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.61 14.02c-.24.66-1.18 1.22-1.94 1.38-.53.11-1.22.2-3.55-.76-2.98-1.23-4.9-4.24-5.05-4.44-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.29.59-.36.79-.36.2 0 .39.001.56.008.18.008.42-.068.66.5.24.58.82 2 .89 2.14.07.15.12.32.02.51-.09.2-.14.32-.28.49-.14.17-.29.38-.42.51-.14.14-.28.29-.12.57.15.28.68 1.12 1.46 1.82 1.01.9 1.86 1.18 2.14 1.31.28.14.44.11.6-.07.17-.17.7-.82.89-1.1.19-.28.38-.23.63-.14.26.09 1.65.78 1.93.92.28.14.47.21.53.33.07.12.07.68-.17 1.34z"/>
         </svg>
        </button>
        <button onClick={() => setShowContactForm(true)} className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
           <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
         </svg>
        </button>
        <button onClick={() => setShowContactForm(true)} className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
           <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
         </svg>
         </button>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <span className="border border-white/40 rounded-md px-3 py-1">Owner</span>
          <span className="font-medium">{property.ownerName || 'Ceylon Properties'}</span>
          <span className="flex items-center gap-2">
            <Phone size={16} />
            {property.ownerPhone || '011-2345678'}
          </span>
        </div>
      </div>

      <h1 className="text-2xl md:text-3xl font-heading font-medium mb-5">
        {property.title} with {property.beds} Bed Rooms at {property.location.split(',')[0]} For Rs.{property.priceRs} Per Month
      </h1>

      <div className="flex flex-wrap gap-3 mb-8">
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm">
          <MapPin size={16} className="text-blue-600" />
          {property.location}
        </div>
        <div className="border border-gray-200 rounded-lg px-4 py-2 text-sm">
          <span className="font-bold">Area of Land: </span>{property.landArea}
        </div>
        <div className="border border-gray-200 rounded-lg px-4 py-2 text-sm">
          <span className="font-bold">Sq.Ft: </span>{property.sqft || '5000'}
        </div>
        <div className="border border-gray-200 rounded-lg px-4 py-2 text-sm">
          <span className="font-bold">Rent: </span>Rs. {property.priceRs} / month
        </div>
      </div>

      <h3 className="text-xl font-heading font-semibold mb-4">overview</h3>
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="bg-indigo-50 rounded-lg px-6 py-3 text-center">
          <p className="text-sm">{property.propertyType || property.tag}</p>
          <p className="font-bold">Property Type</p>
        </div>
        <div className="bg-indigo-50 rounded-lg px-6 py-3 text-center">
          <p className="text-sm">{property.beds} Rooms</p>
          <p className="font-bold">Bed Rooms</p>
        </div>
        <div className="bg-indigo-50 rounded-lg px-6 py-3 text-center">
          <p className="text-sm">{property.sqft || '5 000'}</p>
          <p className="font-bold">Floor Area Sq.Ft</p>
        </div>
        <div className="bg-indigo-50 rounded-lg px-6 py-3 text-center">
          <p className="text-sm">{property.bathrooms} Rooms</p>
          <p className="font-bold">Bath Rooms:</p>
        </div>
      </div>

      <h3 className="text-xl font-heading font-semibold mb-3">Description</h3>
      <p className="text-gray-600 leading-relaxed mb-8">{property.description}</p>

      <h3 className="text-xl font-heading font-semibold mb-4">Features</h3>
      <div className="flex flex-wrap gap-4 mb-10">
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-5 py-2.5 text-sm">
          <BedDouble size={16} /> {property.beds} Beds
        </div>
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-5 py-2.5 text-sm">
          <ChefHat size={16} /> {property.kitchen}Kitchen
        </div>
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-5 py-2.5 text-sm">
          <HomeIcon size={16} /> {property.rooms} Rooms
        </div>
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-5 py-2.5 text-sm">
          <Bath size={16} /> {property.bathrooms} Bathroom
        </div>
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-5 py-2.5 text-sm">
          <Trees size={16} /> {property.garden} Garden
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <img 
          src="/src/assets/properties/promo-1.jpg" 
          alt="Promo banner" 
          className="w-full h-64 object-cover rounded-xl"
        />
        <img 
          src="/src/assets/common/homebanner.png" 
          alt="Promo banner" 
          className="w-full h-72 object-cover rounded-xl"
        />
      </div>

      {similarProperties.length > 0 && (
        <>
          <h3 className="text-xl font-heading font-semibold mb-5">Similar Property</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {similarProperties.map((p) => (
              <Link key={p.id} to={`/rental/${p.id}`}>
                <PropertyCard property={p} />
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Contact Form Modal */}
             {showContactForm && (
            <div className="absolute top-full left-0 mt-2 bg-navy text-white rounded-2xl p-6 w-full max-w-xs z-50 shadow-2xl">
            <button 
              onClick={() => setShowContactForm(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="flex gap-4 mb-6">
              <a href="#" className="w-11 h-11 rounded-full bg-[#25D366] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.61 14.02c-.24.66-1.18 1.22-1.94 1.38-.53.11-1.22.2-3.55-.76-2.98-1.23-4.9-4.24-5.05-4.44-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.29.59-.36.79-.36.2 0 .39.001.56.008.18.008.42-.068.66.5.24.58.82 2 .89 2.14.07.15.12.32.02.51-.09.2-.14.32-.28.49-.14.17-.29.38-.42.51-.14.14-.28.29-.12.57.15.28.68 1.12 1.46 1.82 1.01.9 1.86 1.18 2.14 1.31.28.14.44.11.6-.07.17-.17.7-.82.89-1.1.19-.28.38-.23.63-.14.26.09 1.65.78 1.93.92.28.14.47.21.53.33.07.12.07.68-.17 1.34z"/>
                </svg>
              </a>
              <a href="#" className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </a>
              <a href="#" className="w-11 h-11 rounded-full bg-indigo-500 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                </svg>
              </a>
            </div>

            <label className="block text-sm mb-2">E-mail</label>
            <input 
              type="email" 
              placeholder="@mail.com"
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

            <div className="flex justify-end">
              <button className="bg-secondary text-black font-semibold px-8 py-2.5 rounded-md hover:opacity-90 transition">
                Send
              </button>
            </div>
          </div>
      )}

    </div>
  )
}

export default RentalDetails
