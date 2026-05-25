import { DownOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import { Button, Card, Col, Dropdown, Row, Space } from 'antd';
import dynamic from 'next/dynamic';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { useEffect, useState } from 'react';

import type { Region } from '@/types/region/Region';
import type { UrfData, Well } from '@/types/well/WellExplorer';
import {
  wellPropertyDropdownItems,
  wellPropertyDropdownLabels,
} from '@/utils/constants';

import CustomSlider from '../custom/CustomSlider/CustomSlider';
import { HBox } from '../custom/HBox/Hbox';
import { StandardText } from '../custom/StandardText/StandardText';

const WellsAndUrfData = dynamic(
  () => import('@/components/maps/WellsAndUrfData'),
  {
    ssr: false,
  },
);

export interface MapProps {
  mapEditing: boolean;
  allWells: Well[];
  allWellsLoading: boolean;
  getWellsByAgeThres: (agethres: number, por: number) => void;
  form: FormInstance<any>;
  porosity: number;
  setPorosity: Dispatch<SetStateAction<number>>;
  setEid: Dispatch<SetStateAction<number | null>>;
  urfData: UrfData[];
  mapRef: MutableRefObject<null>;
  mapFiltersRef: MutableRefObject<null>;
}

export default function WellExplorerMap({
  mapEditing,
  allWells,
  allWellsLoading,
  getWellsByAgeThres,
  form,
  porosity,
  setPorosity,
  setEid,
  urfData,
  mapRef,
  mapFiltersRef,
}: MapProps) {
  const [displayData, setDisplayData] = useState<Well[]>([]);

  // value of age thres slider
  const [ageThres, setAgeThres] = useState(0);

  // wells map color-coding selected from well property dropdown
  const [wellProperty, setWellProperty] = useState<
    'depth' | 'unsat' | 'slmod' | 'wt2t' | 'pumping'
  >('depth');

  // menu props for well property dropdown in Results section
  const menuProps = {
    items: wellPropertyDropdownItems,
    onClick: (e) => {
      setWellProperty(e.key);
    },
  };

  // set display data (wells shown on the map) based on filters in Results section
  useEffect(() => {
    async function updateDisplayWells() {
      if (ageThres === 0) {
        setDisplayData(allWells);
      } else {
        setDisplayData((await getWellsByAgeThres(ageThres, porosity)) ?? []);
      }
    }

    if (!allWellsLoading) {
      updateDisplayWells();
    }
  }, [allWells, ageThres, porosity]);

  return (
    <Card>
      <Row gutter={[24, 8]} style={{ width: '100%', justifySelf: 'center' }}>
        <Col span={12} style={{ padding: 0 }} ref={mapRef}>
          <StandardText variant="h4" style={{ marginTop: 0 }}>
            Select Region(s) From Map
          </StandardText>
          <div style={{ width: '100%' }}>
            <WellsAndUrfData
              onSelectRegions={(selectedRegions: Region[]) => {
                if (selectedRegions.length > 0)
                  form.setFields([
                    { name: 'select_regions', errors: undefined },
                  ]);
                form.setFieldValue('regions', selectedRegions);
              }}
              wellProperty={wellProperty}
              wells={displayData}
              onSelectWell={setEid}
              urfData={urfData}
              disableRegionSelection={!mapEditing}
            />
          </div>
        </Col>

        <Col
          span={12}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Card style={{ width: '100%' }} title="Results" ref={mapFiltersRef}>
            <Card.Grid
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                paddingTop: 10,
              }}
            >
              <StandardText variant="h5">Display Settings</StandardText>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  padding: 0,
                }}
              >
                <p style={{ width: 250, paddingRight: 20 }}>Color wells by:</p>
                <Dropdown menu={menuProps}>
                  <Button>
                    {wellPropertyDropdownLabels[wellProperty]}
                    <Space>
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </div>
            </Card.Grid>
            <Card.Grid
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                paddingTop: 10,
              }}
            >
              <HBox>
                <StandardText variant="h5">Filter By Age Fraction</StandardText>
                <div>
                  Displaying {displayData.length ?? allWells.length} of{' '}
                  {allWells.length} fetched Wells
                </div>
              </HBox>

              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <p style={{ width: 250, paddingRight: 20 }}>
                  Minimum Age Threshold [years]:
                </p>
                <CustomSlider
                  value={ageThres}
                  onAfterChange={async (val) => {
                    setAgeThres(val);
                  }}
                />
              </div>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <p style={{ width: 250, paddingRight: 20 }}>Porosity:</p>
                <CustomSlider
                  value={porosity}
                  onAfterChange={async (val) => {
                    setPorosity(val);
                  }}
                  maxValue={0.9}
                />
              </div>
            </Card.Grid>
          </Card>
        </Col>
      </Row>
    </Card>
  );
}
