import React from 'react';
import { useContext, utils } from '@antv/gi-sdk';
import { Skeleton, Drawer } from 'antd';
import PropertiesDetailPanel from './PropertiesPanel'
import PropertiesContainer from './PropertyContainer'
import './index.less';

export interface props {
  data?: any;
  serviceId: string;
}

const TuGraphPropertiesPanel: React.FC<props> = props => {

  const { graph } = useContext();

  const [state, setState] = React.useState<{
    detail: any;
    visible: boolean;
    isLoading: boolean;
  }>({
    visible: false,
    detail: null,
    isLoading: false,
  });

  const handleClose = () => {
    setState(preState => {
      if (preState.visible) {
        return {
          visible: false,
          isLoading: false,
          detail: null,
        };
      }
      return preState;
    });
  };

  const handleNodeClick = async e => {
    setState(preState => {
      return {
        ...preState,
        visible: true,
        isLoading: true,
      };
    });

    const model = e.item.getModel();

    // 有数据服务就从服务中取数，没有服务就从Model中取数
    const detail = model //await service({ ...model, type: 'node' });


    setState(preState => {
      return {
        ...preState,
        detail,
        isLoading: false,
      };
    });
  };
  const handleEdgeClick = async e => {
    setState(preState => {
      return {
        ...preState,
        visible: true,
        isLoading: true,
      };
    });

    const model = e.item.getModel();
    // 有数据服务就从服务中取数，没有服务就从Model中取数
    const detail = model // await service({ ...model, type: 'edge' });

    setState(preState => {
      return {
        ...preState,
        detail,
        isLoading: false,
      };
    });
  };

  React.useEffect(() => {
    graph.on('node:click', handleNodeClick);
    graph.on('edge:click', handleEdgeClick);
    return () => {
      graph.off('node:click', handleNodeClick);
      graph.off('edge:click', handleEdgeClick);
    };
  }, []);

  const { isLoading, detail, visible } = state;

  if (!visible) {
    return null
  }

  const content =
    !isLoading && detail ? (
      <PropertiesDetailPanel data={detail?.data} />
    ) : (
      <Skeleton active />
    );

  return (
    <PropertiesContainer
      animate={true}
      title='属性面板'
      visible={visible}
      containerPlacement='RT'
      onClose={handleClose}
      offset={[0]}
    >
      {content}
    </PropertiesContainer>
  );
};

export default TuGraphPropertiesPanel;
