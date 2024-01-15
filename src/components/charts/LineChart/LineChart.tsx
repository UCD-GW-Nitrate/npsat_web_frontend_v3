import type { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';

import { PRIMARY_COLOR } from '@/components/theme';

interface LineChartProps {
  data: ApexAxisChartSeries;
  reductionStartYear?: number;
  reductionEndYear?: number;
  title?: string;
}

const LineChart = ({
  data,
  reductionEndYear,
  reductionStartYear,
  title,
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
      tickAmount: 31,
    },
    tooltip: {
      inverseOrder: true,
    },
  };

  return (
    <Chart
      type="line"
      options={options}
      series={data}
      width="100%"
      height={500}
    />
  );
};

export default LineChart;