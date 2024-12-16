import { Card } from 'antd';
import { useSelector } from 'react-redux';

import { useGetWellsQuery } from '@/store';
import { selectCurrentModel } from '@/store/slices/modelSlice';
import type { Region } from '@/types/region/Region';
import type { WellRequest } from '@/types/well/Well';
import { REGION_MACROS } from '@/utils/constants';

interface WellNumberProps {
  selectedRegions: number[];
  regionType: number;
  countyList: Region[];
  depthMin: number;
  depthMax: number;
  unsatMin: number;
  unsatMax: number;
  filterOn: boolean;
}

const WellNumber = ({
  selectedRegions,
  countyList,
  regionType,
  depthMax,
  depthMin,
  unsatMin,
  unsatMax,
  filterOn,
}: WellNumberProps) => {
  const depthFilter: [number, number] = [depthMin, depthMax];
  const unsatFilter: [number, number] = [unsatMin, unsatMax];

  const model = useSelector(selectCurrentModel);
  const flowScenario = model.flow_scenario?.id;
  const welltypeScenario = model.welltype_scenario?.id;

  const getWellRegions = () => {
    // store countyList in dictionary for easy lookup
    const countyDic: any = {};

    countyList.forEach((county) => {
      countyDic[county.id] = county.mantis_id;
    });

    // populate mantis_id for data lookup
    const mantisId: string[] = [];
    selectedRegions.forEach((id) => mantisId.push(countyDic[id]));
    return mantisId;
  };

  const getWellParams = () => {
    const queryParams: Partial<WellRequest> = {};
    if (welltypeScenario === 12) {
      queryParams.well_type = 'VI'; // Public supply wells
    } else if (welltypeScenario === 13) {
      queryParams.well_type = 'VD'; // Domestic wells
    }

    if (flowScenario === 10) {
      queryParams.rch_type = 'Padj'; // Pump adjusted
      queryParams.flow_model = 'C2VSim';
    } else if (flowScenario === 11) {
      queryParams.rch_type = 'Radj'; // Recharge adjusted
      queryParams.flow_model = 'C2VSim';
    } else if (flowScenario === 8) {
      queryParams.rch_type = 'Padj'; // Pump adjusted
      queryParams.flow_model = 'CVHM2';
    } else if (flowScenario === 9) {
      queryParams.rch_type = 'Radj'; // Recharge adjusted
      queryParams.flow_model = 'CVHM2';
    }

    if (welltypeScenario !== 14) {
      switch (regionType) {
        case REGION_MACROS.CENTRAL_VALLEY: // central valley
          break;
        case REGION_MACROS.SUB_BASIN: // basin
          queryParams.basin = getWellRegions();
          break;
        case REGION_MACROS.CVHM_FARM: // subRegion
          queryParams.subreg = getWellRegions();
          break;
        case REGION_MACROS.B118_BASIN: // B118 Basin
          queryParams.b118 = getWellRegions();
          break;
        case REGION_MACROS.COUNTY: // county
          queryParams.county = getWellRegions();
          break;
        case REGION_MACROS.TOWNSHIPS: // Township
          queryParams.tship = getWellRegions();
          break;
        default:
          console.log('RegionType Error: Type cannot be found!');
          break;
      }
    }

    if (filterOn) {
      queryParams.depth_range_min = depthFilter[0];
      queryParams.depth_range_max = depthFilter[1];
      queryParams.unsat_range_min = unsatFilter[0];
      queryParams.unsat_range_max = unsatFilter[1];
    }

    return queryParams;
  };

  const { data: wellData, isLoading } = useGetWellsQuery(getWellParams());

  function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const getWellCount = () => {
    if (selectedRegions.length === 0) {
      return '0';
    }
    if (isLoading) {
      return '';
    }
    return numberWithCommas(wellData?.count ?? 0);
  };

  return (
    <div>
      <Card>Number of Wells Selected: {getWellCount()}</Card>
    </div>
  );
};

export default WellNumber;
