import { useState, useEffect } from 'react'
import heroImage from '../assets/hero/hero.png'
import { Search, MapPin, ArrowUpDown, Home as HomeIcon } from 'lucide-react'
import PropertySection from '../components/property/PropertySection'
import { getHotSales, getLands, getStayToBuy, getStayToRent } from '../Routers'
import { useNavigate } from 'react-router-dom'

function Home() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const Navigate = useNavigate()
  const types = ['House', 'Apartment', 'Bungalow', 'Villa', 'Hotel', 'Studio', 'WareHouse']

  useEffect(() => {
    async function loadProperties() {
      try {
        setLoading(true)
        const [hotSalesData, landsData, stayToBuyData, stayToRentData] = await Promise.all([
          getHotSales(),
          getLands(),
          getStayToBuy(),
          getStayToRent(),
        ])

        setProperties([
          ...hotSalesData,
          ...landsData,
          ...stayToBuyData,
          ...stayToRentData,
        ])
      } catch (err) {
        setError(err.message || 'Unable to load property data')
      } finally {
        setLoading(false)
      }
    }

    loadProperties()
  }, [])

  const getPropertiesByType = (type) => properties.filter((property) => property.tag === type)

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative h-[500px] md:h-[560px] bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 w-full">
          <div className="max-w-2xl">
            <h1 
              className="text-white text-4xl md:text-5xl leading-tight mb-6"
              style={{ fontFamily: 'var(--font-hero)' }}
            >
              Join With Us For Beginning<br />Your New Chapter
            </h1>

            <p className="text-white/90 text-base mb-8 max-w-xl">
              Discover exceptional properties designed with elegance, comfort, and modern 
              sophistication. We help you find a place that reflects your lifestyle and 
              turns your vision of luxury living into reality.
            </p>

            <button className="bg-white/90 text-black font-semibold px-6 py-3 rounded-md hover:bg-white transition"
            onClick={() => Navigate('/dashboard/client-login')}>
              Add Property &gt;&gt;
            </button>
          </div>
        </div>
      </section>

      {/* Floating Search Bar */}
      <div className="relative max-w-5xl mx-auto px-4">
        <div className="bg-[#14213D] text-white rounded-xl -mt-8 md:-mt-9 relative z-10 shadow-xl">
          <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/20">
            
            <button className="flex-1 flex items-center justify-center gap-2 py-5 px-4 hover:bg-white/5 transition">
              <Search size={18} />
              <span>Search</span>
            </button>

            <button className="flex-1 flex items-center justify-center gap-2 py-5 px-4 hover:bg-white/5 transition">
              <MapPin size={18} />
              <span>Location</span>
            </button>

            <button className="flex-1 flex items-center justify-center gap-2 py-5 px-4 hover:bg-white/5 transition">
              <ArrowUpDown size={18} />
              <span>Price Sort</span>
            </button>

            <button className="flex-1 flex items-center justify-center gap-2 py-5 px-4 hover:bg-white/5 transition">
              <HomeIcon size={18} />
              <span>Property Type</span>
            </button>

          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-red-600">
          {error}
        </div>
      )}

      <PropertySection 
        title="Hot Sales" 
        properties={getPropertiesByType('House').slice(0, 4)} 
        seeMoreLink="/hot-sales"
        loading={loading}
      />

      <PropertySection 
        title="Houses" 
        properties={getPropertiesByType('House').slice(0, 4)} 
        seeMoreLink="/lands"
        loading={loading}
      />

      {/* Promo Banners */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl overflow-hidden border-2 border-navy">
            <img 
              src="/src/assets/properties/add.png" 
              alt="Spacious villas promo" 
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="rounded-xl overflow-hidden border-2 border-navy">
            <img 
              src="/src/assets/properties/add2.png" 
              alt="Poster design promo" 
              className="w-full h-48 object-cover"
            />
          </div>
        </div>
      </section>

      <PropertySection 
        title="Apartments" 
        properties={getPropertiesByType('Apartment').slice(0, 4)} 
        seeMoreLink="/stay-to-buy"
        loading={loading}
      />

      <PropertySection 
        title="Hotels" 
        properties={getPropertiesByType('Hotel').slice(0, 4)} 
        seeMoreLink="/stay-to-rent"
        loading={loading}
      />

      {/* Why Choose Us + Stats */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left - Dark Box with House Image */}
          <div className="relative bg-navy rounded-2xl p-10 pb-0 overflow-visible min-h-[320px]">
            <h3 className="text-white text-2xl font-heading font-medium mb-5">
              Why You want To Choose Us
            </h3>
            <ul className="space-y-3 text-white/90 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                Give User Offers
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                Easy to sell your property
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                Free Space for Post our ADs
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                Free Space for Post our ADs
              </li>
            </ul>

            <img 
              src="/src/assets/house-illustration.png" 
              alt="House illustration"
              className="absolute bottom-0 right-0 w-3/5 translate-y-8"
            />
          </div>

          {/* Right - Stats */}
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-medium mb-8">
              We Help To Find Your Dream Property
            </h2>

            <div className="grid grid-cols-2 gap-x-8 gap-y-8">
              <div>
                <p className="text-4xl font-medium mb-2">0K+</p>
                <p className="text-sm text-gray-500">
                  Discover exceptional properties designed with elegance, comfort.
                </p>
              </div>
              <div>
                <p className="text-4xl font-medium mb-2">8K+</p>
                <p className="text-sm text-gray-500">
                  Discover exceptional properties designed with elegance, comfort.
                </p>
              </div>
              <div>
                <p className="text-4xl font-medium mb-2">24K+</p>
                <p className="text-sm text-gray-500">
                  Discover exceptional properties designed with elegance, comfort.
                </p>
              </div>
              <div>
                <p className="text-4xl font-medium mb-2">3K+</p>
                <p className="text-sm text-gray-500">
                  Discover exceptional properties designed with elegance, comfort.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}

export default Home