import type { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

const options: ApexOptions = {
  chart: {
    height: 200,
    type: 'heatmap',
  },
  colors: ['#5A9BD5'],
  plotOptions: {
    heatmap: {
      shadeIntensity: 1,
    },
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    custom({ series, seriesIndex, dataPointIndex, w }) {
      if (w.globals.seriesNames[seriesIndex] !== '') {
        return series[seriesIndex][dataPointIndex];
      }
      return '';
    },
  },
};

const ChartNoSSR = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface DifferenceHeatmapProps {
  data: ApexAxisChartSeries;
}

const DifferenceHeatmap = ({ data }: DifferenceHeatmapProps) => {
  return (
    <ChartNoSSR
      options={options}
      series={data}
      type="heatmap"
      width="100%"
      height={500}
    />
  );
};

export default DifferenceHeatmap;
