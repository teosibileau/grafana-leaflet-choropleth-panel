import { PanelPlugin } from '@grafana/data';
import { ChoroplethOptions } from './types';
import { ChoroplethPanel } from './components/ChoroplethPanel';

export const plugin = new PanelPlugin<ChoroplethOptions>(ChoroplethPanel).setPanelOptions((builder) => {
  builder
    .addTextInput({
      path: 'endpoint',
      name: 'GeoJSON Endpoint',
      description: 'URL to fetch GeoJSON data from',
      defaultValue: '',
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
    .addTextInput({
      path: 'geoJsonKey',
      name: 'GeoJSON Key',
      description: 'GeoJSON feature property name used to match metric series',
      defaultValue: '',
    })
    .addTextInput({
      path: 'dataSourceTag',
      name: 'Data Source Tag',
      description: 'Tag name to filter metric series',
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
