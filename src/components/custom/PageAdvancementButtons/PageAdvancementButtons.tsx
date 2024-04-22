import { Button, Space } from 'antd';

import type { HBoxProps } from '../HBox/Hbox';
import { HBox } from '../HBox/Hbox';

export interface PageAdvancementButtonsProps extends HBoxProps {
  onClickPrev?: () => void;
  canGoBack?: boolean;
}

export const PageAdvancementButtons = ({
  onClickPrev,
  canGoBack = false,
  ...rest
}: PageAdvancementButtonsProps) => (
  <HBox spacing="small" {...rest}>
    <Space>
      {canGoBack && (
        <Button
          onClick={onClickPrev}
          style={{
            marginLeft: 8,
          }}
        >
          Prev
        </Button>
      )}
      <Button type="primary" htmlType="submit">
        Next
      </Button>
    </Space>
  </HBox>
);
