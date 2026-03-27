import type { Restaurant } from '../types';

type Props = {
  restaurant: Restaurant | null;
  distanceKm?: number | null;
  onClose?: () => void;
};

function halalBadge(statusRaw: string): { label: string; variant: 'verified' | 'options' | 'unknown' } {
  const s = statusRaw.trim().toLowerCase();
  if (s.includes('certified') || s.includes('verified') || s.includes('fully')) {
    return { label: 'Verified halal', variant: 'verified' };
  }
  if (s.includes('friendly') || s.includes('option')) {
    return { label: 'Halal options', variant: 'options' };
  }
  if (s.length === 0 || s.includes('unknown')) {
    return { label: 'Status unknown', variant: 'unknown' };
  }
  // fallback: show original but pick a reasonable variant
  return { label: statusRaw, variant: 'unknown' };
}

function restaurantImage(restaurant: Restaurant): string {
  const cuisine = restaurant.cuisine.toLowerCase();

  if (cuisine.includes('turkish') || cuisine.includes('ottoman')) {
    return 'https://images.pexels.com/photos/7245465/pexels-photo-7245465.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  if (cuisine.includes('arab') || cuisine.includes('levant')) {
    return 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  if (cuisine.includes('indian') || cuisine.includes('pakistan')) {
    return 'https://images.pexels.com/photos/1117862/pexels-photo-1117862.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  if (cuisine.includes('bangladesh') || cuisine.includes('bengali')) {
    return 'https://images.pexels.com/photos/2087748/pexels-photo-2087748.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  if (cuisine.includes('syrian') || cuisine.includes('middle')) {
    return 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800';
  }

  // generic nice plate fallback
  return (
    restaurant.imageUrl ??
    'https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg?auto=compress&cs=tinysrgb&w=800'
  );
}

export function RestaurantCard({ restaurant, distanceKm, onClose }: Props) {
  if (!restaurant) {
    return (
      <div className="sidebar-card empty card">
        {onClose && (
          <button
            type="button"
            className="card-close"
            onClick={() => onClose()}
            aria-label="Close details"
          >
            ✕
          </button>
        )}
        <div className="sheet-handle" aria-hidden="true" />
        <div className="card-kicker">Selected result</div>
        <h2 className="card-title">Pick a restaurant</h2>
        <p className="muted">Select a pin on the map or choose from the list.</p>
      </div>
    );
  }

  const badge = halalBadge(String(restaurant.halal_status ?? ''));
  const imageSrc = restaurantImage(restaurant);

  return (
    <div className="sidebar-card card">
      {onClose && (
        <button
          type="button"
          className="card-close"
          onClick={() => onClose()}
          aria-label="Close details"
        >
          ✕
        </button>
      )}
      <div className="sheet-handle" aria-hidden="true" />
      <div className="card-kicker">Selected result</div>
      <div className="card-header">
        <h2 className="card-title">{restaurant.name}</h2>
        <span className={`badge badge-${badge.variant}`}>{badge.label}</span>
      </div>
      <div className="card-image-wrap">
        <img
          src={imageSrc}
          alt={restaurant.name}
          className="card-image"
          loading="lazy"
        />
      </div>
      <p className="muted">
        {restaurant.address}
        {restaurant.city ? `, ${restaurant.city}` : ''}
      </p>
      {typeof distanceKm === 'number' && Number.isFinite(distanceKm) && (
        <p className="muted">
          <strong>Distance:</strong> {distanceKm.toFixed(1)} km
        </p>
      )}
      {restaurant.cuisine && (
        <p className="pill-row">
          <span className="pill">{restaurant.cuisine}</span>
        </p>
      )}
      {restaurant.hours && (
        <p className="muted">
          <strong>Hours:</strong> {restaurant.hours}
        </p>
      )}
      {restaurant.phone && (
        <p className="muted">
          <strong>Phone:</strong> {restaurant.phone}
        </p>
      )}
      {restaurant.website && (
        <div className="card-actions">
          <a
            className="btn-link"
            href={restaurant.website}
            target="_blank"
            rel="noreferrer"
          >
            Visit website
          </a>
        </div>
      )}
    </div>
  );
}

