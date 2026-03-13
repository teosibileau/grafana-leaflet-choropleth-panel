import React, { useMemo } from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Combobox } from '@grafana/ui';
import { ChoroplethOptions } from '../types';

type Props = StandardEditorProps<string, any, ChoroplethOptions>;

export const GeoJsonKeyEditor: React.FC<Props> = ({ value, onChange, context }) => {
  const options = useMemo(() => {
    const geoJson = context.options?.geoJsonData;
    if (!geoJson?.features?.length) {
      return [];
    }
    const keys = new Set<string>();
    for (const feature of geoJson.features) {
      if (feature.properties) {
        for (const key of Object.keys(feature.properties)) {
          keys.add(key);
        }
      }
    }
    return Array.from(keys)
      .sort()
      .map((k) => ({ label: k, value: k }));
  }, [context.options?.geoJsonData]);

  return (
    <Combobox
      options={options}
      value={value ?? null}
      onChange={(v) => onChange(v?.value ?? '')}
      placeholder={options.length ? 'Select a property key' : 'Load GeoJSON first'}
      isClearable
    />
  );
};
