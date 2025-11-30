import { Alert, Button, Card, Modal, Select, Slider } from 'antd';
import React, { useEffect, useState } from 'react';

import LineChart from '@/components/charts/LineChart/LineChart';
import { HBox } from '@/components/custom/HBox/Hbox';
import type { ModelDisplay } from '@/hooks/useModelResults';
import { useModelResults } from '@/hooks/useModelResults';
import type { MantisResultPercentile } from '@/types/model/MantisResult';
import { Region } from '@/types/region/Region';
import { ModelRun } from '@/types/model/ModelRun';
import ModelWellsModal from './ModelWellsModal';

interface ModelChartProps {
  percentiles: MantisResultPercentile[];
  reductionStartYear: number;
  reductionCompleteYear: number;
  setDepthRangeMin?: React.Dispatch<React.SetStateAction<number | null>>;
  setDepthRangeMax?: React.Dispatch<React.SetStateAction<number | null>>;
  dynamicPercentiles?: any;
  rangeMin: number,
  rangeMax: number,
  expiration?: Date | null,
  dynamicPercentilesLoading?: boolean
  numBreakthroughCurves?: number
  totalBreakthroughCurves?: number
  regions?: Region[];
  customModelDetail?: ModelRun;
  setPolygonCoords?: React.Dispatch<React.SetStateAction<[number, number][] | null>>;
}

const ModelChart = ({
  percentiles,
  reductionStartYear,
  reductionCompleteYear,
  setDepthRangeMin,
  setDepthRangeMax,
  dynamicPercentiles,
  rangeMin,
  rangeMax,
  expiration,
  dynamicPercentilesLoading,
  numBreakthroughCurves=0,
  totalBreakthroughCurves=0,
  regions,
  customModelDetail,
  setPolygonCoords,
}: ModelChartProps) => {
  const [plotData, percentilesData] = useModelResults(percentiles);
  const [percentilesDisplayed, setPercentilesDisplayed] = useState<number[]>([
    5, 50, 95,
  ]);
  const [percentileButtonClicked, setPercentileButtonClicked] =
    useState<string>('Select 5th, 50th, 95th');

  function configureDisplayData(
    percentilesInput: number[],
  ): ApexAxisChartSeries {
    const data = dynamicPercentiles ?? plotData
    const res: ApexAxisChartSeries = [];
    percentilesInput.sort(function (a, b) {
      return a - b;
    });
    percentilesInput.forEach((p) => {
      const chartData: any = [];
      ((data as any)[p] as ModelDisplay[] | null)?.forEach(
        (data: ModelDisplay) => {
          chartData.push({
            x: data.year,
            y: data.value,
          });
        },
      );
      res.push({
        name: `${p}th percentile`,
        data: chartData,
      });
    });
    return res;
  }

  const [displayData, setDisplayData] = useState<ApexAxisChartSeries>(
    configureDisplayData(percentilesDisplayed),
  );

  useEffect(() => {
    setDisplayData(configureDisplayData(percentilesDisplayed));
  }, [plotData, percentilesDisplayed, dynamicPercentiles]);

  if (!plotData) {
    return <div />;
  }

  const [range, setRange] = useState<[number, number]>([0, 200]);
  const [polygons, setPolygons] = useState<[number, number][]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
  }

  return (
    <div>
      {expiration &&
        <Alert
          message="Notice"
          description={
            "Raw breakthrough curve data will be permanently deleted on "
            + expiration.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              })
            + ". Aggregated results will remain, but filtering by well depth will no longer be available."
          }
          type="warning"
          showIcon
          closable
          style={{
            width: '80%', 
            marginLeft: 'auto', 
            marginRight: 'auto',
            marginBottom: 20 
          }}
        />
      }
      <Select
        showSearch
        placeholder="Select Percentiles"
        optionFilterProp="children"
        mode="multiple"
        allowClear
        value={percentilesDisplayed}
        onChange={setPercentilesDisplayed}
        style={{ width: '100%' }}
      >
        {(percentilesData as number[]).map((p) => (
          <Select.Option key={p} value={p}>
            {p}th percentile
          </Select.Option>
        ))}
      </Select>
      <HBox style={{ marginTop: 20, marginBottom: 40 }}>
        <HBox spacing="small">
          <Button
            type={
              percentileButtonClicked === 'Select 5th, 50th, 95th'
                ? 'primary'
                : 'default'
            }
            onClick={() => {
              setPercentilesDisplayed([5, 50, 95]);
              setPercentileButtonClicked('Select 5th, 50th, 95th');
            }}
          >
            Select 5th, 50th, 95th
          </Button>
          <Button
            type={
              percentileButtonClicked === 'Select 10th, 50th, 90th'
                ? 'primary'
                : 'default'
            }
            onClick={() => {
              setPercentilesDisplayed([10, 50, 90]);
              setPercentileButtonClicked('Select 10th, 50th, 90th');
            }}
          >
            Select 10th, 50th, 90th
          </Button>
          <Button
            type={
              percentileButtonClicked === 'Select 25th, 50th, 75th'
                ? 'primary'
                : 'default'
            }
            onClick={() => {
              setPercentilesDisplayed([25, 50, 75]);
              setPercentileButtonClicked('Select 25th, 50th, 75th');
            }}
          >
            Select 25th, 50th, 75th
          </Button>
        </HBox>
        <Button
          type={
            percentileButtonClicked === 'Select All' ? 'primary' : 'default'
          }
          onClick={() => {
            setPercentilesDisplayed(percentilesData as number[]);
            setPercentileButtonClicked('Select All');
          }}
        >
          Select All
        </Button>
      </HBox>
      <LineChart
        data={displayData}
        reductionEndYear={reductionCompleteYear}
        reductionStartYear={reductionStartYear}
      />
      {dynamicPercentiles && setDepthRangeMin && setDepthRangeMax &&
        <div style={{width: '50%'}}>
          <Card title="Filter Results" extra={<div>Aggregating {numBreakthroughCurves} of {totalBreakthroughCurves} breakthrough curves</div>}>
            <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
              <p style={{width: 150, paddingRight: 20}}>{'Depth range:'}</p>
              <Slider range defaultValue={[rangeMin, rangeMax]} max={rangeMax} style={{width: 250, marginRight: 20}}
                onChange={(value) => {
                  setRange(value as [number, number]);
                }}
              />
            </div>
            <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
              <p style={{width: 150, paddingRight: 20}}>{'Geographic region:'}</p>
              <Button type="default" onClick={showModal}>
                Open modal
              </Button>
            </div>
            <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
              <Button
                type="primary"
                onClick={handleFilterSubmit}
              >
                Apply
              </Button>
            </div>
          </Card>
        </div>
      }
      {dynamicPercentiles && regions && customModelDetail &&
        <Modal
          title="Draw polygon"
          closable={{ 'aria-label': 'Custom Close Button' }}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width={1000}
          style={{ top: 50 }}
        >
          <ModelWellsModal
            regions={regions}
            customModelDetail={customModelDetail}
            setPolygonCoords={setPolygons}
          />
        </Modal>
      }
    </div>
  );
};

export default ModelChart;
