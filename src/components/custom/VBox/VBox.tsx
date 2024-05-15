import { Space } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import type { PropsWithChildren } from 'react';
import React from 'react';

interface VBoxProps {
  spacing?: SizeType;
  style?: React.CSSProperties;
}

export const VBox = ({
  children,
  spacing,
  style,
}: PropsWithChildren<VBoxProps>) => {
  return (
    <Space direction="vertical" size={spacing} style={style}>
      {children}
    </Space>
  );
};
