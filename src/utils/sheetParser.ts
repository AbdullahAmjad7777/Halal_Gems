import type { Restaurant } from '../types';
import Papa from 'papaparse';

export function sheetParser(csvText: string): Restaurant[] {
  // PapaParse turns CSV text into objects like:
  // { name: "...", address: "...", city: "...", lat: "...", lng: "...", ... }
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });

  if (parsed.errors.length > 0) {
    // best-effort: still return what we can parse
  }

  return (parsed.data ?? [])
    .map((row) => {
      // Your sheet uses "lat,lng". Some sheets use "latitude,longitude",
      // so we support both.
      const latRaw = row.latitude ?? row.lat ?? '';
      const lngRaw = row.longitude ?? row.lng ?? '';
      const latitude = Number(latRaw);
      const longitude = Number(lngRaw);

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

      const restaurant: Restaurant = {
        name: row.name ?? '',
        address: row.address ?? '',
        city: row.city ?? '',
        latitude,
        longitude,
        cuisine: row.cuisine ?? '',
        halal_status: row.halal_status ?? 'Unknown',
        phone: row.phone ?? '',
        website: row.website ?? '',
        hours: row.hours ?? '',
      };

      return restaurant;
    })
    .filter((r): r is Restaurant => r !== null);
}

