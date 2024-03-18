import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';

import LineChart from '@/components/charts/LineChart/LineChart';
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

  function configureDisplayData(
    percentilesInput: number[],
  ): ApexAxisChartSeries {
    const res: ApexAxisChartSeries = [];
    percentilesInput.forEach((p) => {
      const chartData: any = [];
      ((plotData as any)[p] as ModelDisplay[] | undefined)?.forEach(
        (data: ModelDisplay) => {
          chartData.push({
            x: data.year,
            y: data.value,
          });
        },
      );
      res.push({
        name: `${p}th percentile`,
        data: chartData,
      });
    });
    return res;
  }

  const [displayData, setDisplayData] = useState<ApexAxisChartSeries>(
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
      <LineChart
        data={displayData}
        reductionEndYear={reductionCompleteYear}
        reductionStartYear={reductionStartYear}
      />
    </Box>
  );
};

export default ModelChart;
