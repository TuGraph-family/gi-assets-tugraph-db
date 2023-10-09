import { Select } from 'antd';
import React from 'react';
import { DescriptionSelectProps } from '../interface';

const DescriptionSelect = ({
  description,
  ...other
}: Partial<DescriptionSelectProps>) => {
  return (
    <div className="description">
      <div className="input">
        <Select {...other} />
      </div>
      <div className="text">{description}</div>
    </div>
  );
};

export default DescriptionSelect;
