import { NavLink } from 'react-router'
import { useAuth } from '../../hooks/useAuth'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigationItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: '📊',
  },
  {
    label: 'Airports',
    path: '/airports',
    icon: '✈️',
  },
  {
    label: 'Favorites',
    path: '/favorites',
    icon: '⭐',
  },
  {
    label: 'Reports',
    path: '/reports',
    icon: '📈',
  },
]

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const {logout} = useAuth()
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-64
          transform
          border-r border-gray-200
          bg-white
          transition-transform duration-200
          lg:static
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 text-white">
              ✈
            </div>

            <span className="font-bold text-gray-900">
              Airport Gap
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 p-4">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `
                flex items-center gap-3 rounded-lg px-4 py-3
                text-sm font-medium
                transition
                ${
                  isActive
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
                `
              }
            >
              <span>{item.icon}</span>

              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="absolute bottom-0 w-full border-t border-gray-200 p-4">
          <button
            type="button"
            onClick={logout}
            className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar