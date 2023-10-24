import { extra } from '@antv/gi-sdk';
import type { IGIAC } from '@antv/gi-sdk';
import React from 'react';

const { GIAComponent } = extra;
export interface IProps {
  GIAC: IGIAC;
}

const GraphDemo: React.FunctionComponent<IProps> = props => {
  const { GIAC } = props;
  
  const showModal = () => {
    // 清除 localstorage 中标识
    localStorage.removeItem('__guidance_key__')

    // 重新加载页面
    window.location.reload()
  };

  return (
    <>
      <GIAComponent GIAC={GIAC} onClick={showModal} />
    </>
  );
};

export default GraphDemo;
