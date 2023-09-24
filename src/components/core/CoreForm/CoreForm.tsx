import type { BoxProps } from '@mui/material';
import { Box, Stack } from '@mui/material';
import type { FormEvent } from 'react';
import React, { Children } from 'react';

import { HBox } from '@/components/custom/HBox/Hbox';

import { CoreText } from '../CoreText/CoreText';

export interface CoreFormField {
  label: string;
  position?: 'flex-start' | 'center' | 'flex-end';
  required?: boolean;
  errorMessage?: string;
}

export interface CoreFormProps extends BoxProps {
  fields: CoreFormField[];
  onFormSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export const CoreForm = ({
  children,
  fields,
  sx,
  onFormSubmit,
}: CoreFormProps) => {
  const childrenArray = Children.toArray(children);
  for (let i = 0; i < childrenArray.length - fields.length; i += 1) {
    fields.push({ label: '' } as CoreFormField);
  }

  return (
    <Box component="form" onSubmit={onFormSubmit} sx={{ mt: 1, ...sx }}>
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
              sx={{
                width: '100%',
                alignItems: fields[index]?.position
                  ? fields[index]?.position
                  : 'center',
              }}
            >
              <Stack
                flexDirection="column"
                sx={{ width: '30vw', overflow: 'hidden' }}
              >
                <CoreText
                  sx={{
                    marginLeft: 'auto',
                    mt: fields[index]?.position ? 0.5 : 0,
                  }}
                  noWrap
                >
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
