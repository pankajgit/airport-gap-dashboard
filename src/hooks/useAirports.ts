import { useCallback, useEffect, useState } from "react";

import { getAirports } from "../services/airport/airportService";

import type { Airport } from "../types/airport";

interface UseAirportsResult {
  airports: Airport[];
  page: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  nextPage: number | null;
  previousPage: number | null;
  goToPage: (page: number) => void;
  refetch: () => void;
}

export const useAirports = (): UseAirportsResult => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [previousPage, setPreviousPage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const goToPage = useCallback(
    (newPage: number) => {
      if (newPage < 1 || newPage > totalPages || newPage === page) {
        return;
      }

      setIsLoading(true);
      setPage(newPage);
    },
    [page, totalPages],
  );

  const refetch = useCallback(() => {
    setIsLoading(true);
    setReloadKey((current) => current + 1);
  }, []);

  useEffect(() => {
    let ignore = false;

    const loadAirports = async () => {
      try {
        const result = await getAirports(page);

        if (ignore) return;

        setAirports(result.airports);
        setTotalPages(result.totalPages);
        setNextPage(result.nextPage);
        setPreviousPage(result.previousPage);
        setError(null);
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
  }, [page, reloadKey]);

  return {
    airports,
    page,
    totalPages,
    isLoading,
    error,
    nextPage,
    previousPage,
    goToPage,
    refetch,
  };
};
