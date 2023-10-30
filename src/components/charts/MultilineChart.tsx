import { Brush } from '@visx/brush';
import type BaseBrush from '@visx/brush/lib/BaseBrush';
import type { BrushHandleRenderProps } from '@visx/brush/lib/BrushHandle';
import type { Bounds } from '@visx/brush/lib/types';
import { Group } from '@visx/group';
import type { CityTemperature } from '@visx/mock-data/lib/mocks/cityTemperature';
import cityTemperature from '@visx/mock-data/lib/mocks/cityTemperature';
import { PatternLines } from '@visx/pattern';
import { scaleLinear, scaleTime } from '@visx/scale';
import React, { useMemo, useRef, useState } from 'react';

import type { MultilineChartBaseProps } from './MultilineChartBase';
import MultilineChartBase from './MultilineChartBase';

export interface Annotation {
  date: Date;
  text: string;
}

export interface BrushedValue {
  start: Date;
  end: Date;
}

export interface MultilineChartProps extends MultilineChartBaseProps {
  annotations?: Annotation[];
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
}: MultilineChartProps) {
  const getDate = (d: CityTemperature) => d.date;

  const oldData = cityTemperature.slice(150, 275);

  const brushMargin = { top: 10, bottom: 10, left: 50, right: 20 };
  const PATTERN_ID = 'brush_pattern';
  const accentColor = '#f6acc8';
  const selectedBrushStyle = {
    fill: `url(#${PATTERN_ID})`,
    stroke: 'white',
  };
  const brushRef = useRef<BaseBrush | null>(null);
  const [filteredData, setFilteredData] = useState(oldData);
  const onBrushChange = (domain: Bounds | null) => {
    if (!domain) return;
    const { x0, x1 } = domain;
    const dataCopy = oldData.filter((s) => {
      const x = Date.parse(getDate(s));
      return x > x0 && x < x1;
    });
    setFilteredData(dataCopy);
  };

  const xBrushMax = width;
  const yBrushMax = height / 8;

  // scales
  const brushDateScale = useMemo(
    () =>
      scaleTime<number>({
        range: [0, xBrushMax],
        domain: [
          Date.parse(getDate(oldData[0]!)),
          Date.parse(getDate(oldData[100]!)),
        ],
      }),
    [xBrushMax],
  );
  const brushStockScale = useMemo(
    () =>
      scaleLinear({
        range: [yBrushMax, 0],
        domain: [0, height],
        nice: true,
      }),
    [yBrushMax],
  );

  const initialBrushPosition = useMemo(
    () => ({
      start: { x: brushDateScale(Date.parse(getDate(filteredData[50]!))) },
      end: { x: brushDateScale(Date.parse(getDate(oldData[100]!))) },
    }),
    [brushDateScale],
  );

  return (
    <div>
      <MultilineChartBase
        height={height}
        width={width}
        chartType={chartType}
        data={data}
      />
      <svg style={{ width: xBrushMax, height: yBrushMax }}>
        <div style={{ width: xBrushMax, height: yBrushMax }} />
        <PatternLines
          id={PATTERN_ID}
          height={8}
          width={8}
          stroke={accentColor}
          strokeWidth={1}
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
