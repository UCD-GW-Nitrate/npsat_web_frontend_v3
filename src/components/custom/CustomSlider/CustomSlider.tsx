import { InputNumber, Row, Slider } from "antd";
import { useEffect } from "react";
import { useState } from "react";

interface SliderProps {
  value: number,
  debounceChange: (value: number) => void;
  onAfterChange: (value: number) => void;
}

export default function CustomSlider({ value, debounceChange, onAfterChange }: SliderProps) {
  const [slider, setSlider] = useState(value)
  useEffect(()=> setSlider(value), [value])
  useEffect(()=> {debounceChange(slider)}, [slider])
  return (
    <div style={{display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'flex-start'}}>
      <div style={{width: '80%'}}>
        <Slider
          min={0}
          max={1000}
          onChange={(value)=>setSlider(value)}
          onAfterChange={onAfterChange}
          value={slider}
          step={1}
        />
      </div>
      <InputNumber
        min={0}
        max={1000}
        style={{ margin: '0 16px' }}
        value={slider}
        onChange={value => value && onAfterChange(value)}
      />
    </div>
  );
}