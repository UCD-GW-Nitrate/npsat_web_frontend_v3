import { InfoCircleOutlined } from '@ant-design/icons';
import { Alert, Button, Card, message, Switch, Tooltip } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import useDynamicPercentiles, {
  usePercentileConfidence,
  useWellDepthRange,
} from '@/hooks/useDynamicPercentiles';
import { useModelRegions } from '@/hooks/useModelRegionsInfo';
import type { ComparisonChartModel } from '@/types/charts/ComparisonChart';
import type { MantisResultPercentile } from '@/types/model/MantisResult';
import type { ModelRun } from '@/types/model/ModelRun';

import RangeFormItem from '../custom/RangeFormItem/RangeFormItem';
import ComparisonChart from './ComparisonChart';
import ModelChart from './ModelChart';
import ModelWellsModal from './ModelWellsModal';
import { StandardText } from '../custom/StandardText/StandardText';

interface DynamicPercentilesChartProps {
  percentiles: MantisResultPercentile[];
  customModelDetail: ModelRun;
  comparisonChartModels?: ComparisonChartModel[];
  baseModelId?: number;
}

const DynamicPercentilesChart = ({
  percentiles,
  customModelDetail,
  comparisonChartModels,
  baseModelId,
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
    baseModelDynamicPercentiles,
    expiration,
    numBreakthroughCurves,
    totalBreakthroughCurves,
    loading,
  } = useDynamicPercentiles({
    customModelDetail,
    baseModelId,
    depthRangeMin,
    depthRangeMax,
    polygonCoords,
  });

  const [stagedPercentiles, setStagedPercentiles] = useState<number[] | null>(
    null,
  );
  const [selectedPercentiles, setSelectedPercentiles] = useState<number[] | null>(
    null,
  );

  const { ciData, loading: ciLoading } = usePercentileConfidence({
    customModelDetail,
    depthRangeMin,
    depthRangeMax,
    polygonCoords,
    dynamicPercentilesLoading: loading,
    percentiles: selectedPercentiles,
    baseModelId,
  });

  const comparisonData = useMemo(() => {
    return [
      {
        name: 'bau',
        plotData: dynamicPercentiles,
      },
      {
        name: 'custom',
        plotData: baseModelDynamicPercentiles,
      },
    ];
  }, [dynamicPercentiles, baseModelDynamicPercentiles]);

  // flag that confirms if backend has the raw simulation results saved still, if so, allow dynamic percentile features
  const renderDynamicPercentiles = expiration;

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

  const [messageApi, contextHolder] = message.useMessage();

  const error = () => {
    messageApi.open({
      type: 'error',
      content: 'Please select a max of 3 percentiles',
    });
  };

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
            width: '50%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 20,
          }}
        />
      )}

      {comparisonChartModels ? (
        <ComparisonChart
          comparisonChartModels={
            renderDynamicPercentiles ? comparisonData : comparisonChartModels
          }
          percentiles={percentiles.map((p) => p.percentile)}
          reductionStartYear={customModelDetail!.reduction_start_year}
          reductionCompleteYear={customModelDetail!.reduction_end_year}
          setPercentiles={setStagedPercentiles}
          ciData={ciData}
        />
      ) : (
        <ModelChart
          percentiles={percentiles}
          reductionStartYear={customModelDetail.reduction_start_year}
          reductionCompleteYear={customModelDetail.reduction_end_year}
          dynamicPercentiles={
            renderDynamicPercentiles ? dynamicPercentiles : null
          }
          setPercentiles={setStagedPercentiles}
          ciData={ciData}
        />
      )}

      {renderDynamicPercentiles && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ width: 700 }}>
            <Card
              title="Filter Results"
              extra={
                <div>
                  Aggregating {numBreakthroughCurves} of{' '}
                  {totalBreakthroughCurves} breakthrough curves
                </div>
              }
              size="small"
            >
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}
              >
                <p style={{ width: 210 }}>Filter by Well Depth Range (m):</p>

                <div style={{ width: 500, marginLeft: 50 }}>
                  <RangeFormItem
                    valueLow={range[0]}
                    valueHigh={range[1]}
                    onChangeMin={(input) =>
                      setRange((prev) => [input, prev[1]])
                    }
                    onChangeMax={(input) =>
                      setRange((prev) => [prev[0], input])
                    }
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

                <p style={{ paddingLeft: 20 }}>
                  Advanced Filters {showAdvancedFilter ? 'Applied:' : 'OFF'}
                </p>

                {showAdvancedFilter && (
                  <Button
                    type="link"
                    onClick={() => {
                      setIsModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                )}
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
          <div style={{ width: 500 }}>
            <Card
              size="small"
            >
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <StandardText variant='h5' style={{ margin: 0}}>Fetch Confidence Intervals</StandardText>
                  <Tooltip
                    title={
                      <div>
                        Confidence intervals estimate the uncertainty of model results. Here, they are calculated using a process called {' '}
                        <a
                          target="_blank"
                          href="https://en.wikipedia.org/wiki/Bootstrapping_(statistics)"
                        >
                          bootstrapping
                        </a>
                      </div>
                    }
                  >
                    <InfoCircleOutlined />
                  </Tooltip>
                </div>
                {!comparisonChartModels && <p>
                  Select up to 3 percentiles to fetch their confidence intervals
                </p>}
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {contextHolder}
                  {ciLoading && <p style={{ color: 'grey' }}>This can take up to a minute.</p>}
                  <Button 
                    type="primary" 
                    onClick={() => {
                      if (stagedPercentiles && stagedPercentiles?.length > 3) {
                        error();
                        return;
                      }
                      setSelectedPercentiles(stagedPercentiles)
                    }}
                    disabled={ciLoading}
                    loading={ciLoading}
                  >
                    Fetch
                  </Button>
                  <Button type='link' style={{ padding: 0}} onClick={() => { setSelectedPercentiles(null) }}>Clear</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {renderDynamicPercentiles && regions.length > 0 && (
        <ModelWellsModal
          open={isModalOpen}
          setOpen={setIsModalOpen}
          regions={regions}
          customModelDetail={customModelDetail}
          setPolygonCoords={setPolygons}
          range={range}
          setRange={setRange}
          minDepth={minDepth}
          maxDepth={maxDepth}
        />
      )}
    </div>
  );
};

export default DynamicPercentilesChart;
