import { Input } from 'antd';
import { DescriptionInputProps } from '../interface';
import React from 'react';

const DescriptionInput = ({
  description,
  ...other
}: Partial<DescriptionInputProps>) => {
  return (
    <div className="description">
      <div className="input">
        <Input {...other} />
      </div>
      <div className="text">{description}</div>
    </div>
  );
};

export default DescriptionInput;
