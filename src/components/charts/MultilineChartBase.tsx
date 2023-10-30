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
import React from 'react';

import CustomChartBackground from './CustomChartBackground';

export interface ChartDataPoint {
  year: number;
  value: number;
}

export interface ChartData {
  [percentile: string]: ChartDataPoint[];
}

export interface MultilineChartBaseProps {
  width: number;
  height: number;
  chartType: 'bar' | 'line' | 'area';
  data: { [percentile: string]: ChartDataPoint[] };
}

export default function MultilineChartBase({
  height,
  width,
  chartType = 'line',
  data,
}: MultilineChartBaseProps) {
  const getDate = (dataPoint: ChartDataPoint) => dataPoint.year;
  const getValue = (dataPoint: ChartDataPoint) => dataPoint.value;

  return (
    <XYChart
      theme={lightTheme}
      xScale={{ type: 'band', paddingInner: 0.3 }}
      yScale={{ type: 'linear' }}
      height={Math.min(400, height)}
      width={width}
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
          {Object.keys(data).map((percentile: string) => {
            return (
              <BarSeries
                key={percentile}
                dataKey={percentile}
                data={data[percentile]!}
                xAccessor={getDate}
                yAccessor={getValue}
              />
            );
          })}
        </BarGroup>
      )}
      {chartType === 'area' && (
        <>
          {Object.keys(data).map((percentile: string) => {
            return (
              <AreaSeries
                key={percentile}
                dataKey={percentile}
                data={data[percentile]!}
                xAccessor={getDate}
                yAccessor={getValue}
                fillOpacity={0.4}
              />
            );
          })}
        </>
      )}
      {chartType === 'line' && (
        <>
          {Object.keys(data).map((percentile: string) => {
            return (
              <LineSeries
                key={percentile}
                dataKey={percentile}
                data={data[percentile]!}
                xAccessor={getDate}
                yAccessor={getValue}
              />
            );
          })}
        </>
      )}
      <Axis orientation="bottom" numTicks={4} />
      <AnimatedAxis orientation="left" numTicks={4} animationTrajectory="min" />
      <Tooltip<ChartDataPoint>
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
                (percentile) => percentile,
              ) as string[]
            ).map((percentile) => {
              const startYear = data[percentile]?.[0]?.year;
              const selectedYear = tooltipData?.nearestDatum?.datum.year;
              const value =
                selectedYear &&
                startYear &&
                data[percentile]?.[selectedYear - startYear]?.value;

              return (
                <div key={percentile}>
                  <em
                    style={{
                      color: colorScale?.(percentile),
                    }}
                  >
                    {percentile}
                  </em>{' '}
                  {value == null || Number.isNaN(value) ? '–' : `${value}`}
                </div>
              );
            })}
          </>
        )}
      />
    </XYChart>
  );
}
