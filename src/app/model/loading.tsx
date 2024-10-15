'use client';

import { Spin } from 'antd';
import React from 'react';

import AppLayout from '@/components/custom/AppLayout/AppLayout';

const Index = () => {
  return (
    <AppLayout>
      <Spin size="large" />
    </AppLayout>
  );
};

export default Index;
