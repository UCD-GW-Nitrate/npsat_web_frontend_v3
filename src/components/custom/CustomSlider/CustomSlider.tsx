import { InputNumber, Slider } from 'antd';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';

interface SliderProps {
  value: number;
  onAfterChange: (value: number) => Promise<void>;
  maxValue?: number;
}

export default function CustomSlider({
  value,
  onAfterChange,
  maxValue,
}: SliderProps) {
  const [slider, setSlider] = useState(value);
  const [hydrated, setHydrated] = useState(false);

  const debounceChange = useCallback(
    debounce(async (val: number) => {
      // console.log('Debounced value:', val);
      await onAfterChange(val);
    }, 300),
    [onAfterChange],
  );

  const handleSubmit = async (val: number) => {
    debounceChange.cancel();
    setSlider(val);
    await onAfterChange(val);
  };

  useEffect(() => setSlider(value), [value]);

  useEffect(() => {
    if (hydrated) {
      debounceChange(slider);
    } else {
      setHydrated(true);
    }
  }, [slider]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-start',
      }}
    >
      <div style={{ width: '80%' }}>
        <Slider
          min={0}
          max={maxValue || 1000}
          onChange={(newValue) => setSlider(newValue)}
          value={slider}
          step={maxValue && maxValue < 1 ? 0.1 : 1}
        />
      </div>
      <InputNumber
        min={0}
        max={maxValue || 1000}
        style={{ margin: '0 16px' }}
        value={slider}
        onChange={(newValue) => newValue && handleSubmit(newValue)}
      />
    </div>
  );
}
