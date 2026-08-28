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
    <header className="sticky top-0 z-50 bg-black text-white">

      {/* Single Navbar */}
      <nav>
        <div className="w-full px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src={logo}
              alt="Ceylon Properties"
              className="h-10 w-10 object-contain"
            />

            <span className="text-xl font-heading font-semibold">
              Ceylon Properties
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6 text-sm">
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

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">

            <button className="bg-[#FBBF24] text-black font-semibold px-5 py-2.5 rounded-2xl text-sm hover:opacity-90 transition">
              Post Your Ad
            </button>

            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <User size={20} className="text-black" />
            </div>

          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-2xl ml-4"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>

        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-[#14213D] px-4 py-4 flex flex-col gap-4 text-sm">

            {menuLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="hover:text-[#FBBF24] transition"
              >
                {link.name}
              </Link>
            ))}

            <button className="bg-[#FBBF24] text-black font-semibold px-5 py-2.5 rounded-2xl text-sm w-fit">
              Post Your Ad
            </button>

          </div>
        )}
      </nav>

    </header>
  )
}

export default Navbar