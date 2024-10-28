'use client';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useDispatch } from 'react-redux';

import { useLoginMutation } from '@/store';
import { setCredentials } from '@/store/slices/authSlice';

import LoginWrapper from '../_components/LoginWrapper';

type FieldType = {
  email?: string;
  password?: string;
};

const LoginPage = () => {
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const router = useRouter();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const email = values.email ?? '';
    const password = values.password ?? '';
    const user = await login({ email, password }).unwrap();
    dispatch(setCredentials(user));
    router.push('/');
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Login - NPSAT</title>
        <meta name="description" content="Login - NPSAT" />
      </Helmet>
      <LoginWrapper>
        <Form
          style={{ width: 360 }}
          name="normal_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item<FieldType>
            name="email"
            rules={[{ required: true, message: 'Please input your email' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item<FieldType>
            name="password"
            rules={[{ required: true, message: 'Please input your password' }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item<FieldType>>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%', marginTop: 10 }}
            >
              Log in
            </Button>
            Or <Link href="/user/register">register now!</Link>
          </Form.Item>
        </Form>
      </LoginWrapper>
    </HelmetProvider>
  );
};

export default LoginPage;
