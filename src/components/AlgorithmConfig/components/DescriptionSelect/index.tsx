import { Select } from 'antd';
import React from 'react';
import { DescriptionSelect } from '../../interface';

const DescriptionSelect = ({ description, ...other }: Partial<DescriptionSelect>) => {
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
