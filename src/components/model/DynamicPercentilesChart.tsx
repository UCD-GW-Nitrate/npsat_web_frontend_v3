import { Alert, Button, Card, Modal, Switch } from 'antd';
import { useEffect, useState } from 'react';

import useDynamicPercentiles, {
  useWellDepthRange,
} from '@/hooks/useDynamicPercentiles';
import { useModelRegions } from '@/hooks/useModelRegionsInfo';
import type { MantisResultPercentile } from '@/types/model/MantisResult';
import type { ModelRun } from '@/types/model/ModelRun';

import RangeFormItem from '../custom/RangeFormItem/RangeFormItem';
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
  const {
    minDepth,
    maxDepth,
    loading: loadingWellDepthRange,
  } = useWellDepthRange(customModelDetail);

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
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
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
    setRange([minDepth, maxDepth]);
  }, [minDepth, maxDepth]);

  return (
    <div>
      {expiration && (
        <Alert
          message="Notice"
          description={`Filtering by wells capabilities for this scenario run will expire on ${expiration.toLocaleDateString(
            'en-US',
            {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            },
          )}`}
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
        <div style={{ width: '60%' }}>
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
              <p style={{ width: 210 }}>Filter by Well Depth Range (m):</p>

              <div style={{ width: 500 }}>
                <RangeFormItem
                  valueLow={range[0]}
                  valueHigh={range[1]}
                  onChangeMin={(input) => setRange((prev) => [input, prev[1]])}
                  onChangeMax={(input) => setRange((prev) => [prev[0], input])}
                  rangeConfig={{
                    min: minDepth,
                    max: maxDepth,
                    step: 1,
                    maxIdentifier: false,
                  }}
                />
              </div>
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
              <p style={{ paddingRight: 20 }}>Advanced filter:</p>

              <Switch
                checkedChildren="on"
                unCheckedChildren="off"
                checked={showAdvancedFilter}
                onClick={(checked) => {
                  if (!checked) {
                    setPolygonCoords(null);
                  }
                  setShowAdvancedFilter(checked);
                }}
              />
            </div>
            {showAdvancedFilter && (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <p style={{ width: 210, paddingLeft: 20 }}>
                  Filter by Bounding Polygon:
                </p>

                <Button
                  type="default"
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  Open Modal
                </Button>
              </div>
            )}

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
          title="Advanced filtering"
          closable={{ 'aria-label': 'Custom Close Button' }}
          open={isModalOpen}
          onOk={() => {
            setIsModalOpen(false);
          }}
          onCancel={() => {
            setIsModalOpen(false);
          }}
          width={1000}
          style={{ top: 30 }}
        >
          <ModelWellsModal
            regions={regions}
            customModelDetail={customModelDetail}
            setPolygonCoords={setPolygons}
            range={range}
            setRange={setRange}
            minDepth={minDepth}
            maxDepth={maxDepth}
          />
        </Modal>
      )}
    </div>
  );
};

export default DynamicPercentilesChart;
