import axios from 'axios'

const API_URL =
  import.meta.env.VITE_BACKEND_URL ||
  'http://localhost:5000'

const getAuthToken = () =>
  localStorage.getItem('userToken') ||
  localStorage.getItem('clientToken') ||
  localStorage.getItem('token') || ''

// ==========================================
// GET ALL WANTED
// ==========================================
export const getWanted = async () => {
  const token = getAuthToken()

  try {
    const response = await axios.get(
      `${API_URL}/api/user-wanted/showall`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    )

    return response.data?.data || []
  } catch (error) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      localStorage.removeItem('userToken')
      localStorage.removeItem('clientToken')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('client')
    }

    throw error
  }
}

// ==========================================
// ADD WANTED
// ==========================================
export const addWanted = async (formData) => {
  const token = getAuthToken()

  try {
    const response = await axios.post(
      `${API_URL}/api/user-wanted/add`,
      formData,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    )

    return response.data
  } catch (error) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      localStorage.removeItem('userToken')
      localStorage.removeItem('clientToken')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('client')
      throw new Error('Please log in or create an account before adding a wanted request.')
    }

    throw error
  }
}
