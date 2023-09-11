import ColorInput from './ColorInputRadio';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Collapse, Form, FormInstance, FormProps, Input, Radio, Select, Tooltip, Switch } from 'antd';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { DefaultColor, getOperatorList } from './Constant';
import IntegerStep from './IntegerStep';
import { typeImg } from '../StatisticsFilter/constants';

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
  const [state, setState] = useImmer<{
    color: {
      basic: string;
      advanced: string;
    };

    currentSchema: any;
    property: any[];
  }>({
    color: {
      basic: initialValues?.color,
      advanced: initialValues?.advancedColor,
    },

    currentSchema: {},
    property: [],
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
    onValuesChange?.({ edgeType: null }, initialValues);
  }, []);

  const handleChangeLableText = () => {
    form.setFieldValue('displayLabel', undefined)
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
                <img src={typeImg['amount']} alt="" className="img" style={{ marginRight: 4 }} />
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

      <Form.Item label='显示文本' name="isShowText">
        <Switch checked={form.getFieldValue('isShowText')} />
      </Form.Item>

      {
        form.getFieldValue('isShowText') &&
        <Form.Item label="文本" name="labelText" initialValue={'id'}>
          <Radio.Group onChange={handleChangeLableText} value={form.getFieldValue('labelText')}>
            <Radio value="id">显示ID</Radio>
            <Radio value="label">显示Label</Radio>
            <Radio value="property">显示属性</Radio>
          </Radio.Group>
        </Form.Item>
      }

      {form.getFieldValue('isShowText') && form.getFieldValue('labelText') === 'property' && (
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
                  <div className='property-list'>
                    <Input.Group compact>
                      <Form.Item {...restField} name={[name, 'name']} noStyle>
                        <Select
                          placeholder="请选择"
                          showSearch
                          allowClear
                          style={{ width: '40%' }}
                          disabled={!currentSchema.properties}
                        >
                          {propertyOptions}
                        </Select>
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'operator']} noStyle>
                        <Select placeholder="请选择" showSearch allowClear style={{ width: '30%' }}>
                          {getOperatorList(
                            property && property[key]?.name
                              ? currentSchema.properties.find(d => d.name === property[key]?.name)?.type
                              : undefined,
                          ).map(op => {
                            return (
                              <Option value={op.key} key={op.key}>
                                {
                                    op.text
                                    ?
                                    <Tooltip title={op.text}>{op.value}</Tooltip>
                                    :
                                    op.value
                                  }
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'value']} noStyle>
                        <Input style={{ width: '30%' }} />
                      </Form.Item>
                    </Input.Group>
                    <DeleteOutlined onClick={() => remove(name)}  />
                  </div>
                ))}
                <Form.Item style={{ width: '91%' }}>
                  <Button
                    type="dashed"
                    disabled={!currentSchema.properties}
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined color="#6A6B71" />}
                    style={{ color: '#6A6B71' }}
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
