import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

import areaPerCrop from '@/logic/areaPerCrop';
import type { CropModification } from '@/types/model/CropModification';
import type { ModelRegion } from '@/types/model/ModelRegion';
import type { ModelRun } from '@/types/model/ModelRun';

interface CropLoadingDetailsTableProps {
  modelDetails: ModelRun[];
  compareWithBase?: boolean;
}

interface CropLoadingDetailsBaseComparisonTableProps {
  customModelDetail: ModelRun;
  baseModelDetail: ModelRun;
}

interface CropLoadingDetailsTableData {
  __cropName__: string;
  [modelName: string]: string;
}

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const CropLoadingDetailsTable = ({
  modelDetails,
  compareWithBase = false,
}: CropLoadingDetailsTableProps) => {
  const [crop, setCrop] = useState<CropLoadingDetailsTableData[]>([]);
  const [columns, setColumns] = useState<ColumnsType<any>>([]);

  const getRegions = (regions: ModelRegion[]) => {
    const regionNames: string[] = [];
    regions.forEach((region) => {
      regionNames.push(region.mantis_id);
    });
    return regionNames;
  };

  const getCrops = (modifications: CropModification[]): number[] => {
    const cropCAML: number[] = [];
    modifications.forEach((m) => {
      cropCAML.push(m.crop.caml_code ?? m.crop.swat_code ?? -1);
    });
    return cropCAML;
  };

  useEffect(() => {
    // data processor
    if (modelDetails && modelDetails.length > 0) {
      // map crop id to index in crops
      const cropMap = new Map();
      const crops: CropLoadingDetailsTableData[] = [];
      const modelColumns: ColumnsType = [];
      const additionalColumns: ColumnsType<any> = [];
      modelDetails.forEach((model) => {
        const { modifications, name, regions } = model;
        const mapType = model.regions[0]?.region_type;
        const loadScenario = model.flow_scenario.scenario_type; // load_scenario type was assigned to flow_scenario, needs to be fixed
        const cropAreas = areaPerCrop(
          mapType,
          loadScenario,
          getCrops(modifications),
          getRegions(regions),
        );
        modifications.forEach((modification) => {
          if (!cropMap.has(modification.crop.id)) {
            cropMap.set(modification.crop.id, crops.length);
            crops.push({
              // to avoid duplicate names
              __cropName__: modification.crop.name,
              [`model${model.id}Loading`]: `${modification.proportion}`,
              [`model${model.id}AreaAcre`]: numberWithCommas(
                Math.round(
                  (cropAreas[
                    modification.crop.caml_code ??
                      modification.crop.swat_code ??
                      0
                  ] ?? 0) *
                    0.25 *
                    2.47,
                ),
              ),
              [`model${model.id}AreaHectare`]: numberWithCommas(
                Math.round(
                  (cropAreas[
                    modification.crop.caml_code ??
                      modification.crop.swat_code ??
                      0
                  ] ?? 0) * 0.25,
                ),
              ),
            });
          } else {
            crops[cropMap.get(modification.crop.id)]![
              `model${model.id}Loading`
            ] = `${modification.proportion}`;
            crops[cropMap.get(modification.crop.id)]![
              `model${model.id}AreaAcre`
            ] = numberWithCommas(
              Math.round(
                (cropAreas[
                  modification.crop.caml_code ? modification.crop.caml_code : 0
                ] ?? 0) *
                  0.25 *
                  2.47,
              ),
            );
            crops[cropMap.get(modification.crop.id)]![
              `model${model.id}AreaHectare`
            ] = numberWithCommas(
              Math.round(
                (cropAreas[
                  modification.crop.caml_code ? modification.crop.caml_code : 0
                ] ?? 0) * 0.25,
              ),
            );
          }
        });
        modelColumns.push({
          title: `${name} - Loading Percentage`,
          dataIndex: `model${model.id}Loading`,
          render: (num) =>
            num ? `${(num * 100).toFixed()}%` : 'Not specified',
        });
        if (!compareWithBase) {
          modelColumns.push({
            title: `${name} - Crop Area (Acre)`,
            dataIndex: `model${model.id}AreaAcre`,
            render: (num) => num || 'Not specified',
          });
        }
      });
      if (compareWithBase && modelDetails.length === 2) {
        additionalColumns.push({
          title: `Crop Area (Acre)`,
          dataIndex: `model${modelDetails[0]!.id}AreaAcre`,
          render: (num) => num || 'Not specified',
        });
        additionalColumns.push({
          title: `Crop Area (Hectare)`,
          dataIndex: `model${modelDetails[0]!.id}AreaHectare`,
          render: (num) => num || 'Not specified',
        });
      }
      setCrop(crops);
      setColumns([
        {
          title: 'Crop',
          dataIndex: '__cropName__',
        },
        ...modelColumns,
        ...additionalColumns,
      ]);
    }
  }, [modelDetails]);

  return (
    <Table pagination={false} bordered columns={columns} dataSource={crop} />
  );
};

export const CropLoadingDetailsBaseComparisonTable = ({
  customModelDetail,
  baseModelDetail,
}: CropLoadingDetailsBaseComparisonTableProps) => {
  return (
    <CropLoadingDetailsTable
      modelDetails={[customModelDetail, baseModelDetail]}
      compareWithBase
    />
  );
};
