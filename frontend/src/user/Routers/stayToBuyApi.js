const API_URL = import.meta.env.VITE_API_URL || ''

let stayToBuyCache = null
let stayToBuyPromise = null

function normalizeImageUrl(url) {
  if (!url) return undefined

  if (url.startsWith('data:') || url.startsWith('http')) {
    return url
  }

  return `${API_URL}/${url.replace(/^\/+/, '')}`
}

function transformStayToBuy(item) {
  const mainImage = normalizeImageUrl(item.main_image)

  const gallery = (item.images || [])
    .map(normalizeImageUrl)
    .filter(Boolean)

  return {
    id: item.id,
    title: item.title,
    location: item.location || item.city,
    price: item.price,
    rating: item.rate || 4.3,
    tag: item.property_type,
    image: mainImage || gallery[0],
    priceRs: item.price,
    landArea: item.area_sqft
      ? `${item.area_sqft} sqft`
      : 'N/A',
    description: item.description,
    rooms: item.rooms || 0,
    beds: item.beds || 0,
    bathrooms: item.bathrooms || 0,
    kitchen: item.kitchen || 0,
    garden: item.garden || 0,
    ownerName: item.full_name,
    ownerEmail: item.email,
    ownerPhone: item.phone_number,
    gallery: mainImage ? [mainImage, ...gallery] : gallery,
    duration: item.duration || 'permanent',
    status: item.status || 'Available',
    overview: Array.isArray(item.overview) ? item.overview : [],
    highlights: Array.isArray(item.highlights) ? item.highlights : [],
    video: normalizeImageUrl(item.main_video),
    mainVideo: normalizeImageUrl(item.main_video),
    city: item.city,
    mapAddress: item.map_address,
    clientId: item.client_id,
  }
}

export async function getStayToBuy() {
  const start = performance.now()

  console.log('1. Request started')

  const res = await fetch(
    `${API_URL}/api/staystobuy/show`
  )

  console.log(
    '2. Response received:',
    Math.round(performance.now() - start),
    'ms'
  )

  if (!res.ok) {
    throw new Error('Failed to fetch stay to buy properties')
  }

  const data = await res.json()

  console.log(
    '3. JSON parsed:',
    Math.round(performance.now() - start),
    'ms'
  )

  const result = (data.data || [])
    .map(transformStayToBuy)

  console.log(
    '4. Transform finished:',
    Math.round(performance.now() - start),
    'ms'
  )

  return result
}

export async function getStayToBuyAll() {
  const res = await fetch(`${API_URL}/api/staystobuy/showall`)

  if (!res.ok) {
    throw new Error('Failed to fetch all stay to buy properties')
  }

  const data = await res.json()

  return (data.data || []).map(transformStayToBuy)
}

export async function getStayToBuyById(id) {
  const res = await fetch(`${API_URL}/api/staystobuy/show/${id}`)

  if (!res.ok) {
    throw new Error('Failed to fetch stay to buy property by id')
  }

  const data = await res.json()

  return transformStayToBuy(data.data || data)
}

export function clearStayToBuyCache() {
  stayToBuyCache = null
}