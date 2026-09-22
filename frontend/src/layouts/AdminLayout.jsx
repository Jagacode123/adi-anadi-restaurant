import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  HiOutlineHome,
  HiOutlineClipboardList,
  HiOutlineMenu as HiOutlineMenuIcon,
  HiOutlineUsers,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineBell,
  HiMenu,
  HiX,
} from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import NotificationBell from '../components/notifications/NotificationBell'

const navItems = [
  { to: '/admin/dashboard',       icon: HiOutlineHome,          label: 'Dashboard' },
  { to: '/admin/orders/pending',  icon: HiOutlineClipboardList, label: 'Pending Orders' },
  { to: '/admin/orders',          icon: HiOutlineClipboardList, label: 'All Orders' },
  { to: '/admin/menu',            icon: HiOutlineMenuIcon,      label: 'Menu' },
  { to: '/admin/extra-items',     icon: HiOutlineMenuIcon,      label: 'Extra Items' },
  { to: '/admin/customers',       icon: HiOutlineUsers,         label: 'Customers' },
  { to: '/admin/settings',        icon: HiOutlineCog,           label: 'Settings' },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 transform transition-transform duration-300
        lg:relative lg:translate-x-0 lg:flex lg:flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          <span className="text-white font-display font-bold text-lg">Adi Anadi</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <HiX className="h-5 w-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                 ${isActive
                   ? 'bg-primary-500 text-white'
                   : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                 }`
              }
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-300
                       hover:bg-gray-800 hover:text-white rounded-lg text-sm font-medium transition-colors"
          >
            <HiOutlineLogout className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <HiMenu className="h-6 w-6" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-4">
            <NotificationBell />
            <span className="text-sm text-gray-600 hidden sm:block">
              {user?.name || 'Admin'}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
