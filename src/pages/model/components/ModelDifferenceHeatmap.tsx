import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import DifferenceHeatmap from '@/components/charts/DifferenceHeatmap/DifferenceHeatmap';
import { CoreButton } from '@/components/core/CoreButton/CoreButton';
import { CoreFormElement } from '@/components/core/CoreForm/CoreFormElement';
import { CoreNumberField } from '@/components/core/CoreNumberField/CoreNumberField';
import { HBox } from '@/components/custom/HBox/Hbox';
import type { PercentileResultMap } from '@/hooks/useModelResults';

interface ModelDifferenceHeatmapProps {
  baseResults: PercentileResultMap;
  customResults: PercentileResultMap;
  percentiles: number[];
}

export interface PercentileDifferenceMap {
  [percentile: string]: ModelDifference[];
}

export interface ModelDifference {
  year: number;
  value: number;
  percentile: string;
}

const ModelDifferenceHeatmap = ({
  baseResults,
  customResults,
  percentiles,
}: ModelDifferenceHeatmapProps) => {
  const [plotData, setPlotData] = useState<PercentileDifferenceMap>({});
  const [selected, setSelected] = useState<number | undefined>(undefined);
  const [bucketSize, setBucketSize] = useState<number>(18.5);

  console.log(plotData);
  console.log(selected);
  console.log(setSelected);

  useEffect(() => {
    if (baseResults && customResults) {
      const data: PercentileDifferenceMap = {};
      percentiles.forEach((p) => {
        const difference: ModelDifference[] = [];
        const baseData = baseResults[p] ?? [];
        const customData = customResults[p] ?? [];
        const years = Math.min(baseData.length, customData.length);
        for (let i = 0; i < years; i += 1) {
          difference.push({
            year: baseData[i]!.year,
            percentile: baseData[i]!.percentile,
            value: Number(
              (baseData[i]!.value - customData[i]!.value).toFixed(6),
            ),
          });
        }
        Object.assign(data, { [`${p}`]: difference });
      });
      setPlotData(data);
    }
  }, [baseResults, customResults]);

  const aggregate = (
    data?: PercentileDifferenceMap,
    level?: number,
  ): ApexAxisChartSeries => {
    const result: ApexAxisChartSeries = [];
    if (!level || !data) {
      return result;
    }
    percentiles.forEach((p) => {
      const singleDifference = data[p];
      if (!singleDifference) {
        return;
      }
      const len = singleDifference.length;
      const percentileData: any = [];
      for (let i = 0; i < len; i += level) {
        const temp = singleDifference.slice(i, Math.min(i + level, len));
        let aggValue = 0;
        let aggYearRange = '';
        temp.forEach((diff) => {
          aggValue += diff.value ?? 0;
        });
        if (i + level > len) {
          aggYearRange = `${1945 + i} - ${1945 + len}`;
          aggValue = Number((aggValue / (len - i)).toFixed(2));
        } else {
          aggYearRange = `${1945 + i} - ${1945 + i + level}`;
          aggValue = Number((aggValue / level).toFixed(2));
        }
        percentileData.push({ x: aggYearRange, y: aggValue });
      }
      result.push({ name: `${p}th percentile`, data: percentileData });
    });
    return result;
  };

  const onFormSubmit = (data: FieldValues) => {
    setBucketSize(data['Aggregate (avg) years']);
    console.log(data['Aggregate (avg) years']);
  };

  const formField = { label: 'Aggregate (avg) years:' };
  const methods = useForm();

  return (
    <>
      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={methods.handleSubmit((data) => {
            onFormSubmit(data);
          })}
          sx={{ mb: 4 }}
        >
          <HBox>
            <Box>
              <CoreFormElement formField={formField}>
                <CoreNumberField
                  name="Aggregate (avg) years"
                  defaultValue={20}
                />
              </CoreFormElement>
            </Box>
            <CoreButton label="Submit" type="submit" variant="contained" />
          </HBox>
        </Box>
      </FormProvider>
      <DifferenceHeatmap data={aggregate(plotData, bucketSize)} />
    </>
  );
};

export default ModelDifferenceHeatmap;
