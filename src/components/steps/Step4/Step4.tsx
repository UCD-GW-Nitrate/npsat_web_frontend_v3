'use client';

import { Divider, Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React from 'react';
import type { FieldValues } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { PageAdvancementButtons } from '@/components/custom/PageAdvancementButtons/PageAdvancementButtons';
import type { Model } from '@/store/slices/modelSlice';
import {
  selectCurrentModel,
  setModelDescription,
  setModelName,
} from '@/store/slices/modelSlice';

import type StepBase from '../StepBase';
import defaultRules from '../util/defaultRules';
import Step4Instructions from './Step4Instructions';

interface Step4Props extends StepBase {
  onComplete: (newModel: Model) => void;
}

const Step4 = ({ onPrev, onComplete }: Step4Props) => {
  const dispatch = useDispatch();
  const model = useSelector(selectCurrentModel);
  const [form] = Form.useForm();

  const onFormSubmit = (data: FieldValues) => {
    dispatch(setModelName(data.model_name));
    dispatch(setModelDescription(data.description));
    onComplete({
      ...model,
      name: data.model_name,
      description: data.model_desc,
    });
  };

  const formItemLayout = {
    labelCol: {
      span: 7,
    },
    wrapperCol: {
      span: 25,
    },
  };

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        layout="horizontal"
        onFinish={onFormSubmit}
      >
        <Form.Item
          name="model_name"
          label="Scenario name"
          rules={defaultRules('Please enter the model name')}
          initialValue={model.name}
        >
          <Input placeholder="scenario name" />
        </Form.Item>
        <Form.Item
          name="model_desc"
          label="Description"
          initialValue={model.description}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          style={{
            marginBottom: 8,
          }}
          wrapperCol={{
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
        >
          <PageAdvancementButtons canGoBack onClickPrev={onPrev} />
        </Form.Item>
      </Form>
      <Divider />
      <Step4Instructions />
    </>
  );
};

export default Step4;
