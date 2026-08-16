const API_URL = import.meta.env.VITE_API_URL

function normalizeImageUrl(url) {
  if (!url) return undefined
  if (url.startsWith('data:') || url.startsWith('http')) return url
  return url.startsWith('/') ? `${API_URL}${url}` : `${API_URL}/${url}`
}

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
    landArea: item.area_sqft ? `${item.area_sqft} sqft` : 'N/A',
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
  }
}

export async function getStayToRent() {
  const res = await fetch(`${API_URL}/api/staystorent/show`)
  if (!res.ok) throw new Error('Failed to fetch stay to rent properties')
  const data = await res.json()
  return (data.data || []).map(transformStayToRent)
}

export async function getStayToRentAll() {
  const res = await fetch(`${API_URL}/api/staystorent/showall`)
  if (!res.ok) throw new Error('Failed to fetch all stay to rent properties')
  const data = await res.json()
  return (data.data || []).map(transformStayToRent)
}

export async function getStayToRentById(id) {
  const res = await fetch(`${API_URL}/api/staystorent/show/${id}`)
  if (!res.ok) throw new Error('Failed to fetch stay to rent property by id')
  const data = await res.json()
  return transformStayToRent(data.data || data)
}
