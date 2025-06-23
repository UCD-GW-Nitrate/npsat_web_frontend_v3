import type { Region } from '@/types/region/Region';
import dynamic from 'next/dynamic';
import { Col, Row } from 'antd';
import Histogram from '../charts/Histogram/Histogram';
import { ModelRun } from '@/types/model/ModelRun';
import { useEffect, useMemo, useState } from 'react';
import WellsMap from '../maps/WellsMap';
import { useGetWellsQuery } from '@/store';
import { WELLS_REGION_BINS } from '@/utils/constants';
import { Well } from '@/types/well/Well';
import { create, all, FactoryFunctionMap } from 'mathjs'

const math = create(all as FactoryFunctionMap)


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
  const [ageThres, setAgeThres] = useState(0)
  const [wellLevel, setWellLevel] = useState(0);
  const [selectedEid, setSelectedEid] = useState<null | number>(null);

  const params = useMemo(
    () => {
      if (!regions) return {}

      // params will define the regions to filter by, and empty params defaults to include all wells
      let params = {}
      const region_type = regions[0]?.region_type
      const region_bin = WELLS_REGION_BINS[region_type ? region_type : 0]
      
      if (region_bin) {
        (params as any)[region_bin] = regions.map((region) => region.mantis_id)
      }

      return params
    },
    [regions]
  );

  const { data, error, isLoading } = useGetWellsQuery(params);

  const wells = useMemo(
    () => {
      if (isLoading || !data?.results) { return [] as Well[] }
      const allWells = data.results

      return allWells
    },
    [data]
  );

  async function getURFData() {
    let urfQueryData = {"qType": 2, "flow": flow, "scen": scen, "wType": wType, "eid": selectedEid}
    const params = {
      method: 'POST',
      body: JSON.stringify(urfQueryData),
      headers: {
        'Content-type': 'applcation/json',
      },
    };
    const response = await fetch('https://subsurface.gr/data/index.php', params);
    const respdata = await response.json();
    const { data, error, message } = respdata;
    return data;
  }

  // useEffect (()=>{
  //     async function getAgeStat() {
        
  //     }

  //     if (!isLoading) getAgeStat();
  //   },
  //   [data]
  // );
  

  useEffect(
    ()=>{

    },
    [selectedEid]
  );
  return (
    <Row gutter={[24, 16]}>
      <Col span={12} style={{ height: 600 }}>
        <WellsMap
          key={'Map_'+wells.length}
          path={regions.map((region: Region) => region.geometry)}
          wellProperty='depth'
          wells={wells}
          setEid={setSelectedEid}
        />
      </Col>
      <Col span={12}>
        <Histogram data={[
          {
            name: "Concentration - Depth",
            data: [{x: 1, y: 1}]
          }
        ]} />
      </Col>

      <Col span={12} />
      <Col span={12} />

      <Col span={12} />
      <Col span={12} />
    </Row>
  );
};

export default ExploreModelWells;
