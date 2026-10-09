import { useCallback, useEffect, useState } from "react";

import { getAirports } from "../services/airport/airportService";

import type { Airport } from "../types/airport";

interface UseAirportsResult {
  airports: Airport[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAirports = (): UseAirportsResult => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAirports = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getAirports();

      setAirports(data);
    } catch (error) {
      console.error(error);

      setError("Unable to load airports. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    const loadAirports = async () => {
      try {
        const data = await getAirports();

        if (!ignore) {
          setAirports(data);
          setError(null);
        }
      } catch (error) {
        console.error(error);

        if (!ignore) {
          setError("Unable to load airports. Please try again.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void loadAirports();

    return () => {
      ignore = true;
    };
  }, []);

  return {
    airports,
    isLoading,
    error,
    refetch: fetchAirports,
  };
};
