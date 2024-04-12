import 'leaflet/dist/leaflet.css';
import '@/components/maps/styles.css';
import '../styles/global.css';

import { ThemeProvider } from '@mui/material/styles';
import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';

import AppLayout from '@/components/custom/AppLayout/AppLayout';
import theme, { PRIMARY_COLOR } from '@/components/theme';

import { store } from '../store';

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
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: PRIMARY_COLOR,
            },
            components: {
              Button: {
                primaryShadow: 'none',
              },
            },
          }}
        >
          <ThemeProvider theme={theme}>
            <AppLayout>
              <Component {...pageProps} />
            </AppLayout>
          </ThemeProvider>
        </ConfigProvider>
      </Provider>
    </main>
  );
}
export default MyApp;
