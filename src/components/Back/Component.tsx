import { ArrowLeftOutlined, CaretDownOutlined } from '@ant-design/icons';
import { Button, Select } from 'antd';
import React, { useState } from 'react';
import { getQueryString } from '../utils'

import './index.less';

const Back = () => {
  const graphName = getQueryString('graphName')

  const [state, setState] = useState({
    graphName
  })


  // 获取子图列表
  const subgraphList = localStorage.getItem('TUGRAPH_SUBGRAPH_LIST') ? JSON.parse(localStorage.getItem('TUGRAPH_SUBGRAPH_LIST') as string) : []

  const handleSwitchGraph = (value) => {
    setState({
      graphName: value
    })
    location.href = `/admin/j50e6v2vivk?graphName=${value}`
  }

  return (
    <div className="gea-back">
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => {
          location.href = '/admin/g42qkxt1ccd';
        }}
      />
      <Select
        value={state.graphName}
        style={{ width: 150, paddingLeft: graphName ? 20 : 0, fontWeight: '600' }}
        bordered={false}
        onChange={handleSwitchGraph}
        suffixIcon={<CaretDownOutlined />}
        options={subgraphList.map(d => {
          return {
            label: d.graph_name,
            value: d.graph_name
          }
        })} />
    </div>
  );
};

export default Back;
