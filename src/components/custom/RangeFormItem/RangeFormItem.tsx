import { Col, InputNumber, Row, Slider } from 'antd';
import React, { useEffect, useState } from 'react';

interface RangeConfig {
  min: number;
  max: number;
  step: number;
  maxIdentifier: boolean;
}

interface RangeFormItemProps {
  value?: [number, number];
  onChange?: (input: [number, number]) => void;
  rangeConfig: RangeConfig;
}

/**
 * Customized antd form item for ranges
 * @param value inherited from Form
 * @param onChange inherited from Form
 * @param rangeConfig config of this component { max, min, step, maxIdentifier(optional) }
 * @param maxIdentifier used when a very large max value is required
 * @returns {JSX.Element}
 * @constructor
 */
const RangeFormItem = ({
  value,
  onChange,
  rangeConfig,
}: RangeFormItemProps) => {
  const { max, min, step, maxIdentifier = true } = rangeConfig;
  const [low, setLow] = useState<number>(value ? value[0] : min);
  const [high, setHigh] = useState<number>(value ? value[1] : max);

  // used to represent the maximum value
  const maxIdentifierFormatter = (num: number | undefined) => {
    if (num && maxIdentifier && num > max) {
      return 'max';
    }
    return (num ?? '').toString();
  };

  useEffect(() => {
    setLow(value ? value[0] : min);
    setHigh(value ? value[1] : max);
  }, [value]);

  const lowOnChange = (lowBound: number | null) => {
    if (lowBound) {
      setLow(lowBound);
      if (onChange) {
        onChange([lowBound, high]);
      }
    }
  };
  const highOnChange = (highBound: number | null) => {
    if (highBound) {
      setHigh(highBound);
      if (onChange) {
        onChange([low, highBound]);
      }
    }
  };
  const rangeOnChange = (range: number[]) => {
    if (range.length === 2) {
      const rangeChecked = range as [number, number];
      setLow(rangeChecked[0]);
      setHigh(rangeChecked[1]);
      if (onChange) {
        onChange([...rangeChecked]);
      }
    }
  };

  return (
    <Row gutter={8}>
      <Col flex="auto">
        <Slider
          range
          value={[low, high]}
          max={maxIdentifier ? max + 1 : max}
          min={min}
          onChange={(v) => rangeOnChange(v)}
        />
      </Col>
      <Col>
        min:{' '}
        <InputNumber
          value={low}
          step={step}
          onChange={(v) => lowOnChange(v)}
          style={{ width: 60 }}
          max={maxIdentifier ? max + 1 : max}
          min={min}
        />
        <span> /{(low * 3.28).toFixed(0)}(ft)</span>
      </Col>
      <Col>
        max:{' '}
        <InputNumber
          value={high}
          step={step}
          onChange={(v) => highOnChange(v)}
          style={{ width: 60 }}
          max={maxIdentifier ? max + 1 : max}
          min={min}
          formatter={maxIdentifierFormatter}
        />
        <span> /{(high * 3.28).toFixed(0)}(ft)</span>
      </Col>
    </Row>
  );
};

export default RangeFormItem;
