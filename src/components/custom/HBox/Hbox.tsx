import { Flex, Space } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import type { PropsWithChildren } from 'react';
import React from 'react';

export interface HBoxProps {
  spacing?: SizeType;
  style?: React.CSSProperties;
}

export const HBox = ({
  children,
  spacing,
  style,
}: PropsWithChildren<HBoxProps>) => {
  return (
    <>
      {spacing ? (
        <Space style={style} align="center" size={spacing}>
          {children}
        </Space>
      ) : (
        <Flex
          vertical={false}
          justify="space-between"
          style={style}
          align="center"
        >
          {children}
        </Flex>
      )}
    </>
  );
};
