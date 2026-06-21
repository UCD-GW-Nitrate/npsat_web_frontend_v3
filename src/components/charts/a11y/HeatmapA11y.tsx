import { Select } from 'antd';
import { useMemo, useState } from 'react';

import { generateHeatmapSummary } from '@/logic/heatmapDesc';

interface HeatmapProps {
  data: ApexAxisChartSeries;
  chartTitle: string;
  xTitle: string;
  yTitle: string;
}

export default function HeatmapA11y({
  data,
  chartTitle,
  xTitle,
  yTitle,
}: HeatmapProps) {
  const { summary, percentileTrends } = useMemo(() => {
    return generateHeatmapSummary(data, xTitle, yTitle);
  }, [data]);
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  return (
    <>
      <p>{summary}</p>

      <Select
        showSearch
        placeholder="Select a percentile"
        options={data.map((s) => ({
          value: s.name,
          label: s.name,
        }))}
        onChange={setSelectedSeries}
        style={{ marginBottom: 20 }}
      />

      {percentileTrends && selectedSeries && (
        <p>
          As {xTitle} increases, the {selectedSeries} value shows a{' '}
          {percentileTrends[selectedSeries]?.direction ?? ''} trend
        </p>
      )}
    </>
  );
}
