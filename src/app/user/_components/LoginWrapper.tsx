import { Flex } from 'antd';
import Image from 'next/image';
import * as React from 'react';

import logo from '@/public/images/logo.svg';

interface LoginWrapperProps {
  children: React.ReactNode;
}

const LoginWrapper = ({ children }: LoginWrapperProps) => {
  return (
    <div
      style={{
        backgroundImage: `url("https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg")`,
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,.1)',
      }}
    >
      <Flex align="center" vertical style={{ paddingTop: 40 }}>
        <Image src={logo} alt="NPSAT Logo" style={{ height: '44px' }} />
        <p
          style={{
            marginTop: 12,
            marginBottom: 40,
            fontSize: 14,
            color: 'rgba(0,0,0,.45)',
          }}
        >
          Non Point Source Assessment Tool
        </p>
        {children}
      </Flex>
    </div>
  );
};

export default LoginWrapper;
