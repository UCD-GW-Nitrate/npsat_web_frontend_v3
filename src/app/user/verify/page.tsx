'use client';

import type { FormProps } from 'antd';
import { Button, Flex, Form, Input } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import {
  useSendVerificationEmailMutation,
  useVerifyUserMutation,
} from '@/store';

import LoginWrapper from '../_components/LoginWrapper';
import { setCredentials } from '@/store/slices/authSlice';

type FieldType = {
  code?: string;
};

const VerifyPage = () => {
  const [sendVerificationEmail] = useSendVerificationEmailMutation();
  const [verify] = useVerifyUserMutation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const code = values.code ?? '';
    try {
      await verify({
        verification_code: code,
        email: searchParams.get('email') ?? '',
      }).unwrap();
      router.push('/');
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
        <title>Verify Email - NPSAT</title>
        <meta name="description" content="Verify Email - NPSAT" />
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

export default VerifyPage;
