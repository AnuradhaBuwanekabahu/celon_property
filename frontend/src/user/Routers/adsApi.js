const API_URL = import.meta.env.VITE_API_URL || '';

const normalizeImageUrl = (url) =>
  !url
    ? undefined
    : url.startsWith('data:') || url.startsWith('http')
      ? url
      : `${API_URL}/${url.replace(/^\/+/, '')}`;

export async function getAds() {
  const res = await fetch(`${API_URL}/api/ads/ads`);

  if (!res.ok) throw new Error('Failed to fetch advertisements');

  const payload = await res.json();
  const ads = Array.isArray(payload?.ads)
    ? payload.ads
    : Array.isArray(payload?.data)
      ? payload.data
      : [];

  return ads.map(ad => ({
    id: ad.id,
    title: ad.title,
    clientId: ad.client_id,
    linkUrl: ad.link_url,
    position: String(ad.position || 'sub_pages').trim().toLowerCase(),
    isActive: ad.is_active === true || Number(ad.is_active) === 1,
    createdAt: ad.created_at,
    image: normalizeImageUrl(ad.image),
  }));
}