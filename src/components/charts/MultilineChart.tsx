import { Brush } from '@visx/brush';
import type BaseBrush from '@visx/brush/lib/BaseBrush';
import type { BrushHandleRenderProps } from '@visx/brush/lib/BrushHandle';
import type { Bounds } from '@visx/brush/lib/types';
import { Group } from '@visx/group';
import type { CityTemperature } from '@visx/mock-data/lib/mocks/cityTemperature';
import cityTemperature from '@visx/mock-data/lib/mocks/cityTemperature';
import { PatternLines } from '@visx/pattern';
import { scaleLinear, scaleTime } from '@visx/scale';
import {
  AnimatedAxis,
  AnimatedGrid,
  AreaSeries,
  Axis,
  BarGroup,
  BarSeries,
  lightTheme,
  LineSeries,
  Tooltip,
  XYChart,
} from '@visx/xychart';
import React, { useCallback, useMemo, useRef, useState } from 'react';

import CustomChartBackground from './CustomChartBackground';

export type MultilineChartProps = {
  width: number;
  height: number;
  chartType: 'bar' | 'line' | 'area';
};

type City = 'San Francisco' | 'New York' | 'Austin';

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
}: MultilineChartProps) {
  type Accessor = (d: CityTemperature) => number | string;

  interface Accessors {
    'San Francisco': Accessor;
    'New York': Accessor;
    Austin: Accessor;
  }

  type DataKey = keyof Accessors;

  const defaultAnnotationDataIndex = 13;
  const [annotationDataKey, setAnnotationDataKey] = useState<DataKey | null>(
    null,
  );
  const [annotationDataIndex, setAnnotationDataIndex] = useState(
    defaultAnnotationDataIndex,
  );
  const getDate = (d: CityTemperature) => d.date;
  const getSfTemperature = (d: CityTemperature) => Number(d['San Francisco']);
  const getNyTemperature = (d: CityTemperature) => Number(d['New York']);
  const getAustinTemperature = (d: CityTemperature) => Number(d.Austin);

  const data = cityTemperature.slice(150, 275);

  const selectedDatumPatternId = 'xychart-selected-datum';
  const colorAccessorFactory = useCallback(
    (dataKey: DataKey) => (d: CityTemperature) =>
      annotationDataKey === dataKey && d === data[annotationDataIndex]
        ? `url(#${selectedDatumPatternId})`
        : null,
    [annotationDataIndex, annotationDataKey],
  );

  const accessors = {
    x: {
      'San Francisco': getDate,
      'New York': getDate,
      Austin: getDate,
    },
    y: {
      'San Francisco': getSfTemperature,
      'New York': getNyTemperature,
      Austin: getAustinTemperature,
    },
    date: getDate,
  };

  const brushMargin = { top: 10, bottom: 10, left: 50, right: 20 };
  const PATTERN_ID = 'brush_pattern';
  const accentColor = '#f6acc8';
  const selectedBrushStyle = {
    fill: `url(#${PATTERN_ID})`,
    stroke: 'white',
  };
  const brushRef = useRef<BaseBrush | null>(null);
  const [filteredData, setFilteredData] = useState(data);
  const onBrushChange = (domain: Bounds | null) => {
    if (!domain) return;
    const { x0, x1 } = domain;
    const dataCopy = data.filter((s) => {
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
          Date.parse(getDate(data[0]!)),
          Date.parse(getDate(data[100]!)),
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
      start: { x: brushDateScale(Date.parse(getDate(data[50]!))) },
      end: { x: brushDateScale(Date.parse(getDate(data[100]!))) },
    }),
    [brushDateScale],
  );

  return (
    <div>
      <XYChart
        theme={lightTheme}
        xScale={{ type: 'band', paddingInner: 0.3 }}
        yScale={{ type: 'linear' }}
        height={Math.min(400, height)}
        onPointerUp={(d) => {
          setAnnotationDataKey(
            d.key as 'New York' | 'San Francisco' | 'Austin',
          );
          setAnnotationDataIndex(d.index);
        }}
      >
        <CustomChartBackground />
        <AnimatedGrid
          rows={false}
          columns={false}
          animationTrajectory="center"
          numTicks={4}
        />
        {chartType === 'bar' && (
          <BarGroup>
            <BarSeries
              dataKey="New York"
              data={filteredData}
              xAccessor={getDate}
              yAccessor={getNyTemperature}
              colorAccessor={colorAccessorFactory('New York')}
            />
            <BarSeries
              dataKey="San Francisco"
              data={filteredData}
              xAccessor={getDate}
              yAccessor={getSfTemperature}
              colorAccessor={colorAccessorFactory('San Francisco')}
            />
            <BarSeries
              dataKey="Austin"
              data={filteredData}
              xAccessor={getDate}
              yAccessor={getAustinTemperature}
              colorAccessor={colorAccessorFactory('Austin')}
            />
          </BarGroup>
        )}
        {chartType === 'area' && (
          <>
            <AreaSeries
              dataKey="Austin"
              data={filteredData}
              xAccessor={getDate}
              yAccessor={getAustinTemperature}
              fillOpacity={0.4}
            />
            <AreaSeries
              dataKey="New York"
              data={filteredData}
              xAccessor={getDate}
              yAccessor={getNyTemperature}
              fillOpacity={0.4}
            />
            <AreaSeries
              dataKey="San Francisco"
              data={filteredData}
              xAccessor={getDate}
              yAccessor={getSfTemperature}
              fillOpacity={0.4}
            />
          </>
        )}
        {chartType === 'line' && (
          <>
            <LineSeries
              dataKey="Austin"
              data={filteredData}
              xAccessor={getDate}
              yAccessor={getAustinTemperature}
            />
            <LineSeries
              dataKey="New York"
              data={filteredData}
              xAccessor={getDate}
              yAccessor={getNyTemperature}
            />
            <LineSeries
              dataKey="San Francisco"
              data={filteredData}
              xAccessor={getDate}
              yAccessor={getSfTemperature}
            />
          </>
        )}
        <Axis orientation="bottom" numTicks={4} />
        <AnimatedAxis
          orientation="left"
          numTicks={4}
          animationTrajectory="min"
        />
        <Tooltip<CityTemperature>
          showVerticalCrosshair
          snapTooltipToDatumX
          renderTooltip={({ tooltipData, colorScale }) => (
            <>
              {/** date */}
              {(tooltipData?.nearestDatum?.datum &&
                getDate(tooltipData?.nearestDatum?.datum)) ||
                'No date'}
              <br />
              <br />
              {/** temperatures */}
              {(
                Object.keys(tooltipData?.datumByKey ?? {}).filter(
                  (city) => city,
                ) as City[]
              ).map((city) => {
                const temperature =
                  tooltipData?.nearestDatum?.datum &&
                  accessors.y[city](tooltipData?.nearestDatum?.datum);

                return (
                  <div key={city}>
                    <em
                      style={{
                        color: colorScale?.(city),
                        textDecoration:
                          tooltipData?.nearestDatum?.key === city
                            ? 'underline'
                            : undefined,
                      }}
                    >
                      {city}
                    </em>{' '}
                    {temperature == null || Number.isNaN(temperature)
                      ? '–'
                      : `${temperature}° F`}
                  </div>
                );
              })}
            </>
          )}
        />
      </XYChart>
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
