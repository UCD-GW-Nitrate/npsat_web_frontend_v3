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

    values.polygons.forEach((poly, idx) => {
      if (poly.points.length < 3) {
        errors.push({
          name: ['polygons', idx],
          errors: ['At least 3 points are required'],
        });
      }
      for (let i = 0; i < poly.points.length; i += 1) {
        if (!poly.points[i].lat || !poly.points[i].lng) {
          errors.push({
            name: ['polygons', idx, 'points', i],
            errors: ['Lat and Lng are required'],
          });
        }
      }
    });

    if (errors.length > 0) {
      console.log('Errors ', errors);
      form.setFields(errors);
      return;
    }

    if (values.polygons.length > 0) {
      const polygon: [number, number][] = values.polygons[0].points.map((p) => {
        return [p.lat, p.lng];
      });

      setPolygonCoords(polygon);
    }

    console.log('Received values of form:', values.polygons[0]);
  };

  return (
    <Form
      name="dynamic_form_item"
      {...formItemLayout}
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
      form={form}
    >
      <Form.List name="polygons">
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                {...formItemLayout}
                label={undefined}
                required={false}
                key={field.key}
              >
                <Flex gap="large">
                  <StandardText variant="h5" style={{ marginTop: 0 }}>
                    Polygon {index + 1}
                  </StandardText>
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                  />
                </Flex>
                <Form.List name={[field.name, 'points']}>
                  {(
                    fields_latLng,
                    { add: addLatLng, remove: removeLatLng },
                    { errors: errorsLatLng },
                  ) => (
                    <>
                      {fields_latLng.map((fieldLatLng) => (
                        <Flex gap="small" align="center" key={fieldLatLng.key}>
                          <p>(</p>

                          <Form.Item name={[fieldLatLng.name, 'lat']} noStyle>
                            <InputNumber
                              placeholder="Lat"
                              style={{ width: 100 }}
                            />
                          </Form.Item>

                          <p>,</p>

                          <Form.Item name={[fieldLatLng.name, 'lng']} noStyle>
                            <InputNumber
                              placeholder="Lng"
                              style={{ width: 100 }}
                            />
                          </Form.Item>

                          <p>)</p>

                          <MinusCircleOutlined
                            onClick={() => removeLatLng(fieldLatLng.name)}
                          />
                        </Flex>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => addLatLng()}
                          style={{ width: '60%' }}
                          icon={<PlusOutlined />}
                        >
                          Add point
                        </Button>
                        <Form.ErrorList errors={errorsLatLng} />
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Form.Item>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: '60%' }}
                icon={<PlusOutlined />}
              >
                Add polygon
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
