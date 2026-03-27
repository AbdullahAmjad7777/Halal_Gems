import type { Restaurant } from '../types';

type Props = {
  restaurants: Restaurant[];
  search: string;
  onSearchChange: (value: string) => void;
  cuisine: string;
  onCuisineChange: (value: string) => void;
  onNearMe?: () => void;
};

export function SearchFilters({
  restaurants,
  search,
  onSearchChange,
  cuisine,
  onCuisineChange,
  onNearMe,
}: Props) {
  const cuisines = Array.from(
    new Set(
      restaurants
        .map((r) => r.cuisine.trim())
        .filter((c) => c.length > 0)
        .sort((a, b) => a.localeCompare(b)),
    ),
  );

  return (
    <div className="filters card">
      <div className="filters-row">
        <input
          type="text"
          placeholder="Search by name or city"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {onNearMe && (
          <button type="button" className="secondary" onClick={onNearMe}>
            Near me
          </button>
        )}
      </div>
      <div className="filters-row">
        <select
          value={cuisine}
          onChange={(e) => onCuisineChange(e.target.value)}
        >
          <option value="">All cuisines</option>
          {cuisines.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

