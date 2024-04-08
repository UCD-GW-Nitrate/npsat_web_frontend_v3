import { InfoCircleOutlined } from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Divider,
  Form,
  InputNumber,
  Select,
  Tooltip,
} from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import type { FieldValues } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { useScenarioGroups } from '@/hooks/useScenarioGroups';
import {
  setModelFlowScenario,
  setModelLoadScenario,
  setModelReductionEndYear,
  setModelReductionStartYear,
  setModelSimEndYear,
  setModelUnsatScenario,
  setModelWaterContent,
  setModelWelltypeScenario,
} from '@/store/slices/modelSlice';

import type { Step } from '../../create';
import defaultRules from '../util/defaultRules';
import Step1Instructions from './Step1Instructions';

const { RangePicker } = DatePicker;

interface Step1Props extends Step {}

const Step1 = ({ onNext }: Step1Props) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const {
    flowScenarios: flowScenarioOptions,
    loadScenarios: loadScenarioOptions,
    unsatScenarios: unsatScenarioOptions,
    welltypeScenarios: welltypeScenarioOptions,
  } = useScenarioGroups();

  const onFormSubmit = (data: FieldValues) => {
    dispatch(setModelFlowScenario({ id: data.flow_scenario }));
    dispatch(setModelLoadScenario({ id: data.load_scenario }));
    dispatch(setModelWelltypeScenario({ id: data.welltype_scenario }));
    dispatch(setModelUnsatScenario(data.unsat_scenario));
    dispatch(setModelWaterContent(data.water_content));
    dispatch(setModelSimEndYear((data.sim_end_year as dayjs.Dayjs).year()));
    dispatch(
      setModelReductionStartYear(
        (data.reduction_year as dayjs.Dayjs[])[0]!.year(),
      ),
    );
    dispatch(
      setModelReductionEndYear(
        (data.reduction_year as dayjs.Dayjs[])[1]!.year(),
      ),
    );
    onNext();
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
          name="flow_scenario"
          label="Flow scenario"
          rules={defaultRules('Please select a flow scenario')}
        >
          <Select>
            {flowScenarioOptions.map((scen) => (
              <Select.Option value={scen.id} key={scen.id}>
                <>
                  {scen.name}{' '}
                  {scen.description ? (
                    <Tooltip title={scen.description}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  ) : null}
                </>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="load_scenario"
          label="Load scenario"
          rules={defaultRules('Please select a load scenario')}
        >
          <Select>
            {loadScenarioOptions.map((scen) => (
              <Select.Option value={scen.id} key={scen.id}>
                <>
                  {scen.name}{' '}
                  {scen.description ? (
                    <Tooltip title={scen.description}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  ) : null}
                </>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="welltype_scenario"
          label="Well Type scenario"
          rules={defaultRules('Please select a well type scenario')}
        >
          <Select>
            {welltypeScenarioOptions.map((scen) => (
              <Select.Option value={scen.id} key={scen.id}>
                <>
                  {scen.name}{' '}
                  {scen.description ? (
                    <Tooltip title={scen.description}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  ) : null}
                </>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="unsat_scenario"
          label="Unsaturated zone depth scenario"
          rules={defaultRules('Please select an unsat scenario')}
        >
          <Select>
            {unsatScenarioOptions.map((scen) => (
              <Select.Option value={scen.id} key={scen.id}>
                <>
                  {scen.name}{' '}
                  {scen.description ? (
                    <Tooltip title={scen.description}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  ) : null}
                </>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="water_content"
          label="Unsaturated zone effective water content"
          rules={defaultRules('Please enter the water content')}
        >
          <InputNumber min={0} max={200} formatter={(v) => `${v}%`} />
        </Form.Item>
        <Form.Item
          name="sim_end_year"
          label="Simulation ending year"
          rules={defaultRules(
            'Please enter numbers of years to simulate the scenario',
          )}
          initialValue={dayjs().year(2100)}
        >
          <DatePicker
            picker="year"
            disabledDate={(current) =>
              current.isBefore(dayjs().year(2020), 'year') ||
              current.isAfter(dayjs().year(2500), 'year')
            }
          />
        </Form.Item>
        <Form.Item
          name="reduction_year"
          label="Transition period"
          dependencies={['sim_end_year']}
          rules={[
            ...defaultRules('Please enter the reduction year'),
            ({ getFieldValue }) => ({
              validator: (_, _value) => {
                const simEndYear: Date = getFieldValue('sim_end_year');
                if (!_value || _value.length <= 1) {
                  return Promise.resolve();
                }
                const [endYear] = _value;
                if (endYear.isAfter(simEndYear, 'year')) {
                  return Promise.reject(
                    new Error(
                      'Reduction end year must not be after sim end year.',
                    ),
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <RangePicker
            picker="year"
            disabledDate={(current) => {
              const endYear: dayjs.Dayjs = form
                .getFieldValue('sim_end_year')
                .clone();
              return (
                current.isBefore(dayjs().year(2000), 'year') ||
                current.isAfter(endYear)
              );
            }}
          />
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
          <Button type="primary" htmlType="submit">
            Next
          </Button>
        </Form.Item>
      </Form>
      <Divider />
      <Step1Instructions />
    </>
  );
};

export default Step1;
