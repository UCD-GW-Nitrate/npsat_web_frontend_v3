'use client';

import { Button, Radio, Select, Tabs } from 'antd';
import type { RadioChangeEvent } from 'antd/lib';
import { useEffect, useState } from 'react';
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

import AccessibleWellsAndUrfData from './WellsAndUrfData.a11y';
import WellsMap from './WellsMap';

const { Option } = Select;

const PersistOptions = ({
  setPersist,
  onClearPress,
}: {
  setPersist: (val: boolean) => void;
  onClearPress: () => void;
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [value, setValue] = useState(1);

  function onChange(e: RadioChangeEvent) {
    setValue(e.target.value);
    if (e.target.value === 1) {
      setPersist(false);
    } else {
      setPersist(true);
    }
  }

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)',
          fontSize: '12px',
        }}
        onMouseEnter={() => setShowOptions(true)}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          Streampoints Display Mode
        </div>
      </div>
      {showOptions && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            fontSize: '12px',
            display: 'flex',
            flexDirection: 'column',
          }}
          onMouseLeave={() => setShowOptions(false)}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            Streampoints Display Mode
          </div>
          <Radio.Group value={value} onChange={(e) => onChange(e)}>
            <Radio value={1} style={{ fontSize: '12px' }}>
              Only for selected well
            </Radio>
            <Radio value={2} style={{ fontSize: '12px' }}>
              Sticky
            </Radio>
          </Radio.Group>

          <Button
            size="small"
            style={{ alignSelf: 'flex-end', marginTop: 5 }}
            onClick={() => onClearPress()}
          >
            Clear Data
          </Button>
        </div>
      )}
    </div>
  );
};

export interface WellsAndUrfDataProps {
  onSelectRegions: (regions: Region[]) => void;
  wells: Well[];
  wellProperty: 'depth' | 'wt2t' | 'unsat' | 'slmod' | 'pumping';
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
  const accessible = true;

  const [mapType, setMapType] = useState<number>(REGION_MACROS.CENTRAL_VALLEY);
  const [selectedRegions, setSelectedRegions] = useState<number[]>([]);
  const [persistData, setPersistData] = useState(false);
  const [data, setData] = useState<UrfData[]>([]);

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
    setSelectedRegions([]);
    onSelectRegions([]);

    setMapType(parseInt(tab, 10));
  };

  // handle change to the dropdown list
  const onListChange = (selectedIds: number[]) => {
    setSelectedRegions(selectedIds);

    const regions = selectedIds
      .map((id: number) => {
        return getMap()?.find((region) => region.id === id) ?? false;
      })
      .filter((item): item is Region => !!item);

    onSelectRegions(regions);
  };

  // handle change to the dropdown list, particurlarly insertions
  const onListSelect = (v: number) => {
    const selectedIds = [...selectedRegions, v];
    onListChange(selectedIds);
  };

  useEffect(() => {
    if (persistData) {
      setData([...data, ...urfData]);
    } else {
      setData(urfData);
    }
  }, [urfData, persistData]);

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
        value={selectedRegions}
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
          selectedRegions={selectedRegions}
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
                      let newSelection = selectedRegions;
                      if (
                        selectedRegions.indexOf(feature.properties.id) === -1
                      ) {
                        newSelection = [
                          ...selectedRegions,
                          feature.properties.id,
                        ];
                      } else {
                        // deselect
                        newSelection = [
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
                      setSelectedRegions(newSelection);

                      // update parent, through onSelectRegions function
                      const regions = newSelection
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
          mapUI={
            <PersistOptions
              setPersist={setPersistData}
              onClearPress={() => {
                setData([]);
              }}
            />
          }
        >
          {!accessible && (
            <LayerGroup>
              {data.map((reactionPoint) => (
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
          )}
        </WellsMap>
      </div>

      {accessible && <AccessibleWellsAndUrfData urfData={urfData} />}
    </>
  );
};

export default WellsAndUrfData;
