import { Stack } from '@mui/material';
import type { PropsWithChildren } from 'react';

import { HBox } from '@/components/custom/HBox/Hbox';

import { CoreText } from '../CoreText/CoreText';
import type { CoreFormField } from './CoreForm';

interface CoreFormElementProps extends PropsWithChildren {
  formField?: CoreFormField;
  insertLabelSpacing?: boolean;
}

export const CoreFormElement = ({
  formField,
  insertLabelSpacing = true,
  children,
}: CoreFormElementProps) => {
  return (
    <HBox
      key={formField?.label ?? ''}
      spacing={2}
      sx={{
        width: '100%',
        alignItems: formField?.position ? formField.position : 'center',
      }}
    >
      <Stack
        flexDirection="column"
        sx={{
          width: insertLabelSpacing ? '30vw' : 0,
          overflow: 'hidden',
        }}
      >
        <CoreText
          sx={{
            marginLeft: 'auto',
            mt: formField?.position ? 0.5 : 0,
          }}
          noWrap
        >
          {formField?.label ?? ''}
        </CoreText>
      </Stack>
      {children}
    </HBox>
  );
};
