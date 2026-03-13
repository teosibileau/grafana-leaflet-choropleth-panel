import { PanelPlugin } from '@grafana/data';
import { ChoroplethOptions } from './types';
import { ChoroplethPanel } from './components/ChoroplethPanel';
import { GeoJsonEditor } from './components/GeoJsonEditor';
import { GeoJsonKeyEditor } from './components/GeoJsonKeyEditor';

export const plugin = new PanelPlugin<ChoroplethOptions>(ChoroplethPanel).setPanelOptions((builder) => {
  builder
    .addCustomEditor({
      id: 'geoJsonData',
      path: 'geoJsonData',
      name: 'GeoJSON Data',
      description: 'Stored GeoJSON for the choropleth layer',
      editor: GeoJsonEditor,
      defaultValue: null,
    })
    .addColorPicker({
      path: 'hotColor',
      name: 'Hot Color',
      description: 'Color for maximum values',
      defaultValue: '#ff0000',
    })
    .addColorPicker({
      path: 'coldColor',
      name: 'Cold Color',
      description: 'Color for minimum values',
      defaultValue: '#0000ff',
    })
    .addCustomEditor({
      id: 'geoJsonKey',
      path: 'geoJsonKey',
      name: 'GeoJSON Key',
      description: 'GeoJSON feature property name used to match metric series',
      editor: GeoJsonKeyEditor,
      defaultValue: '',
    })
    .addBooleanSwitch({
      path: 'autoFitBounds',
      name: 'Auto Fit Bounds',
      description: 'Automatically fit the map to visible features when data refreshes',
      defaultValue: true,
    })
    .addColorPicker({
      path: 'strokeColor',
      name: 'Stroke Color',
      description: 'Border color of polygons',
      defaultValue: '#ffffff',
    })
    .addSliderInput({
      path: 'strokeWidth',
      name: 'Stroke Width',
      description: 'Border width of polygons',
      defaultValue: 1,
      settings: { min: 0, max: 10, step: 0.5 },
    })
    .addSliderInput({
      path: 'fillOpacity',
      name: 'Fill Opacity',
      description: 'Opacity of polygon fill',
      defaultValue: 0.5,
      settings: { min: 0, max: 1, step: 0.05 },
    });
});
