import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as React from 'react';

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
    <Box>
      <Background />
      <LoginForm />
    </Box>
  );
};

export default LoginPage;
