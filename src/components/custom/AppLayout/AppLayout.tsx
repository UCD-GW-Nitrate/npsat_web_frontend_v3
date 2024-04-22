import { LogoutOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';
import { Dropdown } from 'antd';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import type { PropsWithChildren, ReactNode } from 'react';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { BACKGROUND_COLOR, PRIMARY_COLOR } from '@/components/theme';
import { clearModel } from '@/store/slices/modelSlice';

import ProfileButton from './ProfileButton';

const ProLayout = dynamic(() => import('@ant-design/pro-layout'), {
  ssr: false,
});

const AppLayout = ({ children }: PropsWithChildren) => {
  const dispatch = useDispatch();
  const titleRender = useCallback(
    (logo: ReactNode) => (
      <Link
        href="/"
        style={{ marginLeft: 20 }}
        onClick={() => dispatch(clearModel())}
      >
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
      logo={Logo}
      headerTitleRender={titleRender}
      layout="top"
      footerRender={defaultFooterDom}
    >
      {children}
    </ProLayout>
  );
};

export default AppLayout;
