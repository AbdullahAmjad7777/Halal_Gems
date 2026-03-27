import { useEffect, useState } from 'react';
import type { Restaurant } from '../types';
import { sheetParser } from '../utils/sheetParser';

type UseRestaurantsState = {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
};

const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQZ5ewZpT_FcAuxKGMpe_MbX5oKwAvZyunvXDC6qvwAy_h5tlzVAVYAZK1Y7KvZ4S08XXZCLfp9Ssri/pub?output=csv';

type CachePayload = {
  savedAt: number; // unix ms
  restaurants: Restaurant[];
};

const CACHE_KEY = `halal_gems_restaurants_cache_v1:${SHEET_CSV_URL}`;
const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

export function useRestaurants(): UseRestaurantsState {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const readCache = (): CachePayload | null => {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as CachePayload;
        if (!parsed?.savedAt || !Array.isArray(parsed.restaurants)) return null;
        return parsed;
      } catch {
        return null;
      }
    };

    const writeCache = (data: Restaurant[]) => {
      try {
        const payload: CachePayload = { savedAt: Date.now(), restaurants: data };
        localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
      } catch {
        // ignore storage errors (private mode / quota / disabled)
      }
    };

    const load = async () => {
      try {
        setError(null);

        // 1) Fast path: show cached data instantly (if fresh enough)
        const cached = readCache();
        const cacheIsFresh =
          cached && Date.now() - cached.savedAt < CACHE_TTL_MS;
        if (cacheIsFresh && !cancelled) {
          setRestaurants(cached.restaurants);
          setLoading(false);
        } else if (!cancelled) {
          setLoading(true);
        }

        // We fetch the public CSV text directly in the browser.
        // 2) Always revalidate in background (fresh data)
        const response = await fetch(SHEET_CSV_URL, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch data (${response.status})`);
        }

        // Convert CSV text -> JavaScript objects we can use in the app.
        const csvText = await response.text();
        const parsed = sheetParser(csvText);

        if (!cancelled) {
          setRestaurants(parsed);
          writeCache(parsed);
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        if (!cancelled) {
          // If we already showed cached data, keep UI usable and show a soft error.
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return { restaurants, loading, error };
}

