import { Link } from 'react-router-dom'
import { Mail, ShieldCheck } from 'lucide-react'
import logoImg from '/src/assets/logo.png'

function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8" overflow-x-hidden>
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center md:items-start">
          {/* Exact Logo Image */}
          <div className="mb-3">
            <img 
              src={logoImg} 
              alt="Ceylon Property Logo" 
              className="w-28 h-auto object-contain" // Size එක ඔයාගේ Image එක අනුව Adjust කරගන්න (e.g. w-24, w-32)
            />
          </div>
          <p className="text-sm text-gray-300">Ceylon Property</p>
        </div>

        {/* Properties Links */}
        <div>
          <h4 className="text-lg mb-4">Properties</h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li><Link to="/hot-sales" className="hover:text-secondary transition">Hot Sales</Link></li>
            <li><Link to="/lands" className="hover:text-secondary transition">Lands</Link></li>
            <li><Link to="/stay-to-buy" className="hover:text-secondary transition">Stays To Buy</Link></li>
            <li><Link to="/stay-to-rent" className="hover:text-secondary transition">Stays To Rent</Link></li>
          </ul>
        </div>

        {/* About Us Links */}
        <div>
          <h4 className="text-lg mb-4">About Us</h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li><Link to="/services" className="hover:text-secondary transition">Our Services</Link></li>
            <li><Link to="/history" className="hover:text-secondary transition">History</Link></li>
            <li><Link to="/terms" className="hover:text-secondary transition">Terms And Conditions</Link></li>
          </ul>
        </div>

        {/* Newsletter + Social */}
        <div>
          <div className="flex mb-6 max-w-sm">
  <input 
    type="email" 
    placeholder="" 
    className="flex-1 min-w-0 bg-white text-black px-4 py-3 rounded-l-md border-2 border-secondary outline-none"
  />
  <button className="bg-secondary text-black font-semibold px-6 py-3 rounded-r-md hover:opacity-90 transition whitespace-nowrap">
    Subscribe
  </button>
</div>

          <div className="flex items-center gap-3">
            <span className="text-sm">Follow Us On :</span>
            <a href="#" className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:opacity-90 transition">
              <Mail size={18} className="text-black" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:opacity-90 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="black">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
            </svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:opacity-90 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="black">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
            </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer