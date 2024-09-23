/* eslint-disable no-prototype-builtins */
import { Card } from 'antd';
import { useSelector } from 'react-redux';

import { selectCurrentModel } from '@/store/slices/modelSlice';
import type { Region } from '@/types/region/Region';

import { C2VSimRun04VIPadj, C2VSimRun04VIRadj, CVHM2Run1VIPadj, CVHM2Run1VIRadj } from './ScenariosWellData/VIwellsCountMAR24V2';
import { C2VSimRun04VDPadj, C2VSimRun04VDRadj, CVHM2Run1VDPadj, CVHM2Run1VDRadj } from './ScenariosWellData/VDwellsCountMAR24V2';
import { REGION_MACROS } from '@/utils/constants';

interface WellNumberProps {
  selectedRegions: number[];
  regionType: number;
  countyList: Region[];
  depthMin: number;
  depthMax: number;
  screenLenMin: number;
  screenLenMax: number;
  filterOn: boolean;
}

interface WellInfo {
  depth: number;
  screenLen: number;
  count: number;
}

const WellNumber = ({
  selectedRegions,
  countyList,
  regionType,
  depthMax,
  depthMin,
  screenLenMax,
  screenLenMin,
  filterOn,
}: WellNumberProps) => {
  // console.log(
  //   `${selectedRegions} + ${countyList} + ${regionType} + ${depthMax} + ${depthMin} + ${screenLenMax} + ${screenLenMin} + ${filterOn}`,
  // );
  const depthFilter: [number, number] = [depthMin, depthMax];
  const screenLenFilter: [number, number] = [screenLenMin, screenLenMax];

  const model = useSelector(selectCurrentModel);
  const flowScenario = model.flow_scenario?.id;
  const welltypeScenario = model.welltype_scenario?.id;

  // store countyList in dictionary for easy lookup
  const countyDic: any = {};

  // console.log('selected:', selectedRegions);
  // console.log('flow_scenario: ', flowScenario);
  // console.log('welltype: ', welltypeScenario);
  // console.log('region type well number', regionType);

  // load well data based on scenario
  var wellData: any[] = [];

  if (welltypeScenario == 12) { // Public supply wells
    if (flowScenario === 10) wellData = C2VSimRun04VIPadj;
    else if (flowScenario === 11) wellData = C2VSimRun04VIRadj;
    else if (flowScenario === 8) wellData = CVHM2Run1VIPadj;
    else if (flowScenario === 9) wellData = CVHM2Run1VIRadj;
  } else if (welltypeScenario == 13) { // Domestic wells
    if (flowScenario === 10) wellData = C2VSimRun04VDPadj;
    else if (flowScenario === 11) wellData = C2VSimRun04VDRadj;
    else if (flowScenario === 8) wellData = CVHM2Run1VDPadj;
    else if (flowScenario === 9) wellData = CVHM2Run1VDRadj;
  }

  let wellCount: number = 0;
  if (welltypeScenario !== 14) { // Exclude virtual monitoring well

    countyList.forEach((county) => {
      countyDic[county.id] = county.mantis_id;
    });

    // populate mantis_id for data lookup
    const mantisId: number[] = [];
    selectedRegions.forEach((id) => mantisId.push(countyDic[id]));
    console.log('mantis_id: ', mantisId);

    const wellDic: {
      [key: string]: WellInfo;
    } = {};

    const storeInWellDic = (well: any, key: string) => {
      if (!wellDic.hasOwnProperty(key)) {
        wellDic[key] = {count: 0, depth: well.D, screenLen: well.SL};
      }

      if ((filterOn && 
          well.D >= depthFilter[0] &&
          well.D <= depthFilter[1] &&
          well.SL >= screenLenFilter[0] &&
          well.SL <= screenLenFilter[1]) || !filterOn) {
        wellDic[key]!.count += 1;
      }
    }

    switch (regionType) {
      case REGION_MACROS.CENTRAL_VALLEY: // central valley
        console.log('Central Valley');
        wellData.forEach((well) => storeInWellDic(well, "CentralValley"));
        break;
      case REGION_MACROS.SUB_BASIN: // basin
        console.log('Sub Basin');
        wellData.forEach((well) => storeInWellDic(well, well.Basin));
        break;
      case REGION_MACROS.CVHM_FARM: // subRegion
        wellData.forEach((well) => storeInWellDic(well, well.Sub));
        break;
      case REGION_MACROS.B118_BASIN: // B118 Basin
        wellData.forEach((well) => storeInWellDic(well, well.B118));
        break;
      case REGION_MACROS.COUNTY: // county
        wellData.forEach((well) => storeInWellDic(well, well.County));
        break;
      case REGION_MACROS.TOWNSHIPS: // Township
        wellData.forEach((well) => storeInWellDic(well, well.Tship));
        break;
      default:
        console.log('RegionType Error: Type cannot be found!');
        break;
    }

    mantisId.forEach((id) => {
      wellCount += wellDic[id]?.count ?? 0;
    });
  }

  return (
    <div>
      <Card>Number of Wells Selected: {wellCount}</Card>
    </div>
  );
};

export default WellNumber;
