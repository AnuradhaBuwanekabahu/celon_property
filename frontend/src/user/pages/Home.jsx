import { useState, useEffect } from 'react'
import heroImage from '../assets/hero/hero.jpeg'
import {
  Search,
  ChevronDown,
  Flame,
  Building2,
  Home as HouseIcon,
  Castle,
  Trees,
  Hotel
} from 'lucide-react'
import PropertySection from '../components/property/PropertySection'
import {
  getHotSales,
  getLands,
  getStayToBuy,
  getStayToRent,
} from '../Routers'
import { useNavigate } from 'react-router-dom'

function Home() {
  const [properties, setProperties] = useState([])
  const [hotSalesData, setHotSalesData] = useState([])
  const [landsData, setLandsData] = useState([])
  const [stayToBuyData, setStayToBuyData] = useState([])
  const [stayToRentData, setStayToRentData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('Buy')
  const [searchType, setSearchType] = useState('')
  const [searchDistrict, setSearchDistrict] = useState('')
  const [searchCity, setSearchCity] = useState('')
  const [searchPrice, setSearchPrice] = useState('')

  const navigate = useNavigate()

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchType && searchType !== 'Any Type') {
      params.set('type', searchType)
    }

    const loc = (searchCity && searchCity !== 'All Cities')
      ? searchCity
      : (searchDistrict && searchDistrict !== 'All Districts')
        ? searchDistrict
        : ''
    if (loc) {
      params.set('location', loc)
    }

    if (searchPrice && searchPrice !== 'Any Price') {
      params.set('price', searchPrice)
    }

    const queryString = params.toString() ? `?${params.toString()}` : ''

    if (searchType?.toLowerCase() === 'land') {
      navigate(`/lands${queryString}`)
    } else if (activeTab === 'Rent') {
      navigate(`/stay-to-rent${queryString}`)
    } else {
      navigate(`/stay-to-buy${queryString}`)
    }
  }

  useEffect(() => {
    async function loadProperties() {
      try {
        setLoading(true)
        setError(null)

        const [
          hotSales,
          lands,
          buyList,
          rentList,
        ] = await Promise.all([
          getHotSales().catch(err => { console.error('HotSales API error:', err); return []; }),
          getLands().catch(err => { console.error('Lands API error:', err); return []; }),
          getStayToBuy().catch(err => { console.error('StayToBuy API error:', err); return []; }),
          getStayToRent().catch(err => { console.error('StayToRent API error:', err); return []; }),
        ])

        setHotSalesData(hotSales || [])
        setLandsData(lands || [])
        setStayToBuyData(buyList || [])
        setStayToRentData(rentList || [])

        const combined = [
          ...(hotSales || []),
          ...(lands || []),
          ...(buyList || []),
          ...(rentList || []),
        ]
        setProperties(combined)
      } catch (err) {
        console.error('Property loading error:', err)
        setError(err.message || 'Unable to load property data')
      } finally {
        setLoading(false)
      }
    }

    loadProperties()
  }, [])

  const getPropertiesByType = (type) => {
    const target = (type || '').toLowerCase()
    const currentList = activeTab === 'Rent'
      ? stayToRentData
      : [...hotSalesData, ...stayToBuyData, ...landsData]

    return currentList.filter((p) => {
      // Match only against proper type/category fields — not title/description
      const fields = [
        p.property_type || '',
        p.tag || '',
        p.category || '',
        p.type || '',
      ].map(f => f.toLowerCase())

      if (target === 'house') {
        return fields.some(f => f.includes('house') || f.includes('bungalow'))
      }
      if (target === 'apartment') {
        return fields.some(f => f.includes('apartment'))
      }
      if (target === 'hotel') {
        return fields.some(f => f.includes('hotel'))
      }
      if (target === 'villa') {
        return fields.some(f => f.includes('villa'))
      }
      return fields.some(f => f.includes(target))
    })
  }

  const getCategoryCount = (id) => {
    if (loading) return '...'

    const currentList = activeTab === 'Rent'
      ? stayToRentData
      : [...hotSalesData, ...stayToBuyData, ...landsData]

    if (id === 'hot-sales') {
      return activeTab === 'Rent' ? '0+' : `${hotSalesData.length}+`
    } else if (id === 'lands') {
      return activeTab === 'Rent' ? '0+' : `${landsData.length}+`
    } else {
      const count = currentList.filter((p) => {
        const fields = [
          p.property_type || '',
          p.tag || '',
          p.category || '',
          p.type || '',
        ].map(f => f.toLowerCase())

        if (id === 'apartments') return fields.some(f => f.includes('apartment'))
        if (id === 'houses') return fields.some(f => f.includes('house') || f.includes('bungalow'))
        if (id === 'villas') return fields.some(f => f.includes('villa'))
        if (id === 'hotels') return fields.some(f => f.includes('hotel'))
        return false
      }).length
      return `${count}+`
    }
  }

  const categories = [
    { id: 'hot-sales', title: 'Hot Sales', path: '/hot-sales', icon: Flame },
    { id: 'apartments', title: 'Apartments', path: activeTab === 'Rent' ? '/stay-to-rent?type=Apartment' : '/stay-to-buy?type=Apartment', icon: Building2 },
    { id: 'houses', title: 'Houses', path: activeTab === 'Rent' ? '/stay-to-rent?type=House' : '/stay-to-buy?type=House', icon: HouseIcon },
    { id: 'villas', title: 'Villas', path: activeTab === 'Rent' ? '/stay-to-rent?type=Villa' : '/stay-to-buy?type=Villa', icon: Castle },
    { id: 'lands', title: 'Lands', path: '/lands', icon: Trees },
    { id: 'hotels', title: 'Hotels', path: activeTab === 'Rent' ? '/stay-to-rent?type=Hotel' : '/stay-to-buy?type=Hotel', icon: Hotel },
  ]

  return (
    <div className="min-h-screen bg-white">

      {/* ================= HERO SECTION ================= */}
      <section
        className="relative h-[340px] md:h-[400px] bg-cover bg-center flex items-end pb-16 md:pb-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative w-full pl-10 pr-6 md:pl-28 md:pr-8 lg:pl-36">
          <div className="max-w-xl text-left">

            <h1
              className="text-white text-3xl md:text-4xl leading-tight mb-4"
              style={{ fontFamily: 'var(--font-hero)' }}
            >
              Join With Us For Beginning
              <br />
              Your New Chapter
            </h1>

            <p className="text-white/90 text-sm mb-6 max-w-md">
              Discover exceptional properties designed with elegance,
              comfort, and modern sophistication. We help you find a
              place that reflects your lifestyle.
            </p>

            <button
              className="bg-white/90 text-black font-semibold px-5 py-2.5 rounded-md hover:bg-white transition text-sm"
              onClick={() => navigate('/dashboard/client-login')}
            >
              Add Property &gt;&gt;
            </button>

          </div>
        </div>
      </section>


      {/* ================= PROPERTY SEARCH ================= */}
      <section className="relative max-w-7xl mx-auto px-4 mt-9">
        {/* Buy / Rent Tabs */}
        <div className="flex -mt-16 md:-mt-[72px] relative z-10">

          {['Buy', 'Rent'].map((tab) => {
            const isActive = tab === activeTab

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={[
                  'px-6 py-2.5 text-sm font-semibold rounded-t-lg transition-colors',
                  isActive
                    ? 'bg-white text-[#14213D]'
                    : 'bg-[#14213D] text-white/80 hover:text-white',
                ].join(' ')}
              >
                {tab}
              </button>
            )
          })}

        </div>


        {/* Search Box */}
        <div className="bg-white rounded-b-xl rounded-tr-xl relative z-10 shadow-xl px-6 md:px-8 py-6 flex flex-col md:flex-row md:items-end gap-5 md:gap-6 -mt-px">

          {/* Property Type */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">

            <label className="text-xs font-semibold text-gray-700">
              Property Type
            </label>

            <div className="relative">

              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full appearance-none bg-transparent text-sm text-gray-700 pr-6 py-1 outline-none cursor-pointer font-medium"
              >
                <option value="">Any Type</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Bungalow">Bungalow</option>
                <option value="Villa">Villa</option>
                <option value="Hotel">Hotel</option>
                <option value="Studio">Studio</option>
                <option value="Land">Land</option>
              </select>

              <ChevronDown
                className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              />

            </div>

          </div>


          {/* District */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">

            <label className="text-xs font-semibold text-gray-700">
              District
            </label>

            <div className="relative">

              <select
                value={searchDistrict}
                onChange={(e) => setSearchDistrict(e.target.value)}
                className="w-full appearance-none bg-transparent text-sm text-gray-700 pr-6 py-1 outline-none cursor-pointer font-medium"
              >
                <option value="">All Districts</option>
                <option value="Colombo">Colombo</option>
                <option value="Gampaha">Gampaha</option>
                <option value="Kandy">Kandy</option>
                <option value="Galle">Galle</option>
                <option value="Matara">Matara</option>
                <option value="Kurunegala">Kurunegala</option>
                <option value="Anuradhapura">Anuradhapura</option>
              </select>

              <ChevronDown
                className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              />

            </div>

          </div>


          {/* City */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">

            <label className="text-xs font-semibold text-gray-700">
              City
            </label>

            <div className="relative">

              <select
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full appearance-none bg-transparent text-sm text-gray-700 pr-6 py-1 outline-none cursor-pointer font-medium"
              >
                <option value="">All Cities</option>
                <option value="Colombo 03">Colombo 03</option>
                <option value="Nugegoda">Nugegoda</option>
                <option value="Dehiwala">Dehiwala</option>
                <option value="Kandy">Kandy</option>
                <option value="Galle">Galle</option>
                <option value="Matara">Matara</option>
                <option value="Negombo">Negombo</option>
                <option value="Panadura">Panadura</option>
              </select>

              <ChevronDown
                className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              />

            </div>

          </div>


          {/* Price Range */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">

            <label className="text-xs font-semibold text-gray-700">
              Price Range
            </label>

            <div className="relative">

              <select
                value={searchPrice}
                onChange={(e) => setSearchPrice(e.target.value)}
                className="w-full appearance-none bg-transparent text-sm text-gray-700 pr-6 py-1 outline-none cursor-pointer font-medium"
              >
                <option value="">Any Price</option>
                <option value="under-10">Under Rs 10M</option>
                <option value="10-30">Rs 10M - 30M</option>
                <option value="30-60">Rs 30M - 60M</option>
                <option value="above-60">Rs 60M+</option>
              </select>

              <ChevronDown
                className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              />

            </div>

          </div>


          {/* Search Button */}
          <button
            type="button"
            onClick={handleSearch}
            className="flex items-center justify-center gap-2 bg-[#14213D] hover:bg-[#1c2d54] text-white text-sm font-semibold px-6 py-3 rounded-lg transition whitespace-nowrap shadow-md hover:shadow-lg active:scale-98"
          >
            <Search size={16} />
            Search Properties
          </button>

        </div>

      </section>

      {/* ================= CATEGORY SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-[0_6px_25px_rgba(0,0,0,0.06)] border border-gray-100/80 py-6 px-2 md:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {categories.map((cat, idx) => {
              const Icon = cat.icon
              const isHotSale = cat.id === 'hot-sales'
              return (
                <div
                  key={idx}
                  onClick={() => navigate(cat.path)}
                  className="flex flex-col items-center justify-center py-3 px-2 text-center group cursor-pointer transition-all duration-200 hover:-translate-y-1"
                >
                  <div className={`p-3 rounded-full mb-2.5 transition-colors ${isHotSale ? 'bg-amber-50 text-amber-500 group-hover:bg-amber-100' : 'bg-slate-50 text-[#14213D] group-hover:bg-slate-100'
                    }`}>
                    <Icon className="w-7 h-7 stroke-[1.75]" />
                  </div>
                  <span className="font-bold text-[#14213D] text-sm tracking-tight mb-0.5">
                    {cat.title}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {getCategoryCount(cat.id)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>



      {/* ================= ERROR MESSAGE ================= */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 mt-8">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3">
            {error}
          </div>
        </div>
      )}

      {/* ================= Hotsale (Only in Buy Tab) ================= */}
      {activeTab === 'Buy' && (
        <PropertySection
          title="Hot Sales"
          properties={hotSalesData.slice(0, 4)}
          seeMoreLink="/hot-sales"
          loading={loading}
        />
      )}

      {/* ================= House ================= */}
      <PropertySection
        title={activeTab === 'Rent' ? 'Houses for Rent' : 'Houses for Sale'}
        properties={getPropertiesByType('House').slice(0, 4)}
        seeMoreLink={activeTab === 'Rent' ? '/stay-to-rent?type=House' : '/stay-to-buy?type=House'}
        loading={loading}
      />

      {/* ================= APARTMENTS ================= */}
      <PropertySection
        title={activeTab === 'Rent' ? 'Apartments for Rent' : 'Apartments for Sale'}
        properties={getPropertiesByType('Apartment').slice(0, 4)}
        seeMoreLink={activeTab === 'Rent' ? '/stay-to-rent?type=Apartment' : '/stay-to-buy?type=Apartment'}
        loading={loading}
      />

      {/* ================= HOTELS ================= */}
      <PropertySection
        title={activeTab === 'Rent' ? 'Hotels for Rent / Booking' : 'Hotels for Sale'}
        properties={getPropertiesByType('Hotel').slice(0, 4)}
        seeMoreLink={activeTab === 'Rent' ? '/stay-to-rent?type=Hotel' : '/stay-to-buy?type=Hotel'}
        loading={loading}
      />

      {/* ================= Lands (Only in Buy Tab) ================= */}
      {activeTab === 'Buy' && (
        <PropertySection
          title="Lands for Sale"
          properties={landsData.slice(0, 4)}
          seeMoreLink="/lands"
          loading={loading}
        />
      )}


      {/* ================= WHY CHOOSE US & STATS BAR ================= */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#14213D] tracking-tight">
            Why Choose Ceylon Properties?
          </h2>
          <div className="w-12 h-1 bg-amber-400 rounded-full mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {/* Card 1 - Verified Listings */}
          <div className="flex flex-col items-center text-center bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#14213D]/5 flex items-center justify-center mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-[#14213D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 12c0 2.813.975 5.405 2.598 7.443A11.959 11.959 0 0012 22.5c2.813 0 5.405-.975 7.402-2.557A11.955 11.955 0 0021 12a11.955 11.955 0 00-.598-5.443A11.959 11.959 0 0012 3.964z" />
              </svg>
            </div>
            <h4 className="font-bold text-[#14213D] text-sm md:text-base">Verified Listings</h4>
            <p className="text-gray-500 text-xs leading-relaxed">All properties are verified &amp; trusted</p>
          </div>

          {/* Card 2 - Trusted Agents */}
          <div className="flex flex-col items-center text-center bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#14213D]/5 flex items-center justify-center mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-[#14213D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h4 className="font-bold text-[#14213D] text-sm md:text-base">Trusted Agents</h4>
            <p className="text-gray-500 text-xs leading-relaxed">Professional agents you can rely on</p>
          </div>

          {/* Card 3 - Secure Payments */}
          <div className="flex flex-col items-center text-center bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#14213D]/5 flex items-center justify-center mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-[#14213D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
            </div>
            <h4 className="font-bold text-[#14213D] text-sm md:text-base">Secure Payments</h4>
            <p className="text-gray-500 text-xs leading-relaxed">100% secure payment process</p>
          </div>

          {/* Card 4 - 24/7 Support */}
          <div className="flex flex-col items-center text-center bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#14213D]/5 flex items-center justify-center mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-[#14213D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
              </svg>
            </div>
            <h4 className="font-bold text-[#14213D] text-sm md:text-base">24/7 Support</h4>
            <p className="text-gray-500 text-xs leading-relaxed">We're here to help you anytime</p>
          </div>
        </div>
      </section>



      {/* ================= PROMO BANNERS ================= */}
      <section className="max-w-7xl mx-auto px-4 py-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="rounded-xl overflow-hidden border-2 border-[#14213D]">

            <img
              src="/src/assets/properties/add.png"
              alt="Spacious villas promo"
              className="w-full h-48 object-cover"
            />

          </div>


          <div className="rounded-xl overflow-hidden border-2 border-[#14213D]">

            <img
              src="/src/assets/properties/add2.png"
              alt="Poster design promo"
              className="w-full h-48 object-cover"
            />

          </div>

        </div>

      </section>



      <section>
        {/* Horizontal Full-Width Stats Bar */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100 p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#14213D] mb-8 tracking-tight">
            We Help To Find Your Dream Property
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 gap-6 sm:gap-0">
            <div className="px-4 py-3 flex flex-col items-center">
              <p className="text-3xl md:text-4xl font-extrabold text-[#14213D] mb-1">
                10K+
              </p>
              <p className="text-xs font-semibold text-gray-500 max-w-[180px]">
                Satisfied Clients Finding Luxury Homes
              </p>
            </div>

            <div className="px-4 py-3 flex flex-col items-center">
              <p className="text-3xl md:text-4xl font-extrabold text-[#14213D] mb-1">
                8K+
              </p>
              <p className="text-xs font-semibold text-gray-500 max-w-[180px]">
                Verified Property Listings Islandwide
              </p>
            </div>

            <div className="px-4 py-3 flex flex-col items-center">
              <p className="text-3xl md:text-4xl font-extrabold text-[#14213D] mb-1">
                24K+
              </p>
              <p className="text-xs font-semibold text-gray-500 max-w-[180px]">
                Properties Successfully Sold &amp; Rented
              </p>
            </div>

            <div className="px-4 py-3 flex flex-col items-center">
              <p className="text-3xl md:text-4xl font-extrabold text-[#14213D] mb-1">
                3K+
              </p>
              <p className="text-xs font-semibold text-gray-500 max-w-[180px]">
                Premium Locations &amp; Agent Partners
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home