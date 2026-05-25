import { Collapse } from 'antd';
import type { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

import AccessibleViz from '../a11y/AccessibleViz';

const ChartNoSSR = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface LineChartProps {
  data: ApexAxisChartSeries;
  title?: string;
  xTitle?: string;
  yTitle?: string;
}

const Scatterplot = ({ data, title, xTitle, yTitle }: LineChartProps) => {
  const options: ApexOptions = {
    dataLabels: {
      enabled: false,
    },
    title: {
      text: `${title ?? ''}`,
      align: 'left',
    },
    xaxis: {
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
          const index = chars.findIndex((char) => char >= '1' && char <= '9');

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

  console.log('Data ', data);

  return (
    <>
      <ChartNoSSR
        type="scatter"
        options={options}
        series={data}
        width="100%"
        height={500}
      />
      <Collapse
        items={[
          {
            key: '1',
            label: 'Data Table View',
            children: (
              <AccessibleViz
                data={data.map((s, i) => ({
                  name: s.name ?? `Scatterplot ${i}`,
                  data: s.data.map((point) => ({
                    x: point[0] ?? 0,
                    y: point[1] ?? 0,
                  })),
                }))}
                xTitle={xTitle ?? 'x'}
                yTitle={yTitle ?? 'y'}
              />
            ),
          },
        ]}
      />
    </>
  );
};

export default Scatterplot;
