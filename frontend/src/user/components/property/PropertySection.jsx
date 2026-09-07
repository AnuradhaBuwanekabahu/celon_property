import { Link } from 'react-router-dom'
import PropertyCard from './PropertyCard'
import { ArrowRight, Building } from 'lucide-react'

function PropertySection({ title, properties, seeMoreLink, loading }) {
  const getPropertyDetailLink = (property, fallbackPath = seeMoreLink || '/') => {
    if (!property || !property.id) return fallbackPath

    if (property.detailLink) return property.detailLink

    const rawType = property.propertyType || property.property_type || property.tag || property.type || ''
    const normalizedType = String(rawType).toLowerCase()
    const normalizedTitle = String(title || '').toLowerCase()

    if (normalizedType.includes('hotsale') || normalizedType.includes('hot sales') || normalizedTitle.includes('hot sales')) {
      return `/property/hotsale/${property.id}`
    }

    if (normalizedType.includes('land') || normalizedTitle.includes('land')) {
      return `/property/land/${property.id}`
    }

    if (normalizedType.includes('staytorent') || normalizedType.includes('stay to rent') || normalizedTitle.includes('rent')) {
      return `/property/staytorent/${property.id}`
    }

    if (normalizedType.includes('staytobuy') || normalizedType.includes('stay to buy') || normalizedTitle.includes('buy')) {
      return `/property/staytobuy/${property.id}`
    }

    if (normalizedType.includes('hotel') || normalizedType.includes('apartment') || normalizedType.includes('house') || normalizedType.includes('villa') || normalizedType.includes('bungalow') || normalizedType.includes('studio')) {
      const routeType = normalizedTitle.includes('rent') ? 'staytorent' : 'staytobuy'
      return `/property/${routeType}/${property.id}`
    }

    return fallbackPath
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-gray-100 gap-3">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-widest text-amber-600 mb-1 block">
            Featured Listings
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#14213D] tracking-tight">
            {title}
          </h2>
        </div>

        <Link 
          to={seeMoreLink || '/'} 
          className="inline-flex items-center gap-2 bg-[#14213D] hover:bg-[#1c2d54] text-white text-xs md:text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md group w-fit"
        >
          <span>See More Properties</span>
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-[390px] rounded-2xl bg-slate-100 animate-pulse border border-slate-200/60" />
          ))}
        </div>
      ) : properties && properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <Link
              key={property.id}
              to={getPropertyDetailLink(property)}
              className="block"
            >
              <PropertyCard property={property} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-2xl p-10 text-center border border-dashed border-slate-200 flex flex-col items-center justify-center">
          <Building className="w-10 h-10 text-gray-300 mb-2" />
          <p className="text-gray-500 font-medium text-sm">
            No properties found under <span className="font-semibold text-gray-700">{title}</span> currently.
          </p>
        </div>
      )}
    </section>
  )
}

export default PropertySection