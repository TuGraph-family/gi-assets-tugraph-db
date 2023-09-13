import { Input } from 'antd';
import { DescriptionInput } from '../../interface';
import React from 'react';

const DescriptionInput = ({ description, ...other }: Partial<DescriptionInput>) => {
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
