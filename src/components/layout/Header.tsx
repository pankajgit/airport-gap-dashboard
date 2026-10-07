interface HeaderProps {
  onMenuClick: () => void
}

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="h-16 border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            aria-label="Open navigation"
          >
            ☰
          </button>

          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Airport Gap
            </h1>

            <p className="hidden text-xs text-gray-500 sm:block">
              Dashboard
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-gray-600 sm:block">
            Welcome, User
          </span>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-sm font-semibold text-white">
            U
          </div>
        </div>

      </div>
    </header>
  )
}

export default Header