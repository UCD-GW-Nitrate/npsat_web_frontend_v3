import { ParentSize } from '@visx/responsive';
import type { Margin } from '@visx/xychart';
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
import type { PropsWithChildren } from 'react';
import React from 'react';

import { PRIMARY_COLOR } from '@/components/theme';

import CustomChartBackground from './CustomChartBackground';

export interface ChartDataPoint {
  year: number;
  value: number;
}

export interface ChartData {
  [model: string]: ChartDataPoint[];
}

export interface ChartAnnotation {
  date: number;
  title: string;
  color?: string;
}

export interface MultilineChartBaseProps extends PropsWithChildren {
  height: number;
  chartType: 'bar' | 'line' | 'area';
  data: ChartData;
  xLabel?: string;
  yLabel?: string;
  tooltip?: boolean;
  axis?: boolean;
  annotations?: ChartAnnotation[];
  margin?: Margin;
}

export default function MultilineChartBase({
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
}: MultilineChartBaseProps) {
  const getDate = (dataPoint: ChartDataPoint) => dataPoint.year;
  const getValue = (dataPoint: ChartDataPoint) => dataPoint.value;

  let startYear = 4000;
  Object.keys(data).forEach((model: string) => {
    if (
      data[model]?.length &&
      data[model]?.length! > 0 &&
      startYear > data[model]![0]!.year
    ) {
      startYear = data[model]![0]!.year;
    }
  });

  return (
    <ParentSize>
      {(parent) => (
        <XYChart
          theme={lightTheme}
          xScale={{ type: 'band' }}
          yScale={{ type: 'linear' }}
          height={height}
          width={parent.width}
          margin={margin}
        >
          <CustomChartBackground />
          {children}
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
              {data && Object.keys(data).length > 0 && (
                <LineSeries
                  key="zero"
                  dataKey="zero"
                  data={data[Object.keys(data)[0]!]!}
                  xAccessor={getDate}
                  yAccessor={() => 0}
                />
              )}
            </>
          )}
          {annotations && annotations?.length > 0 && (
            <>
              {annotations.map((annotation: ChartAnnotation) => (
                <>
                  {Object.keys(data)[0] &&
                    annotation.date &&
                    data[Object.keys(data)[0]!] &&
                    data[Object.keys(data)[0]!]!.length > 0 &&
                    data[Object.keys(data)[0]!]!.length >
                      annotation.date - data[Object.keys(data)[0]!]![0]!.year &&
                    annotation.date - data[Object.keys(data)[0]!]![0]!.year >=
                      0 && (
                      <Annotation
                        dataKey="zero"
                        datum={
                          data[Object.keys(data)[0]!]![
                            annotation.date -
                              data[Object.keys(data)[0]!]![0]!.year
                          ]!
                        }
                        dx={11}
                        dy={-260}
                        canEditSubject={false}
                        key={annotation.date}
                      >
                        <AnnotationLineSubject
                          stroke={annotation.color ?? PRIMARY_COLOR}
                        />
                        <AnnotationLabel
                          title={annotation.title}
                          showAnchorLine={false}
                          width={30}
                          backgroundProps={{
                            strokeOpacity: 0,
                            fillOpacity: 0,
                          }}
                          fontColor={annotation.color ?? PRIMARY_COLOR}
                          titleProps={{ writingMode: 'vertical-rl' }}
                        />
                      </Annotation>
                    )}
                </>
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
                <div style={{ margin: 5 }}>
                  {(tooltipData?.nearestDatum?.datum &&
                    getDate(tooltipData?.nearestDatum?.datum)) ||
                    'No date'}
                  <br />
                  <br />
                  {(Object.keys(data).filter((model) => model) as string[]).map(
                    (model) => {
                      const selectedYear =
                        tooltipData?.nearestDatum?.datum.year;
                      const value =
                        selectedYear &&
                        startYear &&
                        data[model]?.[selectedYear - startYear]?.value;

                      return (
                        <div key={model} style={{ marginBottom: 4 }}>
                          <span
                            style={{
                              color: colorScale?.(model),
                            }}
                          >
                            {model}:
                          </span>
                          {'   '}
                          {value == null || Number.isNaN(value)
                            ? '–'
                            : `${value}`}
                        </div>
                      );
                    },
                  )}
                </div>
              )}
            />
          )}
        </XYChart>
      )}
    </ParentSize>
  );
}
