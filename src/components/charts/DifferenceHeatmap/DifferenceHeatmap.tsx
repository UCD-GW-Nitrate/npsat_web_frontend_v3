import { Collapse } from 'antd';
import type { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

import HeatmapA11y from '../a11y/HeatmapA11y';

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
  title?: string;
  xTitle: string;
  yTitle: string;
  legendTitle?: string;
}

const DifferenceHeatmap = ({
  data,
  title,
  xTitle,
  yTitle,
  legendTitle,
}: DifferenceHeatmapProps) => {
  return (
    <>
      <ChartNoSSR
        options={options}
        series={data}
        type="heatmap"
        width="100%"
        height={500}
      />
      <Collapse
        items={[
          {
            key: '1',
            label: 'Trend Description',
            children: (
              <HeatmapA11y
                data={data}
                chartTitle={title ?? `${xTitle} vs ${yTitle}`}
                xTitle={xTitle ?? 'x'}
                yTitle={yTitle ?? 'y'}
                legendTitle={legendTitle ?? 'magnitude'}
              />
            ),
          },
        ]}
      />
    </>
  );
};

export default DifferenceHeatmap;
