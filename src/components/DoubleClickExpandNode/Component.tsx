import { useContext, utils } from "@antv/gi-sdk";
import { message } from "antd";
import React, { useEffect, useRef } from "react";
import { getQueryString } from '../utils'
import { getTransformByTemplate } from '../StyleSetting/utils'

const DoubleClickExpandNode = () => {

  const graphName = getQueryString('graphName')

  const currentRef = useRef({
    expandIds: [],
    expandStartId: '',
  });

  const { updateContext, services, schemaData, graph } = useContext();
  const service: any = utils.getService(services, 'TuGraph-DB/neighborsQueryService');

  const customStyleConfig = localStorage.getItem('CUSTOM_STYLE_CONFIG')
    ? JSON.parse(localStorage.getItem('CUSTOM_STYLE_CONFIG') as string)
    : {};

  const expandNodes = async (ids, expandStartId, sep, propNodes: any = undefined) => {
    let nodes = propNodes;

    if (!propNodes) {
      nodes = ids.map(id => graph.findById(id)?.getModel()).filter(Boolean);
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
      formatData.nodes.forEach(d => {
        d.data = d.properties;
      });

      formatData.edges.forEach(d => {
        d.data = d.properties;
      });

      const originData = graph.save()
      const newData = utils.handleExpand(originData, formatData);
      const expandIds = result.nodes?.map(n => n.id) || [];
      currentRef.current.expandIds = expandIds;
      currentRef.current.expandStartId = expandStartId;

      const transform = getTransformByTemplate(customStyleConfig, schemaData);

      updateContext(draft => {
        const res = transform(newData);
        // @ts-ignore
        draft.data = res;
        // @ts-ignore
        draft.source = res;
        draft.isLoading = false;
        if (draft.layout.type === 'preset') {
          //兼容从save模式
          const { props: layoutProps } = draft.config.layout || { props: { type: 'graphin-force' } };
          draft.layout = layoutProps;
        }
      });
    } catch (error) {
    }
  };

  const expandNodeByDoubleClick = () => {
    graph.on('node:dblclick', async (evt) => {
      const { item } = evt
      const model = item?.getModel()
      if (model) {
        const { id } = model
        await expandNodes([id], id, 1, [model])
      }
    })
  }

  useEffect(() => {
    expandNodeByDoubleClick()
  }, [])


  return null;
};

export default DoubleClickExpandNode;
