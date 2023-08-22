import { useContext } from "@antv/gi-sdk";
import { Row, Col, Form, Input, Select, Badge, Tag } from "antd";
import React from "react";
import { SearchOutlined } from '@ant-design/icons';
import { useImmer } from "use-immer";
import "./index.less";

const { Option } = Select;

const SimpleQuery = () => {
  const [form] = Form.useForm();

  const {
    graph,
  } = useContext();

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

  const handleTypeChange = (value) => {
    console.log(value)
    setState(draft => {
      draft.schemaType = value
    })
  }

  const handleChange = (value) => {
    graph.focusItem(value)
    graph.setItemState(value, 'active', true)
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
      const { nodes, edges } = graph.save()
      const filterNodeData = (nodes as any).map(d => {
        const { id, label, properties } = d 
        return {
          id, label, properties
        }
      })

      const filterEdgeData = (edges as any).map(d => {
        const { label, id, properties } = d
        return {
          id, label, properties
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
            value: value[p][v]
          }
        } 
        
         // 匹配到了 label
        return {
          id,
          label: value.label,
          propertyKey: key,
          value: value[key]
        }
      })

      setState(draft => {
        draft.dataList = formArrData.map(d => {
          return {
            value: d.id,
            text: <Row style={{ paddingTop: 4 }}>
              <Col span={6}><Tag><div style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 55 }}><Badge style={{ marginRight: 4 }} status="success" />{d.label}</div></Tag></Col>
              <Col span={1}></Col>
              <Col span={6}><Tag><div style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 55 }}>{d.propertyKey}</div></Tag></Col>
              <Col span={1}></Col>
              <Col span={10}><Tag><div style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 90 }}>{d.value}</div></Tag></Col>
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
                options={[{
                  label: <Row>
                    <Col style={{textAlign: 'center' }} span={6}>节点名称</Col>
                    <Col style={{textAlign: 'center' }} span={8}>属性名称</Col>
                    <Col style={{textAlign: 'center' }} span={10}>属性值</Col>
                  </Row>,
                  options: (dataList || []).map(d => ({
                    value: d.value,
                    label: d.text,
                  }))
                }]}
                suffixIcon={
                  <SearchOutlined />
                }
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SimpleQuery;
