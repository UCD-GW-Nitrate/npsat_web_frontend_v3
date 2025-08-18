import type { Geometry, Region } from '@/types/region/Region';
import { Button, Card, Col, Dropdown, MenuProps, Row, Space } from 'antd';
import Histogram from '../charts/Histogram/Histogram';
import { ModelRun } from '@/types/model/ModelRun';
import { useMemo, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';
import CustomSlider from '../custom/CustomSlider/CustomSlider';
import BoxPlot from '../charts/BoxPlot/BoxPlot';
import { Well } from '@/types/well/WellExplorer';
import useModelWells from '@/hooks/useModelWells';

const WellsMap = dynamic(() => import('../maps/WellsMap'), {
  ssr: false,
});

export interface MapProps {
  regions: Region[];
  customModelDetail: ModelRun;
}

const dropdownItems = [
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

const dropdownLabels = Object.fromEntries(dropdownItems.map(item => [item.key, item.label]));

const ExploreModelWells = ({ regions, customModelDetail }: MapProps) => {
  const { allWells, loading, getWellsByAgeThres } = useModelWells({regions, customModelDetail});
  const [wellProperty, setWellProperty] = useState<'depth' | 'unsat' | 'slmod' | 'wt2t'>('depth');
  const [displayData, setDisplayData] = useState<null | Well[]>(null)

  const configureData = (region: Region): Geometry => {
    const { geometry } = region;
    return {
      ...geometry,
      properties: { ...geometry.properties, id: region.id, name: region.name },
    };
  };

  const histData = (wellProperty: 'depth' | 'unsat' | 'slmod' | 'wt2t', title: string) => {
    const allVals = allWells.map((well: Well) => well[wellProperty]);
    if (allVals.length == 0) return ([{ name: title, data: [], binSize: 0 }])
    const numBins = Math.ceil(Math.sqrt(allVals.length/10));
    const minVal = 0
    const maxVal = Math.max(...allVals)
    const binSize = Math.ceil((maxVal - minVal) / numBins);
    const count = new Array(numBins+1).fill(0);
    allVals?.forEach(val => {
      const binIndex = Math.floor(val / binSize);
      count[binIndex] += 1;
    })
    const data = [];
    for (let i = 0; i < numBins+1; i++) {
      const binCenter = minVal + i * binSize + binSize / 2;
      data.push({x: binCenter, y: count[i] / allVals.length * 100});
    }
    return ([
      {
        name: title,
        data: data,
        binSize: binSize,
      }]
    )
  }

  const depthChart = useMemo(() => histData("depth", "Percentage of Wells"), [allWells])
  const unsatChart = useMemo(() => histData("unsat", "Percentage of Wells"), [allWells])
  const slChart = useMemo(() => histData("slmod", "Percentage of Wells"), [allWells])
  const wt2tChart = useMemo(() => histData("wt2t", "Percentage of Wells"), [allWells])


  function getBoxPlotData(wellProperty: 'depth' | 'unsat' | 'slmod' | 'wt2t') {
    const values = allWells.map((well: Well) => well[wellProperty]);
    if (values.length === 0) return ([])

    const sorted = [...values].sort((a, b) => a - b);
    const median = getMedian(sorted)!.toFixed(2);;
    const q1 = getMedian(sorted.slice(0, Math.floor(sorted.length / 2)))!.toFixed(2);;
    const q3 = getMedian(sorted.slice(Math.ceil(sorted.length / 2)))!.toFixed(2);;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    return [min, q1, median, q3, max];
  }

  function getMedian(arr: number[]) {
    if (arr.length == 0) return 0;
    const mid = Math.floor(arr.length / 2);
    if (arr.length % 2 === 0) {
      return (arr[mid - 1] ?? 0 + arr[mid]!) / 2;
    } else {
      return arr[mid];
    }
  }

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    console.log('click', e);
    setWellProperty(e.key)
  };

  const menuProps = {
    items: dropdownItems,
    onClick: handleMenuClick,
  };

  return (
    <Row gutter={[24, 16]}>
      <Col span={12}>
        <div style={{width: '100%', height: 500}}>
          <WellsMap
            path={regions.map((region: Region) => configureData(region))}
            selectedRegions={regions.map((region: Region) => region.id)}
            wellProperty={wellProperty}
            wells={displayData ? displayData : allWells}
          />
        </div>
      </Col>
      <Col span={12}>
        <Card style={{ width: '100%' }}>
          <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
            <p style={{width: 250, paddingRight: 20}}>Colorcode by Well Property:</p>
            <Dropdown menu={menuProps}>
              <Button>
                {dropdownLabels[wellProperty]}
                <Space>
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </div>
          <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
            <p style={{width: 250, paddingRight: 20}}>Filter by Age Fraction:</p>
            <CustomSlider value={0} onAfterChange={async (val) => { setDisplayData(await getWellsByAgeThres(val)) }} />
          </div>
        </Card>
      </Col>

      <Col span={12}>
        <Histogram key={depthChart[0]?.binSize ?? 0} data={depthChart} xTitle='Depth [m]' yTitle='%' binSize={depthChart[0]?.binSize} />
      </Col>
      <Col span={12}>
        <Histogram key={unsatChart[0]?.binSize ?? 0} data={unsatChart} xTitle='Unsaturated depth [m]' yTitle='%' binSize={unsatChart[0]?.binSize} />
      </Col>

      <Col span={12}>
        <Histogram key={slChart[0]?.binSize ?? 0} data={slChart} xTitle='Screen length [m]' yTitle='%' binSize={slChart[0]?.binSize} />
      </Col>
      <Col span={12}>
        <Histogram key={wt2tChart[0]?.binSize ?? 0} data={wt2tChart} xTitle='Water table to top [m]' yTitle='%' binSize={wt2tChart[0]?.binSize} />
      </Col>

      <Col span={12}>
        <BoxPlot 
          data={[
            {
              type: "boxPlot",
              data: [
                {x: "Depth", y: getBoxPlotData("depth")},
                {x: "Unsat", y: getBoxPlotData("unsat")},
                {x: "WT2T", y: getBoxPlotData("wt2t")},
                {x: "SL", y: getBoxPlotData("slmod")}
              ],
            },
          ]} 
        />
      </Col>
    </Row>
  );
};

export default ExploreModelWells;
