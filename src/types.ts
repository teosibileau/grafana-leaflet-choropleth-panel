import type { FeatureCollection } from 'geojson';

export interface ChoroplethOptions {
  /** Stored GeoJSON data */
  geoJsonData: FeatureCollection | null;
  /** Max value color (hex) */
  hotColor: string;
  /** Min value color (hex) */
  coldColor: string;
  /** GeoJSON property name for matching */
  geoJsonKey: string;
  /** Tag to filter metric series */
  dataSourceTag: string;
  /** Initial zoom level 1-18 */
  initialZoom: number;
}
