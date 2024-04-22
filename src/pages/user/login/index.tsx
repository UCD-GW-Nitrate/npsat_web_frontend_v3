import { Flex } from 'antd';
import Image from 'next/image';
import * as React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import LoginForm from '@/components/custom/Login/LoginForm';
import logo from '@/public/images/logo.svg';

import styles from './login.module.css';

const LoginPage = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Login - NPSAT</title>
        <meta name="description" content="Login - NPSAT" />
      </Helmet>
      <div
        style={{
          backgroundImage: `url("https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg")`,
          height: '100vh',
        }}
      >
        <Flex align="center" vertical style={{ paddingTop: 40 }}>
          <Image src={logo} alt="NPSAT Logo" style={{ height: '44px' }} />
          <p
            className={styles.desc}
            style={{
              marginTop: 12,
              marginBottom: 40,
              fontSize: 14,
              color: 'rgba(0,0,0,.45)',
            }}
          >
            Non Point Source Assessment Tool
          </p>
          <LoginForm style={{ width: 360 }} />
        </Flex>
      </div>
    </HelmetProvider>
  );
};

export default LoginPage;
