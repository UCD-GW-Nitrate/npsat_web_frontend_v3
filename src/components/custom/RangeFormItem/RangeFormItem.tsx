import { Col, InputNumber, Row, Slider } from 'antd';
import React, { useEffect, useState } from 'react';

interface RangeConfig {
  min: number;
  max: number;
  step: number;
  maxIdentifier: boolean;
}

interface RangeFormItemProps {
  valueLow?: number;
  valueHigh?: number;
  onChangeMin?: (input: number) => void;
  onChangeMax?: (input: number) => void;
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
  valueLow,
  valueHigh,
  onChangeMin,
  onChangeMax,
  rangeConfig,
}: RangeFormItemProps) => {
  const { max, min, step, maxIdentifier = true } = rangeConfig;
  const [low, setLow] = useState<number>(valueLow || min);
  const [high, setHigh] = useState<number>(valueHigh || max);

  useEffect(() => {
    if (valueLow) {
      setLow(valueLow);
    }
    if (valueHigh) {
      setHigh(valueHigh);
    }
  }, [valueLow, valueHigh]);

  // used to represent the maximum value
  const maxIdentifierFormatter = (num: number | undefined) => {
    if (num && maxIdentifier && num > max) {
      return 'max';
    }
    return (num ?? '').toString();
  };

  const lowOnChange = (lowBound: number | null) => {
    if (lowBound && lowBound !== low) {
      setLow(lowBound);
    }
  };

  const highOnChange = (highBound: number | null) => {
    if (highBound && highBound !== high) {
      setHigh(highBound);
    }
  };

  const highOnChangeComplete = (highBound: number | null) => {
    if (highBound && onChangeMax) {
      onChangeMax(highBound!);
    }
  };

  const lowOnChangeComplete = (lowBound: number | null) => {
    if (lowBound && onChangeMin) {
      onChangeMin(lowBound!);
    }
  };

  const rangeOnChange = (range: number[]) => {
    if (range.length === 2) {
      const rangeChecked = range as [number, number];
      highOnChange(rangeChecked[1]);
      lowOnChange(rangeChecked[0]);
    }
  };

  const rangeOnChangeComplete = (range: number[]) => {
    if (range.length === 2) {
      const rangeChecked = range as [number, number];
      highOnChangeComplete(rangeChecked[1]);
      lowOnChangeComplete(rangeChecked[0]);
    }
  };

  const highStep = (highBound: number | null) => {
    if (highBound && highBound !== high) {
      setHigh(highBound);
      highOnChangeComplete(highBound);
    }
  };

  const lowStep = (lowBound: number | null) => {
    if (lowBound && lowBound !== low) {
      setLow(lowBound);
      lowOnChangeComplete(lowBound);
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
          onChange={rangeOnChange}
          onChangeComplete={rangeOnChangeComplete}
        />
      </Col>
      <Col>
        min:{' '}
        <InputNumber
          value={low}
          step={step}
          onChange={lowStep}
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
          onChange={highStep}
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
