import React from 'react';
import { Input, InputNumber, Form } from 'antd';

const TwoInput = () => {
  return (
    <Input.Group>
      <Form.Item name="x" extra="x 坐标" style={{ display: 'inline-block', marginBottom: 0 }}>
        <InputNumber size="small" style={{ width: 104 }} />
      </Form.Item>
      <Form.Item
        name="y"
        extra="y 坐标"
        style={{
          display: 'inline-block',

          margin: '0 16px',
        }}
      >
        <InputNumber size="small" style={{ width: 104 }} />
      </Form.Item>
    </Input.Group>
  );
};

export default TwoInput;
