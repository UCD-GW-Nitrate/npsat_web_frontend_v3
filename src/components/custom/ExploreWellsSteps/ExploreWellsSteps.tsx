import { EditOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import { Button, Flex, Form, Select, theme } from 'antd';
import type { ReactNode } from 'react';
import type { FieldValues } from 'react-hook-form';

import defaultRules from '@/components/steps/util/defaultRules';

const { Option } = Select;
const { useToken } = theme;

interface ExploreWellsStepsProps {
  form: FormInstance;
  onFormSubmit: (formData: FieldValues) => void;
  mapEditing: boolean;
  setMapEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

function Step({
  stepNum,
  title,
  content,
  status,
}: {
  stepNum: number;
  title: string;
  content: ReactNode;
  status: 'process' | 'error';
}) {
  const { token } = useToken();

  return (
    <Flex gap="small">
      <div
        style={{
          width: 24,
          height: 24,
          backgroundColor: token.colorPrimary,
          borderRadius: '50%',
          display: 'flex',
        }}
      >
        <p
          style={{
            fontSize: 12,
            marginRight: 'auto',
            marginLeft: 'auto',
            marginTop: 3,
            color: 'white',
          }}
        >
          {stepNum}
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          margin: 0,
          padding: 0,
          fontSize: 14,
          lineHeight: 2,
        }}
      >
        {title}
        {content}
      </div>
    </Flex>
  );
}

function StepsArrow({ color }: { color: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 12,
        height: 12,
        borderTop: `1px solid ${color}`,
        borderRight: `1px solid ${color}`,
        transform: 'rotate(45deg)',
        margin: '0 12px',
        flexShrink: 0,
      }}
    />
  );
}

export default function ExploreWellsSteps({
  form,
  onFormSubmit,
  mapEditing,
  setMapEditing,
}: ExploreWellsStepsProps) {
  return (
    <Form
      form={form}
      name="control-hooks"
      onFinish={onFormSubmit}
      layout="inline"
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 40,
      }}
    >
      <Flex
        justify="space-between"
        align="center"
        style={{ width: '100%', paddingRight: 50, paddingLeft: 50 }}
      >
        <Step
          stepNum={1}
          title="Select Region(s) from Map"
          status="process"
          content={
            <Flex>
              {mapEditing ? (
                <Button
                  type="link"
                  onClick={() => {
                    setMapEditing((prev) => !prev);
                    form.setFields([
                      { name: 'select_regions', errors: undefined },
                    ]);
                  }}
                  style={{ width: 120 }}
                >
                  Cancel Edit Mode
                </Button>
              ) : (
                <Button
                  type="link"
                  onClick={() => setMapEditing((prev) => !prev)}
                  style={{ width: 120 }}
                >
                  Edit Selection
                  <EditOutlined />
                </Button>
              )}
            </Flex>
          }
        />

        <StepsArrow color="rgba(0,0,0,0.25)" />

        <Step
          stepNum={2}
          title="Configure Model"
          status="process"
          content={
            <Flex gap="middle">
              <Form.Item
                name="flow"
                rules={defaultRules('Please select a base model')}
              >
                <Select style={{ width: 170 }} placeholder="Base Model">
                  <Option value="C2VSim">C2VSim</Option>
                  <Option value="CVHM2">CVHM2</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="scen"
                rules={defaultRules('Please select a scenario')}
              >
                <Select style={{ width: 170 }} placeholder="Scenario">
                  <Option value="Pump adjusted">Pump adjusted</Option>
                  <Option value="Recharge adjusted">Recharge adjusted</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="wType"
                rules={defaultRules('Please select a well type')}
              >
                <Select style={{ width: 170 }} placeholder="Well Type">
                  <Option value="Irrigation">Irrigation</Option>
                  <Option value="Domestic">Domestic</Option>
                </Select>
              </Form.Item>
            </Flex>
          }
        />

        <StepsArrow color="rgba(0,0,0,0.25)" />

        <Step
          stepNum={3}
          title="Fetch Wells"
          status="process"
          content={
            <Button type="primary" htmlType="submit">
              Fetch Wells
            </Button>
          }
        />
      </Flex>
    </Form>
  );
}
