import { Select } from 'antd';
import type { GeoJsonObject } from 'geojson';
import type { Layer } from 'leaflet';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';

import type { GeometryResponse, ResultResponse } from '@/store/apis/regionApi';

const { Option } = Select;

export interface FormMapProps {
  data: ResultResponse[];
  selected: number[];
  onSelectRegion?: (input: number[]) => void;
}

export const FormMap = ({ data, onSelectRegion, selected }: FormMapProps) => {
  const configureData = (county: ResultResponse): GeometryResponse => {
    const { geometry } = county;
    return {
      ...geometry,
      properties: { ...geometry.properties, id: county.id, name: county.name },
    };
  };

  const onListSelect = (v: number) => {
    if (onSelectRegion) {
      onSelectRegion([...selected, v]);
    }
  };

  return (
    <>
      <Select
        showSearch
        placeholder={[]}
        optionFilterProp="children"
        value={selected}
        onSelect={onListSelect}
        onChange={onSelectRegion}
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
      >
        {data.map((county) => (
          <Option value={county.id} key={county.id}>
            {county.name}
          </Option>
        ))}
      </Select>
      <div
        style={{
          height: '600px',
          width: '100%',
          marginTop: 20,
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
        <MapContainer center={[37.58, -119.4179]} zoom={6}>
          <GeoJSON
            key={data.length + (selected?.length ?? 0)}
            data={
              (data.map((region) => configureData(region)) ??
                []) as unknown as GeoJsonObject
            }
            onEachFeature={(feature: any, layer: Layer) => {
              layer.on({
                click: () => {
                  let selectedRegions = selected;
                  if (selectedRegions.indexOf(feature.properties.id) === -1) {
                    selectedRegions = [
                      ...selectedRegions,
                      feature.properties.id,
                    ];
                  } else {
                    selectedRegions = [
                      ...selectedRegions.slice(
                        0,
                        selectedRegions.indexOf(feature.properties.id),
                      ),
                      ...selectedRegions.slice(
                        selectedRegions.indexOf(feature.properties.id) + 1,
                      ),
                    ];
                  }
                  if (onSelectRegion) {
                    onSelectRegion(selectedRegions);
                  }
                },
              });
              layer.bindTooltip(feature.properties.name);
            }}
            style={(feature) =>
              // eslint-disable-next-line no-nested-ternary
              selected !== undefined
                ? selected?.indexOf(feature?.properties.id) !== -1
                  ? {
                      color: 'red',
                    }
                  : {
                      color: 'blue',
                    }
                : { color: 'blue' }
            }
          />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </MapContainer>
      </div>
    </>
  );
};
