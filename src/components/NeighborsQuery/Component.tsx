import { getQueryString } from '@/utils';
import { useContext, utils } from '@antv/gi-sdk';
import { Menu, message } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';
import { getTransformByTemplate } from '../StyleSetting/utils';
import AdvanceNeighborsQueryConfig from './AdvanceNeighborsConfig';

const { SubMenu } = Menu;
type ControlledValues = {
  startIds: string[];
  expandStartId: string;
  sep: number;
};
export interface QueryNeighborsProps {
  serviceId: string;
  contextmenu: any;
  controlledValues?: ControlledValues;
  languageServiceId: string;
}

const getContextMenuParams = (graph: any, contextmenu) => {
  const selectedItems = graph.findAllByState('node', 'selected');

  const selectedNodes = new Map();
  selectedItems.forEach((item) => {
    const model = item.getModel();
    selectedNodes.set(model.id, model);
  });

  const value = contextmenu.item.getModel();
  graph.setItemState(value.id, 'selected', true);
  selectedNodes.set(value.id, value);

  const ids = [...selectedNodes.keys()];
  const nodes = [...selectedNodes.values()];
  const expandStartId = value.id;
  return {
    ids,
    nodes,
    expandStartId,
  };
};

/**
 * https://doc.linkurio.us/user-manual/latest/visualization-inspect/
 */
