import { useContext } from "@antv/gi-sdk";
import { Button, Form } from "antd";
import React from "react";
import { useImmer } from "use-immer";
import { getTransformByTemplate } from "./utils";
import "./index.less";
import { NodeForm } from "./NodeForm";

const NodeConfigurationPanel = (props) => {
  const { onClose, schemaData } = props;
  const {
    data: graphData,
    updateContext,
    graph,
  } = useContext();

  const customStyleConfig = localStorage.getItem('CUSTOM_STYLE_CONFIG') ? JSON.parse(localStorage.getItem('CUSTOM_STYLE_CONFIG') as string) : {}

  const [form] = Form.useForm();

  const [state, setState] = useImmer<{
    elementStyles: Record<string, any>;
  }>({
    elementStyles: customStyleConfig,
  });
  const { elementStyles } = state;

  const onElementValuesChange = (changedValues: any, allValues: any = {}) => {
    const { nodeType, labelText, isShowText } = allValues;
    const isNodeTypeChange = "nodeType" in changedValues;
  
    if (!isNodeTypeChange) {
      // 如果展示 Label，则修改 displayLabel
      if (isShowText) {
        if (labelText === 'label' || labelText === 'id') {
          allValues['displayLabel'] = labelText
        }
      } else {
        // 不显示
        allValues['displayLabel'] = ''
      }

      setState((draft) => {
        draft.elementStyles[nodeType || "allNodes"] = allValues;
      });
    }

    if (isNodeTypeChange) {
      form.resetFields();
      form.setFieldsValue({
        ...elementStyles[changedValues.nodeType || "allNodes"],
        elementType: "node",
        nodeType: changedValues.nodeType
      });
    }

    // 如果改变了 advancedColor 值，则清空 advancedCustomColor
    if (changedValues.advancedColor) {
      form.setFieldsValue({
        advancedCustomColor: undefined
      })
    }

    if (changedValues.color) {
      form.setFieldsValue({
        customColor: undefined
      })
    }
  };

  // 点击确认按钮，获取到所有的配置项
  const handleSettingNodeConfig = async () => {
    const transform = getTransformByTemplate(elementStyles, schemaData);

    localStorage.setItem('CUSTOM_STYLE_CONFIG', JSON.stringify(elementStyles))

    updateContext((draft) => {
      // @ts-ignore 保存分析的时候的模版参数
      // draft.customStyleConfig = elementStyles;
      if (transform) {
        draft.transform = transform;
      }
      const newData = transform(graphData);
      // @ts-ignore
      draft.data = newData;
      // @ts-ignore
      draft.source = newData;
    });
    graph.render();
  };

  return (
    <div className="style-setting-element-container">
      <div className='nodeConfigurationContainer'>
        <NodeForm 
          form={form} 
          initialValues={elementStyles} 
          onValuesChange={onElementValuesChange}
          schemaData={schemaData} />
      </div>
      <div className='btn-group'>
        <Button style={{ marginRight: 8 }} onClick={onClose}>
          取消
        </Button>
        <Button type='primary' onClick={handleSettingNodeConfig}>
          确认
        </Button>
      </div>
    </div>
  );
};

export default NodeConfigurationPanel;
