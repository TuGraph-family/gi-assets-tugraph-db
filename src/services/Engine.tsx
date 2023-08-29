import { EngineBanner, utils } from '@antv/gi-sdk';
import { Button, Col, Form, Input, Row } from 'antd';
import * as React from 'react';
import { GI_SERVICE_SCHEMA } from './Initializer';
import { getQueryString } from '../components/utils'
const { setServerEngineContext, getServerEngineContext } = utils;

export interface ServerProps {
  updateGISite: (params: any) => void;
}

export const ENGINE_ID = 'TuGraph-DB';
const DEFAULT_INFO = {
  HTTP_SERVER_URL: 'http://127.0.0.1:7001',
};

const Server: React.FunctionComponent<ServerProps> = props => {
  const { updateGISite } = props;

  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue(getServerEngineContext(DEFAULT_INFO));
  }, []);

  const handleStart = async () => {
    const values = await form.validateFields();
    // 一定要先设置，否则schema查询是没有的
    setServerEngineContext(values);

    const graphName = getQueryString('graphName')

    const schema = await GI_SERVICE_SCHEMA.service(graphName);
    const engineContext = {
      engineId: ENGINE_ID,
      schemaData: schema,
      ...values,
    };

    setServerEngineContext(engineContext);

    updateGISite({
      name: values.name,
      engineId: ENGINE_ID,
      schemaData: schema,
      engineContext,
    });
  };

  return (
    <div>
      <EngineBanner
        docs="https://www.yuque.com/antv/gi/wuvtyf"
        title="高性能图数据库"
        desc="TuGraph 是蚂蚁集团自主研发的大规模图计算系统，提供图数据库引擎和图分析引擎。其主要特点是大数据量存储和计算，高吞吐率，以及灵活的 API，同时支持高效的在线事务处理（OLTP）和在线分析处理（OLAP）"
        logo="https://gw.alipayobjects.com/mdn/rms_3ff49c/afts/img/A*xqsZTKLVHPsAAAAAAAAAAAAAARQnAQ"
      />
      <Form name="form" form={form}>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Form.Item label="数据集名称" name="name" rules={[{ required: true, message: '填写数据集名称!' }]}>
              <Input placeholder="请填写数据集名称" />
            </Form.Item>
            <Form.Item
              label="引擎地址"
              name="HTTP_SERVER_URL"
              rules={[{ required: true, message: '请填写 R+ 引擎地址!' }]}
            >
              <Input placeholder="请填写 R+ 引擎地址" />
            </Form.Item>
            <Form.Item>
              <Button style={{ width: '100%' }} onClick={handleStart} type="primary">
                创建数据集
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Server;
