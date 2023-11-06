import { Brush } from '@visx/brush';
import type BaseBrush from '@visx/brush/lib/BaseBrush';
import type { BrushHandleRenderProps } from '@visx/brush/lib/BrushHandle';
import type { Bounds } from '@visx/brush/lib/types';
import { Group } from '@visx/group';
import { PatternLines } from '@visx/pattern';
import { scaleLinear, scaleTime } from '@visx/scale';
import React, { useMemo, useRef, useState } from 'react';

import type {
  ChartDataPoint,
  MultilineChartBaseProps,
} from './MultilineChartBase';
import MultilineChartBase from './MultilineChartBase';

export interface BrushedValue {
  start: number;
  end: number;
}

export interface MultilineChartProps extends MultilineChartBaseProps {
  brushed?: BrushedValue;
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

export default function MultilineChart({
  height,
  width,
  chartType = 'line',
  data,
  min,
  max,
}: MultilineChartProps) {
  const getDate = (dataPoint: ChartDataPoint) => dataPoint.year;

  const PATTERN_ID = 'brush_pattern';
  const selectedBrushStyle = {
    fill: `url(#${PATTERN_ID})`,
    stroke: 'white',
  };
  const brushRef = useRef<BaseBrush | null>(null);
  const [filteredData, setFilteredData] = useState(data);
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

  const margin = {
    top: 20,
    left: 50,
    bottom: 20,
    right: 20,
  };
  const brushMargin = { top: 10, bottom: 15, left: 50, right: 20 };

  const chartSeparation = 30;
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
        domain: [min, max],
      }),
    [xBrushMax],
  );
  const brushStockScale = useMemo(
    () =>
      scaleLinear({
        range: [yBrushMax, 0],
        domain: [0, 17],
        nice: true,
      }),
    [yBrushMax],
  );

  const initialBrushPosition = useMemo(
    () => ({
      start: { x: brushDateScale(min) },
      end: { x: brushDateScale(max) },
    }),
    [brushDateScale],
  );

  return (
    <div>
      <MultilineChartBase
        height={height}
        width={width}
        chartType={chartType}
        data={filteredData}
        min={min}
        max={max}
        margin={margin}
      />
      <svg width={width} style={{ paddingLeft: 50 }} height={yBrushMax}>
        <PatternLines
          id={PATTERN_ID}
          height={8}
          width={8}
          stroke="lightgrey"
          strokeWidth={8}
          orientation={['diagonal']}
        />
        <Brush
          xScale={brushDateScale}
          yScale={brushStockScale}
          width={xBrushMax}
          height={yBrushMax}
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
}
