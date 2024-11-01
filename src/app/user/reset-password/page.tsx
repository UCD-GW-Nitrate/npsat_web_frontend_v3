'use client';

import { LockOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { useSetPasswordMutation } from '@/store';

import LoginWrapper from '../_components/LoginWrapper';

type FieldType = {
  username?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
};

const ResetPasswordPage = () => {
  const [resetPassword] = useSetPasswordMutation();
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
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
      await resetPassword(password).unwrap();
      router.push('/user/login');
    } catch {
      form.setFields([
        {
          name: 'password',
          errors: ['Unable to reset password'],
        },
      ]);
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Reset Password - NPSAT</title>
        <meta name="description" content="Reset Password - NPSAT" />
      </Helmet>
      <LoginWrapper>
        <Form
          name="normal_reset_password"
          style={{ width: 360 }}
          onFinish={onFinish}
          form={form}
        >
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
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </LoginWrapper>
    </HelmetProvider>
  );
};

export default ResetPasswordPage;
