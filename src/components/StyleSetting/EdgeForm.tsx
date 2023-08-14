import ColorInput from "./ColorInput";
import { CaretRightOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Collapse,
  Form,
  FormInstance,
  FormProps,
  Input,
  Radio,
  Select,
} from "antd";
import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import { DefaultColor, getOperatorList } from "./Constant";

interface EdgeFormProps extends FormProps {
  form: FormInstance<any>;
  onEdgeTypeChange?: (edgeType?: string) => void;
  schemaData: {
    nodes: any[],
    edges: any[];
  }
}

const { Option } = Select;
const { Panel } = Collapse;

export const EdgeForm: React.FC<EdgeFormProps> = ({
  form,
  onValuesChange,
  initialValues,
  onEdgeTypeChange,
  schemaData,
  ...othersProps
}) => {
  const [state, setState] = useImmer<{
    color: {
      basic: string;
      advanced: string;
    };

    currentSchema: any;
    property: any[];
    labelText: string;
  }>({
    color: {
      basic: initialValues?.color,
      advanced: initialValues?.advancedColor
    },

    currentSchema: {},
    property: [],
    labelText: 'id'
  });
  const { color, currentSchema, property } = state;

  const handleChangeBasicColor = (e) => {
    // 设置选择的默认颜色
    setState((draft) => {
      draft.color = {
        ...color,
        basic: e.target.value
      };
    });
  };

  const handleColorChange = (current) => {
    setState((draft) => {
      draft.color = {
        ...color,
        basic: current
      };
    });
    form.setFieldsValue({
      color: current
    });
  };

  const handleChangeAdvancedColor = (e) => {
    // 设置选择的默认颜色

    setState((draft) => {
      draft.color = {
        ...color,
        advanced: e.target.value
      };
    });
  };

  const handleAdvancedColorChange = (current) => {
    setState((draft) => {
      draft.color = {
        ...color,
        advanced: current
      };
    });
  };

  const handleFormValueChange = (changedValues, allValues) => {
    if (onValuesChange) {
      onValuesChange(changedValues, allValues);
    }

    const { property } = changedValues;
    const { edgeType } = allValues;

    // 修改 edgeType 以后，更新 Schema 的属性
    if (edgeType) {
      const currentEdgeSchemas = schemaData.edges.filter((edge: any) => edge.labelName === edgeType);
      if (currentEdgeSchemas.length > 0) {
        setState((draft) => {
          draft.currentSchema = currentEdgeSchemas[0];
        });
      }
    } else {
      setState((draft) => {
        draft.currentSchema = {};
      });
    }

    if ("edgeType" in changedValues && initialValues) {
      const curEdgeStyles = initialValues[changedValues.edgeType || "allEdges"] || {};
      if (curEdgeStyles) {
        setState((draft) => {
          draft.color.basic = curEdgeStyles.color;
          draft.color.advanced = curEdgeStyles.advancedColor;
          draft.property = curEdgeStyles.property;
        });
      }
    }
    if ("edgeType" in changedValues) {
      onEdgeTypeChange?.(changedValues.edgeType);
    }

    if ("property" in changedValues) {
      setState((draft) => {
        draft.property = property;
      });
    }
  };

  const propertyOptions = currentSchema.properties?.map((d) => {
    return (
      <Option value={d.name} key={d.name}>
        {d.name}
      </Option>
    );
  });

  useEffect(() => {
    onValuesChange?.({ nodeType: null }, initialValues);
  }, []);

  const handleChangeLableText = (evt) => {
    setState(draft => {
      draft.labelText = evt.target.value
    })
  }

  return (
    <Form
      {...othersProps}
      form={form}
      name='nodeConfigurationForm'
      layout='vertical'
      onValuesChange={handleFormValueChange}
    >
      <Form.Item name='edgeType' label='应用边类型'>
        <Select placeholder='请选择边类型' allowClear showSearch>
          {schemaData.edges?.map((edge: any) => {
            return (
              <Option value={edge.labelName} key={edge.labelName}>
                {edge.labelName}
              </Option>
            );
          })}
        </Select>
      </Form.Item>

      <div className='color'>
        <Form.Item name='color' label='颜色'>
          <Radio.Group onChange={handleChangeBasicColor}>
            {DefaultColor.map((color) => (
              <span
                key={color}
                className='colorItem'
                style={{
                  border: `1px solid ${color}`
                }}
              >
                <Radio className='custom-ant-radio-wrapper'
                  key={color} 
                  value={color} 
                  style={{ background: color }} />
              </span>
            ))}
            <span
              className='colorItem'
              style={{
                border: `1px dashed ${color.basic}`
              }}
            >
              <Radio
                className='custom-ant-radio-wrapper'
                key={`${color.basic || "custom_color"}`}
                value={`${color.basic || "custom_color"}`}
                style={{ background: color.basic }}
              ></Radio>
            </span>
          </Radio.Group>
        </Form.Item>
        <Form.Item name='customColor' label=' '>
          <ColorInput onChange={handleColorChange} />
        </Form.Item>
      </div>
      
      <Form.Item label='文本' name='labelText'>
        <Radio.Group onChange={handleChangeLableText} value={state.labelText}>
          <Radio value='id'>显示ID</Radio>
          <Radio value='property'>显示属性</Radio>
        </Radio.Group>
      </Form.Item>

      {
        state.labelText === 'property' &&
        <Form.Item name='displyLabel' label='文本对应属性' initialValue='ID'>
          <Select
            placeholder='请选择属性'
            showSearch
            allowClear
            mode='multiple'
            disabled={!currentSchema.properties}
          >
            {propertyOptions}
          </Select>
        </Form.Item>
      }

      <Collapse
        bordered={false}
        defaultActiveKey={["1"]}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        className='site-collapse-custom-collapse'
      >
        <Panel header='高级配置' key='4' className='site-collapse-custom-panel' forceRender>
          <div style={{ marginBottom: 16 }}>属性</div>
          <Form.List name='property'>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <span style={{ display: "inline-block", marginBottom: 8 }} key={key}>
                    <Form.Item {...restField} name={[name, "name"]} noStyle>
                      <Select
                        placeholder='请选择'
                        showSearch
                        allowClear
                        style={{ width: 100, marginRight: 8 }}
                        disabled={!currentSchema.properties}
                      >
                        {propertyOptions}
                      </Select>
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "operator"]} noStyle>
                      <Select
                        placeholder='请选择'
                        showSearch
                        allowClear
                        style={{ width: 90, marginRight: 8 }}
                      >
                        {getOperatorList(
                          property && property[key]?.name
                            ? currentSchema.properties[property[key].name]?.schemaType
                            : undefined
                        ).map((op) => {
                          return (
                            <Option value={op.key} key={op.key}>
                              {op.value}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "value"]} noStyle>
                      <Input style={{ width: 90, marginRight: 8 }} />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </span>
                ))}
                <Form.Item>
                  <Button
                    type='dashed'
                    disabled={!currentSchema.properties}
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    添加属性过滤条件
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        
          <div className='color'>
            <Form.Item name='advancedColor' label='属性颜色'>
              <Radio.Group onChange={handleChangeAdvancedColor}>
                {DefaultColor.map((color) => (
                  <span
                    key={color}
                    className='colorItem'
                    style={{
                      border: `1px solid ${color}`
                    }}
                  >
                    <Radio key={color} value={color} style={{ background: color }} />
                  </span>
                ))}
                <span
                  className='colorItem'
                  style={{
                    border: `1px dashed ${color.advanced}`
                  }}
                >
                  <Radio
                    key={`${color.advanced || "advanced_custom_color"}`}
                    value={`${color.advanced || "advanced_custom_color"}`}
                    style={{ background: color.advanced }}
                  ></Radio>
                </span>
              </Radio.Group>
            </Form.Item>
            <Form.Item name='advancedCustomColor' label=' '>
              <ColorInput onChange={handleAdvancedColorChange} />
            </Form.Item>
          </div>
        </Panel>
      </Collapse>
    </Form>
  );
};
