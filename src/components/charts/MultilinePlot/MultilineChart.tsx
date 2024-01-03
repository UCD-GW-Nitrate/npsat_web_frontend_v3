import { Brush } from '@visx/brush';
import type BaseBrush from '@visx/brush/lib/BaseBrush';
import type { BrushHandleRenderProps } from '@visx/brush/lib/BrushHandle';
import type { Bounds } from '@visx/brush/lib/types';
import { Group } from '@visx/group';
import { PatternLines } from '@visx/pattern';
import { ParentSize } from '@visx/responsive';
import { scaleLinear, scaleTime } from '@visx/scale';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import type {
  ChartDataPoint,
  MultilineChartBaseProps,
} from './MultilineChartBase';
import MultilineChartBase from './MultilineChartBase';

export interface MultilineChartFixedProps extends MultilineChartBaseProps {
  width: number;
}

function BrushHandle({ x, height, isBrushActive }: BrushHandleRenderProps) {
  const pathWidth = 8;
  const pathHeight = 15;
  if (!isBrushActive) {
    return null;
  }
  return (
    <Group left={x + pathWidth / 2} top={(height - pathHeight) / 2}>
      <path
        fill="#f2f2f2"
        d="M -4.5 0.5 L 3.5 0.5 L 3.5 15.5 L -4.5 15.5 L -4.5 0.5 M -1.5 4 L -1.5 12 M 0.5 4 L 0.5 12"
        stroke="#999999"
        strokeWidth="1"
        style={{ cursor: 'ew-resize' }}
      />
    </Group>
  );
}

export const MultilineChartFixed = ({
  width,
  height,
  chartType = 'line',
  data,
  xLabel,
  yLabel,
  tooltip = true,
  axis = true,
  annotations,
  margin = {
    top: 20,
    left: 50,
    bottom: 20,
    right: 20,
  },
  children,
}: MultilineChartFixedProps) => {
  const getDate = (dataPoint: ChartDataPoint) => dataPoint.year;

  const PATTERN_ID = 'brush_pattern';
  const selectedBrushStyle = {
    fill: `url(#${PATTERN_ID})`,
    stroke: 'white',
  };
  const brushRef = useRef<BaseBrush | null>(null);
  const [filteredData, setFilteredData] = useState(data);
  const [minDate, setMinDate] = useState<number>(0);
  const [maxDate, setMaxDate] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(0);

  useEffect(() => {
    let minDateTemp = 100000000;
    let minValTemp = 100000000;
    let maxDateTemp = 0;
    let maxValTemp = 0;

    Object.keys(data).forEach((model: string) => {
      if (data[model]?.length && data[model]?.length! > 0) {
        for (let i = 0; i < data[model]?.length!; i += 1) {
          const dataPoint = data[model]![i]!;
          if (dataPoint.value < minValTemp) {
            minValTemp = dataPoint.value;
          } else if (dataPoint.value > maxValTemp) {
            maxValTemp = dataPoint.value;
          }

          if (dataPoint.year < minDateTemp) {
            minDateTemp = dataPoint.year;
          } else if (dataPoint.year > maxDateTemp) {
            maxDateTemp = dataPoint.year;
          }
        }
      }
    });

    setMinDate(minDateTemp);
    setMaxDate(maxDateTemp);
    setMaxValue(maxValTemp);
    setFilteredData(data);
  }, [data]);

  const onBrushChange = (domain: Bounds | null) => {
    if (!domain) return;
    const { x0, x1 } = domain;
    const dataCopy = structuredClone(data);
    Object.keys(dataCopy).forEach((key) => {
      if (dataCopy[key] !== undefined) {
        dataCopy[key] = dataCopy[key]!.filter((s) => {
          const x = getDate(s);
          return x > x0 && x < x1;
        });
      }
    });
    setFilteredData(dataCopy);
  };

  const brushMargin = {
    top: 10,
    bottom: 15,
    left: margin.left,
    right: margin.right,
  };

  const chartSeparation = 40;
  const innerHeight = height - margin.top - margin.bottom;
  const topChartBottomMargin = chartSeparation / 2;
  const topChartHeight = 0.8 * innerHeight - topChartBottomMargin;
  const bottomChartHeight = innerHeight - topChartHeight - chartSeparation;

  const xBrushMax = Math.max(width - brushMargin.left - brushMargin.right, 0);
  const yBrushMax = Math.max(
    bottomChartHeight - brushMargin.top - brushMargin.bottom,
    0,
  );

  // scales
  const brushDateScale = useMemo(
    () =>
      scaleTime<number>({
        range: [0, xBrushMax],
        domain: [minDate, maxDate + 1],
      }),
    [xBrushMax, minDate, maxDate],
  );
  const brushStockScale = useMemo(
    () =>
      scaleLinear({
        range: [yBrushMax, 0],
        domain: [0, maxValue],
        nice: true,
      }),
    [yBrushMax, maxValue],
  );

  const initialBrushPosition = useMemo(
    () => ({
      start: { x: 0 },
      end: { x: xBrushMax },
    }),
    [brushDateScale],
  );

  return (
    <div>
      <MultilineChartBase
        height={height}
        chartType={chartType}
        data={filteredData}
        margin={margin}
        xLabel={xLabel}
        yLabel={yLabel}
        tooltip={tooltip}
        axis={axis}
        annotations={annotations}
      >
        {children}
      </MultilineChartBase>
      <svg
        style={{
          marginLeft: brushMargin.left,
          width: xBrushMax,
          overflow: 'visible',
          backgroundColor: '#f6f6f6',
          marginTop: 8,
        }}
        height={14}
      >
        <PatternLines
          id={PATTERN_ID}
          height={1}
          width={1}
          stroke="#deeff5"
          strokeWidth={1}
          orientation={['diagonal']}
        />
        <Brush
          xScale={brushDateScale}
          yScale={brushStockScale}
          width={xBrushMax}
          height={14}
          margin={brushMargin}
          handleSize={8}
          innerRef={brushRef}
          resizeTriggerAreas={['left', 'right']}
          brushDirection="horizontal"
          initialBrushPosition={initialBrushPosition}
          onChange={onBrushChange}
          selectedBoxStyle={selectedBrushStyle}
          useWindowMoveEvents
          renderBrushHandle={(props) => <BrushHandle {...props} />}
        />
      </svg>
    </div>
  );
};

const MultilineChart = ({
  height,
  chartType = 'line',
  data,
  xLabel,
  yLabel,
  tooltip = true,
  axis = true,
  annotations,
  margin,
  children,
}: MultilineChartBaseProps) => {
  return (
    <ParentSize>
      {(parent) => {
        if (parent.width === 0) {
          return <div />;
        }
        return (
          <MultilineChartFixed
            width={parent.width}
            height={height}
            chartType={chartType}
            data={data}
            xLabel={xLabel}
            yLabel={yLabel}
            tooltip={tooltip}
            axis={axis}
            annotations={annotations}
            margin={margin}
          >
            {children}
          </MultilineChartFixed>
        );
      }}
    </ParentSize>
  );
};

export default MultilineChart;
