import { hexToRGBA } from '@/utils';
import { Graph } from '@antv/g6';
import type { FormInstance } from 'antd';
import { Badge, Button, Col, Form, Row, Select, Tag } from 'antd';
import React, { memo, useState } from 'react';
import CustomIcon from '../StyleSetting/CustomIcon';
import './index.less';

interface NodeSelectionProps {
  graph: Graph;
  form: FormInstance<any>;
  data: Record<string, any>[];
  nodeLabel: string;
}

interface NodeSelectionWrapProps extends NodeSelectionProps {
  items: {
    name: string;
    label: string;
  }[];
}

interface NodeSelectionFormItemProps extends NodeSelectionProps {
  color: string;
  key: string;
  name: string;
  label: string;
  selecting: string;
  setSelecting: React.Dispatch<React.SetStateAction<string>>;
}

const NodeSelectionFormItem: React.FC<NodeSelectionFormItemProps> = memo(
  (props) => {
    const { nodeLabel, key, name, label, data, setSelecting, color } = props;

    const getDefaultRow = () => {
      return (
        <Row>
          <Col style={{ textAlign: 'center' }} span={7}>
            节点ID
          </Col>
          <Col span={1}></Col>
          <Col style={{ textAlign: 'left' }} span={16}>
            属性值
          </Col>
        </Row>
      );
    };

    return (
      <div className="nodeSelectionFromItem">
        <Form.Item
          className="main"
          key={key}
          name={name}
          label={
            <CustomIcon type="icon-dot" style={{ fontSize: '12px', color }} />
          }
          colon={false}
          rules={[
            {
              // required: true,
              message: `请填写${label}${nodeLabel}`,
            },
          ]}
        >
          <Select
            showSearch
            optionFilterProp="children"
            onChange={() => {
              setSelecting('');
            }}
            optionLabelProp="label"
          >
            <Select.OptGroup key="simple-path-query" label={getDefaultRow()}>
              {data.map((node) => (
                <Select.Option
                  key={node.id}
                  value={node.id}
                  label={
                    <>
                      <Tag color="green">{node.id}</Tag>
                      {node?.style.label.value}
                    </>
                  }
                >
                  <Row>
                    <Col span={7} style={{ textAlign: 'left' }}>
                      <Tag
                        style={{
                          background: hexToRGBA(
                            node?.style.keyshape.fill,
                            0.06,
                          ),
                          border: 'none',
                          borderRadius: '25px',
                        }}
                      >
                        <div
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: 55,
                          }}
                        >
                          <Badge style={{ marginRight: 4 }} status="success" />
                          {node.id}
                        </div>
                      </Tag>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={16} style={{ textAlign: 'left' }}>
                      <Tag
                        style={{
                          background: hexToRGBA('#F6f6f6', 1),
                          border: 'none',
                          borderRadius: '25px',
                        }}
                      >
                        <div
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: 100,
                          }}
                        >
                          {node?.style.label.value || node.label}
                        </div>
                      </Tag>
                    </Col>
                  </Row>
                </Select.Option>
              ))}
            </Select.OptGroup>
          </Select>
        </Form.Item>
      </div>
    );
  },
);

const NodeSelectionWrap: React.FC<NodeSelectionWrapProps> = memo((props) => {
  const { graph, nodeLabel, items, form, data } = props;
  const [selecting, setSelecting] = useState('');
  const colors = ['#1650FF', '#FFC53D'];
  const handleSwap = async () => {
    const values = await form.getFieldsValue();
    console.log('values', values);
    const { source, target } = values;
    form.setFieldsValue({ source: target, target: source });
  };

  return (
    <div style={{ position: 'relative' }}>
      {items.map((item, index) => (
        <NodeSelectionFormItem
          color={colors[index]}
          graph={graph}
          form={form}
          key={item.name}
          name={item.name}
          label={item.label}
          data={data}
          nodeLabel={nodeLabel}
          selecting={selecting}
          setSelecting={setSelecting}
        />
      ))}
      <div
        className="-path-analysis-line"
        style={{
          position: 'absolute',
          top: '22px',
          left: '-6px',
          height: '44px',
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <div
          style={{
            height: '38px',
            width: '1px',
            background: '#DDDDDF',
            position: 'absolute',
          }}
        ></div>
        <Button
          icon={<CustomIcon type="icon-swap" />}
          size="small"
          type="text"
          onClick={handleSwap}
          style={{ background: '#fff' }}
        />
      </div>
    </div>
  );
});

export default NodeSelectionWrap;
