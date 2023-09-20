import React from 'react';
import { Space } from 'antd';
import './index.less';
import CustomIcon from '../StyleSetting/CustomIcon';

interface props {
  path: any;
}
export const StepComponent: React.FC<props> = ({ path }) => {
  return (
    <div className="container" tabIndex={0}>
      <Space>
        {path?.map((item, index) => {
          if (index === 0) {
            return (
              <div className="custom-step-item">
                <CustomIcon type="icon-dot" style={{ fontSize: '12px', color: '#2463EC' }} />
                <div>{item}</div>
              </div>
            );
          }
          return (
            <div className="custom-step-item">
              <div className="custom-step-item-line"></div>
              <CustomIcon type="icon-dot" style={{ fontSize: '12px', color: 'orange', zIndex: 2 }} />
              <div>{item}</div>
            </div>
          );
        })}
      </Space>
    </div>
  );
};
