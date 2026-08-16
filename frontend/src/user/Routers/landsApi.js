const API_URL = import.meta.env.VITE_API_URL

function normalizeImageUrl(url) {
  if (!url) return undefined
  if (url.startsWith('data:') || url.startsWith('http')) return url
  return url.startsWith('/') ? `${API_URL}${url}` : `${API_URL}/${url}`
}

function transformLand(item) {
  const mainImage = normalizeImageUrl(item.main_image)
  const gallery = [
    ...((item.images || []).map(normalizeImageUrl)),
  ].filter(Boolean)

  return {
    id: item.id,
    title: item.title,
    location: item.location || item.city,
    price: item.price,
    tag: item.property_type || item.tag,
    image: mainImage || gallery[0],
    priceRs: item.price,
    status: item.status || 'Available',
    perches: item.land_size || item.perches || 'N/A',
    size_unit: item.size_unit || 'perches',
    landArea: item.land_size ? `${item.land_size} ${item.size_unit || ''}` : 'N/A',
    description: item.description,
    rooms: item.rooms || 0,
    beds: item.beds || 0,
    bathrooms: item.bathrooms || 0,
    kitchen: item.kitchen || 0,
    garden: item.garden || 0,
    gallery: mainImage ? [mainImage, ...gallery] : gallery,
  }
}

export async function getLands() {
  const res = await fetch(`${API_URL}/api/lands/show`)
  if (!res.ok) throw new Error('Failed to fetch lands')
  const data = await res.json()
  return (data.data || data.lands || []).map(transformLand)
}

export async function getLandById(id) {
  const res = await fetch(`${API_URL}/api/lands/show/${id}`)
  if (!res.ok) throw new Error('Failed to fetch land by id')
  const data = await res.json()
  return transformLand(data.land || data)
}
