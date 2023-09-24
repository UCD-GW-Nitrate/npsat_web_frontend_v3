import type { SliderProps } from '@mui/material';
import { Slider } from '@mui/material';
import React, { useState } from 'react';

import { HBox } from '@/components/custom/HBox/Hbox';

import type { CoreInputProps } from '../CoreInput/CoreInput';
import { CoreInput } from '../CoreInput/CoreInput';
import { CoreNumberField } from '../CoreNumberField/CoreNumberField';

export interface CoreRangeSliderProps extends CoreInputProps, SliderProps {
  units?: string;
  minFieldLabel?: string;
  maxFieldLabel?: string;
}

export const CoreRangeSlider = ({
  displayLabel,
  fieldLabel,
  labelStyle,
  fullWidth,
  units,
  minFieldLabel,
  maxFieldLabel,
  ...rest
}: CoreRangeSliderProps) => {
  const [range, setRange] = useState<number[]>([0, 100]);

  const handleMinNumberChange = (value: number) => {
    setRange([value, range[1] as number]);
  };

  const handleMaxNumberChange = (value: number) => {
    setRange([range[0] as number, value]);
  };

  const handleChange = (_event: Event, newValue: number | number[]) => {
    setRange(newValue as number[]);
  };

  return (
    <CoreInput
      displayLabel={displayLabel}
      fieldLabel={fieldLabel}
      labelStyle={labelStyle}
      fullWidth={fullWidth}
    >
      <HBox spacing={2}>
        <Slider
          sx={{ width: 150 }}
          {...rest}
          value={range}
          onChange={handleChange}
        />
        <div>
          <CoreInput displayLabel="left" fieldLabel={minFieldLabel}>
            <CoreNumberField
              value={range[0]}
              onNumberChange={handleMinNumberChange}
              units={units}
              sx={{ width: 100 }}
            />
          </CoreInput>
        </div>
        <div>
          <CoreInput displayLabel="left" fieldLabel={maxFieldLabel}>
            <CoreNumberField
              value={range[1]}
              onNumberChange={handleMaxNumberChange}
              units={units}
              sx={{ width: 100 }}
            />
          </CoreInput>
        </div>
      </HBox>
    </CoreInput>
  );
};
