import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { getAirportById } from "../../services/airport/airportService";
import type { Airport } from "../../types/airport";

const AirportDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const [airport, setAirport] = useState<Airport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    </div>
  );
};

export default AirportDetailsPage;
