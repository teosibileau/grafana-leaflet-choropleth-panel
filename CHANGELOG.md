# Changelog

## 1.0.0

### Breaking Changes

- Complete rewrite from Angular/Grunt/Bower to React/TypeScript/Webpack — Grafana >= 10.0.0 required

### Features

- GeoJSON stored in panel options (no runtime fetch) — `10761a7`
- GeoJSON Key editor scans features to populate dropdown — `e6f63c1`
- Leaflet tooltips on drawn geometries — `f520e9c`
- Auto Fit Bounds toggle — `34f1e0e`
- Stroke width, stroke color, fill opacity options — `ac980b8`
- Support for Grafana named colors (e.g. `light-blue`) — `d7e1313`

### Infrastructure / Dev Environment

- Docker Compose dev environment: Grafana + InfluxDB with seed data — `20021ea`, `733411c`
- Livereload injection for automatic browser refresh — `244f2e9`
- Grafana provisioning (datasources + dashboard) — `7d7cb8a`, `612f8d5`
- Migrated from npm to pnpm — `6dd3f41`
- Migrated Travis CI to GitHub Actions (build + test + plugin-check) — `90fecfe`, `7b7150f`
- Release workflow with Grafana plugin validator — `80a5955`
- Docker Compose + provisioning + seed data included in release zip
- Screenshot in README with absolute URL for plugin catalog

### Internal

- Replaced jQuery AJAX with native fetch API
- Replaced Angular editor template with `setPanelOptions` builder
- Updated tile URL to current CARTO CDN
- Replaced `leaflet-map-zoomToGeometries` with native `map.fitBounds()`
- Migrated `@grafana/ui` Select to Combobox — `f2f2d11`
- Consolidated GeoJSON key filtering logic — `c6f52d7`
- Test coverage expanded — `b80bf5f`
