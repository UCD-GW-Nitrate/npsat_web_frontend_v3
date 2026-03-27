import { LogoutOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Tabs } from 'antd';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { PropsWithChildren, ReactNode } from 'react';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BACKGROUND_COLOR, PRIMARY_COLOR } from '@/components/theme';
import { selectCurrentUser, setCredentials } from '@/store/slices/authSlice';

import ProfileButton from './ProfileButton';

const ProLayout = dynamic(() => import('@ant-design/pro-layout'), {
  ssr: false,
});

const menuItems = [
  { path: '/explore-wells', name: 'Well Explorer' },
  { path: '', name: 'Resources' },
  { path: '/share-feedback', name: 'Share Feedback' },
];

const AppLayout = ({ children }: PropsWithChildren) => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const router = useRouter();
  const titleRender = useCallback(
    (logo: ReactNode) => (
      <Link href="/" style={{ marginLeft: 20 }}>
        {logo}
      </Link>
    ),
    [],
  );

  const Logo = (
    <Image
      src="/images/logo-white.svg"
      height={35}
      width={(88 / 35) * 35}
      alt="NPSAT logo"
    />
  );

  const defaultFooterDom = () => (
    <DefaultFooter
      style={{ backgroundColor: BACKGROUND_COLOR }}
      copyright={`${new Date().getFullYear()} Regents of the University of California`}
      links={[
        {
          key: 'Division of Agriculture and Natural Resources',
          title: 'Division of Agriculture and Natural Resources',
          href: 'http://ucanr.edu/',
          blankTarget: true,
        },
        {
          key: 'Groundwater',
          title: 'Groundwater',
          href: 'http://groundwater.ucdavis.edu/',
          blankTarget: true,
        },
      ]}
    />
  );

  const onClick: MenuProps['onClick'] = () => {
    localStorage.removeItem('npsat_user_info');
    dispatch(setCredentials({ user: null, token: null }));
    router.push('/user/login');
  };

  return (
    <ProLayout
      loading={user === null}
      token={{
        header: {
          colorBgHeader: PRIMARY_COLOR,
        },
        bgLayout: BACKGROUND_COLOR,
      }}
      avatarProps={{
        size: 'small',
        title: <ProfileButton name={user?.username ?? 'U'} />,
        render: (_props, dom) => {
          return (
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: 'Logout',
                  },
                ],
                onClick,
              }}
            >
              {dom}
            </Dropdown>
          );
        },
      }}
      logo={Logo}
      headerTitleRender={titleRender}
      layout="top"
      footerRender={defaultFooterDom}
      menu={{ locale: false, request: async () => menuItems }}
      headerContentRender={() => (
        user && <div style={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1, alignSelf: 'flex-end', height: '100%' }}>
          {menuItems.map((item) => (
            item.name === 'Resources' ?
              <a
                style={{ display: 'flex', justifyContent: 'flex-end', height: '100%'}}
                href='https://gwt.ucdavis.edu/research-tools-and-applications/mantisnpsat-web-interface'
                target='_blank'
              >
                <Button type="text" style={{ color: 'white', height: '100%'}} size='small'>{item.name}</Button>
              </a>
              :
              <Button type="text" style={{ color: 'white', height: '100%'}} size='small' onClick={() => {router.push(item.path)}}>{item.name}</Button>
          ))}
        </div>
      )}
    >
      {user ? children : <div />}
    </ProLayout>
  );
};

export default AppLayout;
