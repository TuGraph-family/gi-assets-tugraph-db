import { useContext, utils } from "@antv/gi-sdk";
import { Button, Checkbox, Form, Input, Select, InputNumber, Space, Tag } from "antd";
import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import "./index.less";
const { Option } = Select;
const { CheckableTag } = Tag;

const operatorMapping = {
  CT: "CONTAINS",
  NC: "CONTAINS",
  EQ: "=",
  NE: "<>",
  GT: ">",
  LT: "<",
  GE: ">=",
  LE: "<="
};

const tagsData = ['person', 'movie', 'user'];

const getOperatorList = (value: string = '') => {
  const type = value.toLowerCase()
  if (type === "string") {
    return [
      {
        key: "CT",
        value: "包括"
      },
      {
        key: "NC",
        value: "不包括"
      },
      {
        key: "EQ",
        value: "等于"
      },
      {
        key: "NE",
        value: "不等于"
      }
    ];
  }

  if (type === "long" || type === "double" || type === 'int32') {
    return [
      {
        key: "GT",
        value: "大于"
      },
      {
        key: "LT",
        value: "小于"
      },
      {
        key: "EQ",
        value: "等于"
      },
      {
        key: "NE",
        value: "不等于"
      },
      {
        key: "GE",
        value: "大于等于"
      },
      {
        key: "LE",
        value: "小于等于"
      }
    ];
  }

  if (type === "boolean") {
    return [
      {
        key: "EQ",
        value: "等于"
      },
      {
        key: "NE",
        value: "不等于"
      }
    ];
  }
  return [];
};

