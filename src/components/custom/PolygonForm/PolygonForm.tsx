import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Form, InputNumber } from 'antd';
import React from 'react';

export default function PolygonForm({
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
    <Card style={{ maxWidth: 600 }} size="small" title="Adding polygon">
      <Form
        name="dynamic_form"
        onFinish={onFinish}
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
        form={form}
      >
        <Form.List name="points">
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item key={field.key} style={{ margin: 0 }}>
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
              <Form.Item style={{ marginTop: 10, marginBottom: 0 }}>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: 200 }}
                  icon={<PlusOutlined />}
                >
                  Add point
                </Button>
              </Form.Item>

              <Form.Item style={{ margin: 0 }}>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item style={{ alignSelf: 'flex-end', margin: 0 }}>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
