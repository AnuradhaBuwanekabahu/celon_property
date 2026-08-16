import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Search } from 'lucide-react'
import LandCard from '../components/property/LandCard'
import { getLands } from '../Routers'
import landsHero from '../assets/properties/landHero.jpg'

function Lands() {
  const [propertyTypes] = useState(['Apartment', 'Bungalow', 'Villa', 'House', 'Land'])
  const [selectedType, setSelectedType] = useState('')
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getLands()
      .then((data) => setProperties(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filteredProperties = selectedType
    ? properties.filter((property) => property.tag === selectedType)
    : properties

  return (
    <div>
      {/* Hero Section */}
<section 
  className="relative h-[600px] bg-cover bg-center flex flex-col justify-center"
  style={{ backgroundImage: `url(${landsHero})` }}
>
  <div className="absolute inset-0 bg-black/25" />

  <div className="relative max-w-7xl mx-auto px-4 w-full">
    <p className="text-white text-lg mb-2">Find Your Dream Land</p>
    <h1 
      className="text-white text-5xl md:text-6xl leading-tight mb-4"
      style={{ fontFamily: 'var(--font-hero)' }}
    >
      Buy Sell & Invest In<br />Premium Lands
    </h1>
    <p className="text-white/90 text-lg mb-10">
      Discover verified lands in the best locations at the best prices
    </p>

    {/* Search Bar */}
    <div className="bg-white rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 w-full">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium mb-1">City</label>
              <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none">
                <option>Search City</option>
                <option>Colombo</option>
                <option>Kandy</option>
                <option>Nuwara Eliya</option>
                <option>Galle</option>
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium mb-1">Property Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none"
              >
                <option value="">All Types</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium mb-1">Land Size</label>
              <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none">
                <option>Land Size</option>
                <option>Under 10 Perches</option>
                <option>10 - 30 Perches</option>
                <option>Above 30 Perches</option>
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium mb-1">Size</label>
              <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none">
                <option>Select Unit</option>
                <option>Perches</option>
                <option>Acres</option>
              </select>
            </div>
            <button className="bg-navy text-white flex items-center gap-2 px-6 py-2.5 rounded-md hover:opacity-90 transition whitespace-nowrap self-end mt-1">
              Serach Land
              <Search size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Lands */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-heading font-bold">Featured Lands</h2>
          <ArrowRight size={22} />
        </div>
        <p className="text-gray-500 mb-8">Handpicked premium lands from trusted sellers.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-10 text-gray-500">Loading lands...</div>
          ) : error ? (
            <div className="col-span-full text-center py-10 text-red-500">Error: {error}</div>
          ) : filteredProperties.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500">No lands match your current filters.</div>
          ) : (
            filteredProperties.map((land) => (
              <Link key={land.id} to={`/property/${land.id}`}>
                <LandCard land={land} />
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Want to Sell CTA */}
      <section className="bg-navy">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center">
          <div className="px-4 py-16">
            <h2 className="text-white text-3xl font-heading font-medium mb-3"
            style={{ fontFamily: 'var(--font-hero)'}}>

              Want To Sell Your Land ?
            </h2>
            <p className="text-white/80">
              Post your property and reach thousands of potential buyers today
            </p>
          </div>
          <div className="relative h-64 md:h-full">
            <img 
              src="/src/assets/properties/landsBanner.png" 
              alt="Sell your land" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Lands