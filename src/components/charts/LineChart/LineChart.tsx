import type { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

import { PRIMARY_COLOR } from '@/components/theme';

const ChartNoSSR = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface LineChartProps {
  data: ApexAxisChartSeries;
  reductionStartYear?: number;
  reductionEndYear?: number;
  title?: string;
  xTitle?: string;
  yTitle?: string;
  variant?: 'percentiles' | 'numeric';
}

const LineChart = ({
  data,
  reductionEndYear,
  reductionStartYear,
  title,
  xTitle,
  yTitle='Nitrate-N [mg/L]',
  variant = 'percentiles',
}: LineChartProps) => {
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

  const options: ApexOptions = {
    annotations: {
      xaxis: getAnnotations(),
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
    },
    title: {
      text: `${title ?? ''}`,
      align: 'left',
    },
    xaxis:
      variant === 'percentiles'
        ? {
            title: {
              text: `${xTitle ?? ''}`,
            },
            tickAmount: 21,
          }
        : {
            type: 'numeric',
            title: {
              text: `${xTitle ?? ''}`,
            },
            labels: {
              formatter(value: string, _: any, opts?: any) {
                // get useful data from ApexChart internal state
                const ticks = opts?.w?.globals?.labels.length;
                const min = opts?.w?.globals?.minX;
                const max = opts?.w?.globals?.maxX;
                const step = (max - min) / ticks;

                if (!step) {
                  return value;
                }

                // find the first non-zero digit to determine how much precision to differentiate ticks
                const val = Number(value);
                const chars = step.toString().split('');
                const index = chars.findIndex(
                  (char) => char >= '1' && char <= '9',
                );

                // don't count the decimal point
                if (index > 1) {
                  return val.toFixed(index - 1);
                }
                return val.toFixed(0);
              },
            },
          },
    tooltip: {
      inverseOrder: true,
      x: {
        formatter(val) {
          // set the tooltip's x-value with max 3 decimal places and no trailing zeroes
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
          // set y-axis ticks with max 3 decimal places and no trailing zeroes
          if (variant === 'numeric') {
            return parseFloat(val.toFixed(3)).toString();
          }
          // for the percentile charts, 2 decimal places is best
          return (val ?? 0).toFixed(2);
        },
      },
    },
    colors: [
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
    ],
  };

  return (
    <ChartNoSSR
      type="line"
      options={options}
      series={data}
      width="100%"
      height={500}
    />
  );
};

export default LineChart;
