import { Segmented } from 'antd';
import * as React from 'react';

import { IState } from './typing';
interface SegementFilterProps {
  state: IState;
  updateState: any;
}

export const options = [
  {
    value: 'Shortest-Path',
    label: '最短',
  },
  {
    value: 'All-Path',
    label: '全部',
    disabled: true,
  },
];

const SegementFilter: React.FunctionComponent<SegementFilterProps> = props => {
  return (
    <div>
      <Segmented options={options} value={options[0].value} style={{ width: 116 }} />
    </div>
  );
};

export default SegementFilter;
