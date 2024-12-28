import { Form } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import RangeFormItem from '@/components/custom/RangeFormItem/RangeFormItem';
import { useGetWellsQuery } from '@/store';
import type { WellRequest } from '@/types/well/Well';

interface WellFilterRangeProps {
  wellParamsMin: Partial<WellRequest>;
  wellParamsMax: Partial<WellRequest>;
  setSelectedMinCallback: (input: number) => void;
  setSelectedMaxCallback: (input: number) => void;
  label: string;
  name: string;
  type: string;
}

const WellFilterRange = ({
  wellParamsMin,
  wellParamsMax,
  setSelectedMinCallback,
  setSelectedMaxCallback,
  label,
  name,
  type,
}: WellFilterRangeProps) => {
  const { data: rangeMaxData, isLoading: depthMaxDataLoading } =
    useGetWellsQuery(wellParamsMax);
  const { data: rangeMinData, isLoading: depthMinDataLoading } =
    useGetWellsQuery(wellParamsMin);

  const [selectedMin, setSelectedMin] = useState<number>(0);
  const [selectedMax, setSelectedMax] = useState<number>(800);

  const [rangeMin, setRangeMin] = useState<number>(0);
  const [rangeMax, setRangeMax] = useState<number>(800);

  const getMin = () => {
    if (rangeMinData?.results[0]?.depth) {
      const min = Math.floor((rangeMinData.results[0] as any)[type]);
      setSelectedMin(min);
      setSelectedMinCallback(min);
      return min;
    }

    return 0;
  };

  const getMax = () => {
    if (rangeMaxData?.results[0]?.depth) {
      const max = Math.ceil((rangeMaxData.results[0] as any)[type]);
      setSelectedMax(max);
      setSelectedMaxCallback(max);
      return max;
    }

    return 800;
  };

  useEffect(() => {
    setRangeMin(getMin());
  }, [rangeMinData]);

  useEffect(() => {
    setRangeMax(getMax());
  }, [rangeMaxData]);

  const rangePicker = useMemo(
    () => (
      <RangeFormItem
        rangeConfig={{
          max: rangeMax,
          min: rangeMin,
          step: 1,
          maxIdentifier: false,
        }}
        valueLow={selectedMin}
        valueHigh={selectedMax}
        onChangeMin={(input) => {
          setSelectedMinCallback(input);
          setSelectedMin(input);
        }}
        onChangeMax={(input) => {
          setSelectedMaxCallback(input);
          setSelectedMax(input);
        }}
      />
    ),
    [rangeMin, rangeMax, selectedMin, selectedMax],
  );

  return (
    <>
      {!depthMaxDataLoading && !depthMinDataLoading && (
        <Form.Item
          label={label}
          name={name}
          initialValue={[rangeMin, rangeMax]}
          rules={[
            {
              validator: (_, v) => {
                if (v[0] >= v[1]) {
                  return Promise.reject(
                    new Error('Range min should be less than max'),
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          {rangePicker}
        </Form.Item>
      )}
    </>
  );
};

export default WellFilterRange;
