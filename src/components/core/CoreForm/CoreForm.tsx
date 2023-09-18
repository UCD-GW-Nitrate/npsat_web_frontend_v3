import type { BoxProps } from '@mui/material';
import { Box, Stack } from '@mui/material';
import React, { Children } from 'react';

import { HBox } from '@/components/custom/HBox/Hbox';

import { CoreText } from '../CoreText/CoreText';

export interface CoreFormField {
  label: string;
  required?: boolean;
  errorMessage?: string;
}

export interface CoreFormProps extends BoxProps {
  fields: CoreFormField[];
}

export const CoreForm = ({ children, fields, ...rest }: CoreFormProps) => {
  const childrenArray = Children.toArray(children);
  for (let i = 0; i < childrenArray.length - fields.length; i += 1) {
    fields.push({ label: '' } as CoreFormField);
  }

  return (
    <Box component="form" {...rest}>
      <Stack
        spacing={4}
        alignItems="flex-start"
        flexDirection="column"
        sx={{ width: '100%' }}
      >
        {childrenArray.map((child, index) => {
          return (
            <HBox
              key={fields[index]?.label ?? ''}
              spacing={2}
              sx={{ width: '100%' }}
            >
              <Stack
                flexDirection="column"
                sx={{ width: '30vw', overflow: 'hidden' }}
              >
                <CoreText sx={{ marginLeft: 'auto' }} noWrap>
                  {fields[index]?.label ?? ''}
                </CoreText>
              </Stack>
              {child}
            </HBox>
          );
        })}
      </Stack>
    </Box>
  );
};
