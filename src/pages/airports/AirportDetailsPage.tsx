import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { getAirportById } from "../../services/airport/airportService";
import type { Airport } from "../../types/airport";

import { addFavorite } from "../../services/airport/favoriteService";

const AirportDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const [airport, setAirport] = useState<Airport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleAddFavorite = async () => {
    if (!airport) return;

    try {
      setIsSaving(true);
      setSaveMessage(null);
      setSaveError(null);

      await addFavorite(airport.id, note);

      setSaveMessage("Airport added to favorites.");
      setNote("");
    } catch (error) {
      console.error(error);
      setSaveError("Unable to add this airport. It may already be a favorite.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadAirport = async () => {
      if (!id) {
        setError("Airport ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const result = await getAirportById(id);

        if (!ignore) {
          setAirport(result);
          setError(null);
        }
      } catch (error) {
        console.error(error);

        if (!ignore) {
          setError("Unable to load airport details.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void loadAirport();

    return () => {
      ignore = true;
    };
  }, [id]);

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading airport details...</p>;
  }

  if (error || !airport) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-600">{error ?? "Airport not found."}</p>

        <Link
          to="/airports"
          className="text-sm font-medium text-green-700 hover:underline"
        >
          Back to airports
        </Link>
      </div>
    );
  }

  const details = [
    { label: "Airport ID", value: airport.id },
    { label: "IATA code", value: airport.iata },
    { label: "ICAO code", value: airport.icao },
    { label: "City", value: airport.city },
    { label: "Country", value: airport.country },
    { label: "Latitude", value: airport.latitude.toFixed(5) },
    { label: "Longitude", value: airport.longitude.toFixed(5) },
    { label: "Altitude", value: `${airport.altitude} ft` },
    { label: "Timezone", value: airport.timezone },
  ];

  return (
    <div className="space-y-6">
      <Link
        to="/airports"
        className="inline-flex text-sm font-medium text-green-700 hover:underline"
      >
        ← Back to airports
      </Link>

      <div>
        <p className="text-sm font-medium text-green-700">Airport details</p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          {airport.name}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {airport.city}, {airport.country}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {details.map((detail) => (
          <div
            key={detail.label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">{detail.label}</p>

            <p className="mt-2 break-words font-semibold text-gray-900">
              {detail.value ?? "—"}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">Save to Favorites</h2>

        <label
          htmlFor="favorite-note"
          className="mb-2 mt-4 block text-sm font-medium text-gray-700"
        >
          Note (optional)
        </label>

        <input
          id="favorite-note"
          type="text"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          maxLength={500}
          placeholder="e.g. My preferred airport"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
        />

        <button
          type="button"
          onClick={() => void handleAddFavorite()}
          disabled={isSaving}
          className="mt-4 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Add to Favorites"}
        </button>

        {saveMessage && (
          <p role="status" className="mt-3 text-sm text-green-700">
            {saveMessage}
          </p>
        )}

        {saveError && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {saveError}
          </p>
        )}
      </div>
    </div>
  );
};

export default AirportDetailsPage;
