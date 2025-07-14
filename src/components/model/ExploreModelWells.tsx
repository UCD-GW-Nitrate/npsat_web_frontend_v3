import type { Region } from '@/types/region/Region';
import { Button, Card, Col, Dropdown, MenuProps, Row, Space } from 'antd';
import Histogram from '../charts/Histogram/Histogram';
import { ModelRun } from '@/types/model/ModelRun';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MANTIS_REGION_TYPES } from '@/utils/constants';
import { DownOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';
import intersect from '@turf/intersect';
import area from '@turf/area';
import { feature } from '@turf/helpers';
import { bmaps } from './bmaps.js';
import debounce from "lodash.debounce";
import CustomSlider from '../custom/CustomSlider/CustomSlider';
import BoxPlot from '../charts/BoxPlot/BoxPlot';
import type { FeatureCollection, GeoJsonProperties, Polygon, MultiPolygon } from 'geojson';
import { Well } from '@/types/well/WellExplorer';

const WellsMap = dynamic(() => import('../maps/WellsMap'), {
  ssr: false,
});

export interface MapProps {
  regions: Region[];
  customModelDetail: ModelRun;
}


const ExploreModelWells = ({ regions, customModelDetail }: MapProps) => {
  const flow = customModelDetail.flow_scenario.name.includes("C2VSIM") ? 0 : 1;
  const scen = customModelDetail.flow_scenario.name.includes("Pumping") ? 0 : 1;
  const wType = customModelDetail.welltype_scenario.name.includes("Irrigation") ? 0 : 1;
  const porosity = customModelDetail.porosity;
  const [wellProperty, setWellProperty] = useState<'depth' | 'unsat' | 'slmod' | 'wt2t'>('depth');
  const [allWells, setAllWells] = useState<null | Well[]>(null)
  const [displayData, setDisplayData] = useState<Well[]>([])

  const getWellsParams = useMemo(
    () => {
      if (!(regions && regions[0]?.region_type)) return []

      const bmapIndex = MANTIS_REGION_TYPES[regions[0]?.region_type ?? 0];
      const features = bmaps[bmapIndex].features;
      return regions.map(region => {
        // hack to map region ids to those used by the age_well_explorer backend, saved into variable idx 
        let idx = 0
        for (idx; idx<features.length; idx++) {
          const feature1 = feature(features[idx].geometry);
          const feature2 = feature(region.geometry.geometry);
          const featureCollection : FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties> = {
            type: "FeatureCollection",
            features: [feature1, feature2]
          };
          const intersection = intersect(featureCollection);
          if (intersection) {
            const overlap = area(intersection);
            const refArea = Math.min(area(feature1), area(feature2));
            const matchScore = overlap / refArea;
            if (Math.round(matchScore * 100) > 50) {
              break;
            }
          }
        }
        return ({
          flow: flow,
          scen: scen,
          wType: wType, 
          bmap: bmapIndex, 
          idmap: features[idx].properties.ID
        });
      })
    }, 
    [regions]
  );

  useEffect(()=>{
    async function getWells() {
      let tempWells : Well[] = [];
      for (const queryParams of getWellsParams) {
        console.time("fetch");
        const res = await fetch(
          // "http://localhost:8000/index.php",
          "https://subsurface.gr/data/index.php", 
          {
            method:"POST",
            body:JSON.stringify({...queryParams, qType: 1}),
            headers:{
                "Content-type":"applcation/json"
            }
          }
        );
        console.timeEnd("fetch");
        const respdata = await res.json();
        const { data, error, message } = respdata;
        const { welldata } = data;

        tempWells.push(...
          (
            welldata.map(
              well => {
                return {
                  eid: well.Eid,
                  lat: well.Lat,
                  lon: well.Lon,
                  unsat: well.UNSATcond,
                  wt2t: well.WT2T,
                  slmod: well.SLmod,
                  depth: well.UNSATcond + well.WT2T + well.SLmod
                }
              }
            )
          )
        );
      }
      tempWells = tempWells.filter((well) => {
        if (customModelDetail.depth_range_min) {
          if (well.depth < customModelDetail.depth_range_min) {
            return false
          }
        }
        if (customModelDetail.depth_range_max) {
          if (well.depth > customModelDetail.depth_range_max) {
            return false
          }
        }
        if (customModelDetail.unsat_range_min) {
          if (well.depth < customModelDetail.unsat_range_min) {
            return false
          }
        }
        if (customModelDetail.unsat_range_max) {
          if (well.depth > customModelDetail.unsat_range_max) {
            return false
          }
        }
        return true
      })
      setAllWells(tempWells);
    }

    if (regions && regions[0]?.region_type) getWells()
  }, [regions])

  const histData = (wellProperty: 'depth' | 'unsat' | 'slmod' | 'wt2t', title: string) => {
    const allVals = allWells?.map((well: Well) => well[wellProperty]);
    if (!allVals) return ([{ name: title, data: [], binSize: 0 }])
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

  const labels = Object.fromEntries(items.map(item => [item.key, item.label]));

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };


  function getBoxPlotData(wellProperty: 'depth' | 'unsat' | 'slmod' | 'wt2t') {
    const values = allWells?.map((well: Well) => well[wellProperty]);
    if (!values || values.length === 0) return ([])

    const sorted = [...values].sort((a, b) => a - b);
    const median = getMedian(sorted)!.toFixed(2);;
    const q1 = getMedian(sorted.slice(0, Math.floor(sorted.length / 2)))!.toFixed(2);;
    const q3 = getMedian(sorted.slice(Math.ceil(sorted.length / 2)))!.toFixed(2);;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    return [min, q1, median, q3, max];
  }

  function getMedian(arr: number[]) {
    if (!arr) return 0;
    
    const mid = Math.floor(arr.length / 2);
    if (arr.length % 2 === 0) {
      return (arr[mid - 1] ?? 0 + arr[mid]!) / 2;
    } else {
      return arr[mid];
    }
  }

  async function getWells(ageThres: number) {
    let tempWells : Well[] = [];
    for (const queryParams of getWellsParams) {
      console.time("fetch");
      const res = await fetch(
        "https://subsurface.gr/data/index.php",
        {
          method:"POST",
          body:JSON.stringify({...queryParams, qType: 3, por: porosity, agethres: ageThres}),
          headers:{
              "Content-type":"applcation/json"
          }
        }
      );
      console.timeEnd("fetch");
      const respdata = await res.json();
      const { data, error, message } = respdata;
      tempWells.push(...
        (
          data.map(
            well => {
              return {
                  eid: well.Eid,
                  lat: well.Lat,
                  lon: well.Lon,
                  unsat: well.UNSATcond,
                  wt2t: well.WT2T,
                  slmod: well.SLmod,
                  depth: well.UNSATcond + well.WT2T + well.SLmod
              }
            }
          )
        )
      );
    }
    setDisplayData(tempWells);
  }

  const debounceChange = useCallback(
    debounce(async (val: number) => {
      console.log("Debounced value:", val);
      await getWells(val)
    }, 1000),
    []
  );

  return (
    <Row gutter={[24, 16]}>
      <Col span={12}>
        <div style={{width: '100%', height: 500}}>
          <WellsMap
            path={regions.map((region: Region) => region.geometry)}
            wellProperty={wellProperty}
            wells={displayData.length>0 ? displayData : allWells ? allWells : []}
          />
        </div>
      </Col>
      <Col span={12}>
        <Card style={{ width: '100%' }}>
          <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
            <p style={{width: 250, paddingRight: 20}}>Colorcode by Well Property:</p>
            <Dropdown menu={menuProps}>
              <Button>
                {labels[wellProperty]}
                <Space>
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </div>
          <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
            <p style={{width: 250, paddingRight: 20}}>Filter by Age Fraction:</p>
            <CustomSlider value={50} debounceChange={debounceChange} onAfterChange={getWells} />
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
