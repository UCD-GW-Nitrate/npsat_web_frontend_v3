import React, { useEffect, useState } from 'react';

import MultilineChart from '@/components/charts/MultilinePlot/MultilineChart';
import type { ChartDataPoint } from '@/components/charts/MultilinePlot/MultilineChartBase';
import { CoreButton } from '@/components/core/CoreButton/CoreButton';
import { CoreContainer } from '@/components/core/CoreContainer/CoreContainer';
import type { CoreMultipleSelectOption } from '@/components/core/CoreMultipleSelect/CoreMultipleSelect';
import { CoreMultipleSelect } from '@/components/core/CoreMultipleSelect/CoreMultipleSelect';
import { HBox } from '@/components/custom/HBox/Hbox';
import type { ModelDisplay } from '@/hooks/useModelResults';
import { useModelResults } from '@/hooks/useModelResults';
import type { Result } from '@/store/apis/modelApi';

interface ModelChartProps {
  percentiles: Result[];
}

interface DisplayData {
  [percentile: string]: ChartDataPoint[];
}

const ModelChart = ({ percentiles }: ModelChartProps) => {
  const [plotData, percentilesData] = useModelResults(percentiles);
  const [percentilesDisplayed, setPercentilesDisplayed] = useState<number[]>([
    5, 50, 95,
  ]);
  const [multSelect, setMultSelect] = useState<
    (CoreMultipleSelectOption | undefined)[]
  >([]);

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
        const res: CoreMultipleSelectOption = { label: `${p}`, value: p };
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
    <CoreContainer>
      <CoreMultipleSelect
        group={false}
        placeholder="Select Percentiles"
        sx={{ mt: 4, mx: 5 }}
        options={(percentilesData as number[]).map((p) => {
          const res: CoreMultipleSelectOption = { label: `${p}`, value: p };
          return res;
        })}
        fieldValue={multSelect}
        setFieldValue={handleMultSelect}
      />
      <HBox spacing={1} sx={{ mt: 2, ml: 5 }}>
        <CoreButton
          variant="contained"
          label="Select 5th, 50th, 95th"
          onClick={() => setPercentilesDisplayed([5, 50, 95])}
        />
        <CoreButton
          variant="contained"
          label="Select 10th, 50th, 90th"
          onClick={() => setPercentilesDisplayed([10, 50, 90])}
        />
        <CoreButton
          variant="contained"
          label="Select 25th, 50th, 75th"
          onClick={() => setPercentilesDisplayed([25, 50, 75])}
        />
      </HBox>
      <MultilineChart
        height={500}
        chartType="line"
        yLabel="Concentration of Nitrate as N [mg/L]"
        annotations={[
          {
            date: 1984,
            title: 'Implementation start year',
          },
          {
            date: 1995,
            title: 'Implementation complete year',
          },
        ]}
        data={displayData}
      />
    </CoreContainer>
  );
};

export default ModelChart;
