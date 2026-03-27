import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import type { Restaurant } from '../types';

// Ensure default Leaflet marker icons work with bundlers
import 'leaflet/dist/leaflet.css';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error - accessing private _getIconUrl is standard workaround
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type Props = {
  restaurants: Restaurant[];
  selected: Restaurant | null;
  onSelect: (restaurant: Restaurant) => void;
  userLocation: LatLngExpression | null;
  highlightedKeys?: string[];
};

const FINLAND_CENTER: LatLngExpression = [64.5, 26];

function FlyToSelected({
  selected,
  userLocation,
}: {
  selected: Restaurant | null;
  userLocation: LatLngExpression | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selected) {
      map.flyTo([selected.latitude, selected.longitude], 13, {
        duration: 0.8,
      });
    }
  }, [map, selected]);

  useEffect(() => {
    if (userLocation) {
      map.flyTo(userLocation, 11, { duration: 0.8 });
    }
  }, [map, userLocation]);

  return null;
}

function restaurantKey(r: Restaurant) {
  return `${r.name}-${r.latitude}-${r.longitude}`;
}

function halalVariant(statusRaw: string): 'verified' | 'options' | 'unknown' {
  const s = statusRaw.trim().toLowerCase();
  if (s.includes('certified') || s.includes('verified') || s.includes('fully')) return 'verified';
  if (s.includes('friendly') || s.includes('option')) return 'options';
  return 'unknown';
}

const iconCache = new Map<string, L.DivIcon>();
function markerIcon(
  variant: 'verified' | 'options' | 'unknown',
  highlighted: boolean,
) {
  const key = `${variant}-${highlighted ? 'h' : 'n'}`;
  const existing = iconCache.get(key);
  if (existing) return existing;

  const icon = L.divIcon({
    className: 'hg-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -26],
    html: `<div class="hg-pin hg-${variant} ${highlighted ? 'hg-highlight' : ''}"></div>`,
  });
  iconCache.set(key, icon);
  return icon;
}

export function MapView({
  restaurants,
  selected,
  onSelect,
  userLocation,
  highlightedKeys,
}: Props) {
  return (
    <MapContainer
      center={FINLAND_CENTER}
      zoom={5}
      className="map"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {restaurants.map((r) => {
        const highlighted =
          highlightedKeys?.includes(restaurantKey(r)) ?? false;
        const variant = halalVariant(String(r.halal_status ?? ''));
        return (
        <Marker
          key={restaurantKey(r)}
          position={[r.latitude, r.longitude]}
          icon={markerIcon(variant, highlighted)}
          eventHandlers={{
            click: () => onSelect(r),
          }}
        >
          <Popup>
            <strong>{r.name}</strong>
            <br />
            {r.city}
          </Popup>
        </Marker>
        );
      })}

      {userLocation && (
        <Marker
          position={userLocation}
          icon={L.divIcon({
            className: 'hg-marker',
            iconSize: [28, 28],
            iconAnchor: [14, 28],
            popupAnchor: [0, -26],
            html: `<div class="hg-pin hg-me"></div>`,
          })}
        >
          <Popup>You are here</Popup>
        </Marker>
      )}

      <FlyToSelected selected={selected} userLocation={userLocation} />
    </MapContainer>
  );
}

