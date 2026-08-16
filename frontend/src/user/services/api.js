const API_URL = import.meta.env.VITE_API_URL || ''

function normalizeImageUrl(url) {
  if (!url) return undefined
  if (url.startsWith('data:') || url.startsWith('http')) return url
  return url.startsWith('/') ? `${API_URL}${url}` : `${API_URL}/${url}`
}

function transformHotSale(item) {
  const mainImage = normalizeImageUrl(item.main_image)
  const gallery = [mainImage, ...(item.images || []).map(normalizeImageUrl)].filter(Boolean)

  return {
    id: item.id,
    title: item.title,
    location: item.location || item.city,
    price: item.price,
    rating: item.rate || 4.3,
    tag: item.property_type,
    image: mainImage,
    priceRs: item.price,
    landArea: item.area_sqft ? `${item.area_sqft} sqft` : 'N/A',
    description: item.description,
    rooms: item.rooms || 0,
    beds: item.beds || 0,
    bathrooms: item.bathrooms || 0,
    kitchen: item.kitchen || 0,
    garden: item.garden || 0,
    gallery,
  }
}

function transformStayToBuy(item) {
  const mainImage = normalizeImageUrl(item.main_image)
  const gallery = [mainImage, ...(item.images || []).map(normalizeImageUrl)].filter(Boolean)

  return {
    id: item.id,
    title: item.title,
    location: item.location || item.city,
    price: item.price,
    rating: item.rate || 4.3,
    tag: item.property_type,
    image: mainImage,
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
    gallery,
  }
}

export async function getHotSales() {
  const res = await fetch(`${API_URL}/api/hotsales/show`)
  if (!res.ok) throw new Error('Failed to fetch hot sales')
  const data = await res.json()
  return data.hotSales.map(transformHotSale)
}

export async function getStayToBuy() {
  const res = await fetch(`${API_URL}/api/staystobuy/show`)
  if (!res.ok) throw new Error('Failed to fetch stay to buy properties')
  const data = await res.json()
  return data.data.map(transformStayToBuy)
}
