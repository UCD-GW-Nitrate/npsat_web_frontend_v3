import { styled } from '@mui/material/styles';
import * as React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import LoginForm from '@/components/Login/LoginForm';

const imageURL =
  'https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg';
const Background = styled('div')(({ theme }) => ({
  backgroundImage: `url(${imageURL})`,
  backgroundPosition: 'center',
  backgroundSize: '100%',
  backgroundRepeat: 'no-repeat',
  position: 'absolute',
  width: '100%',
  height: '100%',
}));

const LoginPage = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Login - NPSAT</title>
        <meta name="description" content="Login - NPSAT" />
      </Helmet>

      <Background />
      <LoginForm />
    </HelmetProvider>
  );
};

export default LoginPage;
