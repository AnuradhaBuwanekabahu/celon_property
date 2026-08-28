import { Link } from 'react-router-dom'
import PropertyCard from './PropertyCard'
import { ArrowRight, Building } from 'lucide-react'

function PropertySection({ title, properties, seeMoreLink, loading }) {
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
              to={property.detailLink || seeMoreLink || '/'}
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