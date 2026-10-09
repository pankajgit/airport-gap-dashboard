import { useMemo, useState } from "react";

import { useAirports } from "../../hooks/useAirports";
import type { Airport } from "../../types/airport";
import DataTable from "../../components/common/DataTable";

const airportColumns = [
  {
    key: "airport",
    header: "Airport",
    render: (airport: Airport) => (
      <div>
        <p className="font-medium text-gray-900">{airport.name}</p>

        <p className="text-xs text-gray-500">{airport.id}</p>
      </div>
    ),
  },
  {
    key: "iata",
    header: "IATA",
    render: (airport: Airport) => airport.iata || "—",
  },
  {
    key: "city",
    header: "City",
    render: (airport: Airport) => airport.city || "—",
  },
  {
    key: "country",
    header: "Country",
    render: (airport: Airport) => airport.country,
  },
  {
    key: "coordinates",
    header: "Coordinates",
    render: (airport: Airport) =>
      `${airport.latitude.toFixed(4)}, ${airport.longitude.toFixed(4)}`,
  },
];

const AirportsPage = () => {
  const { airports, isLoading, error, refetch } = useAirports();
  console.log(airports);
  const [search, setSearch] = useState("");

  const filteredAirports = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return airports;
    }

    return airports.filter((airport) => {
      return (
        airport.name.toLowerCase().includes(searchValue) ||
        airport.iata?.toLowerCase().includes(searchValue) ||
        airport.city.toLowerCase().includes(searchValue)
      );
    });
  }, [airports, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Airports</h2>

          <p className="mt-1 text-sm text-gray-500">
            Browse airports available through the Airport Gap API.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isLoading}
          className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <label
          htmlFor="airport-search"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Search airports
        </label>

        <input
          id="airport-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by airport, IATA code or city..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => void refetch()}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-gray-500">Loading airports...</p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredAirports.length}
              </span>{" "}
              airports
            </p>
          </div>

          <div className="overflow-x-auto">
            {
              <DataTable
                columns={airportColumns}
                data={filteredAirports}
                rowKey={(rowKey) => rowKey.id}
              />
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default AirportsPage;
