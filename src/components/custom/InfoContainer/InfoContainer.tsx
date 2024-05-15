import { Card } from 'antd';
import type { PropsWithChildren } from 'react';
import React from 'react';

export interface ContainerProp {
  title?: string;
}

export const InfoContainer = ({
  title,
  children,
}: PropsWithChildren<ContainerProp>) => <Card title={title}>{children}</Card>;
