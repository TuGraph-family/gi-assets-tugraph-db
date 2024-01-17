import { Form, Input, InputNumber } from 'antd';
import React from 'react';

const inputStyle = {
  width: 'auto',
  borderRadius: '4px',
};

const TwoInput = () => {
  return (
    <Input.Group
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Form.Item
        name="x"
        extra="x 坐标"
        style={{ display: 'inline-block', marginBottom: 0 }}
      >
        <InputNumber size="small" style={inputStyle} />
      </Form.Item>
      <Form.Item
        name="y"
        extra="y 坐标"
        style={{
          display: 'inline-block',
          margin: '0 16px',
        }}
      >
        <InputNumber size="small" style={inputStyle} />
      </Form.Item>
    </Input.Group>
  );
};

export default TwoInput;
