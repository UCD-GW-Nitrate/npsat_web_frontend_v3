'use client';

import { Select, Tabs } from 'antd';

import type { Geometry, Region } from '@/types/region/Region';
import WellsMap from './WellsMap';
import { UrfData, Well } from '@/types/well/WellExplorer';
import { REGION_MACROS } from '@/utils/constants';
import { useFetchB118BasinQuery, useFetchBasinQuery, useFetchCentralValleyQuery, useFetchCountyQuery, useFetchSubregionsQuery, useFetchTownshipQuery } from '@/store';
import { useState } from 'react';
import { CircleMarker, LayerGroup } from 'react-leaflet';

const { Option } = Select;

export interface WellsAndUrfDataProps {
  onSelectRegion: (regions: Region[]) => void;
  wells: Well[];
  wellProperty: 'depth' | 'wt2t' | 'unsat' | 'slmod';
  onSelectWell: (eid: number) => void;
  urfData: UrfData[];
  disableRegionSelection?: boolean;
  lastSelectedRegions?: number[];
}

export const WellsAndUrfData = ({ 
  onSelectRegion, 
  wells, 
  wellProperty, 
  onSelectWell, 
  urfData, 
  disableRegionSelection, 
  lastSelectedRegions 
}: WellsAndUrfDataProps) => {
  const [mapType, setMapType] = useState<number>(REGION_MACROS.CENTRAL_VALLEY);
  const [selected, setSelected] = useState<number[]>([]);

  // fetch all map beforehand
  const { data: b118BasinData } = useFetchB118BasinQuery();
  const { data: basinData } = useFetchBasinQuery();
  const { data: centralValleyData } = useFetchCentralValleyQuery();
  const { data: countyData } = useFetchCountyQuery();
  const { data: subregionsData } = useFetchSubregionsQuery();
  const { data: townshipData } = useFetchTownshipQuery();

  const getMap = (): Region[] | undefined => {
    if (mapType === 0) return centralValleyData;
    if (mapType === 3) return b118BasinData;
    if (mapType === 5) return subregionsData;
    if (mapType === 2) return countyData;
    if (mapType === 1) return basinData;
    if (mapType === 4) return townshipData;
    return [];
  };

  const handleTabChange = (tab: string) => {
    setSelected([]);
    onSelectRegion([]);
    setMapType(parseInt(tab, 10));
  };

  const configureData = (region: Region): Geometry => {
    const { geometry } = region;
    return {
      ...geometry,
      properties: { ...geometry.properties, id: region.id, name: region.name },
    };
  };

  const onListSelect = (v: number) => {
    const selectedIds = [...selected, v];
    onListChange(selectedIds);
  };

  const onListChange = (selectedIds: number[]) => {
    setSelected(selectedIds);
    let regions = selectedIds.map((id: number) => {
        return getMap()?.find(region => region.id == id) ?? false;
      }).filter((item): item is Region => !!item)
    onSelectRegion(regions);
  };

  return (
    <>
      <Tabs
        tabPosition="top"
        centered
        activeKey={`${mapType}`}
        onChange={handleTabChange}
        items={[
          {
            label: 'Central Valley',
            key: `${REGION_MACROS.CENTRAL_VALLEY}`,
          },
          {
            label: 'Basin',
            key: `${REGION_MACROS.SUB_BASIN}`,
          },
          {
            label: 'County',
            key: `${REGION_MACROS.COUNTY}`,
          },
          {
            label: 'B118 Basin',
            key: `${REGION_MACROS.B118_BASIN}`,
          },
          {
            label: 'Subregions',
            key: `${REGION_MACROS.CVHM_FARM}`,
          },
          {
            label: 'Township',
            key: `${REGION_MACROS.TOWNSHIPS}`,
          },
        ]}
      />

      <Select
        showSearch
        placeholder={[]}
        optionFilterProp="children"
        value={selected}
        onSelect={onListSelect}
        onChange={onListChange}
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        disabled={disableRegionSelection}
      >
        {getMap()?.map((region) => (
          <Option value={region.id} key={region.id}>
            {region.name}
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
        <WellsMap
          wells={wells}
          wellProperty={wellProperty}
          onSelectWell={onSelectWell}
          selectedRegions={selected}
          path={getMap()?.map((region: Region) => configureData(region)) ?? []}
          regionsEditable={!disableRegionSelection}
          onEachFeature={disableRegionSelection ? 
            (feature: Geometry, layer: any) => {layer.off()} 
            : 
            (feature: Geometry, layer: any) => {
              layer.on({
                click: () => { // toggle selection
                  let selectedRegions = selected;
                  if (selectedRegions.indexOf(feature.properties.id) === -1) {
                    selectedRegions = [...selectedRegions, feature.properties.id];
                  } else { // deselect
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

                  setSelected(selectedRegions);
                  let regions = selectedRegions.map((id: number) => {
                    return getMap()?.find(region => region.id == id) ?? false;
                  }).filter((item): item is Region => !!item)
                  onSelectRegion(regions);
                },
              });
              layer.bindTooltip(feature.properties.name);
            }
          }
        >
          <LayerGroup>
            {urfData.map((reactionPoint, index) => (
                <CircleMarker
                  key={`reactionPoint${index}`}
                  center={[reactionPoint.lat, reactionPoint.lon]}
                  pathOptions={{
                    color: 'yellow',
                    fillColor: 'yellow',
                    fillOpacity: 1,
                  }}
                  radius={5}
                />
              ))
            }
          </LayerGroup>
        </WellsMap>
      </div>
    </>
  );
};
