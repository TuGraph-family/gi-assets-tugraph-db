import {
  CaretRightOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Collapse, Form, Input, Select, Tooltip } from 'antd';
import React, { useState } from 'react';
import { getOperatorList } from '../../StyleSetting/Constant';
import '../index.less';

const { Panel } = Collapse;
const { OptGroup, Option } = Select;

const typeImg = {
  person:
    'https://mdn.alipayobjects.com/huamei_xn3ctq/afts/img/A*QuLESbeUyZwAAAAAAAAAAAAADo6BAQ/original',
  shop: 'https://mdn.alipayobjects.com/huamei_xn3ctq/afts/img/A*pRx7QIlK8HgAAAAAAAAAAAAADo6BAQ/original',
  bank: 'https://mdn.alipayobjects.com/huamei_xn3ctq/afts/img/A*ZisPQY7wXpQAAAAAAAAAAAAADo6BAQ/original',
  amount:
    'https://mdn.alipayobjects.com/huamei_xn3ctq/afts/img/A*AUHjRZ036OIAAAAAAAAAAAAADo6BAQ/original',
};

interface props {
  id: number;
  handleDelete: any;
  form: any;
  schemaList?: any;
}

export const AttributesEditForm: React.FC<props> = ({
  id,
  handleDelete,
  form,
  schemaList,
}) => {
  const [state, setState] = useState<{
    currentSchema: any;
    currentProperty: any;
  }>({
    currentSchema: {},
    currentProperty: {},
  });
  const label = Form.useWatch(`label-${id}`, form);

  const handleLabelChange = (value: string) => {
    let schemaArr: any[] = [];
    // 过滤出 schemaType 的值，设置当前的 Schema
    if (value) {
      schemaArr = [...schemaList.nodes, ...schemaList.edges].filter(
        (node) => node.labelName === value,
      );
      if (schemaArr.length > 0) {
        setState({ ...state, currentSchema: schemaArr[0] });
      }
    }
  };
  const handlePropertyChange = (value) => {
    if (value) {
      // @ts-ignore
      const tmpProperty = state.currentSchema?.properties.find(
        (d) => d.name === value,
      );
      if (tmpProperty) {
        setState({ ...state, currentProperty: tmpProperty });
      }
    }
  };

  return (
    <>
      <Collapse
        defaultActiveKey={['1']}
        style={{
          marginBottom: 16,
          backgroundImage:
            'linear-gradient(178deg, rgba(245,248,255,0.38) 11%, rgba(244,247,255,0.55) 96%)',
        }}
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
      >
        <Panel
          header={
            <span>
              {label ? (
                <span>
                  <img
                    src={
                      state.currentSchema.labelType === 'node'
                        ? typeImg.person
                        : typeImg.amount
                    }
                    alt=""
                    className="img"
                  />
                  {label}
                </span>
              ) : (
                <span style={{ color: '#1A1B25' }}>未选择</span>
              )}
            </span>
          }
          key="1"
          extra={handleDelete(id)}
        >
          <Form.Item
            label="请选择点/边类型"
            name={`label-${id}`}
            rules={[{ required: true, message: '请选择点/边类型' }]}
          >
            <Select
              placeholder="请选择点/边类型"
              showSearch
              optionFilterProp="children"
              onChange={handleLabelChange}
            >
              <OptGroup label="点">
                {schemaList?.nodes?.map((item) => {
                  return (
                    <Option value={item.labelName} key={item.labelName}>
                      <img
                        src={typeImg['person']}
                        alt=""
                        className="img"
                        style={{ marginRight: 4 }}
                      />
                      {item.labelName}
                    </Option>
                  );
                })}
              </OptGroup>
              <OptGroup label="边">
                {schemaList?.edges?.map((item) => {
                  return (
                    <Option value={item.labelName} key={item.labelName}>
                      <img src={typeImg['amount']} alt="" className="img" />
                      {item.labelName}
                    </Option>
                  );
                })}
              </OptGroup>
            </Select>
          </Form.Item>
          <p className="conditionIcon">属性条件</p>
          <Form.List name={`rules-${id}`} initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="formList">
                    <Input.Group compact>
                      <Form.Item noStyle name={[name, 'name']}>
                        <Select
                          placeholder="请选择"
                          showSearch
                          // @ts-ignore
                          filterOption={(input, option) =>
                            (option?.label ?? '').includes(input)
                          }
                          style={{ width: '40%' }}
                          onChange={handlePropertyChange}
                        >
                          {state.currentSchema?.properties?.map((d) => {
                            return (
                              <Option value={d.name} key={d.name}>
                                {d.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        noStyle
                        name={[name, 'operator']}
                        rules={[{ required: true, message: '请选择查询逻辑' }]}
                      >
                        <Select
                          placeholder="请选择"
                          style={{ width: '30%' }}
                          allowClear
                        >
                          {getOperatorList(state.currentProperty?.type).map(
                            (logic) => {
                              return (
                                <Option value={logic.key} key={logic.key}>
                                  {logic.text ? (
                                    <Tooltip title={logic.text}>
                                      {logic.value}
                                    </Tooltip>
                                  ) : (
                                    logic.value
                                  )}
                                </Option>
                              );
                            },
                          )}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        noStyle
                        name={[name, 'value']}
                        rules={[{ required: true, message: '请输入属性值' }]}
                      >
                        <Input placeholder="请输入" style={{ width: '30%' }} />
                      </Form.Item>
                    </Input.Group>

                    <DeleteOutlined onClick={() => remove(name)} />
                  </div>
                ))}
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined color="#6A6B71" />}
                    style={{ color: '#6A6B71' }}
                  >
                    添加属性条件
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Panel>
      </Collapse>
    </>
  );
};
