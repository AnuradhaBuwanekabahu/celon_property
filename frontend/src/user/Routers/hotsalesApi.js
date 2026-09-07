const API_URL = import.meta.env.VITE_API_URL || '';

let hotSalesCache = null;
let hotSalesPromise = null;

const normalizeImageUrl = (url) => {
  if (!url) return undefined;
  if (url.startsWith('data:') || url.startsWith('http')) return url;

  return `${API_URL}/${url.replace(/^\/+/, '')}`;
};

const transformHotSale = (item) => {
  const mainImage = normalizeImageUrl(item.main_image);

  const gallery = [
    ...(item.images || []),
    ...(item.gallery_images || [])
  ]
    .map(normalizeImageUrl)
    .filter(Boolean);

  return {
    id: item.id,
    title: item.title,
    location: item.location || item.city,
    price: item.price,
    priceRs: item.price,
    rating: item.rate || 4.3,
    tag: item.property_type,

    image: mainImage || gallery[0],
    gallery: mainImage ? [mainImage, ...gallery] : gallery,

    landArea: item.area_sqft ? `${item.area_sqft} sqft` : 'N/A',
    areaSqft: item.area_sqft,

    description: item.description,

    rooms: item.rooms || 0,
    beds: item.beds || 0,
    bathrooms: item.bathrooms || 0,
    kitchen: item.kitchen || 0,
    garden: item.garden || 0,

    city: item.city,
    mapAddress: item.map_address,

    duration: item.duration || 'permanent',

    overview: Array.isArray(item.overview) ? item.overview : [],
    highlights: Array.isArray(item.highlights) ? item.highlights : [],

    status: item.status || 'active',

    video: normalizeImageUrl(item.main_video),
    mainVideo: normalizeImageUrl(item.main_video),

    createdAt: item.created_at,
    updatedAt: item.updated_at,
    clientId: item.client_id
  };
};

// GET ACTIVE HOT SALES
export async function getHotSales() {
  if (hotSalesCache) return hotSalesCache;
  if (hotSalesPromise) return hotSalesPromise;

  hotSalesPromise = fetch(`${API_URL}/api/hotsales/show`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch hot sales');
      return res.json();
    })
    .then(data => {
      hotSalesCache = (data.hotSales || []).map(transformHotSale);
      return hotSalesCache;
    })
    .finally(() => {
      hotSalesPromise = null;
    });

  return hotSalesPromise;
}

// GET ALL HOT SALES
export async function getHotSalesAll() {
  const res = await fetch(`${API_URL}/api/hotsales/showall`);

  if (!res.ok) throw new Error('Failed to fetch all hot sales');

  const data = await res.json();

  return (data.hotSales || []).map(transformHotSale);
}

// GET SINGLE HOT SALE
const hotSaleByIdCache = new Map();

export async function getHotSaleById(id) {
  if (hotSaleByIdCache.has(id)) {
    return hotSaleByIdCache.get(id);
  }

  const res = await fetch(`${API_URL}/api/hotsales/show/${id}`);

  if (!res.ok) {
    throw new Error('Failed to fetch hot sale by id');
  }

  const data = await res.json();

  const result = transformHotSale(data.hotSale || data);

  hotSaleByIdCache.set(id, result);

  return result;
}

// CLEAR CACHE
export function clearHotSalesCache() {
  hotSalesCache = null;
  hotSaleByIdCache.clear();
}