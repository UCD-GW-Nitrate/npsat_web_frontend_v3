import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

import type { ModelDetail, Modification, Region } from '@/store/apis/modelApi';

import areaPerCrop from '../logic/areaPerCrop';

interface CropLoadingDetailsTableProps {
  modelDetail: ModelDetail | undefined;
}

interface CropLoadingDetailsTableData {
  name: string;
  percentage: string;
  area: string;
}

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const CropLoadingDetailsTable = ({
  modelDetail,
}: CropLoadingDetailsTableProps) => {
  const [crop, setCrop] = useState<CropLoadingDetailsTableData[]>([]);
  const [loading, setLoading] = useState(true);
  const loadScenario = modelDetail?.flow_scenario.scenario_type; // load_scenario type was assigned to flow_scenario, needs to be fixed
  const mapType = modelDetail?.regions[0]?.region_type;

  const columns: ColumnsType<CropLoadingDetailsTableData> = [
    {
      title: 'Crops',
      dataIndex: 'name',
    },
    {
      title: 'Loading percentage',
      dataIndex: 'percentage',
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
    if (modelDetail?.modifications) {
      const cropAreas = areaPerCrop(
        mapType,
        loadScenario,
        getCrops(modelDetail.modifications),
        getRegions(modelDetail.regions),
      );
      const crops: CropLoadingDetailsTableData[] =
        modelDetail.modifications.map((item) => ({
          name: item.crop.name,
          percentage: `${item.proportion * 100}%`,
          area: numberWithCommas(
            cropAreas[item.crop.caml_code ? item.crop.caml_code : 0] ?? 0,
          ),
        }));
      setCrop(crops);
      setLoading(false);
    }
  }, [modelDetail]);

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
