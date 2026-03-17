import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GeoJsonEditor } from '../src/components/GeoJsonEditor';
import type { FeatureCollection } from 'geojson';

// Minimal mock for StandardEditorProps shape
function makeProps(overrides: Partial<{ value: FeatureCollection | null; onChange: jest.Mock }> = {}) {
  return {
    value: overrides.value ?? null,
    onChange: overrides.onChange ?? jest.fn(),
    item: {} as any,
    context: {} as any,
    id: 'test',
  };
}

const validGeoJson: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { name: 'a' }, geometry: { type: 'Point', coordinates: [0, 0] } },
    { type: 'Feature', properties: { name: 'b' }, geometry: { type: 'Point', coordinates: [1, 1] } },
  ],
};

let fetchMock: jest.Mock;

beforeEach(() => {
  fetchMock = jest.fn();
  global.fetch = fetchMock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('GeoJsonEditor', () => {
  it('renders the URL input and Fetch button', () => {
    render(<GeoJsonEditor {...makeProps()} />);
    expect(screen.getByPlaceholderText('https://example.com/data.geojson')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Fetch' })).toBeInTheDocument();
  });

  it('disables Fetch button when URL is empty', () => {
    render(<GeoJsonEditor {...makeProps()} />);
    expect(screen.getByRole('button', { name: 'Fetch' })).toBeDisabled();
  });

  it('fetches GeoJSON and calls onChange on success', async () => {
    const onChange = jest.fn();
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => validGeoJson,
    } as Response);

    render(<GeoJsonEditor {...makeProps({ onChange })} />);

    const input = screen.getByPlaceholderText('https://example.com/data.geojson');
    await userEvent.type(input, 'https://example.com/data.geojson');
    await userEvent.click(screen.getByRole('button', { name: 'Fetch' }));

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(validGeoJson);
    });
    expect(screen.getByText('Loaded 2 features')).toBeInTheDocument();
  });

  it('shows error on HTTP failure', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({}),
    } as Response);

    render(<GeoJsonEditor {...makeProps()} />);

    await userEvent.type(screen.getByPlaceholderText('https://example.com/data.geojson'), 'https://bad.url');
    await userEvent.click(screen.getByRole('button', { name: 'Fetch' }));

    await waitFor(() => {
      expect(screen.getByText('HTTP 404: Not Found')).toBeInTheDocument();
    });
  });

  it('shows error when response is not a FeatureCollection', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ type: 'Feature', properties: {} }),
    } as Response);

    render(<GeoJsonEditor {...makeProps()} />);

    await userEvent.type(screen.getByPlaceholderText('https://example.com/data.geojson'), 'https://example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Fetch' }));

    await waitFor(() => {
      expect(screen.getByText('Response is not a valid GeoJSON FeatureCollection')).toBeInTheDocument();
    });
  });

  it('shows preview and Clear button when value is set', () => {
    render(<GeoJsonEditor {...makeProps({ value: validGeoJson })} />);
    expect(screen.getByRole('button', { name: 'Clear GeoJSON' })).toBeInTheDocument();
    // Preview textarea contains the JSON
    expect(screen.getByDisplayValue(/"FeatureCollection"/)).toBeInTheDocument();
  });

  it('clears GeoJSON when Clear button is clicked', async () => {
    const onChange = jest.fn();
    render(<GeoJsonEditor {...makeProps({ value: validGeoJson, onChange })} />);

    await userEvent.click(screen.getByRole('button', { name: 'Clear GeoJSON' }));
    expect(onChange).toHaveBeenCalledWith(null);
  });
});
