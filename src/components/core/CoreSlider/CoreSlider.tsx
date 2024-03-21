import type { BoxProps } from '@mui/material';
import { Box, Slider } from '@mui/material';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';

import { HBox } from '@/components/custom/HBox/Hbox';

import { CoreInput } from '../CoreInput/CoreInput';
import { CoreNumberField } from '../CoreNumberField/CoreNumberField';

export interface CoreSliderBaseProps extends BoxProps {
  units?: string;
  textFieldLabel?: string;
  min?: number;
  max?: number;
}

export interface CoreSliderProps extends CoreSliderBaseProps {
  formField?: boolean;
  name?: string;
}

export const CoreSlider = ({
  units,
  textFieldLabel,
  min,
  max,
  name,
  formField,
  sx,
  ...rest
}: CoreSliderProps) => {
  const [value, setValue] = useState(((min ?? 0) + (max ?? 0)) / 2);

  const handleNumberChange = (newVal: number) => {
    setValue(newVal);
  };

  const handleChange = (_event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  return (
    <Box>
      {formField ? (
        <Controller
          name={name ?? ''}
          defaultValue={value}
          render={({ field: { onChange } }) => (
            <Box {...rest}>
              <HBox spacing={2}>
                <div>
                  <Slider
                    value={value}
                    onChange={(_event: Event, newValue: number | number[]) => {
                      setValue(newValue as number);
                      onChange(newValue as number);
                    }}
                    sx={{ width: 200 }}
                    min={min}
                    max={max}
                  />
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
          )}
        />
      ) : (
        <Box {...rest}>
          <HBox spacing={2}>
            <div>
              <Slider
                value={value}
                onChange={handleChange}
                sx={{ width: 200 }}
                min={min}
                max={max}
              />
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
      )}
    </Box>
  );
};
