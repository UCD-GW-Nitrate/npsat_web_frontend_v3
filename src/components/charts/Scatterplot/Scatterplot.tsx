import type { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

const ChartNoSSR = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface LineChartProps {
  data: ApexAxisChartSeries;
  title?: string;
  xTitle?: string;
  yTitle?: string;
}

const Scatterplot = ({
  data,
  title,
  xTitle,
  yTitle,
}: LineChartProps) => {

  const options: ApexOptions = {
    dataLabels: {
      enabled: false,
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
          return val.toFixed(2);
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
      type="scatter"
      options={options}
      series={data}
      width="100%"
      height={500}
    />
  );
};

export default Scatterplot;
