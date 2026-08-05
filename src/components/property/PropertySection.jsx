import { Link } from 'react-router-dom'
import PropertyCard from './PropertyCard'

function PropertySection({ title, properties, seeMoreLink }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-heading font-medium">{title}</h2>
        <Link 
          to={seeMoreLink || '/'} 
          className="bg-navy text-white text-sm px-5 py-2 rounded-md hover:opacity-90 transition"
        >
          see more
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  )
}

export default PropertySection