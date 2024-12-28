'use client';

import type { FormProps } from 'antd';
import { Button, Flex, Form, Input } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useDispatch } from 'react-redux';

import {
  useUnauthorizedVerifyCodeMutation,
  useUnauthorizedVerifyEmailMutation,
} from '@/store';
import { setCredentials } from '@/store/slices/authSlice';

import LoginWrapper from '../_components/LoginWrapper';

type FieldType = {
  code?: string;
};

const ForgotPasswordPage = () => {
  const [verify] = useUnauthorizedVerifyCodeMutation();
  const [sendVerificationEmail] = useUnauthorizedVerifyEmailMutation();
  const dispatch = useDispatch();

  const router = useRouter();
  const searchParams = useSearchParams();
  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const code = values.code ?? '';
    try {
      const user = await verify({
        verification_code: code,
        email: searchParams.get('email') ?? '',
      }).unwrap();
      dispatch(setCredentials(user));
      router.push('/user/reset-password');
    } catch {
      form.setFields([
        {
          name: 'code',
          errors: ['This code is invalid'],
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
          name="normal_verify"
          style={{ width: 360 }}
          onFinish={onFinish}
          form={form}
        >
          <Flex align="center" vertical>
            <Form.Item<FieldType>
              name="code"
              rules={[
                { required: true, message: 'Enter the code emailed to you' },
              ]}
            >
              <Input.OTP length={6} size="large" />
            </Form.Item>
          </Flex>
          <Form.Item<FieldType>>
            <Button
              onClick={() =>
                sendVerificationEmail(searchParams.get('email') ?? '')
              }
              style={{ width: '100%', marginTop: 10 }}
            >
              Resend Code
            </Button>
          </Form.Item>
          <Form.Item<FieldType>>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Verify Email
            </Button>
          </Form.Item>
        </Form>
      </LoginWrapper>
    </HelmetProvider>
  );
};

export default ForgotPasswordPage;
