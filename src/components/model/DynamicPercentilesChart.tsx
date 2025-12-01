import { Alert, Button, Card, Modal, Slider } from 'antd';
import { useEffect, useState } from 'react';

import useDynamicPercentiles, {
  useWellDepthRange,
} from '@/hooks/useDynamicPercentiles';
import { useModelRegions } from '@/hooks/useModelRegionsInfo';
import type { MantisResultPercentile } from '@/types/model/MantisResult';
import type { ModelRun } from '@/types/model/ModelRun';

import ModelChart from './ModelChart';
import ModelWellsModal from './ModelWellsModal';

interface DynamicPercentilesChartProps {
  percentiles: MantisResultPercentile[];
  customModelDetail: ModelRun;
}

const DynamicPercentilesChart = ({
  percentiles,
  customModelDetail,
}: DynamicPercentilesChartProps) => {
  const regions = useModelRegions(customModelDetail.regions);
  const { minDepth, maxDepth } = useWellDepthRange(customModelDetail);

  // params to pass into useDynamicPercentiles
  const [depthRangeMin, setDepthRangeMin] = useState<number | null>(null);
  const [depthRangeMax, setDepthRangeMax] = useState<number | null>(null);
  const [polygonCoords, setPolygonCoords] = useState<[number, number][] | null>(
    null,
  );

  const {
    dynamicPercentiles,
    expiration,
    numBreakthroughCurves,
    totalBreakthroughCurves,
    loading,
  } = useDynamicPercentiles({
    customModelDetail,
    depthRangeMin,
    depthRangeMax,
    polygonCoords,
  });

  // flag that confirms if backend has the raw simulation results saved still, if so, allow dynamic percentile features
  const renderDynamicPercentiles = !loading && expiration;

  // state variables to stage changes to useDynamicPercentiles params
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [range, setRange] = useState<[number, number]>([0, 200]);
  const [polygons, setPolygons] = useState<[number, number][]>([]);

  // mutate useDynamicPercentiles params on submit
  const handleFilterSubmit = () => {
    if (setDepthRangeMin) {
      setDepthRangeMin(range[0]);
    }
    if (setDepthRangeMax) {
      setDepthRangeMax(range[1]);
    }
    if (setPolygonCoords) {
      setPolygonCoords(polygons);
    }
  };

  // initialize depthRangeMin and depthRangeMax to the entire well depth range
  useEffect(() => {
    setDepthRangeMin(minDepth);
    setDepthRangeMax(maxDepth);
  }, [minDepth, maxDepth]);

  return (
    <div>
      {expiration && (
        <Alert
          message="Notice"
          description={`Raw breakthrough curve data will be permanently deleted on ${expiration.toLocaleDateString(
            'en-US',
            {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            },
          )}. Aggregated results will remain, but filtering by well depth will no longer be available.`}
          type="warning"
          showIcon
          closable
          style={{
            width: '80%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 20,
          }}
        />
      )}

      <ModelChart
        percentiles={percentiles}
        reductionStartYear={customModelDetail.reduction_start_year}
        reductionCompleteYear={customModelDetail.reduction_end_year}
        dynamicPercentiles={
          renderDynamicPercentiles ? dynamicPercentiles : null
        }
      />

      {renderDynamicPercentiles && (
        <div style={{ width: '50%' }}>
          <Card
            title="Filter Results"
            extra={
              <div>
                Aggregating {numBreakthroughCurves} of {totalBreakthroughCurves}{' '}
                breakthrough curves
              </div>
            }
          >
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <p style={{ width: 150, paddingRight: 20 }}>Depth range:</p>
              <Slider
                range
                defaultValue={[minDepth, maxDepth]}
                max={maxDepth}
                style={{ width: 250, marginRight: 20 }}
                onChange={(value) => {
                  setRange(value as [number, number]);
                }}
              />
            </div>
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <p style={{ width: 150, paddingRight: 20 }}>Geographic region:</p>
              <Button
                type="default"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                Open modal
              </Button>
            </div>
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}
            >
              <Button type="primary" onClick={handleFilterSubmit}>
                Apply
              </Button>
            </div>
          </Card>
        </div>
      )}

      {renderDynamicPercentiles && regions.length > 0 && (
        <Modal
          title="Draw polygon"
          closable={{ 'aria-label': 'Custom Close Button' }}
          open={isModalOpen}
          onOk={() => {
            setIsModalOpen(false);
          }}
          onCancel={() => {
            setIsModalOpen(false);
          }}
          width={1000}
          style={{ top: 50 }}
        >
          <ModelWellsModal
            regions={regions}
            customModelDetail={customModelDetail}
            setPolygonCoords={setPolygons}
          />
        </Modal>
      )}
    </div>
  );
};

export default DynamicPercentilesChart;
