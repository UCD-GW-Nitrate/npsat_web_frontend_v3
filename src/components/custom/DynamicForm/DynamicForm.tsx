import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Form, InputNumber } from 'antd';
import React from 'react';

import { StandardText } from '../StandardText/StandardText';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

export default function DynamicForm({
  setPolygonCoords,
}: {
  setPolygonCoords: React.Dispatch<React.SetStateAction<[number, number][]>>;
}) {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const errors = [];
    const polygon: [number, number][] = [];

    // Clear any previous errors
    form.setFields(
      form.getFieldsError().map(({ name }) => ({
        name,
        errors: [],
      })),
    );

    if (values.points.length < 3) {
      errors.push({
        name: ['points'],
        errors: ['At least 3 points are required'],
      });
    }

    values.points.forEach(
      (point: { lat: number; lng: number }, idx: number) => {
        if (!point.lat) {
          errors.push({
            name: ['points', idx, 'lat'],
            errors: ['Lat and Lng are required'],
          });

          // If there is also a lng error, highlight it but don't duplicate error message
          if (!point.lng) {
            errors.push({
              name: ['points', idx, 'lng'],
              errors: [''],
            });
          }
        } else if (!point.lng) {
          errors.push({
            name: ['points', idx, 'lng'],
            errors: ['Lat and Lng are required'],
          });
        }
        polygon.push([point.lat, point.lng]);
      },
    );

    if (errors.length > 0) {
      form.setFields(errors);
      return;
    }

    setPolygonCoords(polygon);
  };

  return (
    <Form
      name="dynamic_form"
      {...formItemLayout}
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
      form={form}
    >
      <StandardText variant="h5" style={{ marginTop: 0 }}>
        Adding polygon
      </StandardText>

      <Form.List name="points">
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item key={field.key}>
                <Flex gap="small" align="center">
                  <p>(</p>

                  <Form.Item name={[field.name, 'lat']} noStyle required>
                    <InputNumber placeholder="Lat" />
                  </Form.Item>

                  <p>,</p>

                  <Form.Item name={[field.name, 'lng']} noStyle required>
                    <InputNumber placeholder="Lng" />
                  </Form.Item>

                  <p>)</p>

                  <MinusCircleOutlined onClick={() => remove(field.name)} />
                </Flex>
              </Form.Item>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: '60%' }}
                icon={<PlusOutlined />}
              >
                Add point
              </Button>
            </Form.Item>

            <Form.Item>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create polygon
        </Button>
      </Form.Item>
    </Form>
  );
}
