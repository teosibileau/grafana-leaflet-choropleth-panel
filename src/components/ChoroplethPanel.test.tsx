import React from 'react';
import { render, screen } from '@testing-library/react';
import { FieldType, LoadingState, toDataFrame } from '@grafana/data';
import { mapDataToFeatures, ChoroplethPanel } from './ChoroplethPanel';
import type { ChoroplethOptions } from '../types';
import type { FeatureCollection } from 'geojson';

// Mock ChoroplethMap to avoid Leaflet Canvas issues in jsdom
jest.mock('./ChoroplethMap', () => ({
  ChoroplethMap: jest.fn().mockImplementation(() => ({
    remove: jest.fn(),
    resize: jest.fn(),
    drawPolygons: jest.fn(),
  })),
}));

function makeGeoJSON(keys: string[]): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: keys.map((key) => ({
      type: 'Feature',
      properties: { name: key, choropleth: 0 },
      geometry: { type: 'Point', coordinates: [0, 0] },
    })),
  };
}

describe('mapDataToFeatures', () => {
  it('assigns choropleth values to matching features', () => {
    const geojson = makeGeoJSON(['region-a', 'region-b', 'region-c']);

    const series = [
      toDataFrame({
        name: 'metric{name=region-a}',
        fields: [
          { name: 'time', type: FieldType.time, values: [1000] },
          { name: 'value', type: FieldType.number, values: [42] },
        ],
      }),
      toDataFrame({
        name: 'metric{name=region-c}',
        fields: [
          { name: 'time', type: FieldType.time, values: [1000] },
          { name: 'value', type: FieldType.number, values: [99] },
        ],
      }),
    ];

    const result = mapDataToFeatures(series, geojson, 'name');

    expect(result.features[0].properties!.choropleth).toBe(42);
    expect(result.features[1].properties!.choropleth).toBe(0);
    expect(result.features[2].properties!.choropleth).toBe(99);
  });

  it('returns zeroed features when geoJsonKey is empty', () => {
    const geojson = makeGeoJSON(['region-a']);
    const series = [
      toDataFrame({
        name: 'metric{name=region-a}',
        fields: [
          { name: 'time', type: FieldType.time, values: [1000] },
          { name: 'value', type: FieldType.number, values: [42] },
        ],
      }),
    ];

    const result = mapDataToFeatures(series, geojson, '');
    expect(result.features[0].properties!.choropleth).toBe(0);
  });

  it('ignores series without brace-delimited tags', () => {
    const geojson = makeGeoJSON(['region-a']);
    const series = [
      toDataFrame({
        name: 'plain-metric-name',
        fields: [
          { name: 'time', type: FieldType.time, values: [1000] },
          { name: 'value', type: FieldType.number, values: [42] },
        ],
      }),
    ];

    const result = mapDataToFeatures(series, geojson, 'name');
    expect(result.features[0].properties!.choropleth).toBe(0);
  });

  it('filters by geoJsonKey tag', () => {
    const geojson = makeGeoJSON(['region-a']);
    const series = [
      toDataFrame({
        name: 'metric{other=region-a}',
        fields: [
          { name: 'time', type: FieldType.time, values: [1000] },
          { name: 'value', type: FieldType.number, values: [42] },
        ],
      }),
    ];

    const result = mapDataToFeatures(series, geojson, 'name');
    expect(result.features[0].properties!.choropleth).toBe(0);
  });
});

describe('ChoroplethPanel', () => {
  const defaultProps = {
    id: 1,
    data: { series: [], state: LoadingState.Done, timeRange: {} as any, structureRev: 0 },
    timeRange: {} as any,
    timeZone: 'utc' as const,
    options: {
      geoJsonData: null,
      hotColor: 'red',
      coldColor: 'blue',
      geoJsonKey: 'name',
      autoFitBounds: true,
      strokeColor: '#000',
      strokeWidth: 1,
      fillOpacity: 0.8,
    } as ChoroplethOptions,
    transparent: false,
    width: 400,
    height: 300,
    fieldConfig: { defaults: {}, overrides: [] } as any,
    renderCounter: 0,
    title: 'Test',
    eventBus: {
      subscribe: jest.fn(),
      getStream: jest.fn(),
      publish: jest.fn(),
      removeAllListeners: jest.fn(),
      newScopedBus: jest.fn(),
    } as any,
    onOptionsChange: jest.fn(),
    onFieldConfigChange: jest.fn(),
    replaceVariables: ((s: string) => s) as any,
    onChangeTimeRange: jest.fn(),
  };

  it('shows fallback message when no GeoJSON is configured', () => {
    render(<ChoroplethPanel {...defaultProps} />);
    expect(
      screen.getByText('No GeoJSON data configured. Use the panel editor to fetch GeoJSON from a URL.')
    ).toBeInTheDocument();
  });
});
