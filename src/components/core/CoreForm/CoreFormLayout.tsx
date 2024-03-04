import { Stack } from '@mui/material';
import type { PropsWithChildren } from 'react';
import React, { Children } from 'react';

import type { CoreFormField } from './CoreForm';
import { CoreFormElement } from './CoreFormElement';

export interface CoreFormLayoutProps extends PropsWithChildren {
  fields?: CoreFormField[];
}

export const CoreFormLayout = ({
  children,
  fields = [],
}: CoreFormLayoutProps) => {
  const insertLabelSpacing = fields.length > 0;

  const childrenArray = Children.toArray(children);
  for (let i = 0; i < childrenArray.length - fields.length; i += 1) {
    fields.push({ label: '' } as CoreFormField);
  }

  return (
    <Stack
      spacing={4}
      alignItems="flex-start"
      flexDirection="column"
      sx={{ width: '100%' }}
    >
      {childrenArray.map((child, index) => {
        return (
          <CoreFormElement
            key={fields[index]?.label ?? index}
            formField={fields[index]}
            insertLabelSpacing={insertLabelSpacing}
          >
            {child}
          </CoreFormElement>
        );
      })}
    </Stack>
  );
};
