import type { SliderProps } from '@mui/material';
import { Slider } from '@mui/material';
import React, { useState } from 'react';

import { HBox } from '@/components/custom/HBox/Hbox';

import type { CoreInputProps } from '../CoreInput/CoreInput';
import { CoreInput } from '../CoreInput/CoreInput';
import { CoreNumberField } from '../CoreNumberField/CoreNumberField';

export interface CoreSliderProps extends CoreInputProps, SliderProps {
  units?: string;
  textFieldLabel?: string;
}

export const CoreSlider = ({
  displayLabel,
  fieldLabel,
  labelStyle,
  fullWidth,
  units,
  textFieldLabel,
  ...rest
}: CoreSliderProps) => {
  const [value, setValue] = useState(0);

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(+event.target.value);
  };

  const handleChange = (_event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
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
          value={value}
          onChange={handleChange}
        />
        <div>
          <CoreNumberField
            displayLabel="left"
            fieldLabel={textFieldLabel}
            value={value}
            onNumberChange={handleNumberChange}
            units={units}
            sx={{ width: 100 }}
          />
        </div>
      </HBox>
    </CoreInput>
  );
};
