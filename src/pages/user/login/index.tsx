import { styled } from '@mui/material/styles';
import Image from 'next/image';
import * as React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import Footer from '@/components/custom/Footer/Footer';
import LoginForm from '@/components/custom/Login/LoginForm';
import logo from '@/public/images/logo.svg';

import styles from './login.module.css';

const imageURL =
  'https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg';
const Background = styled('div')(({ theme }) => ({
  backgroundImage: `url(${imageURL})`,
  margin: 0,
  height: '100vh',
  paddingTop: theme.spacing(4),
  backgroundColor: 'rgba(0,0,0,.05)',
  display: 'flex',
  flexFlow: 'column',
}));

const LoginPage = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Login - NPSAT</title>
        <meta name="description" content="Login - NPSAT" />
      </Helmet>
      <Background>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Image src={logo} alt="NPSAT Logo" className={styles.logo} />
            </div>
            <p className={styles.desc}>Non Point Source Assessment Tool</p>
          </div>
        </div>
        <LoginForm />
        <Footer />
      </Background>
    </HelmetProvider>
  );
};

export default LoginPage;
