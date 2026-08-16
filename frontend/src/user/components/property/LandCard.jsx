import { MapPin, Ruler } from 'lucide-react'

function LandCard({ land }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition bg-white">
      <div className="relative">
        <img 
          src={land.image} 
          alt={land.title} 
          className="w-full h-48 object-cover"
        />
        <span className="absolute top-3 left-3 bg-navy text-white text-xs font-medium px-3 py-1 rounded-full">
          {land.status}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-heading font-medium text-base mb-1">
          {land.title}
        </h3>
        <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
          <MapPin size={13} />
          {land.location}
        </p>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Ruler size={13} />
            {land.perches} Perches
          </p>
          <p className="font-bold">${land.price}.00</p>
        </div>
      </div>
    </div>
  )
}

export default LandCard