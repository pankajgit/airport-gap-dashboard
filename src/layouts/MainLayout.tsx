import { useState } from 'react'
import { Outlet } from 'react-router'

import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'
import Footer from '../components/layout/Footer'

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleMenuClick = () => {
    setIsSidebarOpen((previous) => !previous)
  }

  const handleSidebarClose = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
      />

      <div className="flex min-w-0 flex-1 flex-col">

        <Header
          onMenuClick={handleMenuClick}
        />

        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>

        <Footer />

      </div>

    </div>
  )
}

export default MainLayout