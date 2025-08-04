import { InputNumber, Slider } from "antd";
import debounce from "lodash.debounce";
import { useCallback, useEffect } from "react";
import { useState } from "react";

interface SliderProps {
  value: number,
  onAfterChange: (value: number) => Promise<void>;
}

export default function CustomSlider({ value, onAfterChange }: SliderProps) {
  const [slider, setSlider] = useState(value)
  const [hydrated, setHydrated] = useState(false)

  useEffect(
    () => setSlider(value), 
    [value]
  );

  useEffect(
    () => {
      hydrated ? debounceChange(slider) : setHydrated(true);
    },
    [slider]
  );

  const debounceChange = useCallback(
    debounce(async (val: number) => {
      console.log("Debounced value:", val);
      await onAfterChange(val);
    }, 500),
    [onAfterChange]
  );

  const handleSubmit = async (val: number) => {
    debounceChange.cancel;
    setSlider(val);
    await onAfterChange(val);
  }

  return (
    <div style={{display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'flex-start'}}>
      <div style={{width: '80%'}}>
        <Slider
          min={0}
          max={1000}
          onChange={(value)=>setSlider(value)}
          value={slider}
          step={1}
        />
      </div>
      <InputNumber
        min={0}
        max={1000}
        style={{ margin: '0 16px' }}
        value={slider}
        onChange={val => val && handleSubmit(val)}
      />
    </div>
  );
}