# Changelog

## 2.0.0

- Complete rewrite from Angular/Grunt to React/TypeScript targeting Grafana >= 10.0.0
- Replaced jQuery AJAX with native fetch API
- Replaced Angular editor template with `setPanelOptions` builder
- Updated tile URL to current CARTO CDN
- Replaced `leaflet-map-zoomToGeometries` with native `map.fitBounds()`
