import { useState } from 'react'
import {
  X, BedDouble, Bath, ChefHat, Home, Trees, Sofa, Building2,
  Landmark, Ruler, Car, Layers, Hash, Calendar, Compass, Route,
  Droplet, Zap, Shapes, MapPin, Map as MapIcon, Flag, MailCheck,
  Sofa as LivingIcon, UtensilsCrossed, PanelTop, Waves, Warehouse,
  Wallet, Building
} from 'lucide-react'

// Maps each overview title to a specific icon (falls back to Home)
const OVERVIEW_ICON_MAP = {
  'bedrooms': BedDouble,
  'bathrooms': Bath,
  'availability': Calendar,
  'furnishing status': Sofa,
  'property type': Building2,
  'area of land': Ruler,
  'floor area': Ruler,
  'parking space': Car,
  'no. of floors': Layers,
  'floor number': Hash,
  'age of building': Building,
  'year built': Calendar,
  'facing direction': Compass,
  'road access': Route,
  'water supply': Droplet,
  'electricity supply': Zap,
  'land shape': Shapes,
  'land type': Landmark,
  'location': MapPin,
  'city': MapIcon,
  'district': Flag,
  'postal code': MailCheck,
  'living rooms': LivingIcon,
  'dining area': UtensilsCrossed,
  'kitchen type': ChefHat,
  'balconies': PanelTop,
  'garden area': Trees,
  'swimming pool': Waves,
  'garage': Warehouse,
  'monthly maintenance fee': Wallet,
  'nearby facilities': MapPin,
}

const getOverviewIcon = (title = '') => {
  const t = String(title).toLowerCase().trim()
  return OVERVIEW_ICON_MAP[t] || Home
}

function PropertyPreviewPanel({ property, onClose }) {
  const [expanded, setExpanded] = useState(false)

  if (!property) return null

  const overviewItems = (property.overview || []).filter(
    (item) => (item.value ?? item.count ?? item.qty ?? '') !== ''
  )

  return (
    <div className="sticky top-24 border-l border-gray-200 pl-6 h-fit">
      <div className="flex justify-end mb-2">
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>

      <img
        src={property.image}
        alt={property.title}
        className="w-full h-48 object-cover rounded-xl mb-4"
      />

      <div className="flex justify-between items-start mb-1">
        <h3 className="text-lg font-heading font-medium">{property.title}</h3>
        <span className="text-sm font-semibold whitespace-nowrap">
          LKR {property.priceRs ?? property.price ?? '0'}/month
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-4">{property.location}</p>

      {/* Full overview list — wraps to fit however many fields exist */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-4 text-sm text-gray-600 mb-4">
        {overviewItems.map((item, index) => {
          const title = item.title ?? item.label ?? ''
          const value = item.value ?? item.count ?? item.qty ?? ''
          const Icon = item.icon || getOverviewIcon(title)

          return (
            <div key={index} className="flex items-start gap-2 min-w-0">
              <Icon size={16} className="text-[#FCA311] mt-0.5 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-[#14213D] break-words">
                  {value}
                </span>
                <span className="text-xs text-gray-500">{title}</span>
              </div>
            </div>
          )
        })}
      </div>

      <h4 className="font-medium mb-2">Description</h4>
      <p className={`text-sm text-gray-500 mb-2 leading-relaxed ${expanded ? '' : 'line-clamp-4'}`}>
        {property.description}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-blue-600 hover:underline mb-4"
      >
        {expanded ? 'Show Less' : 'Read More'}
      </button>

      <button className="bg-[#14213D] text-white text-sm px-6 py-2.5 rounded-md hover:opacity-90 transition mb-4 mt-2 block">
        View All
      </button>

      <img
        src="https://placehold.co/400x220/e2e8f0/64748b?text=Map+View"
        alt="Map location"
        className="w-full h-40 object-cover rounded-xl"
      />
    </div>
  )
}

export default PropertyPreviewPanel