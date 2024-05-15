/* eslint-disable no-prototype-builtins */
import { Card } from 'antd';

import type { ResultResponse } from '@/store/apis/regionApi';

interface WellNumberProps {
  selectedRegions: number[];
  regionType: number;
  countyList: ResultResponse[];
  depthMin: number;
  depthMax: number;
  screenLenMin: number;
  screenLenMax: number;
  filterOn: boolean;
}

// onChange contains dynamic region id based on selections
// countyList contains both name and id based on region selected
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
  console.log(
    `${selectedRegions} + ${countyList} + ${regionType} + ${depthMax} + ${depthMin} + ${screenLenMax} + ${screenLenMin} + ${filterOn}`,
  );
  // const depthFilter: [number, number] = [depthMin, depthMax];
  // const screenLenFilter: [number, number] = [screenLenMin, screenLenMax];

  // const model = useSelector(selectCurrentModel);
  // const flowScenario = model.flow_scenario?.id;
  // const welltypeScenario = model.welltype_scenario?.id;

  // // store countyList in dictionary for easy lookup
  // const countyDic: any = {};

  // console.log('selected:', selectedRegions);
  // console.log('flow_scenario: ', flowScenario);
  // console.log('welltype: ', welltypeScenario);
  // console.log('region type well number', regionType);

  // // load well data based on scenario
  // let wellData: any[] = [];

  // if (flowScenario === 8) {
  //   // GUI_flowScen == C2VSIM
  //   if (welltypeScenario === 10) {
  //     // GUI_wellType == Public
  //     wellData = C2VSim_VI;
  //   } else if (welltypeScenario === 11) {
  //     // GUI_wellType == domestic
  //     wellData = C2VSim_VD;
  //   } else {
  //     // GUI_wellType == virtual monitoring (welltype_scenario == 12)
  //     wellData = TshipWell;
  //   }
  // }

  // if (flowScenario === 9) wellData = cvhm;

  // console.log('County List', countyList);

  // let wellCount: number = 0;
  // if (welltypeScenario !== 12) {
  //   // anchor data point for each region:
  //   // basin: id, mantis_id
  //   // county: id, mantis_id
  //   // B118 Basin: id, mantis_id
  //   // subRegions: id, mantis_id
  //   // township: id, mantis_id

  //   countyList.forEach((county) => {
  //     countyDic[county.id] = county.mantis_id;
  //   });

  //   // populate mantis_id for data lookup
  //   const mantisId: number[] = [];
  //   selectedRegions.forEach((id) => mantisId.push(countyDic[id]));
  //   console.log('mantis_id: ', mantisId);

  //   // regionType:
  //   // Basin 1
  //   // subRegion 2
  //   // B118Basin 3
  //   // county 4
  //   // Township 5

  //   // Step1. store well data in dictionary for easy lookup
  //   // => [# (number of wells), well_depth(D), screen_length (SL)]
  //   // Step2. look up well dictionary based on regionType
  //   console.log('wellData', wellData);
  //   const wellDic: any = {};
  //   switch (regionType) {
  //     case 1: // basin
  //       // Step1
  //       wellData.forEach((well) => {
  //         console.log('well dic case 1.0', well);
  //         if (!wellDic.hasOwnProperty(well.Basin)) {
  //           console.log('well dic case 1.1', wellDic);
  //           if (filterOn) {
  //             if (
  //               well.D >= depthFilter[0] &&
  //               well.D <= depthFilter[1] &&
  //               well.SL >= screenLenFilter[0] &&
  //               well.SL <= screenLenFilter[1]
  //             )
  //               wellDic[well.Basin] = [1, well.D, well.SL];
  //             else wellDic[well.Basin] = [0, well.D, well.SL];
  //           } else {
  //             console.log('well dic case 1.2', wellDic);
  //             wellDic[well.Basin] = [1, well.D, well.SL];
  //             console.log('well dic case 1.3', wellDic);
  //           }
  //         } else if (filterOn) {
  //           if (
  //             well.D >= depthFilter[0] &&
  //             well.D <= depthFilter[1] &&
  //             well.SL >= screenLenFilter[0] &&
  //             well.SL <= screenLenFilter[1]
  //           )
  //             wellDic[well.Basin][0] += 1;
  //         } else wellDic[well.Basin][0] += 1;
  //       });
  //       console.log('well dic case 1', wellDic);
  //       // Step2
  //       mantisId.forEach((id) => {
  //         wellCount += wellDic[id][0];
  //       });
  //       break;
  //     case 2: // subRegion
  //       // Step1
  //       wellData.forEach((well) => {
  //         if (!wellDic.hasOwnProperty(well.Sub)) {
  //           if (filterOn) {
  //             if (
  //               well.D >= depthFilter[0] &&
  //               well.D <= depthFilter[1] &&
  //               well.SL >= screenLenFilter[0] &&
  //               well.SL <= screenLenFilter[1]
  //             ) {
  //               wellDic[well.Sub] = [1, well.D, well.SL];
  //               // console.log('start well');
  //             } else wellDic[well.Sub] = [0, well.D, well.SL];
  //           } else {
  //             wellDic[well.Sub] = [1, well.D, well.SL];
  //           }
  //         } else if (filterOn) {
  //           if (
  //             well.D >= depthFilter[0] &&
  //             well.D <= depthFilter[1] &&
  //             well.SL >= screenLenFilter[0] &&
  //             well.SL <= screenLenFilter[1]
  //           ) {
  //             // console.log('start well', wellDic[well.Sub][0]);
  //             wellDic[well.Sub][0] += 1;
  //           }
  //         } else wellDic[well.Sub][0] += 1;
  //       });

  //       console.log('mantis id', mantisId);
  //       // Step2
  //       mantisId.forEach((id) => {
  //         wellCount += wellDic[id][0];
  //       });

  //       console.log('well count', wellCount);
  //       break;
  //     case 3: // B118 Basin
  //       // Step1
  //       wellData.forEach((well) => {
  //         if (!wellDic.hasOwnProperty(well.B118)) {
  //           if (filterOn) {
  //             if (
  //               well.D >= depthFilter[0] &&
  //               well.D <= depthFilter[1] &&
  //               well.SL >= screenLenFilter[0] &&
  //               well.SL <= screenLenFilter[1]
  //             )
  //               wellDic[well.B118] = [1, well.D, well.SL];
  //             else wellDic[well.B118] = [0, well.D, well.SL];
  //           } else {
  //             wellDic[well.B118] = [1, well.D, well.SL];
  //           }
  //         } else if (filterOn) {
  //           if (
  //             well.D >= depthFilter[0] &&
  //             well.D <= depthFilter[1] &&
  //             well.SL >= screenLenFilter[0] &&
  //             well.SL <= screenLenFilter[1]
  //           )
  //             wellDic[well.B118][0] += 1;
  //         } else wellDic[well.B118][0] += 1;
  //       });
  //       // Step2
  //       mantisId.forEach((id) => {
  //         if (wellDic.hasOwnProperty(id)) {
  //           wellCount += wellDic[id][0];
  //         }
  //       });
  //       break;
  //     case 4: // county
  //       // Step1
  //       wellData.forEach((well) => {
  //         if (!wellDic.hasOwnProperty(well.County)) {
  //           if (filterOn) {
  //             if (
  //               well.D >= depthFilter[0] &&
  //               well.D <= depthFilter[1] &&
  //               well.SL >= screenLenFilter[0] &&
  //               well.SL <= screenLenFilter[1]
  //             )
  //               wellDic[well.County] = [1, well.D, well.SL];
  //             else wellDic[well.County] = [0, well.D, well.SL];
  //           } else {
  //             wellDic[well.County] = [1, well.D, well.SL];
  //           }
  //         } else if (filterOn) {
  //           if (
  //             well.D >= depthFilter[0] &&
  //             well.D <= depthFilter[1] &&
  //             well.SL >= screenLenFilter[0] &&
  //             well.SL <= screenLenFilter[1]
  //           )
  //             wellDic[well.County][0] += 1;
  //         } else wellDic[well.County][0] += 1;
  //       });
  //       // Step2
  //       mantisId.forEach((id) => {
  //         if (wellDic.hasOwnProperty(id)) {
  //           wellCount += wellDic[id][0];
  //         }
  //       });
  //       break;
  //     case 5: // Township
  //       // Step1
  //       wellData.forEach((well) => {
  //         if (!wellDic.hasOwnProperty(well.Tship)) {
  //           if (filterOn) {
  //             if (
  //               well.D >= depthFilter[0] &&
  //               well.D <= depthFilter[1] &&
  //               well.SL >= screenLenFilter[0] &&
  //               well.SL <= screenLenFilter[1]
  //             )
  //               wellDic[well.Tship] = [1, well.D, well.SL];
  //             else wellDic[well.Tship] = [0, well.D, well.SL];
  //           } else {
  //             wellDic[well.Tship] = [1, well.D, well.SL];
  //           }
  //         } else if (filterOn) {
  //           if (
  //             well.D >= depthFilter[0] &&
  //             well.D <= depthFilter[1] &&
  //             well.SL >= screenLenFilter[0] &&
  //             well.SL <= screenLenFilter[1]
  //           )
  //             wellDic[well.Tship][0] += 1;
  //         } else wellDic[well.Tship][0] += 1;
  //       });
  //       // Step2
  //       mantisId.forEach((id) => {
  //         if (wellDic.hasOwnProperty(id)) {
  //           wellCount += wellDic[id][0];
  //         }
  //       });
  //       break;
  //     default:
  //       console.log('RegionType Error: Type cannot be found!');
  //       break;
  //   }
  // } else {
  //   // viryual monitoring well with only Township available
  //   // store township well info in a dictionary for faster look up
  //   const TshipWellDic: any = {};
  //   TshipWell.forEach((tship) => {
  //     TshipWellDic[tship.Township] = tship.WellCount;
  //   });
  //   countyList.forEach((county) => {
  //     countyDic[county.id] = county.external_id;
  //   });
  //   // count well numbers for selected township(s)
  //   selectedRegions.forEach((tship) => {
  //     if (countyDic[tship] in TshipWellDic) {
  //       wellCount += TshipWellDic[countyDic[tship]];
  //     }
  //   });
  // }
  return (
    <div>
      <Card>Number of Wells Selected: </Card>
    </div>
  );
};

export default WellNumber;
