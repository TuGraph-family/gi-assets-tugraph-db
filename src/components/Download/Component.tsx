import { Select } from 'antd';
import { common, useContext } from '@antv/gi-sdk';
import React from 'react';
import './index.less';

const Download: React.FC<{}> = ({}) => {
  const { graph } = useContext();

  const onExport = () => {
    const { nodes, edges } = graph.save() as {
      nodes: any[];
      edges: any[];
    };

    const data = {
      nodes: nodes.map(node => {
        return node.data;
      }),
      edges: edges.map(edge => {
        return edge.data;
      }),
    };

    common.createDownload(new Blob([JSON.stringify(data)], { type: 'text/json' }), 'data.json');
  };

  const handleChange = (value: string) => {
    if (value === 'image') {
      graph.downloadFullImage();
      return;
    }
    onExport();
  };

  return (
    <div className="container">
      <Select
        placeholder="下载"
        style={{ width: 98 }}
        onChange={handleChange}
        dropdownMatchSelectWidth={false}
        className="selection"
        suffixIcon={
          <img
            src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*8vDOSrGq4ykAAAAAAAAAAAAADgOBAQ/original"
            alt=""
            style={{
              width: 12,
              height: 12,
            }}
          />
        }
      >
        <Select.Option value="material">下载资料</Select.Option>
        <Select.Option value="image">下载图片</Select.Option>
      </Select>
    </div>
  );
};

export default Download;
