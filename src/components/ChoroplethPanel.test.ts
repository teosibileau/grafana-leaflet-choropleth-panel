import { FieldType, toDataFrame } from '@grafana/data';
import { mapDataToFeatures } from './ChoroplethPanel';
import type { FeatureCollection } from 'geojson';

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
        name: 'metric{host=region-a}',
        fields: [
          { name: 'time', type: FieldType.time, values: [1000] },
          { name: 'value', type: FieldType.number, values: [42] },
        ],
      }),
      toDataFrame({
        name: 'metric{host=region-c}',
        fields: [
          { name: 'time', type: FieldType.time, values: [1000] },
          { name: 'value', type: FieldType.number, values: [99] },
        ],
      }),
    ];

    const result = mapDataToFeatures(series, geojson, 'name', 'host');

    expect(result.features[0].properties!.choropleth).toBe(42);
    expect(result.features[1].properties!.choropleth).toBe(0);
    expect(result.features[2].properties!.choropleth).toBe(99);
  });

  it('returns zeroed features when geoJsonKey is empty', () => {
    const geojson = makeGeoJSON(['region-a']);
    const series = [
      toDataFrame({
        name: 'metric{host=region-a}',
        fields: [
          { name: 'time', type: FieldType.time, values: [1000] },
          { name: 'value', type: FieldType.number, values: [42] },
        ],
      }),
    ];

    const result = mapDataToFeatures(series, geojson, '', 'host');
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

    const result = mapDataToFeatures(series, geojson, 'name', 'host');
    expect(result.features[0].properties!.choropleth).toBe(0);
  });

  it('filters by dataSourceTag', () => {
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

    const result = mapDataToFeatures(series, geojson, 'name', 'host');
    expect(result.features[0].properties!.choropleth).toBe(0);
  });
});
