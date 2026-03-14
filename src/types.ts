import type { FeatureCollection } from 'geojson';

export interface ChoroplethOptions {
  /** Stored GeoJSON data */
  geoJsonData: FeatureCollection | null;
  /** Max value color (hex) */
  hotColor: string;
  /** Min value color (hex) */
  coldColor: string;
  /** GeoJSON property name for matching (also used to filter metric series by tag) */
  geoJsonKey: string;
  /** Automatically fit the map to visible features when data refreshes */
  autoFitBounds: boolean;
  /** Border color of polygons (hex) */
  strokeColor: string;
  /** Border width of polygons */
  strokeWidth: number;
  /** Opacity of polygon fill (0–1) */
  fillOpacity: number;
}
