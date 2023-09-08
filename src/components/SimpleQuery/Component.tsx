import { useContext, utils } from "@antv/gi-sdk";
import { Row, Col, Form, Input, Select, Badge, Tag, message } from "antd";
import React, { useEffect } from "react";
import { SearchOutlined } from '@ant-design/icons';
import { useImmer } from "use-immer";
import { getQueryString, hexToRGBA } from '../utils'
import { getTransformByTemplate } from '../StyleSetting/utils'
import "./index.less";

const { Option } = Select;

const SimpleQuery = () => {
  const [form] = Form.useForm();

  const demoGraphName = getQueryString('demoGraphName')

  const { updateContext, services, schemaData, graph, data } = useContext();
  const languageService: any = utils.getService(services, 'TuGraph-DB/languageQueryService');

  const customStyleConfig = localStorage.getItem('CUSTOM_STYLE_CONFIG')
    ? JSON.parse(localStorage.getItem('CUSTOM_STYLE_CONFIG') as string)
    : {};

  const getDefaultRow = (type) => {
    return <Row>
      {/* <Col style={{textAlign: 'center' }} span={6}>{type === 'node' ? '节点名称' : '边名称' }</Col>
      <Col span={1}></Col> */}
      <Col style={{textAlign: 'center' }} span={7}>属性名称</Col>
      <Col span={1}></Col>
      <Col style={{textAlign: 'left' }} span={16}>属性值</Col>
    </Row>
  }
  
  const [state, setState] = useImmer<{
    dataList: any[];
    searchValue: string;
    schemaType: string;
  }>({
    dataList: [],
    searchValue: '',
    schemaType: 'node'
  });

  const {
    searchValue, dataList, schemaType
  } = state;

  const autoQueryDataFromDemo = async () => {
    const result = await languageService({
      script: 'match p=(n)-[*..1]-(m)  RETURN p LIMIT  50',
      graphName: demoGraphName,
    });

    if (!result.success) {
      // 执行查询失败
      message.error(`执行查询失败: ${result.errorMessage}`);
      return;
    }
    const { formatData } = result.data;
    // 处理 formData，添加 data 字段
    formatData.nodes.forEach(d => {
      d.data = d.properties;
    });

    formatData.edges.forEach(d => {
      d.data = d.properties;
    });
    const transformData = getTransformByTemplate(customStyleConfig, schemaData);

    // 清空数据
    updateContext(draft => {
      if (transformData) {
        draft.transform = transformData;
      }

      const res = transformData(formatData);
      // @ts-ignore
      draft.data = res;
      // @ts-ignore
      draft.source = res;
    });
  }

  useEffect(() => {
    if (demoGraphName) {
      autoQueryDataFromDemo()
    }
  }, [demoGraphName])

  const handleTypeChange = (value) => {
    setState(draft => {
      draft.schemaType = value
    })
  }

  const handleChange = (value) => {
    graph.focusItem(value)
    graph.setItemState(value, 'selected', true)
  };


  const filterData = (value, arr, parentKey = '') => {
    const result: any = [];
    arr.forEach(obj => {
      for(let key in obj) {
        if(typeof obj[key] === 'object') {
          let innerResult = filterData(value, [obj[key]], key);
          if(innerResult.length > 0) {
            result.push({
              id: obj.id,
              key: innerResult[0].key, 
              value: obj
            });
            break;
          }
        } else if(typeof obj[key] === 'string' && obj[key].includes(value)) {
          let fullKey = parentKey ? `${parentKey}.${key}` : key;
          result.push({
            id: obj.id,
            key: fullKey, 
            value: obj
          });
          break;
        }
      }
    });
    return result;
  }

  const handleSearch = (value: string) => {    
    if (value) {
      // 计算数据
      const { nodes, edges } = data//graph.save()
      const filterNodeData = (nodes as any).map(d => {
        const { id, label, properties, style } = d 
        return {
          id, 
          label, 
          properties,
          color: style?.keyshape?.fill || 'green'
        }
      })

      const filterEdgeData = (edges as any).map(d => {
        const { label, id, properties, style } = d
        return {
          id, 
          label, 
          properties,
          color: style?.keyshape?.stroke || 'green'
        }
      })
      let result: any = []
      if (schemaType === 'node') {
        // 从节点中搜索
        result = filterData(value, filterNodeData)       
      } else if (schemaType === 'edge') {
        result = filterData(value, filterEdgeData)
      }

      // 将模糊匹配到值转成 label properties value
      // 将模糊匹配到值转成 label value 这个是匹配到了 label
      const formArrData = result.map(d => {
        const { id, key, value } = d
        const keys = key.split('.')
        if (keys.length === 2) {
          // 匹配到了 properties
          const [p, v] = keys
          return {
            id,
            label: value.label,
            propertyKey: v,
            value: value[p][v],
            color: value.color
          }
        } 
        
         // 匹配到了 label
        return {
          id,
          label: value.label,
          propertyKey: key,
          value: value[key],
          color: value.color
        }
      })

      setState(draft => {
        draft.dataList = formArrData.map(d => {
          return {
            value: d.id,
            originValue: <><Tag style={{ marginLeft: 4 }} color="green">{d.propertyKey}</Tag>{d.value}</>,
            text: <Row style={{ paddingTop: 4 }}>
              {/* <Col span={6} style={{ textAlign: 'left' }}><div style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 55 }}><Badge style={{ marginRight: 4 }} color={d.color} />{d.label}</div></Col>
              <Col span={1}></Col> */}
              <Col span={7} style={{ textAlign: 'left' }}><Tag style={{ background: hexToRGBA(d.color, 0.06), border: 'none', borderRadius: '25px' }}><div style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 40 }}><Badge style={{ marginRight: 4 }} color={d.color} />{d.propertyKey}</div></Tag></Col>
              <Col span={1}></Col>
              <Col span={16} style={{ textAlign: 'left' }}><Tag style={{ background: hexToRGBA('#F6f6f6', 1), border: 'none', borderRadius: '25px' }}><div style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 115 }}>{d.value}</div></Tag></Col>
            </Row>
          }
        })
      })
    } else {
      setState(draft => {
        draft.dataList = []
      })
    }
  };

  return (
    <div className='simpleQueryContainer'>
      <Form
        form={form}
        className='quickQueryForm'
        layout='vertical'
        style={{ height: "100%", overflow: "auto" }}
      >
        <Form.Item>
          <Input.Group compact>
            <Form.Item
              noStyle
              name='property'
            >
              <Select defaultValue={schemaType} value={schemaType} style={{ width: "20%" }} onChange={handleTypeChange}>
                <Option value='node' key='node'>点</Option>
                <Option value='edge' key='edge'>边</Option>
              </Select>
            </Form.Item>
            <Form.Item noStyle name='value' rules={[{ required: true, message: "请输入属性值" }]}>
              <Select
                showSearch
                value={searchValue}
                placeholder='请输入名称'
                style={{ width: "80%" }}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={handleSearch}
                onChange={handleChange}
                notFoundContent={null}
                optionLabelProp='label'
                suffixIcon={
                  <SearchOutlined />
                }
              >
                <Select.OptGroup key='simple-query' label={getDefaultRow(state.schemaType)}>
                  {
                    dataList.map(d => {
                      return <Option key={d.id} value={d.value} label={d.originValue}>
                        {d.text}
                      </Option>
                    })
                  }
                </Select.OptGroup>
              </Select>
            </Form.Item>
          </Input.Group>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SimpleQuery;
