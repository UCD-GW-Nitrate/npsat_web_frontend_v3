import type { BoxProps } from '@mui/material';
import { Box, Slider } from '@mui/material';
import React, { useState } from 'react';

import { HBox } from '@/components/custom/HBox/Hbox';

import { CoreInput } from '../CoreInput/CoreInput';
import { CoreNumberField } from '../CoreNumberField/CoreNumberField';

export interface CoreSliderProps extends BoxProps {
  units?: string;
  textFieldLabel?: string;
}

export const CoreSlider = ({
  units,
  textFieldLabel,
  sx,
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
    <Box {...rest}>
      <HBox spacing={2}>
        <div>
          <Slider value={value} onChange={handleChange} sx={{ width: 200 }} />
        </div>
        <div>
          <CoreInput displayLabel="left" fieldLabel={textFieldLabel}>
            <CoreNumberField
              value={value}
              onNumberChange={handleNumberChange}
              units={units}
              sx={{ width: 100 }}
            />
          </CoreInput>
        </div>
      </HBox>
    </Box>
  );
};
