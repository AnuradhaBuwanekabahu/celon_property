import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Home as HomeIcon, Wallet, Phone, Plus, X } from 'lucide-react'
import { getWanted, addWanted } from '../Routers/wantedApi'

function formatCreatedDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function Wanted() {
  const [requests, setRequests] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    client_id: '',
    title: '',
    description: '',
    budget: '',
    preferred_city: '',
    phone_number: '',
    main_image: null,
  })

  const navigate = useNavigate()

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        const parsed = JSON.parse(savedUser)
        const clientId = parsed?.id
        const validId = typeof clientId === 'number'
          ? clientId
          : typeof clientId === 'string' && /^[0-9]+$/.test(clientId)
            ? Number(clientId)
            : null

        if (validId) {
          setUser({ ...parsed, id: validId })
          setFormData((prev) => ({
            ...prev,
            client_id: validId,
          }))
        } else {
          localStorage.removeItem('user')
          localStorage.removeItem('userToken')
        }
      }
    } catch (err) {
      console.warn('Unable to load saved user from localStorage', err)
    }
  }, [])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    async function fetchRequests() {
      setLoading(true)
      setError(null)

      try {
        const data = await getWanted()
        setRequests(data)
      } catch (err) {
        setError(err.message || 'Unable to load wanted requests')
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }))
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setFormError(null)

    try {
      const payload = new FormData()
      payload.append('client_id', user?.id || formData.client_id)
      payload.append('title', formData.title)
      payload.append('description', formData.description)
      payload.append('budget', formData.budget)
      payload.append('preferred_city', formData.preferred_city)
      payload.append('phone_number', formData.phone_number)
      if (formData.main_image) {
        payload.append('main_image', formData.main_image)
      }

      await addWanted(payload)
      const updated = await getWanted()
      setRequests(updated)
      setShowForm(false)
      setFormData({
        client_id: '',
        title: '',
        description: '',
        budget: '',
        preferred_city: '',
        phone_number: '',
        main_image: null,
      })
    } catch (err) {
      setFormError(err.message || 'Failed to submit wanted request')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="relative mb-10">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-heading font-medium mb-2">Wanted Properties</h1>
            <p className="text-gray-500">
              Can't find what you're looking for? Post your requirement and let sellers come to you.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (!user) {
              navigate('/user-login?redirect=/wanted')
              return
            }
            setShowForm(true)
          }}
          className="absolute right-0 top-0 flex items-center gap-2 bg-[#14213D] text-white font-semibold px-6 py-3 rounded-md hover:opacity-90 transition whitespace-nowrap"
        >
          <Plus size={18} />
          Add Wanted
        </button>
      </div>

      {!user && (
        <div className="mb-10 rounded-2xl border border-gray-200 bg-yellow-50 p-6">
          <h2 className="text-xl font-semibold mb-2">Login required to add wanted</h2>
          <p className="text-gray-700 mb-4">
            Please login first to submit a wanted request. Use the login page to sign in or continue with Google.
          </p>
          <button
            onClick={() => navigate('/user-login?redirect=/wanted')}
            className="inline-flex items-center gap-2 bg-[#14213D] text-white font-semibold px-5 py-3 rounded-md hover:opacity-90 transition"
          >
            Login to continue
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-center py-10 text-gray-500">Loading wanted requests...</p>
      ) : error ? (
        <p className="text-center py-10 text-red-500">{error}</p>
      ) : requests.length === 0 ? (
        <p className="text-center py-10 text-gray-500">No wanted requests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((req) => (
            <div key={req.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition">
              <div className="flex flex-col gap-6 md:flex-row md:items-start">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                      Wanted
                    </span>
                    <span className="text-xs text-gray-400">{formatCreatedDate(req.postedDate)}</span>
                  </div>

                  <h3 className="font-heading font-medium text-lg mb-2">{req.title}</h3>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-secondary" /> {req.preferred_city || 'Any location'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Wallet size={14} className="text-secondary" /> {req.budget || 'Budget not specified'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{req.description}</p>

                  <a
                    href={`tel:${req.phone_number}`}
                    className="inline-flex items-center gap-2 text-sm text-navy font-medium hover:underline"
                  >
                    <Phone size={14} />
                    Contact: {req.phone_number}
                  </a>
                </div>

                <div className="h-44 w-full overflow-hidden rounded-2xl bg-gray-100 md:w-44 md:flex-shrink-0">
                  {req.main_image ? (
                    <img
                      src={req.main_image}
                      alt={req.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-500">
                      No image available
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-heading font-medium mb-6">Post Wanted Requirement</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              

              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-navy"
                  placeholder="What are you looking for?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Preferred City</label>
                <input
                  type="text"
                  name="preferred_city"
                  value={formData.preferred_city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-navy"
                  placeholder="e.g. Colombo, Kandy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Budget</label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-navy"
                  placeholder="e.g. Rs. 20M - 30M"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-navy"
                  placeholder="Specific requirements, property type, or other notes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Contact Number</label>
                <input
                  type="text"
                  name="phone_number"
                  required
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-navy"
                  placeholder="07X XXX XXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Main Image</label>
                <input
                  type="file"
                  name="main_image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full text-sm text-gray-700"
                />
              </div>

              {formError && <p className="text-sm text-red-500">{formError}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#14213D] text-white font-semibold px-6 py-3 rounded-md hover:opacity-90 transition disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Add Wanted'}
              </button>
            </form>
          </div>
        </div>
        
      )}

    </div>
  )
}

export default Wanted