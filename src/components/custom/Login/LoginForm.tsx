import { LockOutlined, UserOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch } from 'react-redux';

import { useLoginMutation } from '@/store';
import { setCredentials } from '@/store/slices/authSlice';

import { HBox } from '../HBox/Hbox';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

interface LoginFormProps {
  style?: React.CSSProperties;
}

const LoginForm = ({ style }: LoginFormProps) => {
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const router = useRouter();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const username = values.username ?? '';
    const password = values.password ?? '';
    const user = await login({ username, password }).unwrap();
    dispatch(setCredentials(user));
    router.push('/');
  };

  return (
    <Form
      style={style}
      name="normal_login"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item<FieldType>
        name="username"
        rules={[{ required: true, message: 'Please input your Username!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>
      <Form.Item<FieldType>
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input
          prefix={<LockOutlined />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <HBox>
        <Form.Item<FieldType> name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <Link href="/user/login">Forgot password</Link>
      </HBox>

      <Form.Item<FieldType>>
        <Button
          type="primary"
          htmlType="submit"
          style={{ width: '100%', marginTop: 10 }}
        >
          Log in
        </Button>
        Or <Link href="/user/login">register now!</Link>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
