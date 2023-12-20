import { getQueryString } from '@/utils';
import { ArrowLeftOutlined, CaretDownOutlined } from '@ant-design/icons';
import { Button, Select } from 'antd';

import './index.less';

const Back = () => {
  const graphName = getQueryString('graphName');
  // 获取子图列表
  const subgraphList = localStorage.getItem('TUGRAPH_SUBGRAPH_LIST')
    ? JSON.parse(localStorage.getItem('TUGRAPH_SUBGRAPH_LIST') as string)
    : [];

  const handleSwitchGraph = (value) => {
    const url = `${location.pathname}?graphName=${value}`;
    // GI 中测试使用
    // const url = `http://dev.alipay.net:8000/#/workspace/d72a7985-292f-4dc5-a9c9-c38f3e3639e5?nav=components&graphName=${value}`
    window.location.href = url;
  };

  return (
    <div className="gea-back">
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => {
          window.location.href = window.location.origin;
        }}
      />
      <Select
        defaultValue={graphName}
        style={{
          width: 150,
          paddingLeft: graphName ? 20 : 0,
          fontWeight: '600',
        }}
        bordered={false}
        onChange={handleSwitchGraph}
        suffixIcon={<CaretDownOutlined />}
        options={subgraphList.map((d) => {
          return {
            label: d.graph_name,
            value: d.graph_name,
          };
        })}
      />
    </div>
  );
};

export default Back;
