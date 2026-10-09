import axiosClient from "../api/axiosClient";

import type { Airport } from "../../types/airport";

interface AirportApiItem {
  id: string;
  type: string;
  attributes: {
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
}

interface AirportsResponse {
  data: AirportApiItem[];
  links: {
    first: string;
    self: string;
    last: string;
    prev?: string;
    next?: string;
  };
}

export const getAirports = async (): Promise<Airport[]> => {
  const response = await axiosClient.get<AirportsResponse>("/airports");

  return response.data.data.map((airport) => ({
    id: airport.id,
    name: airport.attributes.name,
    city: airport.attributes.city,
    country: airport.attributes.country,
    iata: airport.attributes.iata,
    icao: airport.attributes.icao,
    latitude: Number(airport.attributes.latitude),
    longitude: Number(airport.attributes.longitude),
    altitude: airport.attributes.altitude,
    timezone: airport.attributes.timezone,
  }));
};
