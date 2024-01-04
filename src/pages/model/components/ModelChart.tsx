import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';

import MultilineChart from '@/components/charts/MultilinePlot/MultilineChart';
import type { ChartDataPoint } from '@/components/charts/MultilinePlot/MultilineChartBase';
import { CoreButton } from '@/components/core/CoreButton/CoreButton';
import type { CoreMultipleSelectOption } from '@/components/core/CoreMultipleSelect/CoreMultipleSelect';
import { CoreMultipleSelect } from '@/components/core/CoreMultipleSelect/CoreMultipleSelect';
import { HBox } from '@/components/custom/HBox/Hbox';
import type { ModelDisplay } from '@/hooks/useModelResults';
import { useModelResults } from '@/hooks/useModelResults';
import type { Result } from '@/store/apis/modelApi';

interface ModelChartProps {
  percentiles: Result[];
  reductionStartYear: number;
  reductionCompleteYear: number;
}

interface DisplayData {
  [percentile: string]: ChartDataPoint[];
}

const ModelChart = ({
  percentiles,
  reductionStartYear,
  reductionCompleteYear,
}: ModelChartProps) => {
  const [plotData, percentilesData] = useModelResults(percentiles);
  const [percentilesDisplayed, setPercentilesDisplayed] = useState<number[]>([
    5, 50, 95,
  ]);
  const [multSelect, setMultSelect] = useState<
    (CoreMultipleSelectOption | undefined)[]
  >([]);
  const [percentileButtonClicked, setPercentileButtonClicked] =
    useState<string>('Select 5th, 50th, 95th');

  function configureDisplayData(percentilesInput: number[]) {
    const res: any = {};
    percentilesInput.forEach((p) => {
      res[`${p}th percentile`] =
        ((plotData as any)[p] as ModelDisplay[] | undefined)?.map((data) => {
          return {
            year: data.year,
            value: data.value,
          } as ChartDataPoint;
        }) ?? [];
    });
    return res;
  }

  const [displayData, setDisplayData] = useState<DisplayData>(
    configureDisplayData(percentilesDisplayed),
  );

  useEffect(() => {
    setDisplayData(configureDisplayData(percentilesDisplayed));
    setMultSelect(
      (percentilesDisplayed as number[]).map((p) => {
        const res: CoreMultipleSelectOption = {
          label: `${p}th percentile`,
          value: p,
        };
        return res;
      }),
    );
  }, [plotData, percentilesDisplayed]);

  useEffect(() => {
    setDisplayData(configureDisplayData(multSelect.map((p) => p!.value)));
  }, [multSelect]);

  if (!plotData) {
    return <div />;
  }

  const handleMultSelect = (
    selected: (CoreMultipleSelectOption | undefined)[],
  ) => {
    setMultSelect(selected);
    setPercentilesDisplayed(selected.map((s) => s?.value));
  };

  console.log('display data: ', displayData);

  return (
    <Box>
      <CoreMultipleSelect
        group={false}
        placeholder="Select Percentiles"
        options={(percentilesData as number[]).map((p) => {
          const res: CoreMultipleSelectOption = {
            label: `${p}th percentile`,
            value: p,
          };
          return res;
        })}
        fieldValue={multSelect}
        setFieldValue={handleMultSelect}
        isOptionEqualToValue={(option, value) => option?.value === value?.value}
      />
      <HBox sx={{ mt: 2, mb: 4 }}>
        <HBox spacing={1}>
          <CoreButton
            variant={
              percentileButtonClicked === 'Select 5th, 50th, 95th'
                ? 'contained'
                : 'outlined'
            }
            label="Select 5th, 50th, 95th"
            onClick={() => {
              setPercentilesDisplayed([5, 50, 95]);
              setPercentileButtonClicked('Select 5th, 50th, 95th');
            }}
            size="small"
          />
          <CoreButton
            variant={
              percentileButtonClicked === 'Select 10th, 50th, 90th'
                ? 'contained'
                : 'outlined'
            }
            label="Select 10th, 50th, 90th"
            onClick={() => {
              setPercentilesDisplayed([10, 50, 90]);
              setPercentileButtonClicked('Select 10th, 50th, 90th');
            }}
            size="small"
          />
          <CoreButton
            variant={
              percentileButtonClicked === 'Select 25th, 50th, 75th'
                ? 'contained'
                : 'outlined'
            }
            label="Select 25th, 50th, 75th"
            onClick={() => {
              setPercentilesDisplayed([25, 50, 75]);
              setPercentileButtonClicked('Select 25th, 50th, 75th');
            }}
            size="small"
          />
        </HBox>
        <CoreButton
          variant={
            percentileButtonClicked === 'Select All' ? 'contained' : 'outlined'
          }
          label="Select All"
          onClick={() => {
            setPercentilesDisplayed(percentilesData as number[]);
            setPercentileButtonClicked('Select All');
          }}
          size="small"
        />
      </HBox>
      <MultilineChart
        height={500}
        chartType="line"
        yLabel="Concentration of Nitrate as N [mg/L]"
        annotations={[
          {
            date: reductionStartYear,
            title: 'Implementation start year',
          },
          {
            date: reductionCompleteYear,
            title: 'Implementation complete year',
          },
        ]}
        data={displayData}
      />
    </Box>
  );
};

export default ModelChart;
