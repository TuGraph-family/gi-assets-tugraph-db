import { useContext } from "@antv/gi-sdk";
import { Button, Form } from "antd";
import React from "react";
import { useImmer } from "use-immer";
import { getTransformByTemplate } from "./utils";
import { EdgeForm } from "./EdgeForm";
import "./index.less";

const EdgeConfigurationPanel = (props) => {
  const { onClose, schemaData } = props;
  const {
    data: graphData,
    updateContext,
    graph
  } = useContext();

  const customStyleConfig = localStorage.getItem('CUSTOM_STYLE_CONFIG') ? JSON.parse(localStorage.getItem('CUSTOM_STYLE_CONFIG') as string) : {}

  const [form] = Form.useForm();
  const [state, setState] = useImmer<{
    elementStyles: Record<string, any>;
  }>({
    elementStyles: customStyleConfig
  });
  const { elementStyles } = state;

  const onElementValuesChange = (changedValues: any, allValues: any = {}) => {
    const { edgeType, labelText, isShowText } = allValues;
    const isEdgeTypeChange = "edgeType" in changedValues;

    if (!isEdgeTypeChange) {
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
        draft.elementStyles[edgeType || "allEdges"] = allValues;
      });
    }

    if (isEdgeTypeChange) {
      form.resetFields();
      form.setFieldsValue({
        ...elementStyles[changedValues.edgeType || "allEdges"],
        elementType: "edge",
        edgeType: changedValues.edgeType
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
  const handleSettingEdgeConfig = async () => {
    // 第二个参数为 Schema
    const transform = getTransformByTemplate(elementStyles, schemaData);

    localStorage.setItem('CUSTOM_STYLE_CONFIG', JSON.stringify(elementStyles))

    updateContext((draft) => {
      // @ts-ignore
      if (transform) {
        draft.transform = transform;
      }
      const newData = transform(graphData);
      // @ts-ignore
      draft.data = newData;
      // @ts-ignore
      draft.source = newData;
      draft.isLoading = false;
    });
    graph.render();
  };

  return (
    <div className="style-setting-element-container">
      <div className='edgeConfigurationContainer'>
        <EdgeForm form={form} initialValues={elementStyles} onValuesChange={onElementValuesChange} schemaData={schemaData} />
      </div>
      <div className='btn-group'>
        <Button style={{ marginRight: 8 }} onClick={onClose}>
          取消
        </Button>
        <Button type='primary' onClick={handleSettingEdgeConfig}>
          确认
        </Button>
      </div>
    </div>
  );
};

export default EdgeConfigurationPanel;
