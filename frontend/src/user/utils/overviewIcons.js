// src/utils/overviewIcons.js

import {
  BedDouble,
  Bath,
  ChefHat,
  Home,
  Trees,
  Sofa,
  Building2,
  Landmark,
  Ruler,
  Car,
  Layers,
  Hash,
  Calendar,
  Compass,
  Route,
  Droplet,
  Zap,
  Shapes,
  MapPin,
  Map as MapIcon,
  Flag,
  MailCheck,
  Sofa as LivingIcon,
  UtensilsCrossed,
  PanelTop,
  Waves,
  Warehouse,
  Wallet,
  Building,
} from 'lucide-react'


const OVERVIEW_ICON_MAP = {
  bedrooms: BedDouble,
  bathrooms: Bath,
  availability: Calendar,
  'furnishing status': Sofa,
  'property type': Building2,

  'area of land': Ruler,
  'land area': Ruler,
  'floor area': Ruler,

  'parking space': Car,
  parking: Car,

  'no. of floors': Layers,
  floors: Layers,

  'floor number': Hash,

  'age of building': Building,
  'year built': Calendar,

  'facing direction': Compass,
  'road access': Route,

  'water supply': Droplet,
  'electricity supply': Zap,

  'land shape': Shapes,
  'land type': Landmark,

  location: MapPin,
  city: MapIcon,
  district: Flag,
  'postal code': MailCheck,

  'living rooms': LivingIcon,
  'living room': LivingIcon,

  'dining area': UtensilsCrossed,
  'dining room': UtensilsCrossed,

  'kitchen type': ChefHat,
  kitchen: ChefHat,

  balconies: PanelTop,
  balcony: PanelTop,

  'garden area': Trees,
  garden: Trees,

  'swimming pool': Waves,
  pool: Waves,

  garage: Warehouse,

  'monthly maintenance fee': Wallet,

  'nearby facilities': MapPin,
}


const normalizeTitle = (title = '') => {
  return String(title)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}


export const getOverviewIcon = (title = '') => {

  const key = normalizeTitle(title)

  // Exact match
  if (OVERVIEW_ICON_MAP[key]) {
    return OVERVIEW_ICON_MAP[key]
  }

  // Flexible matching
  if (key.includes('bedroom')) return BedDouble

  if (key.includes('bathroom')) return Bath

  if (key.includes('availability')) return Calendar

  if (key.includes('furnish')) return Sofa

  if (key.includes('property type')) return Building2

  if (
    key.includes('area of land') ||
    key.includes('land area') ||
    key.includes('floor area')
  ) {
    return Ruler
  }

  if (key.includes('parking')) return Car

  if (
    key.includes('no. of floor') ||
    key.includes('number of floor')
  ) {
    return Layers
  }

  if (key.includes('floor number')) return Hash

  if (
    key.includes('age of building') ||
    key.includes('building age')
  ) {
    return Building
  }

  if (key.includes('year built')) return Calendar

  if (
    key.includes('facing') ||
    key.includes('direction')
  ) {
    return Compass
  }

  if (key.includes('road access')) return Route

  if (key.includes('water')) return Droplet

  if (
    key.includes('electricity') ||
    key.includes('electric')
  ) {
    return Zap
  }

  if (key.includes('shape')) return Shapes

  if (key.includes('land type')) return Landmark

  if (key.includes('location')) return MapPin

  if (key.includes('city')) return MapIcon

  if (key.includes('district')) return Flag

  if (key.includes('postal')) return MailCheck

  if (key.includes('living')) return LivingIcon

  if (key.includes('dining')) return UtensilsCrossed

  if (key.includes('kitchen')) return ChefHat

  if (key.includes('balcon')) return PanelTop

  if (key.includes('garden')) return Trees

  if (
    key.includes('swimming') ||
    key.includes('pool')
  ) {
    return Waves
  }

  if (key.includes('garage')) return Warehouse

  if (key.includes('maintenance')) return Wallet

  if (key.includes('nearby')) return MapPin

  return Home
}


export const getOverviewData = (overview) => {

  if (!overview) {
    return []
  }

  if (Array.isArray(overview)) {
    return overview
  }

  if (typeof overview === 'string') {
    try {
      const parsed = JSON.parse(overview)

      return Array.isArray(parsed)
        ? parsed
        : []

    } catch (error) {
      console.error(
        'Overview JSON parse error:',
        error
      )

      return []
    }
  }

  return []
}


export const getOverviewValue = (item) => {

  if (!item) {
    return ''
  }

  return (
    item.value ??
    item.count ??
    item.qty ??
    item.amount ??
    ''
  )
}


export const getOverviewTitle = (item) => {

  if (!item) {
    return ''
  }

  return (
    item.title ??
    item.label ??
    item.name ??
    ''
  )
}