const AdvanceNeighborsQuery: React.FunctionComponent<QueryNeighborsProps> = (
  props,
) => {
  const { contextmenu, serviceId, languageServiceId, controlledValues } = props;
  const currentRef = useRef({
    expandIds: [],
    expandStartId: '',
  });

  const [state, setState] = useImmer<{
    visible: boolean;
    ids: string[];
  }>({
    visible: false,
    ids: [],
  });

  const { data, updateContext, updateHistory, graph, schemaData, services } =
    useContext();

  const service = utils.getService(services, serviceId);
  const languageService = utils.getService(services, languageServiceId);

  const graphName = getQueryString('graphName');

  const { item: targetNode } = contextmenu;
  if (!service || targetNode?.destroyed || targetNode?.getType?.() !== 'node') {
    return null;
  }

  const handleClick = async (sep) => {
    const { ids, nodes, expandStartId } = getContextMenuParams(
      graph,
      contextmenu,
    );
    if (sep === 'custom-query') {
      // 展示高级配置
      setState((draft) => {
        draft.visible = true;
        draft.ids = ids;
      });
      contextmenu.onClose();
      return;
    }

    updateContext((draft) => {
      draft.isLoading = true;
    });

    contextmenu.onClose();
    await expandNodes(ids, expandStartId, sep, nodes);
  };

  const expandNodes = async (
    ids,
    expandStartId,
    sep,
    propNodes: any = undefined,
  ) => {
    let nodes = propNodes;
    const historyProps = {
      startIds: ids,
      expandStartId,
      sep,
    };
    if (!propNodes) {
      nodes = ids.map((id) => graph.findById(id)?.getModel()).filter(Boolean);
      if (!nodes?.length)
        handleUpateHistory(
          historyProps,
          false,
          '当前画布中未找到指定的扩散起始节点',
        );
    }
    try {
      const result = await service({
        ids,
        graphName,
        sep,
        limit: 200,
      });

      if (!result.success) {
        // 执行查询失败
        message.error(`执行查询失败: ${result.errorMessage}`);
        return;
      }

      const { formatData } = result.data;

      // 处理 formData，添加 data 字段
      formatData.nodes.forEach((d) => {
        d.data = d.properties;
      });

      formatData.edges.forEach((d) => {
        d.data = d.properties;
      });

      const newData = utils.handleExpand(data, formatData);
      const expandIds = result.nodes?.map((n) => n.id) || [];
      currentRef.current.expandIds = expandIds;
      currentRef.current.expandStartId = expandStartId;

      const customStyleConfig = JSON.parse(
        (localStorage.getItem('CUSTOM_STYLE_CONFIG') as string) || '{}',
      );

      const transform = getTransformByTemplate(customStyleConfig, schemaData);

      updateContext((draft) => {
        const res = transform(newData);
        // @ts-ignore
        draft.data = res;
        // @ts-ignore
        draft.source = res;
        draft.isLoading = false;
        if (draft.layout.type === 'preset') {
          //兼容从save模式
          const { props: layoutProps } = draft.config.layout || {
            props: { type: 'graphin-force' },
          };
          draft.layout = layoutProps;
        }
      });
      handleUpateHistory(historyProps);
    } catch (error) {
      handleUpateHistory(historyProps, false, String(error));
    }
  };

  const advanceExpandNodes = async (cyper: string) => {
    const {
      ids,
      nodes: propNodes,
      expandStartId,
    } = getContextMenuParams(graph, contextmenu);

    let nodes = propNodes;
    const historyProps = {
      startIds: ids,
      expandStartId,
      sep: 1,
    };
    if (!propNodes) {
      nodes = ids.map((id) => graph.findById(id)?.getModel()).filter(Boolean);
      if (!nodes?.length)
        handleUpateHistory(
          historyProps,
          false,
          '当前画布中未找到指定的扩散起始节点',
        );
    }

    if (!languageService) {
      return;
    }

    try {
      const result = await languageService({
        script: cyper,
        graphName,
      });

      if (!result.success) {
        // 执行查询失败
        message.error(`执行查询失败: ${result.errorMessage}`);
        return;
      }

      const { formatData } = result.data;

      // 处理 formData，添加 data 字段
      formatData.nodes.forEach((d) => {
        d.data = d.properties;
      });

      formatData.edges.forEach((d) => {
        d.data = d.properties;
      });

      const newData = utils.handleExpand(data, formatData);
      const expandIds = result.nodes?.map((n) => n.id) || [];
      currentRef.current.expandIds = expandIds;
      currentRef.current.expandStartId = expandStartId;

      const customStyleConfig = JSON.parse(
        (localStorage.getItem('CUSTOM_STYLE_CONFIG') as string) || '{}',
      );
      const transform = getTransformByTemplate(customStyleConfig, schemaData);

      updateContext((draft) => {
        const res = transform(newData);
        // @ts-ignore
        draft.data = res;
        // @ts-ignore
        draft.source = res;
        draft.isLoading = false;
        draft;
        if (draft.layout.type === 'preset') {
          //兼容从save模式
          const { props: layoutProps } = draft.config.layout || {
            props: { type: 'graphin-force' },
          };
          draft.layout = layoutProps;
        }
      });
      handleUpateHistory(historyProps);
      // 关闭高级配置框
      handleCloseConfig();
    } catch (error) {
      handleUpateHistory(historyProps, false, String(error));
    }
  };

  /**
   * 更新到历史记录
   * @param success 是否成功
   * @param errorMsg 若失败，填写失败信息
   * @param value 查询语句
   */
  const handleUpateHistory = (
    params: ControlledValues,
    success: boolean = true,
    errorMsg?: string,
  ) => {
    updateHistory({
      componentId: 'NeighborsQuery',
      type: 'analyse',
      subType: '邻居查询',
      statement: `查询 ${params.startIds.join(', ')} 的邻居`,
      success,
      errorMsg,
      params,
    });
  };

  /**
   * 受控参数变化，自动进行分析
   * e.g. ChatGPT，历史记录模版等
   */
  useEffect(() => {
    if (controlledValues) {
      const { startIds, expandStartId, sep } = controlledValues;
      expandNodes(startIds, expandStartId, sep);
    }
  }, [controlledValues]);

  useEffect(() => {
    //@ts-ignore
    const handleCallback = () => {
      const { expandIds, expandStartId } = currentRef.current;
      if (expandIds.length === 0) {
        return;
      }
      expandIds.forEach((id) => {
        const item = graph.findById(id);
        if (item && !item.destroyed) {
          graph.setItemState(id, 'query_normal', true);
        }
      });
      const startItem = graph.findById(expandStartId);
      if (!startItem || startItem.destroyed) return;
      graph.setItemState(expandStartId, 'query_start', true);
      graph.focusItem(expandStartId);
    };
    //@ts-ignore
    graph.on('graphin:datachange', handleCallback);
    return () => {
      graph.off('graphin:datachange', handleCallback);
    };
  }, []);

  const menus = [
    {
      label: '一度查询',
      key: '1',
    },
    {
      label: '二度查询',
      key: '2',
    },
    {
      label: '三度查询',
      key: '3',
    },
    {
      label: '自定义查询',
      key: 'custom-query',
    },
  ];

  const menuItem = menus.map((_item) => {
    const { label, key } = _item;
    return (
      // @ts-ignore
      <Menu.Item key={key} eventKey={key} onClick={() => handleClick(key)}>
        {label}
      </Menu.Item>
    );
  });

  const handleCloseConfig = () => {
    setState((draft) => {
      draft.visible = false;
    });
  };

  return (
    <>
      <SubMenu
        key="expand"
        // @ts-ignore
        eventKey="expand"
        title="扩展查询"
      >
        {menuItem}
      </SubMenu>
      {state.visible && (
        <AdvanceNeighborsQueryConfig
          schemaData={schemaData}
          visible={state.visible}
          close={handleCloseConfig}
          expandNodeIds={state.ids}
          languageService={advanceExpandNodes}
        />
      )}
    </>
  );
};

export default AdvanceNeighborsQuery;
