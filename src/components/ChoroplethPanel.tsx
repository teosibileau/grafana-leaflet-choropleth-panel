import React, { useRef, useEffect, useMemo } from 'react';
import { PanelProps, DataFrame } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { ChoroplethOptions } from '../types';
import { ChoroplethMap } from './ChoroplethMap';
import type { FeatureCollection } from 'geojson';
import { leafletStyles } from './leafletStyles';

interface Props extends PanelProps<ChoroplethOptions> {}

/**
 * Maps Grafana data series to GeoJSON features by matching the geoJsonKey
 * tag in the series name to GeoJSON feature property values.
 */
export function mapDataToFeatures(
  series: DataFrame[],
  geojson: FeatureCollection,
  geoJsonKey: string
): FeatureCollection {
  // Reset all choropleth values
  for (const feature of geojson.features) {
    if (feature.properties) {
      feature.properties.choropleth = 0;
    }
  }

  if (!geoJsonKey) {
    return geojson;
  }

  for (const frame of series) {
    const name = frame.name ?? '';
    // Extract the tag portion: everything from the first '{'
    const braceIdx = name.indexOf('{');
    if (braceIdx === -1) {
      continue;
    }
    const target = name.substring(braceIdx);

    if (target.indexOf(geoJsonKey) === -1) {
      continue;
    }

    for (const feature of geojson.features) {
      if (!feature.properties) {
        continue;
      }
      const property = feature.properties[geoJsonKey];
      if (property && target.indexOf(property) > -1) {
        // Get first numeric value from the first numeric field
        const numericField = frame.fields.find((f) => f.type === 'number');
        if (numericField && numericField.values.length > 0) {
          feature.properties.choropleth = numericField.values[0];
        }
        break;
      }
    }
  }

  return geojson;
}

export const ChoroplethPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<ChoroplethMap | null>(null);
  const theme = useTheme2();
  const geojson = options.geoJsonData;
  const coldColor = theme.visualization.getColorByName(options.coldColor);
  const hotColor = theme.visualization.getColorByName(options.hotColor);
  const strokeColor = theme.visualization.getColorByName(options.strokeColor);
  const strokeWidth = options.strokeWidth;
  const fillOpacity = options.fillOpacity;

  // Create/destroy map on mount/unmount
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    mapRef.current = new ChoroplethMap(containerRef.current);
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // Only re-create map if the container mounts/unmounts
  }, []);

  // Handle resize
  useEffect(() => {
    mapRef.current?.resize();
  }, [width, height]);

  // Map data to features and draw polygons when data, geojson, or color options change
  const mappedGeoJson = useMemo(() => {
    if (!geojson) {
      return null;
    }
    // Deep clone to avoid mutating the stored geojson
    const clone: FeatureCollection = JSON.parse(JSON.stringify(geojson));
    return mapDataToFeatures(data.series, clone, options.geoJsonKey);
  }, [geojson, data.series, options.geoJsonKey]);

  useEffect(() => {
    if (mapRef.current && mappedGeoJson) {
      mapRef.current.drawPolygons(mappedGeoJson, coldColor, hotColor, options.geoJsonKey, options.autoFitBounds, {
        strokeColor,
        strokeWidth,
        fillOpacity,
      });
    }
  }, [
    mappedGeoJson,
    coldColor,
    hotColor,
    options.geoJsonKey,
    options.autoFitBounds,
    strokeColor,
    strokeWidth,
    fillOpacity,
  ]);

  if (!geojson) {
    return (
      <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        No GeoJSON data configured. Use the panel editor to fetch GeoJSON from a URL.
      </div>
    );
  }

  return <div ref={containerRef} className={leafletStyles} style={{ width, height }} />;
};
