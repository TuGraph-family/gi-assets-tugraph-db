import { QuestionCircleOutlined } from '@ant-design/icons';
import { Select, Space, Tooltip } from 'antd';
import { selectAlgorithm } from '../content';
import React from 'react';

const SelectAlgorithm = (props) => {
  return (
    <Select {...props}>
      {selectAlgorithm.map((item) => (
        <Select.Option key={item.value} title={item?.label}>
          <Space>
            <div className="txt">
              {item?.label}({item?.value})
            </div>
            <div className="tip">
              &nbsp; | &nbsp;
              <Tooltip title={item?.tooltip}>
                <span className="lTxt">
                  算法说明 &nbsp;
                  <QuestionCircleOutlined className="tIc" />
                </span>
              </Tooltip>
            </div>
          </Space>
        </Select.Option>
      ))}
    </Select>
  );
};

export default SelectAlgorithm;
