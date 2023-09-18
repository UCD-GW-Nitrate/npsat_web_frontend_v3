import { CoreButton } from '@/components/core/CoreButton/CoreButton';

import type { HBoxProps } from '../HBox/Hbox';
import { HBox } from '../HBox/Hbox';

export interface PageAdvancementButtonsProps extends HBoxProps {
  onClickNext?: () => void;
  onClickPrev?: () => void;
}

export const PageAdvancementButtons = ({
  onClickNext,
  onClickPrev,
  ...rest
}: PageAdvancementButtonsProps) => (
  <HBox spacing={2} {...rest}>
    <CoreButton variant="outlined" label="Prev" onClick={onClickPrev} />
    <CoreButton variant="contained" label="Next" onClick={onClickNext} />
  </HBox>
);
