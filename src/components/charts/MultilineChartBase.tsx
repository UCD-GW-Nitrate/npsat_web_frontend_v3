import {
  AnimatedAxis,
  AnimatedGrid,
  Annotation,
  AnnotationLabel,
  AnnotationLineSubject,
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

export interface ChartAnnotation {
  dataKey: string;
  index: number;
  title: string;
  color?: string;
}

export interface MultilineChartBaseProps {
  width: number;
  height: number;
  chartType: 'bar' | 'line' | 'area';
  data: ChartData;
  xLabel?: string;
  yLabel?: string;
  tooltip?: boolean;
  axis?: boolean;
  min: number;
  // eslint-disable-next-line react/no-unused-prop-types
  max: number;
  annotations?: ChartAnnotation[];
}

export default function MultilineChartBase({
  height,
  width,
  chartType = 'line',
  data,
  xLabel,
  yLabel,
  tooltip = true,
  axis = true,
  min,
  annotations,
}: MultilineChartBaseProps) {
  const getDate = (dataPoint: ChartDataPoint) => dataPoint.year;
  const getValue = (dataPoint: ChartDataPoint) => dataPoint.value;

  return (
    <XYChart
      theme={lightTheme}
      xScale={{ type: 'band' }}
      yScale={{ type: 'linear' }}
      height={height}
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
      {annotations && annotations?.length > 0 && (
        <>
          {annotations.map((annotation: ChartAnnotation) => (
            <Annotation
              dataKey={annotation.dataKey}
              datum={data[annotation.dataKey]![annotation.index]!}
              dx={1}
              dy={0}
              canEditSubject={false}
              key={annotation.dataKey + annotation.index}
            >
              <AnnotationLineSubject stroke={annotation.color ?? 'red'} />
              <AnnotationLabel
                title={annotation.title}
                showAnchorLine={false}
                width={30}
                backgroundProps={{
                  strokeOpacity: 0,
                  fillOpacity: 0,
                }}
                fontColor={annotation.color ?? 'red'}
                titleProps={{ writingMode: 'vertical-rl' }}
              />
            </Annotation>
          ))}
        </>
      )}
      {axis && (
        <>
          <Axis orientation="bottom" numTicks={4} label={xLabel} />
          <AnimatedAxis
            orientation="left"
            numTicks={4}
            animationTrajectory="min"
            label={yLabel}
          />
        </>
      )}
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
                const startYear = min;
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
