import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Collapse, Form, FormInstance, FormProps, Input, Radio, Select, Tooltip, Switch, Checkbox } from 'antd';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import CustomIcon from './CustomIcon';
import ColorInput from './ColorInputRadio';
import CustomIconComponent from './CustomIconCompnent'
import { getOperatorList, ICONS, NodeDefaultColor } from './Constant';
import IntegerStep from './IntegerStep';
import { typeImg } from '../StatisticsFilter/constants';

interface NodeFormProps extends FormProps {
  form: FormInstance<any>;
  onNodeTypeChange?: (nodeType?: string) => void;
  schemaData: {
    nodes: any[];
    edges: any[];
  };
}

const { Option } = Select;
const { Panel } = Collapse;

const marks = {
  5: '最小',
  30: '小',
  60: '中等',
  100: '大',
};

export const NodeForm: React.FC<NodeFormProps> = ({
  form,
  onValuesChange,
  initialValues,
  onNodeTypeChange,
  schemaData,
  ...otherProps
}) => {
  const [state, setState] = useImmer<{
    color: {
      basic: string;
      advanced: string;
    };
    currentSchema: any;
    property: any[];
    tag: {
      checked: boolean;
      value: string;
    };
  }>({
    color: {
      basic: initialValues?.customColor || initialValues?.color,
      advanced: initialValues?.advancedCustomColor || initialValues?.advancedColor,
    },

    currentSchema: {},
    property: [],
    tag: {
      checked: false,
      value: ''
    }
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
    form.setFieldsValue({
      customColor: undefined,
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

  const handleIconChange = e => {
    const currentNodeType = form.getFieldValue('nodeType')
    form.setFieldsValue({
      icon: {
        iconText: e.target.value,
      }
    })
    if (onValuesChange && currentNodeType) {
      onValuesChange({
        icon: {
          iconText: e.target.value,
        }
      }, {
        // @ts-ignore
        ...initialValues[currentNodeType],
        icon: {
          iconText: e.target.value,
        }
      })
    }
  }

  const handleChangeAdvancedColor = e => {
    // 设置选择的默认颜色
    setState(draft => {
      draft.color = {
        ...color,
        advanced: e.target.value,
      };
    });
    form.setFieldsValue({
      advancedCustomColor: undefined,
    });
  };

  const handleAdvancedColorChange = current => {
    setState(draft => {
      draft.color = {
        ...color,
        advanced: current,
      };
    });
    form.setFieldsValue({
      advancedColor: current,
    });
  };

  const handleFormValueChange = (changedValues, allValues) => {
    // 如果点击的是更多icon直接返回
    const { icon } = changedValues
    if (icon && icon.iconText === 'gengduo') {
      return
    }

    if (onValuesChange) {
      onValuesChange(changedValues, allValues);
    }
    const { nodeType, property } = allValues;

    // 修改 nodeType 以后，更新 Schema 的属性
    if (nodeType) {
      const currentNodeSchemas = schemaData.nodes.filter((node: any) => node.labelName === nodeType);
      if (currentNodeSchemas.length > 0) {
        setState(draft => {
          draft.currentSchema = currentNodeSchemas[0];
        });
      }
    } else {
      // 清空了 nodeType，则重置属性
      setState(draft => {
        draft.currentSchema = {};
      });
    }

    if ('nodeType' in changedValues && initialValues) {
      const curNodeStyles = initialValues[changedValues.nodeType || 'allNodes'] || {};
      if (curNodeStyles) {
        setState(draft => {
          draft.color.basic = curNodeStyles.color;
          draft.color.advanced = curNodeStyles.advancedColor;
          draft.property = curNodeStyles.property;
        });
      }
    }
    if ('property' in changedValues) {
      setState(draft => {
        draft.property = property;
      });
    }
    if ('nodeType' in changedValues) {
      onNodeTypeChange?.(changedValues.nodeType);
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

  const handleChangeLableText = () => {
    // 切换到属性以后，将属性置空
    form.setFieldValue('displayLabel', undefined)
  };

  return (
    <Form
      {...otherProps}
      form={form}
      name="nodeConfigurationForm"
      layout="vertical"
      onValuesChange={handleFormValueChange}
    >
      <Form.Item name="nodeType" label="应用点类型">
        <Select placeholder="请选择节点类型" showSearch allowClear>
          {schemaData.nodes?.map((node: any) => {
            return (
              <Option value={node.labelName} key={node.labelName}>
                <img src={typeImg['person']} alt="" className="img" style={{ marginRight: 4 }} />
                {node.labelName}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item name="size" label="大小" initialValue={30}>
        <IntegerStep marks={marks} />
      </Form.Item>

      <div className="color">
        <Form.Item name="color" label="颜色">
          <Radio.Group onChange={handleChangeBasicColor}>
            {NodeDefaultColor.map(color => (
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

      <Form.Item name={['icon', 'iconText']} label="图标">
        <Radio.Group buttonStyle="solid">
          {ICONS.map((icon: any, index) => {
            if (index === ICONS.length - 1) {
              return <CustomIconComponent onChange={handleIconChange} icon={icon} />
            }
            return (
              <Radio.Button
                key={icon.key}
                value={icon.key}
                className="custom-ant-radio-wrapper"
                style={{
                  border: 'none',
                  lineHeight: '25px',
                  padding: '0 1px',
                  width: 25,
                  height: 25,
                }}
              >
                <CustomIcon
                  type={icon.value}
                  style={{
                    fontSize: 23,
                    cursor: 'pointer',
                  }}
                />
              </Radio.Button>
            )
          })}
        </Radio.Group>
      </Form.Item>

      <Form.Item label='显示文本' name="isShowText" style={{ height: 30, marginBottom: 16 }}>
        <Switch size='small' style={{ position: 'absolute', left: 70, top: -26 }} checked={form.getFieldValue('isShowText')} />
      </Form.Item>

      {
        form.getFieldValue('isShowText') &&
        <Form.Item label="文本显示类型" name="labelText" initialValue={'id'}>
          <Radio.Group onChange={handleChangeLableText} value={form.getFieldValue('labelText')}>
            <Radio value="id">显示ID</Radio>
            <Radio value="label">显示Label</Radio>
            <Radio value="property">显示属性</Radio>
          </Radio.Group>
        </Form.Item>
      }

      {form.getFieldValue('isShowText') && form.getFieldValue('labelText') === 'property' && (
        <Form.Item name="displayLabel" label="文本对应属性">
          <Select placeholder={currentSchema.properties ? "请选择属性" : '请先选择点类型'} showSearch allowClear mode="multiple" disabled={!currentSchema.properties}>
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
            {(fields, { add, remove }) => {
              return (
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

                      <DeleteOutlined  onClick={() => remove(name)} />
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
              );
            }}
          </Form.List>
          <div className="color">
            <Form.Item name="badgeValue" label="属性标签">
              <Checkbox.Group>
                <Checkbox 
                  value='shuxingbiaoqian' 
                  className="custom-ant-checkbox-wrapper"
                  style={{
                      border: 'none',
                      lineHeight: '25px',
                      width: 24,
                      height: 25,
                    }}
                  >
                  <CustomIcon
                      type='icon-shuxingbiaoqian'
                      style={{
                        fontSize: 23,
                        cursor: 'pointer',
                        position: 'absolute',
                        bottom: 4,
                        left: 0,
                      }}
                    />
                </Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </div>
        </Panel>
      </Collapse>
    </Form>
  );
};
