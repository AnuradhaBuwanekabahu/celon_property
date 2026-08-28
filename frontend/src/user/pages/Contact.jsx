import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import contactHero from '../assets/hero/hero.jpeg'

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
  }

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative h-[380px] bg-cover bg-center flex flex-col justify-center"
        style={{ backgroundImage: `url(${contactHero})` }}
      >
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative max-w-7xl mx-auto px-4 w-full text-center">
          <p className="text-secondary text-lg mb-2">We're Here To Help</p>
          <h1 
            className="text-white text-5xl md:text-6xl leading-tight mb-4"
            style={{ fontFamily: 'var(--font-hero)' }}
          >
            Contact Us
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Have a question about a property or need guidance? Reach out and 
            our team will get back to you shortly.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-14 h-14 rounded-xl bg-navy flex items-center justify-center mx-auto mb-4">
              <MapPin size={24} className="text-secondary" />
            </div>
            <h3 className="font-heading font-medium text-lg mb-2">Visit Us</h3>
            <p className="text-gray-500 text-sm">No. 24, Marine Drive,<br />Colombo 03, Sri Lanka</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-14 h-14 rounded-xl bg-navy flex items-center justify-center mx-auto mb-4">
              <Phone size={24} className="text-secondary" />
            </div>
            <h3 className="font-heading font-medium text-lg mb-2">Call Us</h3>
            <p className="text-gray-500 text-sm">+94 11 234 5678<br />+94 77 888 8888</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-14 h-14 rounded-xl bg-navy flex items-center justify-center mx-auto mb-4">
              <Mail size={24} className="text-secondary" />
            </div>
            <h3 className="font-heading font-medium text-lg mb-2">Email Us</h3>
            <p className="text-gray-500 text-sm">info@ceylonproperties.lk<br />support@ceylonproperties.lk</p>
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left - Form */}
          <div>
            <h2 
              className="text-3xl mb-3"
              style={{ fontFamily: 'var(--font-hero)' }}
            >
              Send Us a Message
            </h2>
            <p className="text-gray-500 mb-8">
              Fill out the form below and one of our property consultants will 
              contact you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-navy"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-navy"
                    placeholder="07X XXX XXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-navy"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-navy"
                  placeholder="Tell us about your property needs..."
                />
              </div>

              <button 
                type="submit"
                className="flex items-center gap-2 bg-navy text-white font-semibold px-8 py-3 rounded-md hover:opacity-90 transition"
              >
                Send Message
                <Send size={18} />
              </button>
            </form>
          </div>

          {/* Right - Map + Hours */}
          <div>
            <img 
              src="https://placehold.co/600x360/e2e8f0/64748b?text=Map+View" 
              alt="Office location map" 
              className="w-full h-72 object-cover rounded-2xl mb-6"
            />

            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock size={20} className="text-navy" />
                <h3 className="font-heading font-medium text-lg">Office Hours</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-medium">8:30 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium">9:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}

export default Contact