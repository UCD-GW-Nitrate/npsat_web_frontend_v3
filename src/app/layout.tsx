'use client';

import 'leaflet/dist/leaflet.css';
import '@/components/maps/styles.css';
import '../styles/global.css';

import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import dynamic from 'next/dynamic';
import { Provider } from 'react-redux';

import { PRIMARY_COLOR } from '@/components/theme';

import { store } from '../store';

const CachedAuthWithNoSSR = dynamic(
  () => import('@/components/custom/CachedAuthState/CachedAuthState'),
  { ssr: false },
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
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
      </head>
      <body>
        <Provider store={store}>
          <ConfigProvider
            locale={enUS}
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
            <CachedAuthWithNoSSR>{children}</CachedAuthWithNoSSR>
          </ConfigProvider>
        </Provider>
      </body>
    </html>
  );
}
