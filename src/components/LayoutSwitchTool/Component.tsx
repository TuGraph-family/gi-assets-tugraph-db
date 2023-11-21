import React from 'react';
import type { GILayoutConfig, IGIAC } from '@antv/gi-sdk';
import { useImmer } from 'use-immer';
import { useContext } from '@antv/gi-sdk';
import { Popover } from 'antd';
import GIAComponent from '@antv/gi-sdk/lib/components/GIAC';
import './index.less';

export interface LayoutSwitchProps {
  GIAC: IGIAC;
}
let timer: NodeJS.Timer;
const LayoutSwitchTool: React.FC<LayoutSwitchProps> = props => {
  const { GIAC } = props;
  const [state, setState] = useImmer<{
    dataList: any[];
  }>({
    dataList: [
      {
        id: 'force2',
        src: 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*KgwCS5Fjk4MAAAAAAAAAAAAADgOBAQ/original',
        name: '力导向布局',
      },
      {
        id: 'concentric',
        src: 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*9gpaQ5eqdOQAAAAAAAAAAAAADgOBAQ/original',
        name: '同心圆布局',
      },
      {
        id: 'circular',
        src: 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*yJxxRpfky0cAAAAAAAAAAAAADgOBAQ/original',
        name: '圆形布局',
      },
      {
        id: 'radial',
        src: 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*CI8CR7hqvfUAAAAAAAAAAAAADgOBAQ/original',
        name: '辐射布局',
      },
      {
        id: 'dagre',
        src: 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*HJ4PTLLqPuIAAAAAAAAAAAAADgOBAQ/original',
        name: 'Dagre布局',
      },
      // {
      //   id: '5',
      //   src: 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*LTrgQ6SDHzIAAAAAAAAAAAAADgOBAQ/original',
      //   name: '分类Dagre布局',
      // },
      {
        id: 'grid',
        src: 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*floUSocpYIAAAAAAAAAAAAAADgOBAQ/original',
        name: '网格布局',
      },
    ],
  });
  const { config, updateContext, graph } = useContext();

  const PopoverItem = ({ id, src, name }) => {
    const handleClick = (layoutConfig: GILayoutConfig) => {
      let layoutProps = { ...layoutConfig.props };
      if (config.layout.id === layoutConfig.id) {
        layoutProps = {
          ...layoutProps,
          ...config.layout.props,
        };
      }
      
      // 将当前面板 key 存储到localStorage中
      localStorage.setItem('ActiveAssetID', 'LayoutContent')

      updateContext(draft => {
        draft.layout = layoutProps;
        draft.config.layout = {
          id: layoutConfig.id,
          props: layoutProps,
        };
        draft.layoutCache = false;
      });
      // @ts-ignore
      clearTimeout(timer);
      timer = setTimeout(() => {
        graph.fitCenter(true);
      }, 60);
    };
    return (
      <div
        className="popoverItem"
        onClick={() => {
          handleClick({
            id,
            props: {
              type: id,
            },
          });
        }}
      >
        <img src={src} className="pic" />
        <div className="text">{name}</div>
      </div>
    );
  };
  return (
    // <div className="popoverContainer">
    <Popover
      title={null}
      content={
        <div className="popoverContent">
          {state.dataList.map(item => {
            return <PopoverItem key={item?.id} src={item?.src} name={item?.name} id={item?.id} />;
          })}
        </div>
      }
      placement="bottom"
    >
      <GIAComponent GIAC={GIAC} className='layout-switch-btn'/>
    </Popover>
  );
};

export default LayoutSwitchTool;
