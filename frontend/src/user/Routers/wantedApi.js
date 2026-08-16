const API_URL = import.meta.env.VITE_API_URL

function parseWantedRow(row) {
  return {
    ...row,
    postedDate: row.created_at,
    images: Array.isArray(row.images) ? row.images : row.images ? JSON.parse(row.images) : [],
  }
}

export async function getWanted() {
  const res = await fetch(`${API_URL}/api/wanted/showall`)
  if (!res.ok) {
    throw new Error('Failed to fetch wanted requests')
  }

  const data = await res.json()
  return (data.data || []).map(parseWantedRow)
}

export async function addWanted(formData) {
  const res = await fetch(`${API_URL}/api/wanted/add`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || 'Failed to add wanted request')
  }

  return res.json()
}
