import { useContext, utils } from "@antv/gi-sdk";
import { Button, Checkbox, Form, Input, Select, InputNumber, Space, Tag, message, Tooltip } from "antd";
import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import { getTransformByTemplate } from "../StyleSetting/utils";
import { getOperatorList, operatorMapping } from '../StyleSetting/Constant'
import { getQueryString } from '../utils'
import "./index.less";
import { typeImg } from "../StatisticsFilter/constants";

const { Option } = Select;
const { CheckableTag } = Tag;

export interface QuickQueryProps {
  languageServiceId: string;
  schemaServiceId: string;
}
const ConfigQuery: React.FC<QuickQueryProps> = ({ languageServiceId, schemaServiceId }) => {
  const [form] = Form.useForm();

  const {
    updateContext,
    services,
    graph,
  } = useContext();
  
  const customStyleConfig = localStorage.getItem('CUSTOM_STYLE_CONFIG') ? JSON.parse(localStorage.getItem('CUSTOM_STYLE_CONFIG') as string) : {}

  const quickQueryService = utils.getService(services, languageServiceId);

  const schemaService = utils.getService(services, schemaServiceId);

  const graphName = getQueryString('graphName')

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
    if (!schemaService || !graphName) {
      return
    }
    const result = await schemaService(graphName)

    const { data } = result
    if (!data) {
      // 如果请求失败，则直接 return
      return
    }
    
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
  }, [graphName])

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


  const transform = getTransformByTemplate(customStyleConfig, state.schemaList);

  const handleExecQuery = async () => {
    const values = await form.validateFields();
    const { label, property, value, logic, limit = 10, hasClearData } = values;
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

    const result = await quickQueryService({
      script: cypherScript,
      graphName
    });

    setState((draft) => {
      draft.btnLoading = false;
    });

    if (!result.success) {
      // 执行查询失败
      message.error(`执行查询失败: ${result.errorMessage}`)
      return
    }

    const { formatData } = result.data

     // 处理 formData，添加 data 字段
     formatData.nodes.forEach(d => {
      d.data = d.properties
    })

    formatData.edges.forEach(d => {
      d.data = d.properties
    })

    // 查询后除了改变画布节点/边数据，还需要保存初始数据，供类似 Filter 组件作为初始化数据使用
    if (hasClearData) {
      // 清空数据
      updateContext((draft) => {
        if (transform) {
          draft.transform = transform;
        }

        const res = transform(formatData);
        // @ts-ignore
        draft.data = res;
        // @ts-ignore
        draft.source = res;
      });
    } else {
      // 在画布上叠加数据
      const originData = graph.save() as any
      const newData = {
        nodes: [...originData.nodes, ...formatData.nodes],
        edges: [...originData.edges, ...formatData.edges]
      }
      updateContext((draft) => {
        if (transform) {
          draft.transform = transform;
        }

        const res = transform(newData);
        // @ts-ignore
        draft.data = res;
        // @ts-ignore
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

      if (!quickQueryService) {
        return
      }

      const cypherScript = `MATCH (n: ${tag}) RETURN n LIMIT 1`
      // 选中时候执行查询
      const result = await quickQueryService({
        script: cypherScript,
        graphName
      });
  
      setState((draft) => {
        draft.btnLoading = false;
      });
  
      if (!result.success) {
        // 执行查询失败
        message.error(`执行查询失败: ${result.errorMessage}`)
        return
      }

      const { formatData } = result.data
      // 查询后除了改变画布节点/边数据，还需要保存初始数据，供类似 Filter 组件作为初始化数据使用
 
       // 处理 formData，添加 data 字段
      formatData.nodes.forEach(d => {
        d.data = d.properties
      })

      formatData.edges.forEach(d => {
        d.data = d.properties
      })
      
      updateContext((draft) => {
        const res = transform(formatData);
        // @ts-ignore
        draft.data = res;
        // @ts-ignore
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

  const handleResetForm = () => {
    form.resetFields()
  }

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
                    <img src={typeImg['person']} alt="" className="img" style={{ marginRight: 4 }} />
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
                        {
                            logic.text
                            ?
                            <Tooltip title={logic.text}>{logic.value}</Tooltip>
                            :
                            logic.value
                          }
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
          <Form.Item name='hasClearData' valuePropName='checked' wrapperCol={{ span: 16 }} style={{ marginBottom: 0 }}>
            <Checkbox>清空画布数据</Checkbox>
          </Form.Item>
        </div>
        <div className="otherContainer">
          <span style={{ marginRight: 8 }}>示例:</span>
          <Space size={[0, 8]} wrap>
            {schemaTypeData.map(d => d.labelName).slice(0, 3).map((tag) => (
              <CheckableTag
                key={tag}
                checked={state.selectTag === tag}
                onChange={(checked) => handleChange(tag, checked)}
                style={{ backgroundColor: state.selectTag === tag ? '#3056E3' : '#E6EBF6', borderRadius: 20 }}
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
          className='queryButton'
          onClick={handleResetForm}
        >
          重置
        </Button>
        <Button
          loading={btnLoading}
          className='queryButton'
          type='primary'
          onClick={handleExecQuery}
        >
          查询
        </Button>
      </div>
    </div>
  );
};

export default ConfigQuery;
