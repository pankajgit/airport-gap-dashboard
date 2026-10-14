import { useCallback, useEffect, useState } from "react";

import {
  getFavorites,
  removeFavorite,
} from "../services/airport/favoriteService";

import type { Favorite } from "../types/favorite";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setReloadKey((current) => current + 1);
  }, []);

  const deleteFavorite = useCallback(async (favoriteId: string) => {
    await removeFavorite(favoriteId);

    setFavorites((current) =>
      current.filter((favorite) => favorite.id !== favoriteId),
    );
  }, []);

  useEffect(() => {
    let ignore = false;

    const loadFavorites = async () => {
      try {
        const data = await getFavorites();

        if (!ignore) {
          setFavorites(data);
          setError(null);
        }
      } catch (error) {
        console.error(error);

        if (!ignore) {
          setError("Unable to load favorites. Please try again.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void loadFavorites();

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  return {
    favorites,
    isLoading,
    error,
    refetch,
    deleteFavorite,
  };
};
