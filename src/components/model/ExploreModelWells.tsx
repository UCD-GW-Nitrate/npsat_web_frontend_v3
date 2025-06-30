import type { Region } from '@/types/region/Region';
import { Button, Col, Dropdown, InputNumber, MenuProps, Row, Slider, Space } from 'antd';
import Histogram from '../charts/Histogram/Histogram';
import { ModelRun } from '@/types/model/ModelRun';
import { useEffect, useMemo, useState } from 'react';
import { WELLS_REGION_BINS } from '@/utils/constants';
import { Well } from '@/types/well/Well';
import { fetchAllWells } from '@/store/apis/wellApi';
import { DownOutlined } from '@ant-design/icons';
import { InputNumberProps } from 'antd/lib';
import dynamic from 'next/dynamic';

const WellsMap = dynamic(() => import('../maps/WellsMap'), {
  ssr: false,
});

export interface MapProps {
  regions: Region[];
  customModelDetail: ModelRun;
}

// eslint-disable-next-line no-empty-pattern
const ExploreModelWells = ({ regions, customModelDetail }: MapProps) => {
  const flow = customModelDetail.flow_scenario.name.includes("C2VSIM") ? 0 : 1;
  const scen = customModelDetail.flow_scenario.name.includes("Pumping") ? 0 : 1;
  const wType = customModelDetail.welltype_scenario.name.includes("Irrigation") ? 0 : 1;
  const porosity = customModelDetail.porosity;
  const [wellProperty, setWellProperty] = useState('depth');
  const [ageThres, setAgeThres] = useState(0)
  const [wellLevel, setWellLevel] = useState(0);
  const [selectedEid, setSelectedEid] = useState<null | number>(null);

  const params = useMemo(
    () => {
      // params will define the regions to filter by, and empty params defaults to include all wells
      let params = {
        flow_model: flow==0 ? "C2VSim" : "CVHM2",
        rch_type: scen==0 ? "Padj" : "Radj",
        well_type: wType==0 ? "VI" : "VD",
      }
      if (!regions) return params
      
      const region_type = regions[0]?.region_type
      const region_bin = WELLS_REGION_BINS[region_type ? region_type : 0]
      
      if (region_bin) {
        (params as any)[region_bin] = regions.map((region) => region.mantis_id)
      }

      return params
    },
    [regions]
  );

  const [allWells, setAllWells] = useState<null | Well[]>(null)

  useEffect(()=>{
    async function getWells() {
      setAllWells(await fetchAllWells(params));
    }

    if (regions && regions[0]?.region_type) getWells()
  }, [regions])

  const wells = useMemo(
    () => {
      if (!allWells) { return [] as Well[] }
      return allWells
    },
    [allWells]
  );

  const histData = (wellProperty: 'depth' | 'unsat' | 'slmod' | 'wt2t', title: string, binSize: number) => {
    const allVals = allWells?.map((well: Well) => well[wellProperty]);
    if (!allVals) return []
    const minVal = Math.min(0)
    const maxVal = Math.max(...allVals)
    const numBins = Math.ceil((maxVal - minVal) / binSize);
    const count = new Array(numBins+1).fill(0);
    allVals?.forEach(val => {
      const binIndex = Math.floor(val / binSize);
      count[binIndex] += 1;
    })
    const data = [];
    for (let i = 0; i < numBins+1; i++) {
      const binCenter = minVal + i * binSize + binSize / 2;
      data.push({x: binCenter, y: count[i] / allVals.length});
    }
    return ([
      {
        name: title,
        data: data
      }]
    )
  }

  const depthChart = histData("depth", "Percentage of Wells", 50)
  const unsatChart = histData("unsat", "Percentage of Wells", 10)
  const slChart = histData("slmod", "Percentage of Wells", 30)
  const wt2tChart = histData("wt2t", "Percentage of Wells", 30)
  
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    console.log('click', e);
    setWellProperty(e.key)
  };

  const items: MenuProps['items'] = [
    {
      label: 'Depth',
      key: 'depth',
    },
    {
      label: 'Unsat',
      key: 'unsat',
    },
    {
      label: 'WT2T',
      key: 'wt2t',
    },
    {
      label: 'SL',
      key: 'slmod',
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const onChange: InputNumberProps['onChange'] = (newValue) => {
    setAgeThres(newValue as number);
  };

  return (
    <Row gutter={[24, 16]}>
      <Col span={12}>
        <div style={{width: '100%', height: 500}}>
          <WellsMap
            key={'Map_'+wells.length}
            path={regions.map((region: Region) => region.geometry)}
            wellProperty={wellProperty}
            wells={wells}
            setEid={setSelectedEid}
          />
        </div>
        <Dropdown menu={menuProps}>
          <Button>
            <Space>
              Well Property: {wellProperty}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>

        <Row>
          <Col span={12}>
            <Slider
              min={0}
              max={1000}
              onChange={onChange}
              value={typeof ageThres === 'number' ? ageThres : 0}
            />
          </Col>
          <Col span={4}>
            <InputNumber
              min={1}
              max={20}
              style={{ margin: '0 16px' }}
              value={ageThres}
              onChange={onChange}
            />
          </Col>
        </Row>
      </Col>
      <Col span={12}>
        <Histogram data={depthChart} xTitle='Depth [m]' yTitle='%' />
      </Col>

      <Col span={12}>
        <Histogram data={unsatChart} xTitle='Unsaturated depth [m]' yTitle='%' />
      </Col>
      <Col span={12}>
        <Histogram data={slChart} xTitle='Screen length [m]' yTitle='%' />
      </Col>

      <Col span={12}>
        <Histogram data={wt2tChart} xTitle='Water table to top [m]' yTitle='%' />
      </Col>
    </Row>
  );
};

export default ExploreModelWells;
