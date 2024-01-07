import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

import type { ModelDetail, Modification, Region } from '@/store/apis/modelApi';

import areaPerCrop from '../logic/areaPerCrop';

interface CropLoadingDetailsTableProps {
  baseModelDetail: ModelDetail | undefined;
  customModelDetail: ModelDetail | undefined;
}

interface CropLoadingDetailsTableData {
  name: string;
  customPercentage: string;
  bauPercentage: string;
  area: string;
}

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const CropLoadingDetailsTable = ({
  customModelDetail,
  baseModelDetail,
}: CropLoadingDetailsTableProps) => {
  const [crop, setCrop] = useState<CropLoadingDetailsTableData[]>([]);
  const [loading, setLoading] = useState(true);
  const loadScenario = customModelDetail?.flow_scenario.scenario_type; // load_scenario type was assigned to flow_scenario, needs to be fixed
  const mapType = customModelDetail?.regions[0]?.region_type;

  const columns: ColumnsType<CropLoadingDetailsTableData> = [
    {
      title: 'Crops',
      dataIndex: 'name',
    },
    {
      title: 'Custom loading percentage',
      dataIndex: 'customPercentage',
    },
    {
      title: 'BAU loading percentage',
      dataIndex: 'bauPercentage',
    },
    {
      title: 'Crop area (Hectare)',
      dataIndex: 'area',
    },
    {
      title: 'Crop area (Acre)',
      dataIndex: 'area',
    },
  ];

  const getRegions = (regions: Region[]) => {
    const regionNames: string[] = [];
    regions.forEach((region) => {
      regionNames.push(region.mantis_id);
    });
    return regionNames;
  };

  const getCrops = (modifications: Modification[]) => {
    const cropCAML: number[] = [];
    modifications.forEach((m) => {
      cropCAML.push(m.crop.caml_code);
    });
    return cropCAML;
  };

  useEffect(() => {
    if (customModelDetail?.modifications && baseModelDetail?.modifications) {
      const cropAreas = areaPerCrop(
        mapType,
        loadScenario,
        getCrops(customModelDetail.modifications),
        getRegions(customModelDetail.regions),
      );
      const crops: CropLoadingDetailsTableData[] = [];
      for (let i = 0; i < customModelDetail.modifications.length; i += 1) {
        const customModification = customModelDetail.modifications[i]!;
        const baseModification = baseModelDetail.modifications[i]!;
        crops.push({
          name: customModification.crop.name,
          customPercentage: `${customModification.proportion * 100}%`,
          bauPercentage: `${baseModification.proportion * 100}%`,
          area: numberWithCommas(
            cropAreas[
              customModification.crop.caml_code
                ? customModification.crop.caml_code
                : 0
            ] ?? 0,
          ),
        });
      }
      setCrop(crops);
      setLoading(false);
    }
  }, [customModelDetail, baseModelDetail]);

  return (
    <Table
      pagination={false}
      bordered
      loading={loading}
      columns={columns}
      dataSource={crop}
    />
  );
};

export default CropLoadingDetailsTable;
