const API_URL = import.meta.env.VITE_API_URL || ''

// ============================================
// CACHE
// ============================================

let stayToRentCache = null
let stayToRentPromise = null


// ============================================
// IMAGE URL
// ============================================

function normalizeImageUrl(url) {
  if (!url) return undefined

  if (
    url.startsWith('data:') ||
    url.startsWith('http')
  ) {
    return url
  }

  return url.startsWith('/')
    ? `${API_URL}${url}`
    : `${API_URL}/${url}`
}


// ============================================
// TRANSFORM
// ============================================

function transformStayToRent(item) {
  const mainImage = normalizeImageUrl(item.main_image)

  const gallery = [
    ...((item.images || []).map(normalizeImageUrl)),
  ].filter(Boolean)

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

    gallery: mainImage
      ? [mainImage, ...gallery]
      : gallery,

    city: item.city,

    mapAddress: item.map_address,

    pricePeriod: item.price_period || 'monthly',

    duration: item.duration || 'month',

    overview: Array.isArray(item.overview)
      ? item.overview
      : [],

    highlights: Array.isArray(item.highlights)
      ? item.highlights
      : [],

    status: item.status || 'Available',

    video: normalizeImageUrl(item.main_video),

    mainVideo: normalizeImageUrl(item.main_video),

    // Client
    clientId: item.client_id,
  }
}


// ============================================
// GET STAY TO RENT
// ============================================

export async function getStayToRent() {

  // Already loaded → use cache
  if (stayToRentCache) {
    console.log('Using cached Stay To Rent data')
    return stayToRentCache
  }

  // Request already running → reuse it
  if (stayToRentPromise) {
    console.log('Using existing Stay To Rent request')
    return stayToRentPromise
  }

  console.log('Fetching Stay To Rent from server...')

  stayToRentPromise = fetch(
    `${API_URL}/api/staystorent/show`
  )
    .then(async (res) => {

      if (!res.ok) {
        throw new Error(
          'Failed to fetch stay to rent properties'
        )
      }

      const data = await res.json()

      const result = (data.data || [])
        .map(transformStayToRent)

      // Store result
      stayToRentCache = result

      return result
    })
    .finally(() => {
      stayToRentPromise = null
    })

  return stayToRentPromise
}


// ============================================
// GET ALL STAY TO RENT
// ============================================

export async function getStayToRentAll() {

  const res = await fetch(
    `${API_URL}/api/staystorent/showall`
  )

  if (!res.ok) {
    throw new Error(
      'Failed to fetch all stay to rent properties'
    )
  }

  const data = await res.json()

  return (data.data || [])
    .map(transformStayToRent)
}


// ============================================
// GET SINGLE PROPERTY
// ============================================

export async function getStayToRentById(id) {

  const res = await fetch(
    `${API_URL}/api/staystorent/show/${id}`
  )

  if (!res.ok) {
    throw new Error(
      'Failed to fetch stay to rent property by id'
    )
  }

  const data = await res.json()

  return transformStayToRent(
    data.data || data
  )
}


// ============================================
// CLEAR CACHE
// ============================================

export function clearStayToRentCache() {
  stayToRentCache = null
}