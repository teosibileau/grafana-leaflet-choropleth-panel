import React from 'react';
import { render, screen } from '@testing-library/react';
import { GeoJsonKeyEditor } from '../src/components/GeoJsonKeyEditor';
import type { FeatureCollection } from 'geojson';
import type { ChoroplethOptions } from '../src/types';

const geoJson: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { name: 'a', code: '001' }, geometry: { type: 'Point', coordinates: [0, 0] } },
    { type: 'Feature', properties: { name: 'b', region: 'west' }, geometry: { type: 'Point', coordinates: [1, 1] } },
  ],
};

function makeProps(overrides: { value?: string; geoJsonData?: FeatureCollection | null } = {}) {
  return {
    value: overrides.value ?? '',
    onChange: jest.fn(),
    item: {} as any,
    id: 'test',
    context: {
      options: {
        geoJsonData: overrides.geoJsonData ?? null,
      } as ChoroplethOptions,
    } as any,
  };
}

describe('GeoJsonKeyEditor', () => {
  it('shows placeholder when no GeoJSON is loaded', () => {
    render(<GeoJsonKeyEditor {...makeProps()} />);
    expect(screen.getByPlaceholderText('Load GeoJSON first')).toBeInTheDocument();
  });

  it('shows select placeholder when GeoJSON is loaded', () => {
    render(<GeoJsonKeyEditor {...makeProps({ geoJsonData: geoJson })} />);
    expect(screen.getByPlaceholderText('Select a property key')).toBeInTheDocument();
  });
});
