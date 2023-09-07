import React, { useEffect, useState, useRef } from 'react';
import { Steps } from 'antd';
import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import './index.less';

interface props {
  path: any;
}
const { Step } = Steps;
export const StepComponent: React.FC<props> = ({ path }) => {
  return (
    <div className="container">
      <Steps current={0} labelPlacement="vertical">
        {path?.map((item, index) => {
          return (
            <Step
              title={item}
              style={{ marginLeft: -8 }}
              icon={
                <div
                  style={{
                    background: index === 0 ? '#2463EC' : 'orange',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    position: 'relative',
                    top: 9,
                    left: 12,
                  }}
                ></div>
              }
            />
          );
        })}
      </Steps>
    </div>
  );
};
