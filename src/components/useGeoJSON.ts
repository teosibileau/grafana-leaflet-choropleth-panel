import { useState, useEffect } from 'react';
import type { FeatureCollection } from 'geojson';

interface UseGeoJSONResult {
  geojson: FeatureCollection | null;
  loading: boolean;
  error: string | null;
}

export function useGeoJSON(endpoint: string): UseGeoJSONResult {
  const [geojson, setGeojson] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!endpoint) {
      return;
    }

    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: reset UI state when starting a new fetch
    setLoading(true);
    setError(null);

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data: FeatureCollection) => {
        if (cancelled) {
          return;
        }
        // Initialize choropleth property on each feature
        for (const feature of data.features) {
          if (feature.properties) {
            feature.properties.choropleth = 0;
          }
        }
        setGeojson(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  if (!endpoint) {
    return { geojson: null, loading: false, error: null };
  }

  return { geojson, loading, error };
}
