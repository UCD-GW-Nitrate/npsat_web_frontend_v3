'use client';

import { Select, Tabs } from 'antd';
import { useState } from 'react';
import { CircleMarker, LayerGroup } from 'react-leaflet';

import {
  useFetchB118BasinQuery,
  useFetchBasinQuery,
  useFetchCentralValleyQuery,
  useFetchCountyQuery,
  useFetchSubregionsQuery,
  useFetchTownshipQuery,
} from '@/store';
import type { Geometry, Region } from '@/types/region/Region';
import type { UrfData, Well } from '@/types/well/WellExplorer';
import { mapTabs, REGION_MACROS } from '@/utils/constants';

import WellsMap from './WellsMap';

const { Option } = Select;

export interface WellsAndUrfDataProps {
  onSelectRegions: (regions: Region[]) => void;
  wells: Well[];
  wellProperty: 'depth' | 'wt2t' | 'unsat' | 'slmod';
  onSelectWell: (eid: number) => void;
  urfData: UrfData[];
  // in Explore Wells parent, is mapEditing on or off
  disableRegionSelection?: boolean;
  // if mapEditing is canceled, return to prev selectedRegions
  lastSelectedRegions?: number[];
}

export const WellsAndUrfData = ({
  onSelectRegions,
  wells,
  wellProperty,
  onSelectWell,
  urfData,
  disableRegionSelection,
  lastSelectedRegions,
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

  // return map to render based on tab selection
  const getMap = (): Region[] | undefined => {
    switch (mapType) {
      case REGION_MACROS.CENTRAL_VALLEY: // central valley
        return centralValleyData;
      case REGION_MACROS.SUB_BASIN: // basin
        return basinData;
      case REGION_MACROS.CVHM_FARM: // subRegion
        return subregionsData;
      case REGION_MACROS.B118_BASIN: // B118 Basin
        return b118BasinData;
      case REGION_MACROS.COUNTY: // county
        return countyData;
      case REGION_MACROS.TOWNSHIPS: // Township
        return townshipData;
      default:
        return [];
    }
  };

  // isolate just the Geometry of a region,
  // add additional properties to be able to use in onEachFeature func
  const configureData = (region: Region): Geometry => {
    const { geometry } = region;
    return {
      ...geometry,
      properties: { ...geometry.properties, id: region.id, name: region.name },
    };
  };

  const handleTabChange = (tab: string) => {
    // reset region selections, since different mapTypes have regions with the same id
    setSelected([]);
    onSelectRegions([]);

    setMapType(parseInt(tab, 10));
  };

  // handle change to the dropdown list
  const onListChange = (selectedIds: number[]) => {
    setSelected(selectedIds);

    const regions = selectedIds
      .map((id: number) => {
        return getMap()?.find((region) => region.id === id) ?? false;
      })
      .filter((item): item is Region => !!item);

    onSelectRegions(regions);
  };

  // handle change to the dropdown list, particurlarly insertions
  const onListSelect = (v: number) => {
    const selectedIds = [...selected, v];
    onListChange(selectedIds);
  };

  return (
    <>
      <Tabs
        tabPosition="top"
        centered
        activeKey={`${mapType}`}
        onChange={handleTabChange}
        items={mapTabs}
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
          height: '500px',
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
          onEachFeature={
            disableRegionSelection
              ? (_, layer: any) => {
                  layer.off();
                }
              : (feature: Geometry, layer: any) => {
                  layer.on({
                    click: () => {
                      // toggle selection (if a region is not in selectedRegions, add it, else remove it)
                      let selectedRegions = selected;
                      if (
                        selectedRegions.indexOf(feature.properties.id) === -1
                      ) {
                        selectedRegions = [
                          ...selectedRegions,
                          feature.properties.id,
                        ];
                      } else {
                        // deselect
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

                      // update Regions dropdown
                      setSelected(selectedRegions);

                      // update parent, through onSelectRegions function
                      const regions = selectedRegions
                        .map((id: number) => {
                          return (
                            getMap()?.find((region) => region.id === id) ??
                            false
                          );
                        })
                        .filter((item): item is Region => !!item);
                      onSelectRegions(regions);
                    },
                  });
                  layer.bindTooltip(feature.properties.name);
                }
          }
        >
          <LayerGroup>
            {urfData.map((reactionPoint) => (
              <CircleMarker
                key={reactionPoint.sid}
                center={[reactionPoint.lat, reactionPoint.lon]}
                pathOptions={{
                  color: 'yellow',
                  fillColor: 'yellow',
                  fillOpacity: 1,
                }}
                radius={5}
              />
            ))}
          </LayerGroup>
        </WellsMap>
      </div>
    </>
  );
};

export default WellsAndUrfData;
