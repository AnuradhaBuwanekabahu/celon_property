import { Link } from 'react-router-dom'
import { useState } from 'react'
import { User } from 'lucide-react'
import logo from '../../assets/logo.png'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const menuLinks = [
    { name: 'Hot Sales', path: '/hot-sales' },
    { name: 'Stay to Rent', path: '/stay-to-rent' },
    { name: 'Stay to Buy', path: '/stay-to-buy' },
    { name: 'Lands', path: '/lands' },
    { name: 'Wanted', path: '/wanted' },
    { name: 'Our Services', path: '/services' },
    { name: 'Contact Us', path: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 h-14 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Ceylon Properties" className="h-10 w-10 object-contain" />
          <span className="text-xl font-heading font-semibold text-white">
          Ceylon Properties
          </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-8">
            <button className="bg-[#FBBF24] text-black font-semibold px-6 py-2.5 rounded-2xl text-sm hover:opacity-90 transition">
              Post Your Add
            </button>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <User size={20} className="text-black" />
            </div>
            </div>
          </div>
        </div>

      {/* Bottom Nav Bar */}
<nav className="bg-[#14213D] text-white">
  <div className="max-w-7xl mx-auto px-4 h-14 flex justify-center items-center relative">
    
    <div className="hidden md:flex justify-between w-full max-w-4xl text-sm">
      {menuLinks.map((link) => (
        <Link
          key={link.name}
          to={link.path}
          className="hover:text-[#FBBF24] transition whitespace-nowrap"
        >
          {link.name}
        </Link>
      ))}
    </div>

    <button
      className="md:hidden text-2xl absolute right-4"
      onClick={() => setIsOpen(!isOpen)}
    >
      ☰
    </button>
  </div>

        {isOpen && (
          <div className="md:hidden flex flex-col gap-3 px-4 pb-4 text-sm">
            {menuLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar