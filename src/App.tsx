import { useState } from 'react';
import type { LatLngExpression } from 'leaflet';
import { useRestaurants } from './hooks/useRestaurants';
import type { Restaurant } from './types';
import { MapView } from './components/MapView';
import { RestaurantCard } from './components/RestaurantCard';
import { SearchFilters } from './components/SearchFilters';
import {
  addDistanceIfWeHaveLocation,
  filterRestaurants,
  getClosestRestaurants,
  restaurantKey,
} from './utils/restaurantHelpers';
import './index.css';

function App() {
  const { restaurants, loading, error } = useRestaurants();
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(
    null,
  );
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);
  const [highlightedRestaurantKeys, setHighlightedRestaurantKeys] = useState<
    string[]
  >([]);

  // Beginner-friendly derived data: calculate these step-by-step.
  const filteredRestaurants = filterRestaurants(restaurants, search, cuisine);
  const restaurantsWithDistance = addDistanceIfWeHaveLocation(
    filteredRestaurants,
    userLocation,
  );

  const selectedDistanceKm =
    restaurantsWithDistance.find((x) => x.restaurant === selected)?.km ?? null;

  const handleNearMe = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const location: LatLngExpression = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setUserLocation(location);

        // Recalculate distances with the new location, then pick the closest 5.
        const updatedWithDistance = addDistanceIfWeHaveLocation(
          filteredRestaurants,
          location,
        );
        const closest = getClosestRestaurants(updatedWithDistance, 5);

        setHighlightedRestaurantKeys(
          closest.map((x) => restaurantKey(x.restaurant)),
        );

        // Auto-select the nearest restaurant.
        if (closest[0]?.restaurant) {
          setSelected(closest[0].restaurant);
          setIsMobileDetailsOpen(true);
        }
      },
      () => {
        // ignore geolocation errors for now
      },
    );
  };

  const selectRestaurant = (restaurant: Restaurant) => {
    setSelected(restaurant);
    setIsMobileDetailsOpen(true);
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true" />
          <div className="brand-text">
            <div className="brand-title">Verdant Halal</div>
            <div className="brand-sub muted">Halal Finder Finland</div>
          </div>
        </div>

        <div className="topbar-right">
          <span className="badge subtle">
            {restaurants.length > 0 ? `${restaurants.length} places` : 'Loading…'}
          </span>
        </div>
      </header>

      <main className="layout">
        <section className="sidebar">
          <div className="sidebar-head">
            <h1 className="sidebar-title">Top Halal Restaurants</h1>
            <p className="muted sidebar-desc">
              Search, filter, then pick a pin on the map.
            </p>
          </div>

          <SearchFilters
            restaurants={restaurants}
            search={search}
            onSearchChange={setSearch}
            cuisine={cuisine}
            onCuisineChange={setCuisine}
            onNearMe={handleNearMe}
          />

          {loading && <p className="muted">Loading restaurants…</p>}
          {error && <p className="error">Could not load data: {error}</p>}

          <div className="list" aria-label="Restaurant results">
            {restaurantsWithDistance.map(({ restaurant, km }) => (
              <button
                key={restaurantKey(restaurant)}
                className={
                  selected && selected === restaurant
                    ? 'list-item active'
                    : 'list-item'
                }
                type="button"
                onClick={() => selectRestaurant(restaurant)}
              >
                <div className="list-item-main">
                  <span className="list-title">{restaurant.name}</span>
                  <span className="list-sub">
                    {restaurant.city} • {restaurant.cuisine}
                    {typeof km === 'number' && Number.isFinite(km)
                      ? ` • ${km.toFixed(1)} km`
                      : ''}
                  </span>
                </div>
              </button>
            ))}

            {!loading && restaurantsWithDistance.length === 0 && (
              <p className="muted">No restaurants match your filters.</p>
            )}
          </div>

          <div className={isMobileDetailsOpen ? 'details open' : 'details'}>
            <RestaurantCard
              restaurant={selected}
              distanceKm={selected ? selectedDistanceKm : null}
              onClose={() => setIsMobileDetailsOpen(false)}
            />
          </div>
        </section>

        <section className="map-section">
          <MapView
            restaurants={filteredRestaurants}
            selected={selected}
            onSelect={(r) => selectRestaurant(r)}
            userLocation={userLocation}
            highlightedKeys={highlightedRestaurantKeys}
          />
        </section>
      </main>
    </div>
  );
}

export default App;

