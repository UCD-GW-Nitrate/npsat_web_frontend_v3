import 'leaflet/dist/leaflet.css';
import '@/components/maps/styles.css';
import '../styles/global.css';

import GlobalStyles from '@mui/material/GlobalStyles';
import { ThemeProvider } from '@mui/material/styles';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { type PropsWithChildren, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';

import theme from '@/components/theme';
import type { AuthState } from '@/store/apis/authApi';
import { setCredentials } from '@/store/slices/authSlice';

import { store } from '../store';

const Wrapper = ({ children }: PropsWithChildren) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const cachedAuthState: AuthState = JSON.parse(
      localStorage.getItem('npsat_user_info') ?? '{}',
    );

    console.log('cachedAuthState', cachedAuthState);

    dispatch(setCredentials(cachedAuthState));
  }, []);

  return <>{children}</>;
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main>
      <Head>
        <title>NPSAT</title>
        <meta charSet="UTF-8" key="charset" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
          key="viewport"
        />
        <link
          rel="apple-touch-icon"
          href="/images/apple-touch-icon.png"
          key="apple"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32x32.png"
          key="icon32"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
          key="icon16"
        />
        <link rel="icon" href="/images/favicon.ico" key="favicon" />
      </Head>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <GlobalStyles
            styles={{
              body: { backgroundColor: theme.palette.background.default },
            }}
          />
          <Wrapper>
            <Component {...pageProps} />
          </Wrapper>
        </ThemeProvider>
      </Provider>
    </main>
  );
}
export default MyApp;
