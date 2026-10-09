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
    prev?: string | null;
    next?: string | null;
  };
}
export interface AirportPage {
  airports: Airport[];
  currentPage: number;
  totalPages: number;
  nextPage: number | null;
  previousPage: number | null;
}

export const getAirports = async (page = 1): Promise<AirportPage> => {
  const response = await axiosClient.get<AirportsResponse>("/airports", {
    params: { page },
  });

  const result = response.data;

  const getPageNumber = (url: string | null | undefined): number | null => {
    if (!url) return null;

    const pageValue = new URL(url).searchParams.get("page");

    return pageValue ? Number(pageValue) : 1;
  };

  return {
    airports: result.data.map((airport) => ({
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
    })),
    currentPage: page,
    totalPages: getPageNumber(result.links.last) ?? 1,
    nextPage: getPageNumber(result.links.next),
    previousPage: getPageNumber(result.links.prev),
  };
};

export const getAirportById = async (id: string): Promise<Airport> => {
  const response = await axiosClient.get<{ data: AirportApiItem }>(
    `/airports/${encodeURIComponent(id)}`,
  );
  const airport = response.data.data;

  return {
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
  };
};
