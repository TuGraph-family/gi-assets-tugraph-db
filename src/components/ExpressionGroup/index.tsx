import {
  DeleteOutlined,
  FieldBinaryOutlined,
  FieldNumberOutlined,
  FieldStringOutlined,
  PlusOutlined
} from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Checkbox,
  Col,
  Collapse,
  InputNumber,
  Row,
  Select,
  Switch
} from "antd";
import cloneDeep from "lodash/cloneDeep";
import React from "react";
import { getOperatorList } from "../StyleSetting/Constant";
import "./index.less";

export type Logic = "and" | "or";
// export type Operator = "contain" | "not-contain" | "eql" | "not-eql" | "gt" | "lt" | "gte" | "lte";
export type Operator = "CT" | "NC" | "EQ" | "NE" | "GT" | "LT" | "GE" | "LE";

// 切换 and/or
const SwitchNode: React.FunctionComponent<{
  checked: boolean;
  disabled: boolean;
  onChange: (v: boolean) => void;
}> = ({ checked, disabled, onChange }) => (
  <span
    onClick={(e) => {
      e.stopPropagation();
    }}
  >
    <Switch
      className='switchButton'
      checked={checked}
      disabled={disabled}
      checkedChildren='and'
      unCheckedChildren='or'
      onChange={onChange}
    />
  </span>
);

export interface Schema {
  logic: Logic;
  items: SchemaItem[];
}

export interface Expression {
  name: string;
  operator: Operator;
  value: string | number;
}

export interface SchemaItem {
  id: string;
  type: string;
  label: string;
  properties: {
    name: string;
    label: string; // 展示名，例如 name 展示为 '姓名'
    type: "number" | "string" | "boolean";
    enum: Set<string>; // 枚举值
  }[];
  // ui props
  count: number;
  disabled: boolean;
  visible: boolean;
  logic: Logic;
  expressions: Expression[];
  source: string;
  target: string;
}

const ExpressionGroup: React.FunctionComponent<{
  schema: Schema;
  onSchemaChanged: (schema: Schema) => void;
  showCount?: boolean; // 是否需要展示数量
  showToggleDisabled?: boolean; // 是否支持通过开关 disable
}> = ({ schema: propSchema, onSchemaChanged, showCount = true, showToggleDisabled = true }) => {
  const schema = cloneDeep(propSchema);
  const content = (
    <Collapse
      bordered={false}
      expandIconPosition='right'
      defaultActiveKey={(schema.items || []).map((item) => item.label || "")}
    >
      {schema.items.map(
        ({ label, properties, count, logic, disabled, visible, expressions }, i) => {
          // 默认使用 properties 中的第一个字段
          const defaultExpressionName = properties[0]?.name;
          const defaultExpressionOperator = "eql";

          if (!visible) {
            return null;
          }

          return (
            <Collapse.Panel
              header={
                <div className='header'>
                  {showToggleDisabled ? (
                    <Checkbox
                      checked={!disabled}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      onChange={(e) => {
                        schema.items[i].disabled = !e.target.checked;
                        onSchemaChanged({ ...schema });
                      }}
                    >
                      <span
                        className='typeLabel'
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <span className='typeName'>{label}</span>
                        <span>{showCount && `（${count}）`}</span>
                      </span>
                    </Checkbox>
                  ) : (
                    <span className='typeLabel'>
                      <span className='typeName'>{label}</span>
                    </span>
                  )}
                  <Button
                    type='link'
                    onClick={(e) => {
                      e.stopPropagation();
                      schema.items[i].expressions = [];
                      onSchemaChanged({ ...schema });
                    }}
                  >
                    重置
                  </Button>
                </div>
              }
              key={label}
              className='expressionGroup'
            >
              <div className='expressonList'>
                <div>属性过滤</div>
                {expressions.map((expression, j) => {
                  const expressionData = schema.items[i].properties.find(
                    ({ name }) => schema.items[i].expressions[j].name === name
                  );
                  // 字段类型 string | number | boolean
                  const expressionDataType = expressionData?.type || "string";
                  return (
                    <Row gutter={8} className='item' key={j}>
                      <Col span={2}>
                        {expressionDataType === "string" && <FieldStringOutlined />}
                        {expressionDataType === "number" && <FieldNumberOutlined />}
                        {expressionDataType === "boolean" && <FieldBinaryOutlined />}
                      </Col>
                      <Col span={7}>
                        <Select
                          disabled={disabled}
                          size='small'
                          style={{ width: "100%" }}
                          value={expression.name}
                          onChange={(v: string) => {
                            schema.items[i].expressions[j].name = v;
                            onSchemaChanged({ ...schema });
                          }}
                        >
                          {properties.map((p) => (
                            <Select.Option value={p.name} key={p.name}>
                              {p.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Col>
                      <Col span={6}>
                        <Select
                          disabled={disabled}
                          size='small'
                          style={{ width: "100%" }}
                          value={expression.operator}
                          onChange={(v: Operator) => {
                            schema.items[i].expressions[j].operator = v;
                            onSchemaChanged({ ...schema });
                          }}
                        >
                          {getOperatorList(expressionDataType).map((p) => (
                            <Select.Option value={p.key} key={p.key}>
                              {p.value}
                            </Select.Option>
                          ))}
                        </Select>
                      </Col>
                      <Col span={7}>
                        {expressionDataType === "string" ? (
                          <AutoComplete
                            disabled={disabled}
                            size='small'
                            style={{ width: "100%" }}
                            dataSource={Array.from(expressionData?.enum || []) || []}
                            filterOption={(input, option) => {
                              const value = (option?.value as string) || "";
                              return value.indexOf(input) > -1;
                            }}
                            value={expression.value as string}
                            onChange={(v) => {
                              schema.items[i].expressions[j].value = v as string;
                              onSchemaChanged({ ...schema });
                            }}
                          />
                        ) : expressionDataType === "number" ? (
                          <InputNumber
                            disabled={disabled}
                            size='small'
                            value={expression.value as number}
                            onChange={(n) => {
                              schema.items[i].expressions[j].value = n || 0;
                              onSchemaChanged({ ...schema });
                            }}
                            style={{ width: "100%" }}
                          />
                        ) : (
                          <Select
                            options={[
                              {
                                label: "true",
                                value: "true"
                              },
                              {
                                label: "false",
                                value: "false"
                              }
                            ]}
                          />
                        )}
                      </Col>
                      <Col span={2}>
                        {!disabled && (
                          <DeleteOutlined
                            onClick={() => {
                              schema.items[i].expressions.splice(j, 1);
                              onSchemaChanged({ ...schema });
                            }}
                          />
                        )}
                      </Col>
                    </Row>
                  );
                })}
              </div>

              <Button
                disabled={disabled}
                size='small'
                className='addExpressionButton'
                onClick={() => {
                  schema.items[i].expressions.push({
                    name: defaultExpressionName,
                    operator: defaultExpressionOperator,
                    value: ""
                  });
                  onSchemaChanged({ ...schema });
                }}
              >
                <PlusOutlined />
                添加属性
              </Button>
              <SwitchNode
                disabled={disabled}
                checked={logic === "and"}
                onChange={(v) => {
                  schema.items[i].logic = v ? "and" : "or";
                  onSchemaChanged({ ...schema });
                }}
              />
            </Collapse.Panel>
          );
        }
      )}
    </Collapse>
  );

  return (
    <div
      style={{
        marginRight: 24
      }}
    >
      {content}
    </div>
  );
};

export default ExpressionGroup;
