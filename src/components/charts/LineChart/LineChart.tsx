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
}

const LineChart = ({
  data,
  reductionEndYear,
  reductionStartYear,
  title,
  xTitle,
  yTitle,
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
    xaxis: {
      title: {
        text: `${xTitle ?? ''}`,
      },
      tickAmount: 21,
    },
    tooltip: {
      inverseOrder: true,
    },
    yaxis: {
      title: {
        text: `${yTitle ?? ''}`,
      },
      labels: {
        formatter(val) {
          if (title === "URFs") {
            if (!val.toFixed(3).endsWith('0')) {
              if (!val.toFixed(4).endsWith('0')) {
                return val.toFixed(3);
              }
              return val.toFixed(3);
            }
          }
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
