import type { Airport } from "../../types/airport";
import type {
  FavoriteApiItem,
  Favorite,
  FavoritesResponse,
} from "../../types/favorite";
import axiosClient from "../api/axiosClient";

interface SingleFavoriteResponse {
  data: FavoriteApiItem;
}

const mapFavorite = (item: FavoriteApiItem): Favorite => {
  const airport = item.attributes.airport;

  const normalizedAirport: Airport = {
    id: airport.iata ?? String(airport.id),
    name: airport.name,
    city: airport.city,
    country: airport.country,
    iata: airport.iata,
    icao: airport.icao,
    latitude: Number(airport.latitude),
    longitude: Number(airport.longitude),
    altitude: airport.altitude,
    timezone: airport.timezone,
  };

  return {
    id: item.id,
    airport: normalizedAirport,
    note: item.attributes.note,
  };
};

export const getFavorites = async (): Promise<Favorite[]> => {
  const response = await axiosClient.get<FavoritesResponse>("/favorites");
  return response.data.data.map(mapFavorite);
};

export const addFavorite = async (
  airportId: string,
  note?: string,
): Promise<Favorite> => {
  const body = new URLSearchParams();

  body.append("airport_id", airportId);
  if (note?.trim()) {
    body.append("note", note.trim());
  }
  const response = await axiosClient.post<SingleFavoriteResponse>(
    "/favorites",
    body,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );
  return mapFavorite(response.data.data);
};

export const removeFavorite = async (favoriteId: string): Promise<void> => {
  await axiosClient.delete(`/favorites/${favoriteId}`);
};