export interface QuickQueryProps {
  languageServiceId: string;
  schemaServiceId: string;
}
const ConfigQuery: React.FC<QuickQueryProps> = ({ languageServiceId, schemaServiceId }) => {
  const [form] = Form.useForm();

  const {
    updateContext,
    transform,
    services,
    graph,
  } = useContext();
  
  const quickQueryService = utils.getService(services, languageServiceId);

  const schemaService = utils.getService(services, schemaServiceId);

  // TODO: 从 URL 中获取当前子图名称
  const graphName = 'default'

  const [state, setState] = useImmer<{
    btnLoading: boolean;
    currentProperty: any;
    schemaList: {
      nodes: any[];
      edges: any[];
    };
    currentSchema: any;
    schemaTypeData: any[];
    selectTag: string;
  }>({
    btnLoading: false,
    currentProperty: {},
    schemaList: {
      nodes: [],
      edges: []
    },
    currentSchema: {},
    schemaTypeData: [],
    selectTag: ''
  });

  const {
    btnLoading,
    currentSchema,
    currentProperty,
    schemaList,
    schemaTypeData,
  } = state;

  const queryGraphSchema = async () => {
    if (!schemaService) {
      return
    }
    const result = await schemaService('default')
    console.log(result)
    const { data } = result
    setState((draft) => {
      draft.schemaList = {
        nodes: data.nodes,
        edges: data.edges
      };
      draft.schemaTypeData = data.nodes;
    });
  }

  useEffect(() => {
    queryGraphSchema()
  }, [])

  const handleValueChange = async (changeValues, allValues) => {
    const { label, property } = allValues;

    let schemaArr: any[] = [];
    // 过滤出 schemaType 的值，设置当前的 Schema
    if (label) {
      schemaArr = schemaList.nodes.filter((node) => node.labelName === label);
    }

    if (schemaArr.length > 0) {
      setState((draft) => {
        draft.currentSchema = schemaArr[0];
      });

      // 设置当前选中的属性值，根据选择的属性值类型，填充不同的逻辑值
      if (property) {
        const tmpProperty = schemaArr[0].properties.find(d => d.name === property);
        if (tmpProperty) {
          setState((draft) => {
            draft.currentProperty = tmpProperty;
          });
        }
      }
    }
  };

  useEffect(() => {
    const values = form.getFieldsValue();
    const { label } = values;
    if (label) {
      handleValueChange({}, { label });
    }
  }, [schemaList]);

  const handleExecQuery = async () => {
    const values = await form.validateFields();
    const { label, property, value, logic, limit, hasClearData } = values;
    setState((draft) => {
      draft.btnLoading = true;
    });
    updateContext((draft) => {
      draft.isLoading = true;
    });
 
    if (!quickQueryService) {
      return;
    }

    let cypherScript = ''
    if (logic === 'NC') {
      // 不包含
      cypherScript = `MATCH (n: ${label}) WHERE NOT n.${property} ${operatorMapping[logic]} '${value}' RETURN n limit ${limit}`
    } else {
      const propertyType = currentProperty.type.toLowerCase()
      if (propertyType === "long" || propertyType === "double" || propertyType === 'int32') {
        cypherScript = `MATCH (n: ${label}) WHERE n.${property} ${operatorMapping[logic]} ${value} RETURN n limit ${limit}`
      } else {
        cypherScript = `MATCH (n: ${label}) WHERE n.${property} ${operatorMapping[logic]} '${value}' RETURN n limit ${limit}`
      }
    }
    console.log(currentProperty.type, cypherScript)
    
    const result = await quickQueryService({
      script: cypherScript,
      graphName
    });

    setState((draft) => {
      draft.btnLoading = false;
    });

    const { formatData } = result.data
    // 查询后除了改变画布节点/边数据，还需要保存初始数据，供类似 Filter 组件作为初始化数据使用
    if (hasClearData) {
      // 清空数据
      updateContext((draft) => {
        const res = transform(formatData);
        draft.data = res;
        draft.source = res;
      });
    } else {
      // 在画布上叠加数据
      console.log(graph)
      const originData = graph.save()
      const newData = {
        nodes: [...originData.nodes, ...formatData.nodes],
        edges: [...originData.edges, ...formatData.edges]
      }
      updateContext((draft) => {
        const res = transform(newData);
        draft.data = res;
        draft.source = res;
      });
    }
    setTimeout(() => {
      graph.fitCenter();
    });
    updateContext((draft) => {
      draft.isLoading = false;
    });
  };

  const handleChange = async (tag: string, checked: boolean) => {
    if (checked) {
      // 选中
      setState(draft => {
        draft.selectTag = tag
      })

      const cypherScript = `MATCH (n: ${tag}) RETURN n LIMIT 1`
      // 选中时候执行查询
      const result = await quickQueryService({
        script: cypherScript,
        graphName
      });
  
      setState((draft) => {
        draft.btnLoading = false;
      });
  
      const { formatData } = result.data
      // 查询后除了改变画布节点/边数据，还需要保存初始数据，供类似 Filter 组件作为初始化数据使用
 
      updateContext((draft) => {
        const res = transform(formatData);
        draft.data = res;
        draft.source = res;
      });
      setTimeout(() => {
        graph.fitCenter();
      });
    } else {
      setState(draft => {
        draft.selectTag = ''
      })
    }
  };

  return (
    <div className='quickQueryContainer'>
      <Form
        form={form}
        className='quickQueryForm'
        layout='vertical'
        onValuesChange={handleValueChange}
        style={{ height: "100%", overflow: "auto" }}
      >

        <div className="formContainer">
          <Form.Item
            label='节点类型'
            name='label'
            rules={[{ required: true, message: "请选择节点类型" }]}
          >
            <Select
              placeholder='请选择'
              style={{ width: "100%" }}
              showSearch
              allowClear
            >
              {schemaTypeData.map((schema) => {
                return (
                  <Option
                    key={schema.labelName}
                    value={schema.labelName}
                  >
                    {schema.labelName}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label='属性条件' rules={[{ required: true, message: "请选择图元素属性" }]}>
            <Input.Group compact>
              <Form.Item
                noStyle
                name='property'
              >
                <Select placeholder='请选择' style={{ width: "35%" }} showSearch allowClear>
                  {currentSchema.properties?.map((d) => {
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
                name='logic'
                rules={[{ required: true, message: "请选择查询逻辑" }]}
              >
                <Select placeholder='请选择' style={{ width: "35%" }} allowClear>
                  {getOperatorList(currentProperty.type).map((logic) => {
                    return (
                      <Option value={logic.key} key={logic.key}>
                        {logic.value}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item noStyle name='value' rules={[{ required: true, message: "请输入属性值" }]}>
                <Input placeholder='请输入' style={{ width: "30%" }} />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item label='返回节点数目' name='limit'>
            <InputNumber placeholder='请输入' style={{ width: "100%" }} />
          </Form.Item>
        </div>
        <div className="otherContainer">
          <Form.Item name='hasClearData' valuePropName='checked' wrapperCol={{ span: 16 }}>
            <Checkbox>是否清空画布数据</Checkbox>
          </Form.Item>

          <span style={{ marginRight: 8 }}>示例:</span>
          <Space size={[0, 8]} wrap>
            {tagsData.map((tag) => (
              <CheckableTag
                key={tag}
                checked={state.selectTag === tag}
                onChange={(checked) => handleChange(tag, checked)}
              >
                {tag}
              </CheckableTag>
            ))}
          </Space>
        </div>
        <div>
          
        </div>
      </Form>
      <div className='buttonContainer'>
        <Button
          loading={btnLoading}
          className='queryButton'
          type='primary'
          onClick={handleExecQuery}
        >
          执行查询
        </Button>
      </div>
    </div>
  );
};

export default ConfigQuery;
