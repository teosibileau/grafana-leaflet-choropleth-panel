import React, { useState } from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Button, Input, TextArea, Field, Alert } from '@grafana/ui';
import type { FeatureCollection } from 'geojson';

type Props = StandardEditorProps<FeatureCollection | null>;

export const GeoJsonEditor: React.FC<Props> = ({ value, onChange }) => {
  const [url, setUrl] = useState('');
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFetch = async () => {
    if (!url) {
      return;
    }
    setFetching(true);
    setMessage(null);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      if (data.type !== 'FeatureCollection') {
        throw new Error('Response is not a valid GeoJSON FeatureCollection');
      }
      onChange(data);
      setMessage({ type: 'success', text: `Loaded ${data.features?.length ?? 0} features` });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : String(err) });
    } finally {
      setFetching(false);
    }
  };

  const handleClear = () => {
    onChange(null as unknown as FeatureCollection);
    setMessage(null);
  };

  return (
    <div>
      <Field label="Fetch from URL">
        <div style={{ display: 'flex', gap: 8 }}>
          <Input
            value={url}
            onChange={(e) => setUrl(e.currentTarget.value)}
            placeholder="https://example.com/data.geojson"
          />
          <Button onClick={handleFetch} disabled={fetching || !url} size="md">
            {fetching ? 'Fetching...' : 'Fetch'}
          </Button>
        </div>
      </Field>

      {message && (
        <Alert title={message.type === 'success' ? 'Success' : 'Error'} severity={message.type}>
          {message.text}
        </Alert>
      )}

      {value && (
        <>
          <Field label="Stored GeoJSON preview">
            <TextArea
              value={JSON.stringify(value, null, 2)}
              rows={10}
              readOnly
              style={{ fontFamily: 'monospace', fontSize: 11 }}
            />
          </Field>
          <Button variant="destructive" onClick={handleClear} size="sm">
            Clear GeoJSON
          </Button>
        </>
      )}
    </div>
  );
};
