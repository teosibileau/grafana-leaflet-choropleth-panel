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
    .addSliderInput({
      path: 'initialZoom',
      name: 'Initial Zoom',
      description: 'Initial map zoom level',
      defaultValue: 1,
      settings: {
        min: 1,
        max: 18,
        step: 1,
      },
    });
});
