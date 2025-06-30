import type { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

const ChartNoSSR = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface HistogramProps {
  data: ApexAxisChartSeries;
  title?: string;
  xTitle?: string;
  yTitle?: string;
}

const Histogram = ({
  data,
  title,
  xTitle,
  yTitle,
}: HistogramProps) => {
  const options: ApexOptions = {
    title: {
      text: `${title ?? ''}`,
      align: 'left',
    },
    tooltip: {
      inverseOrder: true,
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      title: {
        text: `${xTitle ?? ''}`,
      },
      type: 'numeric',
      tickPlacement: 'on',
      labels: {
        formatter: (val) => Number(val).toFixed(0),
      },
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
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '80%',
        borderRadius: 4,
      },
    },
  };

  return (
    <ChartNoSSR
      type="bar"
      options={options}
      series={data}
      width="100%"
      height={500}
    />
  );
};

export default Histogram;
