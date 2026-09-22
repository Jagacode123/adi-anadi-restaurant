import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { HiMenu, HiX, HiShoppingCart } from 'react-icons/hi'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

const navLinks = [
  { to: '/',        label: 'Home' },
  { to: '/menu',    label: 'Menu' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/about',   label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthenticated, isCustomer, user, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🍛</span>
            <span className="font-display font-bold text-gray-900 text-lg leading-tight">
              Adi Anadi
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors
                   ${isActive ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && isCustomer ? (
              <>
                <Link to="/order/new" className="relative">
                  <button className="btn-primary py-2 px-4 text-sm">
                    Book / Order Now
                    {totalItems > 0 && (
                      <span className="ml-2 bg-white text-primary-600 rounded-full w-5 h-5
                                       flex items-center justify-center text-xs font-bold">
                        {totalItems}
                      </span>
                    )}
                  </button>
                </Link>
                <Link to="/orders" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/order/new" className="btn-primary py-2 px-4 text-sm">
                  Book / Order Now
                </Link>
                <Link to="/login" className="btn-secondary py-2 px-4 text-sm">
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-500 hover:text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg text-sm font-medium
                 ${isActive ? 'text-primary-600 bg-primary-50' : 'text-gray-600'}`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <Link
              to="/order/new"
              onClick={() => setMenuOpen(false)}
              className="block btn-primary text-center text-sm py-3"
            >
              Book / Order Now
            </Link>
            {isAuthenticated && isCustomer ? (
              <>
                <Link
                  to="/orders"
                  onClick={() => setMenuOpen(false)}
                  className="block text-center py-3 text-sm text-gray-600 font-medium"
                >
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-center py-3 text-sm text-red-500 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block btn-secondary text-center text-sm py-3"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
