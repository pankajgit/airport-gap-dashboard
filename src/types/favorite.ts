import type { Airport } from "./airport";

export interface Favorite {
  id: string;
  airport: Airport;
  note: string | null;
}

export interface FavoritesResponse {
  data: FavoriteApiItem[];
  links: {
    first?: string;
    self?: string;
    last?: string;
    next?: string | null;
    prev?: string | null;
  };
}

export interface FavoriteApiItem {
  id: string;
  type: string;
  attributes: {
    note: string | null;
    airport: {
      id: string | number;
      name: string;
      city: string;
      country: string;
      iata: string | null;
      icao: string | null;
      latitude: string;
      longitude: string;
      altitude: number;
      timezone: string;
    };
  };
}
