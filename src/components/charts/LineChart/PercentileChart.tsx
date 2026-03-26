import type { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';

import { PRIMARY_COLOR } from '@/components/theme';
import { ConfidenceIntervalResult } from '@/hooks/useDynamicPercentiles';

const ChartNoSSR = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const SERIES_COLORS = [
  '#54478C',
  '#2C699A',
  '#048BA8',
  '#0DB39E',
  '#16DB93',
  '#83E377',
  '#B9E769',
  '#EFEA5A',
  '#F1C453',
  '#F29E4C',
  '#FF4D6D',
  '#E63946',
];

interface LineChartProps {
  data: ApexAxisChartSeries;
  reductionStartYear?: number;
  reductionEndYear?: number;
  title?: string;
  xTitle?: string;
  yTitle?: string;
  confidenceAreaData?: ConfidenceIntervalResult[];
}

const PercentileChart = ({
  data,
  reductionEndYear,
  reductionStartYear,
  title,
  xTitle,
  yTitle = 'Nitrate-N [mg/L]',
  confidenceAreaData = [],
}: LineChartProps) => {
  const [zoomRange, setZoomRange] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [inactiveSeries, setInactiveSeries] = useState<number[]>([]);
  const xMin = useMemo(() => {
    return Math.min(...data.flatMap((s) => s.data.map((p) => p.x)));
  }, [data]);
  const xMax = useMemo(() => {
    return Math.max(...data.flatMap((s) => s.data.map((p) => p.x)));
  }, [data]);

  const getAnnotations = (): XAxisAnnotations[] => {
    const annotations: XAxisAnnotations[] = [];

    if (reductionEndYear) {
      annotations.push({
        x: reductionEndYear,
        borderColor: PRIMARY_COLOR,
        label: {
          text: 'Implementation end year',
          borderColor: PRIMARY_COLOR,
          style: {
            color: '#fff',
            background: PRIMARY_COLOR,
          },
        },
      });
    }

    if (reductionStartYear) {
      annotations.push({
        x: reductionStartYear,
        borderColor: PRIMARY_COLOR,
        label: {
          text: 'Implementation start year',
          borderColor: PRIMARY_COLOR,
          style: {
            color: '#fff',
            background: PRIMARY_COLOR,
          },
        },
      });
    }

    return annotations;
  };

  const rangeSeries = useMemo(() => {
    if (
      !confidenceAreaData ||
      !confidenceAreaData.length ||
      !data ||
      !data.length
    ) {
      return [];
    }

    const ranges = confidenceAreaData.map((s) => ({
      name: `${s.percentile}th percentile confidence interval`,
      type: 'rangeArea',
      data: s.lower.map((modelDisplay, idx) => ({
        x: modelDisplay.year,
        y: [modelDisplay.value, s.upper[idx]?.value]
      }))
    }));

    const shadow = data
      .filter((_s, idx) => !inactiveSeries.includes(idx))
      .map((s) => ({
        name: `${data[0]?.name ?? 'Data'}`,
        type: 'rangeArea',
        data: s.data.map((p) => ({
          x: p.x,
          y: [p.y, p.y],
        })),
      }));

    return [
      ...ranges,
      ...shadow,
    ];
  }, [confidenceAreaData, data, inactiveSeries]);

  const lineSeries = useMemo(() => {
    if (!data || !data.length) {
      return [];
    }

    const ciData = confidenceAreaData?.flatMap((obj) => [
      {
        name: `${obj.lower[0]?.percentile ?? 'Data'}`,
        type: 'line',
        data: obj.lower.map(modelDisplay => ({
          x: modelDisplay.year,
          y: modelDisplay.value
        })),
      },
      {
        name: `${obj.upper[0]?.percentile ?? 'Data'}`,
        type: 'line',
        data: obj.upper.map(modelDisplay => ({
          x: modelDisplay.year,
          y: modelDisplay.value
        })),
      },
    ]) ?? [];

    return [
      ...data,
      ...ciData,
    ];
  }, [confidenceAreaData, data]);

  const options: ApexOptions = {
    chart: {
      id: 'ci-line',
      animations: {
        enabled: true,
        dynamicAnimation: {
          enabled: true,
        },
      },
      events: {
        zoomed: (_ctx, { xaxis }) => {
          setZoomRange((prev) =>
            prev?.min === xaxis.min
              ? { min: xMin, max: xMax }
              : { min: xaxis.min, max: xaxis.max },
          );
        },
        legendClick: (ctx) => {
          requestAnimationFrame(() => {
            const globals = ctx?.w?.globals;
            if (!globals) return;

            const collapsedIndices = globals.collapsedSeriesIndices;
            setInactiveSeries([...collapsedIndices]);
          });
        },
      },
    },
    annotations: {
      xaxis: getAnnotations(),
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
      width: lineSeries.map((_, idx) => {
        if (idx < data.length) return 5;
        return 0;
      }),
    },
    fill: {
      opacity: lineSeries.map((_, idx) => {
        if (idx < data.length) return 1;
        return 0;
      }),
    },
    title: {
      text: `${title ?? ''}`,
      align: 'left',
    },
    xaxis: {
      title: {
        text: `${xTitle ?? ''}`,
      },
      tickAmount: 21,
      min: zoomRange?.min,
      max: zoomRange?.max,
    },
    tooltip: {
      inverseOrder: true,
      x: {
        formatter(val) {
          return parseFloat(val.toFixed(3)).toString();
        },
      },
    },
    yaxis: {
      title: {
        text: `${yTitle ?? ''}`,
      },
      labels: {
        formatter(val) {
          return (val ?? 0).toFixed(2);
        },
      },
    },
    colors: lineSeries.map((_, i) => {
      if (i < data.length) return SERIES_COLORS[i % SERIES_COLORS.length];
      return 'grey';
    }),
  };

  const rangeAreaOptions: ApexOptions = {
    chart: {
      id: 'ci-area',
      animations: {
        enabled: true,
        dynamicAnimation: {
          enabled: false,
        },
      },
      toolbar: { show: false },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
      width: 0,
    },
    fill: {
      opacity: [...confidenceAreaData.map(() => 0.2), ...lineSeries.map(() => 0)],
    },
    title: {
      text: `${title ?? ''}`,
      align: 'left',
    },
    grid: {
      borderColor: 'transparent',
    },
    xaxis: {
      tickAmount: 21,
      min: zoomRange?.min,
      max: zoomRange?.max,
      labels: {
        style: {
          colors: 'transparent',
        },
      },
      axisBorder: {
        color: 'transparent',
      },
      axisTicks: {
        color: 'transparent',
      },
    },
    tooltip: {
      enabled: false,
    },
    legend: {
      show: lineSeries.length > 1,
      customLegendItems: lineSeries.map((s) => s.name ?? ''),
      labels: {
        colors: 'transparent',
        useSeriesColors: false,
      },
      markers: {
        fillColors: lineSeries.map(() => 'transparent'),
      },
    },
    yaxis: {
      axisBorder: {
        color: 'transparent',
      },
      axisTicks: {
        color: 'transparent',
      },
      title: {
        text: `${yTitle ?? ''}`,
        style: {
          color: 'transparent',
        },
      },
      labels: {
        style: {
          colors: 'transparent',
        },
        formatter(val) {
          return (val ?? 0).toFixed(2);
        },
      },
    },
    colors: SERIES_COLORS,
  };

  return (
    <div
      style={{
        position: 'relative',
        height: 500,
      }}
    >
      <ChartNoSSR
        type="rangeArea"
        options={rangeAreaOptions}
        series={rangeSeries}
        width="100%"
        height={500}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
      <ChartNoSSR
        type="line"
        options={options}
        series={lineSeries}
        width="100%"
        height={500}
      />
    </div>
  );
};

export default PercentileChart;
