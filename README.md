# Grafana Leaflet Choropleth Panel

Cross-reference time-series metric data with GeoJSON to display colored polygons on a Leaflet map.

## Requirements

- Grafana >= 10.0.0
- Node.js >= 22
- [Ahoy (optional)](https://github.com/ahoy-cli/ahoy)

## Getting started

```bash
npm install
npm run dev
```

In another terminal:

```bash
ahoy docker up
```

Then open http://localhost:3000 in your browser.

## Configuration

| Option           | Description                                       |
| ---------------- | ------------------------------------------------- |
| GeoJSON Endpoint | URL to fetch GeoJSON data from                    |
| Hot Color        | Color for maximum values                          |
| Cold Color       | Color for minimum values                          |
| GeoJSON Key      | Feature property name used to match metric series |
| Data Source Tag  | Tag name to filter metric series                  |
| Initial Zoom     | Initial map zoom level (1-18)                     |

## How it works

The plugin fetches GeoJSON from a configurable endpoint, matches Grafana metric series to features using a tag-based naming convention (`metric{tag=value}`), and colors polygons with a chroma-js quantile scale on a Leaflet map with CartoDB dark tiles.
