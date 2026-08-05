import { useState } from 'react'
import { Search, MapPin, Home as HomeIcon, Wallet, Phone, Plus, X } from 'lucide-react'

const initialRequests = [
  {
    id: 1,
    name: "Nimal Perera",
    type: "House",
    location: "Nugegoda / Maharagama",
    budget: "Rs. 20M - 30M",
    beds: 3,
    note: "Looking for a 3-bedroom house close to schools, preferably with a small garden and parking space.",
    phone: "077 123 4567",
    postedDate: "2 days ago",
  },
  {
    id: 2,
    name: "Ishara Fernando",
    type: "Apartment",
    location: "Colombo 03 / 05",
    budget: "Rs. 40M - 60M",
    beds: 2,
    note: "Searching for a modern 2-bedroom apartment with city views, ideally in a building with a gym and pool.",
    phone: "071 987 6543",
    postedDate: "4 days ago",
  },
  {
    id: 3,
    name: "Kasun Silva",
    type: "Land",
    location: "Kandy / Peradeniya",
    budget: "Rs. 8M - 15M",
    beds: null,
    note: "Need a residential land plot of around 15-20 perches for building a family home, hillside view preferred.",
    phone: "070 456 7890",
    postedDate: "1 week ago",
  },
  {
    id: 4,
    name: "Dilini Jayasuriya",
    type: "Villa",
    location: "Bentota / Galle",
    budget: "Rs. 100M+",
    beds: 4,
    note: "Interested in a beachfront or near-beach villa for a family vacation home, must have private pool.",
    phone: "076 234 5678",
    postedDate: "1 week ago",
  },
]

function Wanted() {
  const [requests, setRequests] = useState(initialRequests)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '', type: 'House', location: '', budget: '', beds: '', note: '', phone: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newRequest = {
      id: Date.now(),
      name: formData.name,
      type: formData.type,
      location: formData.location,
      budget: formData.budget,
      beds: formData.beds || null,
      note: formData.note,
      phone: formData.phone,
      postedDate: "Just now",
    }
    setRequests([newRequest, ...requests])
    setFormData({ name: '', type: 'House', location: '', budget: '', beds: '', note: '', phone: '' })
    setShowForm(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-heading font-medium mb-2">Wanted Properties</h1>
          <p className="text-gray-500">
            Can't find what you're looking for? Post your requirement and let sellers come to you.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-md hover:opacity-90 transition whitespace-nowrap"
        >
          <Plus size={18} />
          Post Your Requirement
        </button>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requests.map((req) => (
          <div key={req.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-3">
              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                {req.type}
              </span>
              <span className="text-xs text-gray-400">{req.postedDate}</span>
            </div>

            <h3 className="font-heading font-medium text-lg mb-2">{req.name} is looking for a {req.type}</h3>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-secondary" /> {req.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Wallet size={14} className="text-secondary" /> {req.budget}
              </span>
              {req.beds && (
                <span className="flex items-center gap-1.5">
                  <HomeIcon size={14} className="text-secondary" /> {req.beds} Beds
                </span>
              )}
            </div>

            <p className="text-sm text-gray-500 leading-relaxed mb-4">{req.note}</p>

            <a 
              href={`tel:${req.phone}`}
              className="inline-flex items-center gap-2 text-sm text-navy font-medium hover:underline"
            >
              <Phone size={14} />
              Contact: {req.phone}
            </a>
          </div>
        ))}
      </div>

      {/* Post Requirement Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-heading font-medium mb-6">Post Your Requirement</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <input 
                  type="text" name="name" required value={formData.name} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-navy"
                  placeholder="e.g. Nimal Perera"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Property Type</label>
                  <select 
                    name="type" value={formData.type} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-navy"
                  >
                    <option>House</option>
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>Land</option>
                    <option>Bungalow</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Beds (optional)</label>
                  <input 
                    type="number" name="beds" value={formData.beds} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-navy"
                    placeholder="e.g. 3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Preferred Location</label>
                <input 
                  type="text" name="location" required value={formData.location} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-navy"
                  placeholder="e.g. Nugegoda / Maharagama"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Budget</label>
                <input 
                  type="text" name="budget" required value={formData.budget} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-navy"
                  placeholder="e.g. Rs. 20M - 30M"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Additional Notes</label>
                <textarea 
                  name="note" rows={3} value={formData.note} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-navy"
                  placeholder="Any specific requirements..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Contact Number</label>
                <input 
                  type="text" name="phone" required value={formData.phone} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-navy"
                  placeholder="07X XXX XXXX"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-secondary text-black font-semibold px-6 py-3 rounded-md hover:opacity-90 transition"
              >
                Post Requirement
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Wanted