import { LogoutOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { PropsWithChildren, ReactNode } from 'react';
import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { BACKGROUND_COLOR, PRIMARY_COLOR } from '@/components/theme';
import type { AuthState } from '@/store/apis/authApi';
import { setCredentials } from '@/store/slices/authSlice';

import Logo from '../Navbar/Logo';
import ProfileButton from './ProfileButton';

const ProLayout = dynamic(() => import('@ant-design/pro-layout'), {
  ssr: false,
});

const AppLayout = ({ children }: PropsWithChildren) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const cachedAuthState: AuthState = JSON.parse(
      localStorage.getItem('npsat_user_info') ?? '{}',
    );

    console.log('cachedAuthState', cachedAuthState);

    dispatch(setCredentials(cachedAuthState));
  }, []);

  const titleRender = useCallback(
    (logo: ReactNode) => (
      <Link href="/" style={{ marginLeft: 20 }}>
        {logo}
      </Link>
    ),
    [],
  );

  return (
    <ProLayout
      loading={false}
      token={{
        header: {
          colorBgHeader: PRIMARY_COLOR,
        },
        bgLayout: BACKGROUND_COLOR,
      }}
      avatarProps={{
        size: 'small',
        title: <ProfileButton />,
        render: (_props, dom) => {
          return (
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: 'Caden',
                  },
                ],
              }}
            >
              {dom}
            </Dropdown>
          );
        },
      }}
      logo={<Logo />}
      headerTitleRender={titleRender}
      layout="top"
    >
      {children}
    </ProLayout>
  );
};

export default AppLayout;
