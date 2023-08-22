import { Form, Button, Popconfirm } from 'antd';
import React, { useState, useEffect } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { cloneDeep } from 'lodash';
import { AttributesEditForm } from './AttributesEditForm/index';
import { useContext, utils } from '@antv/gi-sdk';
import { filterByTopRule } from '../StyleSetting/utils';
import { getQueryString } from '../utils'
import './index.less';

export interface props {
  schemaServiceId: string;
}

const AttributesFilter: React.FC<props> = ({ schemaServiceId }) => {
  const [form] = Form.useForm();
  const { services, graph } = useContext();
  const [filterdata, setFilterData] = useState([{ id: Date.now() }]);
  const schemaService = utils.getService(services, schemaServiceId);
  const [schemaList, setSchemaList] = useState<{
    nodes: any[],
    edges: any[]
  }>({
    nodes: [],
    edges: []
  });

  const graphName = getQueryString('graphName')
  const queryGraphSchema = async () => {
    if (!schemaService) {
      return;
    }
    
    const result = await schemaService(graphName);
    const { data } = result;
    setSchemaList(data);
  };

  useEffect(() => {
    queryGraphSchema();
  }, []);

  const addPanel = () => {
    const addData = cloneDeep(filterdata);
    addData.push({
      id: Date.now(),
    });
    setFilterData(addData);
  };

  //删除事件
  const handleDelete = id => (
    <Popconfirm
      title="你确定要删除吗?"
      placement="topRight"
      okText="确认"
      cancelText="取消"
      onConfirm={() => {
        const deleteData = filterdata.filter(item => item.id !== id);
        setFilterData(deleteData);
      }}
    >
      <CloseOutlined
        onClick={event => {
          event.stopPropagation();
        }}
      />
    </Popconfirm>
  );

  const transformObject = (params) => {
    const o: any = [];
    for (const key in params) {
      if (key.startsWith("label-")) {
        const labelValue = params[key];
        const rulesKey = `rules-${key.slice(6)}`;
        const rulesValue = params[rulesKey];
        o.push({ key: labelValue, rules: rulesValue });
      }
    }
    return o;
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    const rules = transformObject(values)
    // console.log('属性过滤规则', rules)
    // 筛选出符合条件的节点
    const graphData = graph.save()

    const currentNodes: any = []
    const currentEdges: any = []
    rules.forEach(rule => {
      const currentSchema = schemaList?.nodes?.find(
        (nodeSchema) => nodeSchema.labelName === rule.key
      );
      const filterSchemaData =  {
        type: rule.key,
        label: rule.key,
        expressions: rule.rules,
        properties: currentSchema?.properties
      }

      // @ts-ignore
      const filterNodes = graphData.nodes?.filter((node) =>
        filterByTopRule({
          id: node.id,
          label: node.label,
          properties: node.data
        }, filterSchemaData as any)
      );

      filterNodes.forEach(d => {
        currentNodes.push(d)
      })

      // @ts-ignore
      const filterEdges = graphData.edges?.filter((edge) =>
        filterByTopRule({
          id: edge.id,
          label: edge.label,
          properties: edge.data
        }, filterSchemaData as any)
      );

      filterEdges.forEach(d => {
        currentEdges.push(d)
      })
    })
    console.log('符合条件的节点', currentNodes, currentNodes.map(d => d.id))

    const nodeIds = currentNodes.map(d => d.id)

    // @ts-ignore
    graphData.nodes?.forEach(node => {
      const hasMatch = nodeIds.includes(node.id);
      if (hasMatch) {
        graph.setItemState(node.id, 'disabled', false);
        graph.setItemState(node.id, 'selected', true);
      } else {
        graph.setItemState(node.id, 'selected', false);
        graph.setItemState(node.id, 'disabled', true);
      }
    });

    const edgeIds = currentEdges.map(d => d.id)
     // @ts-ignore
     graphData.edges?.forEach(edge => {
      const hasMatch = edgeIds.includes(edge.id);
      if (hasMatch) {
        graph.setItemState(edge.id, 'disabled', false);
        graph.setItemState(edge.id, 'selected', true);
      } else {
        graph.setItemState(edge.id, 'selected', false);
        graph.setItemState(edge.id, 'disabled', true);
      }
    });
  };

  return (
    <div className='attribute-filter-container'>
      <Form form={form} layout="vertical">
        {filterdata.map((item, index) => {
          return <AttributesEditForm id={item.id} handleDelete={handleDelete} form={form} schemaList={schemaList} />;
        })}
        <Button
          block
          style={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6A6B71',
            height: 94,
            backgroundImage: 'linear-gradient(174deg, rgba(245,248,255,0.38) 11%, rgba(244,247,255,0.55) 96%)',
            border: 'none',
          }}
          onClick={() => {
            addPanel();
          }}
        >
          <img
            src="https://mdn.alipayobjects.com/huamei_xn3ctq/afts/img/A*fHVRTq8rqlMAAAAAAAAAAAAADo6BAQ/original"
            alt=""
          />
          <span>添加筛选组</span>
        </Button>
        <div className="button">
          <Button
            style={{ marginRight: 16 }}
            onClick={() => {
              form.resetFields();
            }}
          >
            重置
          </Button>
          <Button htmlType="submit" type="primary" onClick={handleSubmit}>
            确认
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AttributesFilter
