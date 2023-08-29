import ColorInput from './ColorInputRadio';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Collapse, Form, FormInstance, FormProps, Input, Radio, Select } from 'antd';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { DefaultColor, getOperatorList } from './Constant';
import IntegerStep from './IntegerStep';

interface EdgeFormProps extends FormProps {
  form: FormInstance<any>;
  onEdgeTypeChange?: (edgeType?: string) => void;
  schemaData: {
    nodes: any[];
    edges: any[];
  };
}

const { Option } = Select;
const { Panel } = Collapse;

const marks = {
  1: '最细',
  2: '细',
  5: '中等',
  10: '粗',
};

export const EdgeForm: React.FC<EdgeFormProps> = ({
  form,
  onValuesChange,
  initialValues,
  onEdgeTypeChange,
  schemaData,
  ...othersProps
}) => {
  console.log('initialValues', initialValues)
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
      advanced: initialValues?.advancedColor,
    },

    currentSchema: {},
    property: [],
    labelText: '',
  });
  const { color, currentSchema, property } = state;

  const handleChangeBasicColor = e => {
    // 设置选择的默认颜色
    setState(draft => {
      draft.color = {
        ...color,
        basic: e.target.value,
      };
    });
  };

  const handleColorChange = e => {
    setState(draft => {
      draft.color = {
        ...color,
        basic: e.target.value,
      };
    });
    form.setFieldsValue({
      color: e.target.value,
    });
  };

  const handleChangeAdvancedColor = e => {
    // 设置选择的默认颜色

    setState(draft => {
      draft.color = {
        ...color,
        advanced: e.target.value,
      };
    });
  };

  const handleAdvancedColorChange = current => {
    setState(draft => {
      draft.color = {
        ...color,
        advanced: current,
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
        setState(draft => {
          draft.currentSchema = currentEdgeSchemas[0];
        });
      }
    } else {
      setState(draft => {
        draft.currentSchema = {};
      });
    }

    if ('edgeType' in changedValues && initialValues) {
      const curEdgeStyles = initialValues[changedValues.edgeType || 'allEdges'] || {};
      if (curEdgeStyles) {
        setState(draft => {
          draft.color.basic = curEdgeStyles.color;
          draft.color.advanced = curEdgeStyles.advancedColor;
          draft.property = curEdgeStyles.property;
          draft.labelText = curEdgeStyles.labelText;
        });
      }
    }
    if ('edgeType' in changedValues) {
      onEdgeTypeChange?.(changedValues.edgeType);
    }

    if ('property' in changedValues) {
      setState(draft => {
        draft.property = property;
      });
    }
  };

  const propertyOptions = currentSchema.properties?.map(d => {
    return (
      <Option value={d.name} key={d.name}>
        {d.name}
      </Option>
    );
  });

  useEffect(() => {
    onValuesChange?.({ nodeType: null }, initialValues);
  }, []);

  const handleChangeLableText = evt => {
    const value = evt.target.value
    if (!value) {
      form.setFieldsValue({
        displayLabel: undefined
      })
    } else if (value === 'id') {
      form.setFieldsValue({
        displayLabel: 'id'
      })
    }
    setState(draft => {
      draft.labelText = evt.target.value;
    });
  };

  return (
    <Form
      {...othersProps}
      form={form}
      name="nodeConfigurationForm"
      layout="vertical"
      onValuesChange={handleFormValueChange}
    >
      <Form.Item name="edgeType" label="应用边类型">
        <Select placeholder="请选择边类型" allowClear showSearch>
          {schemaData.edges?.map((edge: any) => {
            return (
              <Option value={edge.labelName} key={edge.labelName}>
                {edge.labelName}
              </Option>
            );
          })}
        </Select>
      </Form.Item>

      <div className="color">
        <Form.Item name="color" label="颜色">
          <Radio.Group onChange={handleChangeBasicColor}>
            {DefaultColor.map(color => (
              <Radio
                className="custom-ant-radio-wrapper"
                key={color}
                value={color}
                style={{
                  background: color,
                }}
              />
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item name="customColor" label=" ">
          <ColorInput onChange={handleColorChange} />
        </Form.Item>
      </div>

      <Form.Item name="lineWidth" label="边宽" initialValue={1}>
        <IntegerStep  marks={marks} min={1} max={10} />
      </Form.Item>

      <Form.Item label="文本" name="labelText">
        <Radio.Group onChange={handleChangeLableText} value={state.labelText}>
          <Radio value="">不显示</Radio>
          <Radio value="id">显示ID</Radio>
          <Radio value="property">显示属性</Radio>
        </Radio.Group>
      </Form.Item>

      {state.labelText === 'property' && (
        <Form.Item name="displayLabel" label="文本对应属性">
          <Select placeholder={currentSchema.properties ? "请选择属性" : '请先选择边类型'} showSearch allowClear mode="multiple" disabled={!currentSchema.properties}>
            {propertyOptions}
          </Select>
        </Form.Item>
      )}

      <Collapse
        bordered={false}
        ghost
        // expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        className="site-collapse-custom-collapse"
      >
        <Panel header="高级配置" key="1" className="site-collapse-custom-panel" forceRender>
          <div style={{ marginBottom: 16 }}>属性</div>
          <Form.List name="property">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <span style={{ display: 'inline-block', marginBottom: 8 }} key={key}>
                    <Form.Item {...restField} name={[name, 'name']} noStyle>
                      <Select
                        placeholder="请选择"
                        showSearch
                        allowClear
                        style={{ width: '33%', marginRight: 8 }}
                        disabled={!currentSchema.properties}
                      >
                        {propertyOptions}
                      </Select>
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'operator']} noStyle>
                      <Select placeholder="请选择" showSearch allowClear style={{ width: '33%', marginRight: 8 }}>
                        {getOperatorList(
                          property && property[key]?.name
                            ? currentSchema.properties.find(d => d.name === property[key]?.name)?.type
                            : undefined,
                        ).map(op => {
                          return (
                            <Option value={op.key} key={op.key}>
                              {op.value}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'value']} noStyle>
                      <Input style={{ width: '19%', marginRight: 8 }} />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </span>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
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

          <div className="color">
            <Form.Item name="advancedColor" label="属性颜色">
              <Radio.Group onChange={handleChangeAdvancedColor}>
                {DefaultColor.map(color => (
                  <Radio
                    className="custom-ant-radio-wrapper"
                    key={color}
                    value={color}
                    style={{ background: color }}
                  />
                ))}
              </Radio.Group>
            </Form.Item>
            <Form.Item name="advancedCustomColor" label=" ">
              <ColorInput onChange={handleAdvancedColorChange} />
            </Form.Item>
          </div>
        </Panel>
      </Collapse>
    </Form>
  );
};
