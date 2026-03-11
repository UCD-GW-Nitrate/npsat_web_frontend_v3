import type { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

import { PRIMARY_COLOR } from '@/components/theme';

const ChartNoSSR = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface BoxPlotProps {
  data: ApexAxisChartSeries;
  reductionStartYear?: number;
  reductionEndYear?: number;
  title?: string;
  variant?: 'default' | 'standard';
}

const BoxPlot = ({
  data,
  reductionEndYear,
  reductionStartYear,
  title,
  variant='default',
}: BoxPlotProps) => {
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
    title: {
      text: `${title ?? ''}`,
      align: 'left',
    },
    tooltip: {
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const yValues = w.config.series[seriesIndex].data[dataPointIndex].y;
        const labels = variant==='default' ? 
          ["5th Percentile", "Q1", "Median", "Q3", "95th Percentile"] 
          : ["Minimum", "Q1", "Median", "Q3", "Maximum"];

        return `
          <div class="apexcharts-tooltip-boxplot" style="padding: 8px; padding-bottom: 0px">
            ${
              labels.reverse().map(
                (label, i) =>
                  `<div style="margin-bottom: 8px;">${label}: <span style="font-weight:bold">${yValues[i]}</span></div>`
              )
              .join("")
            }
          </div>
        `;
      }
    },
    yaxis: {
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
      boxPlot: {
        colors: {
          lower: undefined,
          upper: undefined,
        },
      },
    },
  };

  return (
    <ChartNoSSR
      type="boxPlot"
      options={options}
      series={data}
      width="100%"
      height={500}
    />
  );
};

export default BoxPlot;
