import type { LatLngExpression } from 'leaflet';
import type { Restaurant } from '../types';
import { distanceKm } from './geo';

export function restaurantKey(r: Restaurant): string {
  return `${r.name}-${r.latitude}-${r.longitude}`;
}

export function filterRestaurants(
  restaurants: Restaurant[],
  searchText: string,
  cuisine: string,
): Restaurant[] {
  const term = searchText.trim().toLowerCase();
  const cuisineTerm = cuisine.trim().toLowerCase();

  return restaurants.filter((r) => {
    const matchesSearch =
      term.length === 0 ||
      r.name.toLowerCase().includes(term) ||
      r.city.toLowerCase().includes(term);

    const matchesCuisine =
      cuisineTerm.length === 0 || r.cuisine.toLowerCase() === cuisineTerm;

    return matchesSearch && matchesCuisine;
  });
}

export type RestaurantWithDistance = {
  restaurant: Restaurant;
  km: number | null;
};

export function addDistanceIfWeHaveLocation(
  restaurants: Restaurant[],
  userLocation: LatLngExpression | null,
): RestaurantWithDistance[] {
  if (!userLocation) {
    return restaurants.map((restaurant) => ({ restaurant, km: null }));
  }

  const [lat, lng] = userLocation as [number, number];

  const withKm = restaurants.map((restaurant) => ({
    restaurant,
    km: distanceKm(
      { lat, lng },
      { lat: restaurant.latitude, lng: restaurant.longitude },
    ),
  }));

  // Put closest restaurants first
  withKm.sort((a, b) => (a.km ?? 0) - (b.km ?? 0));
  return withKm;
}

export function getClosestRestaurants(
  restaurantsWithDistance: RestaurantWithDistance[],
  count: number,
): RestaurantWithDistance[] {
  return restaurantsWithDistance.slice(0, count);
}

