import { Select } from 'antd';
import { common, useContext } from '@antv/gi-sdk';
import React, { useEffect } from 'react';
import './index.less';
import { useState } from 'react';

const Download: React.FC<{}> = ({}) => {
  const { graph, data } = useContext();
  const [state, setState] = useState({
    disbaled: true
  })

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

  useEffect(() => {
    if (data.nodes.length > 0) {
      setState({
        disbaled: false
      })
    } else {
      setState({
        disbaled: true
      })
    }
  }, [data.nodes.length])

  return (
    <div className="tugraph-download-container">
      <Select
        placeholder="下载"
        style={{ width: 75 }}
        onChange={handleChange}
        dropdownMatchSelectWidth={false}
        className="selection"
        disabled={state.disbaled}
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
