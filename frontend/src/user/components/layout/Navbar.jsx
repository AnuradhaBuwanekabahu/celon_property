import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { User, LogOut, ChevronDown, Mail } from 'lucide-react'
import logo from '../../assets/logo.png'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  // Read user from localStorage on mount + when location changes
  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try { setLoggedInUser(JSON.parse(stored)) } catch { setLoggedInUser(null) }
    } else {
      setLoggedInUser(null)
    }
  }, [location])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userToken')
    localStorage.removeItem('user')
    setLoggedInUser(null)
    setShowDropdown(false)
    navigate('/')
  }

  const menuLinks = [
      { name: 'Home', path: '/' },
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
            {menuLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path))
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`transition whitespace-nowrap py-1 font-bold ${
                    isActive
                      ? 'text-[#FBBF24] font-bold border-b-2 border-[#FBBF24] '
                      : 'text-white/90 hover:text-[#FBBF24]'
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">

            <Link to="/dashboard/client-login" className="bg-[#FBBF24] text-black font-semibold px-5 py-2.5 rounded-2xl text-sm hover:opacity-90 transition">
              Post Your Ad
            </Link>

            {/* User Avatar / Dropdown */}
            {loggedInUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown((v) => !v)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-[#FBBF24] flex items-center justify-center select-none">
                    <Mail size={18} className="text-black" />
                  </div>
                  <ChevronDown size={14} className={`text-white/70 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl overflow-hidden z-50 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs text-gray-400 mb-0.5">Logged in as</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">{loggedInUser.full_name}</p>
                      <p className="text-xs text-gray-400 truncate">{loggedInUser.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition text-left cursor-pointer"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/user-login" className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:opacity-90 transition cursor-pointer">
                <User size={20} className="text-black" />
              </Link>
            )}

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

            {menuLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path))
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`transition ${
                    isActive
                      ? 'text-[#FBBF24] font-bold pl-2 border-l-2 border-[#FBBF24]'
                      : 'text-white/90 hover:text-[#FBBF24]'
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}

            <Link to="/dashboard/client-login" onClick={() => setIsOpen(false)} className="bg-[#FBBF24] text-black font-semibold px-5 py-2.5 rounded-2xl text-sm w-fit">
              Post Your Ad
            </Link>

            {/* Mobile user section */}
            {loggedInUser ? (
              <div className="border-t border-white/10 pt-3 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FBBF24] flex items-center justify-center">
                    <Mail size={16} className="text-black" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{loggedInUser.full_name}</p>
                    <p className="text-white/50 text-xs">{loggedInUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false) }}
                  className="flex items-center gap-2 text-red-400 text-sm hover:text-red-300 transition w-fit cursor-pointer"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/user-login" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-white/90 hover:text-[#FBBF24] text-sm transition">
                <User size={16} />
                Login
              </Link>
            )}

          </div>
        )}
      </nav>

    </header>
  )
}

export default Navbar  