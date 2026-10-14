import { Link } from "react-router";
import { useState } from "react";

import { useFavorites } from "../../hooks/useFavorites";

const FavoritesPage = () => {
  const { favorites, isLoading, error, refetch, deleteFavorite } =
    useFavorites();

  const [removingId, setRemovingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleRemove = async (favoriteId: string) => {
    try {
      setRemovingId(favoriteId);
      setActionError(null);

      await deleteFavorite(favoriteId);
    } catch (error) {
      console.error(error);
      setActionError("Unable to remove favorite. Please try again.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Favorite Airports
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Airports saved to your account.
          </p>
        </div>

        <button
          type="button"
          onClick={refetch}
          disabled={isLoading}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {actionError && (
        <p role="alert" className="text-sm text-red-600">
          {actionError}
        </p>
      )}

      {isLoading && (
        <p className="rounded-xl bg-white p-6 text-sm text-gray-500">
          Loading favorites...
        </p>
      )}

      {!isLoading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={refetch}
            className="mt-3 text-sm font-semibold text-red-700 underline"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !error && favorites.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <h2 className="font-semibold text-gray-900">
            No favorite airports yet
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Browse airports and save one to see it here.
          </p>

          <Link
            to="/airports"
            className="mt-4 inline-block text-sm font-semibold text-green-700 hover:underline"
          >
            Browse airports
          </Link>
        </div>
      )}

      {!isLoading && !error && favorites.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Airport", "IATA", "City", "Country", "Note", "Action"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {favorites.map((favorite) => (
                <tr key={favorite.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm">
                    <Link
                      to={`/airports/${encodeURIComponent(favorite.airport.id)}`}
                      className="font-medium text-green-700 hover:underline"
                    >
                      {favorite.airport.name}
                    </Link>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {favorite.airport.iata || "—"}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {favorite.airport.city}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {favorite.airport.country}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {favorite.note || "—"}
                  </td>

                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => void handleRemove(favorite.id)}
                      disabled={removingId !== null}
                      className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
                    >
                      {removingId === favorite.id ? "Removing..." : "Remove"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
