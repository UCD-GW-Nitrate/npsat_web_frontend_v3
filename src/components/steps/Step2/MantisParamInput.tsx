import { Form, InputNumber } from 'antd';

interface MantisParamInputProps {
  label: string;
  value: number;
  onChange: (input: number) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  help?: string;
}

const MantisParamInput = ({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  precision,
  help,
}: MantisParamInputProps) => (
  <Form.Item label={label} extra={help}>
    <InputNumber
      value={value}
      min={min}
      max={max}
      step={step}
      precision={precision}
      onChange={(input) => {
        if (input !== null && input !== undefined) {
          onChange(input);
        }
      }}
      style={{ width: 160 }}
    />
  </Form.Item>
);

export default MantisParamInput;