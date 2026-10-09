import { useMemo, useState } from "react";

import { useAirports } from "../../hooks/useAirports";
import type { Airport } from "../../types/airport";
import DataTable from "../../components/common/DataTable";
import { Link } from "react-router";

const airportColumns = [
  {
    key: "airport",
    header: "Airport",
    render: (airport: Airport) => (
      <div>
        <Link
          to={`/airports/${encodeURIComponent(airport.id)}`}
          className="font-medium text-green-700 hover:underline"
        >
          {airport.name}
        </Link>

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
  type SortField = "name" | "city" | "country";
  type SortDirection = "asc" | "desc";

  const {
    airports,
    page,
    totalPages,
    isLoading,
    error,
    nextPage,
    previousPage,
    goToPage,
    refetch,
  } = useAirports();
  console.log(airports);
  const [search, setSearch] = useState("");

  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const filteredAirports = useMemo(() => {
    const query = search.trim().toLowerCase();

    return airports
      .filter((airport) => {
        return (
          airport.name.toLowerCase().includes(query) ||
          airport.city.toLowerCase().includes(query) ||
          airport.country.toLowerCase().includes(query) ||
          airport.iata?.toLowerCase().includes(query) ||
          airport.icao?.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        const comparison = a[sortField].localeCompare(b[sortField]);

        return sortDirection === "asc" ? comparison : -comparison;
      });
  }, [airports, search, sortField, sortDirection]);

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
          onClick={refetch}
          disabled={isLoading}
          className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Search */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
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
            placeholder="Name, city, IATA or ICAO..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <div>
          <label
            htmlFor="sort-field"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Sort by
          </label>

          <select
            id="sort-field"
            value={sortField}
            onChange={(event) => setSortField(event.target.value as SortField)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm"
          >
            <option value="name">Airport name</option>
            <option value="city">City</option>
            <option value="country">Country</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <button
            type="button"
            onClick={() =>
              setSortDirection((current) =>
                current === "asc" ? "desc" : "asc",
              )
            }
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {sortDirection === "asc" ? "Ascending ↑" : "Descending ↓"}
          </button>
        </div>
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
            <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-600">
                Page <span className="font-semibold">{page}</span> of{" "}
                <span className="font-semibold">{totalPages}</span>
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (previousPage !== null) {
                      goToPage(previousPage);
                    }
                  }}
                  disabled={isLoading || previousPage === null}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (nextPage !== null) {
                      goToPage(nextPage);
                    }
                  }}
                  disabled={isLoading || nextPage === null}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AirportsPage;
