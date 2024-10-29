'use client';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { useRegisterMutation } from '@/store';

import LoginWrapper from '../_components/LoginWrapper';

type FieldType = {
  username?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
};

const RegisterPage = () => {
  const [register] = useRegisterMutation();
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const email = values.email ?? '';
    const username = values.username ?? '';
    const password = values.password ?? '';
    const confirmPassword = values.confirm_password ?? '';
    if (password !== confirmPassword) {
      form.setFields([
        {
          name: 'confirm_password',
          errors: ['Password does not match'],
        },
      ]);
      return;
    }
    try {
      await register({ email, username, password }).unwrap();
      router.push('/user/login');
    } catch {
      form.setFields([
        {
          name: 'email',
          errors: ['There is already an account with this email'],
        },
      ]);
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Register - NPSAT</title>
        <meta name="description" content="Register - NPSAT" />
      </Helmet>
      <LoginWrapper>
        <Form
          style={{ width: 360 }}
          name="normal_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item<FieldType>
            name="username"
            rules={[{ required: true, message: 'Please input your name' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Name" />
          </Form.Item>
          <Form.Item<FieldType>
            name="email"
            rules={[{ required: true, message: 'Please input your email' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
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
          <Form.Item<FieldType>
            name="confirm_password"
            rules={[{ required: true, message: 'Please input your password' }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Confirm Password"
            />
          </Form.Item>
          <Form.Item<FieldType>>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%', marginTop: 10 }}
            >
              Register Now
            </Button>
          </Form.Item>
        </Form>
      </LoginWrapper>
    </HelmetProvider>
  );
};

export default RegisterPage;
