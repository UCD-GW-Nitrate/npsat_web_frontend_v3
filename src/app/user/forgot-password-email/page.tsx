'use client';

import { UserOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { useUnauthorizedVerifyEmailMutation } from '@/store';

import LoginWrapper from '../_components/LoginWrapper';

type FieldType = {
  email?: string;
};

const LoginPage = () => {
  const [sendVerificationEmail] = useUnauthorizedVerifyEmailMutation();
  const router = useRouter();
  const [form] = Form.useForm();

  useEffect(() => {
    router.refresh();
  }, []);

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const email = values.email ?? '';
    try {
      await sendVerificationEmail(email);
      const params = new URLSearchParams();
      params.set('email', email);
      router.push(`/user/forgot-password?${params.toString()}`);
    } catch {
      form.setFields([
        {
          name: 'email',
          errors: ['Invalid email'],
        },
      ]);
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Forgot Password - NPSAT</title>
        <meta name="description" content="Forgot Password - NPSAT" />
      </Helmet>
      <LoginWrapper>
        <Form
          name="normal_forgot_password"
          style={{ width: 360 }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item<FieldType>
            name="email"
            rules={[{ required: true, message: 'Please input your email' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item<FieldType>>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%', marginTop: 10 }}
            >
              Email Verification Code
            </Button>
          </Form.Item>
        </Form>
      </LoginWrapper>
    </HelmetProvider>
  );
};

export default LoginPage;
