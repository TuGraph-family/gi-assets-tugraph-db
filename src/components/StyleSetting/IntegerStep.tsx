import { Col, Popover, Row, Slider } from "antd";
import React, { useEffect } from "react";
import { useImmer } from "use-immer";

interface IntegerStepProps {
  onChange?: (value: number) => void;
  defaultValue?: number;
  value?: number;
  marks: any;
  min?: number;
  max?: number;
}

const IntegerStep: React.FC<IntegerStepProps> = ({ value, defaultValue = 0, onChange, marks, min = 5, max = 100 }) => {
  const [state, setState] = useImmer<{ inputValue?: number }>({ 
    inputValue: defaultValue,
  });
  const { inputValue } = state;

  const onValueChange = (value) => {
    setState((draft) => {
      draft.inputValue = value;
    });
    if (onChange) {
      onChange(value);
    }
  };
  useEffect(() => {
    setState((draft) => {
      draft.inputValue = value;
    });
  }, [value]);

  return (
    <Row style={{ padding: '0 8px' }}>
      <Col span={24}>
        <Slider
          min={min}
          max={max}
          marks={marks}
          step={null}
          onChange={onValueChange}
          value={typeof inputValue === "number" ? inputValue : 0}
        />
      </Col>
      {/* <Col span={4}>
        <InputNumber
          min={1}
          max={200}
          style={{ margin: "0 16px" }}
          value={inputValue}
          onChange={onValueChange}
        />
      </Col> */}
    </Row>
  );
};

export default IntegerStep;
