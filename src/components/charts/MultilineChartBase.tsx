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
  [model: string]: ChartDataPoint[];
}

export interface MultilineChartBaseProps {
  width: number;
  height: number;
  chartType: 'bar' | 'line' | 'area';
  data: ChartData;
  xLabel?: string;
  yLabel?: string;
  tooltip?: boolean;
}

export default function MultilineChartBase({
  height,
  width,
  chartType = 'line',
  data,
  xLabel,
  yLabel,
  tooltip = true,
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
          {Object.keys(data).map((model: string) => {
            return (
              <BarSeries
                key={model}
                dataKey={model}
                data={data[model]!}
                xAccessor={getDate}
                yAccessor={getValue}
              />
            );
          })}
        </BarGroup>
      )}
      {chartType === 'area' && (
        <>
          {Object.keys(data).map((model: string) => {
            return (
              <AreaSeries
                key={model}
                dataKey={model}
                data={data[model]!}
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
          {Object.keys(data).map((model: string) => {
            return (
              <LineSeries
                key={model}
                dataKey={model}
                data={data[model]!}
                xAccessor={getDate}
                yAccessor={getValue}
              />
            );
          })}
        </>
      )}
      <Axis orientation="bottom" numTicks={4} label={xLabel} />
      <AnimatedAxis
        orientation="left"
        numTicks={4}
        animationTrajectory="min"
        label={yLabel}
      />
      {tooltip && (
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
                  (model) => model,
                ) as string[]
              ).map((model) => {
                const startYear = data[model]?.[0]?.year;
                const selectedYear = tooltipData?.nearestDatum?.datum.year;
                const value =
                  selectedYear &&
                  startYear &&
                  data[model]?.[selectedYear - startYear]?.value;

                return (
                  <div key={model}>
                    <em
                      style={{
                        color: colorScale?.(model),
                      }}
                    >
                      &#x2022;
                    </em>{' '}
                    <span>{model}</span>
                    {': '}
                    {value == null || Number.isNaN(value) ? '–' : `${value}`}
                  </div>
                );
              })}
            </>
          )}
        />
      )}
    </XYChart>
  );
}
