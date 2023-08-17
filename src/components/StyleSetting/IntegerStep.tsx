import { Col, Popover, Row, Slider } from "antd";
import React, { useEffect } from "react";
import { useImmer } from "use-immer";

interface IntegerStepProps {
  onChange?: (value: number) => void;
  defaultValue?: number;
  value?: number;
}

const IntegerStep: React.FC<IntegerStepProps> = ({ value, defaultValue = 0, onChange }) => {
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

  const marks = {
    5: '最小',
    30: '小',
    60: '中等',
    100: '大',
  };

  return (
    <Row style={{ padding: '0 8px' }}>
      <Col span={24}>
        <Slider
          // min={1}
          // max={200}
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
