const DashboardPage = () => {
  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Welcome to your Airport Gap dashboard.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Airports
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            0
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Favorites
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            0
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Distances Calculated
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            0
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Reports
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            0
          </p>
        </div>

      </div>

      {/* Welcome Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">
          Getting Started
        </h3>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
          This dashboard will use the Airport Gap REST API to
          retrieve airports, calculate distances, manage favorites,
          and generate reports.
        </p>
      </div>

    </div>
  )
}

export default DashboardPage