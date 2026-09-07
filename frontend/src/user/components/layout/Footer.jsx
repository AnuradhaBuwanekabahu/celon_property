import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn } from 'react-icons/fa'
import logoImg from '../../assets/logo.png'

function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 5000)
    }
  }

  const propertiesLinks = [
    { name: 'Hot Sales', path: '/hot-sales' },
    { name: 'Lands for Sale', path: '/lands' },
    { name: 'Stays To Buy', path: '/stay-to-buy' },
    { name: 'Stays To Rent', path: '/stay-to-rent' },
    { name: 'Wanted Listings', path: '/wanted' },
  ]

  const aboutUsLinks = [
    { name: 'Our Services', path: '/services' },
    { name: 'History', path: '/history' },
    { name: 'Terms And Conditions', path: '/terms' },
  ]

  return (
    <footer className="bg-[#050C1A] text-slate-300 font-sans border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        
        {/* Main Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Col 1: Logo & Brand Description (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src={logoImg}
                alt="Ceylon Properties Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-bold text-white tracking-tight">
                Ceylon Properties
              </span>
            </Link>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Your trusted partner for buying, selling & renting properties across Sri Lanka.
            </p>

            {/* Circular Social Buttons */}
            <div className="flex items-center gap-2.5 pt-1">
              {[
                { icon: FaFacebookF, href: '#', label: 'Facebook' },
                { icon: FaInstagram, href: '#', label: 'Instagram' },
                { icon: FaYoutube, href: '#', label: 'YouTube' },
                { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  aria-label={social.label}
                  className="w-8 h-8 rounded-full border border-slate-700/80 bg-slate-900/60 text-slate-300 hover:text-black hover:bg-[#FBBF24] hover:border-[#FBBF24] flex items-center justify-center transition-all duration-200"
                >
                  <social.icon size={13} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Properties (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide">
              Properties
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {propertiesLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.path}
                    className="hover:text-white transition duration-200 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: About Us / Company (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide">
              About Us
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {aboutUsLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.path}
                    className="hover:text-white transition duration-200 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Us (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide">
              Contact Us
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="text-slate-300 shrink-0 mt-0.5" />
                <span>123, Galle Road, Colombo 03, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-slate-300 shrink-0" />
                <a href="tel:+94771234567" className="hover:text-white transition">
                  +94 77 123 4567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="text-slate-300 shrink-0" />
                <a href="mailto:info@ceylonproperties.lk" className="hover:text-white transition">
                  info@ceylonproperties.lk
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Subscribe Newsletter Box (lg:col-span-3) */}
          <div className="lg:col-span-3 bg-[#0A192F] border border-slate-800 p-5 rounded-2xl shadow-xl">
            <h4 className="text-sm font-semibold text-[#FBBF24] mb-1">
              Subscribe Newsletter
            </h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Get the latest property listings and market updates.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 p-3 rounded-lg border border-emerald-500/30">
                <CheckCircle2 size={16} />
                <span>Subscribed successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-white text-slate-900 placeholder-slate-400 text-xs px-3.5 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#FBBF24]"
                />
                <button
                  type="submit"
                  className="w-full bg-[#FBBF24] hover:bg-amber-400 text-slate-950 font-semibold text-xs py-2.5 rounded-lg transition duration-200 shadow-md cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar Divider & Copyright */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Ceylon Properties. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/terms" className="hover:text-slate-400 transition">Terms & Conditions</Link>
            <span>|</span>
            <Link to="/privacy" className="hover:text-slate-400 transition">Privacy Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer