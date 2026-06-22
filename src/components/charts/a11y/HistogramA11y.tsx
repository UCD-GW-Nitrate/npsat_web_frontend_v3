import { useMemo } from 'react';

import { generateHistogramDescription } from '@/logic/histogramDesc';

interface HistogramProps {
  data: ApexAxisChartSeries;
  xTitle: string;
  yTitle: string;
}

export default function HistogramA11y({
  data,
  xTitle,
  yTitle,
}: HistogramProps) {
  const description = useMemo(() => {
    return generateHistogramDescription(data, xTitle, yTitle);
  }, [data]);
  return (
    <>
      <p>{description}</p>
    </>
  );
}
