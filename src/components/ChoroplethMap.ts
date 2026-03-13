import L from 'leaflet';
import chroma from 'chroma-js';
import type { FeatureCollection } from 'geojson';

const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTRIBUTION =
  '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';

export class ChoroplethMap {
  private map: L.Map;
  private tiles: L.TileLayer;
  private geojsonLayer: L.GeoJSON | null = null;

  constructor(container: HTMLDivElement) {
    this.map = L.map(container, {
      scrollWheelZoom: false,
    }).setView([0, 0], 2);

    this.tiles = L.tileLayer(TILE_URL, {
      attribution: TILE_ATTRIBUTION,
      detectRetina: true,
    });
    this.tiles.addTo(this.map);
  }

  drawPolygons(
    geojson: FeatureCollection,
    coldColor: string,
    hotColor: string,
    geoJsonKey: string,
    autoFitBounds: boolean
  ): void {
    // Remove previous GeoJSON layer
    if (this.geojsonLayer) {
      this.map.removeLayer(this.geojsonLayer);
      this.geojsonLayer = null;
    }

    // Filter to features with choropleth > 0
    const activeFeatures = geojson.features.filter((f) => f.properties && f.properties.choropleth > 0);

    if (activeFeatures.length === 0) {
      return;
    }

    const filteredGeoJson: FeatureCollection = {
      type: 'FeatureCollection',
      features: activeFeatures,
    };

    const values = activeFeatures.map((f) => f.properties!.choropleth as number);
    const steps = 10;
    const limits = chroma.limits(values, 'q', steps - 1);
    const colors = chroma.scale([coldColor, hotColor]).colors(limits.length);

    this.geojsonLayer = L.geoJSON(filteredGeoJson, {
      style: (feature) => {
        const featureValue = feature?.properties?.choropleth ?? 0;
        let fillColor = colors[0];
        for (let i = 0; i < limits.length; i++) {
          if (featureValue <= limits[i]) {
            fillColor = colors[i];
            break;
          }
        }
        return {
          color: '#fff',
          weight: 1,
          fillOpacity: 0.5,
          fillColor,
        };
      },
      onEachFeature: (feature, layer) => {
        const name = feature.properties?.[geoJsonKey] ?? 'Unknown';
        const value = feature.properties?.choropleth ?? 0;
        layer.bindTooltip(`${name}: ${value}`, { sticky: true });
      },
    });

    this.geojsonLayer.addTo(this.map);
    if (autoFitBounds) {
      this.map.fitBounds(this.geojsonLayer.getBounds());
    }
  }

  resize(): void {
    this.map.invalidateSize();
  }

  remove(): void {
    this.map.remove();
  }
}
