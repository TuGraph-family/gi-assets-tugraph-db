import { Button, Form, Input, Radio, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import DescriptionInput from './ActiveForm';
import CheckAllRadio from './CheckAllRadio';
import SelectAlgorithm from '..';
import AlgorithmParamsMap from './ActiveForm';
import { data } from '../data';

const ActiveForm = ({
  type,
  preSet,
  ...other
}: {
  type: string;
  preSet?: any;
}) => {
  const [form] = Form.useForm();
  const [hotUpdate, setHotUpdate] = useState({
    selectOutputDataOriginType: '0',
  });
  useEffect(() => {
    if (form) {
      form.setFieldsValue(preSet);
    }
  }, []);
  return (
    <Form
      name="activeForm"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      style={{ width: 524, paddingTop: '44px', margin: '0 auto' }}
      initialValues={{ remember: true }}
      autoComplete="off"
      layout="vertical"
      form={form}
      {...other}
    >
      <Form.Item
        label="算法配置名称"
        name="algorithmName"
        rules={[{ required: true, message: '请输入' }]}
      >
        <DescriptionInput
          description={'由中文、英文数字、下划线组成，50字符以内。'}
        />
      </Form.Item>
      <Form.Item
        label="选择节点类型"
        name="nodeType"
        rules={[{ required: true, message: '请选择' }]}
      >
        <CheckAllRadio
          value={['Test']}
          defaultValue={[
            { label: '测试', value: 'Test' },
            { label: '大众点评数据', value: 'Dpdata' },
            { label: '返璞TEst事件1', value: 'FanpuTestEvent1' },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="选择边类型"
        name="edgeType"
        rules={[{ required: true, message: '请选择' }]}
      >
        <CheckAllRadio
          defaultValue={[
            { label: '测试', value: 'Test' },
            { label: '大众点评数据', value: 'Dpdata' },
            { label: '返璞TEst事件1', value: 'FanpuTestEvent1' },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="算法配置类型"
        name="algorithmConfigType"
        rules={[{ required: true, message: '请选择' }]}
      >
        <Radio.Group
          options={[
            { label: '内置算法', value: '0' },
            { label: '自定义算法', value: '1', disabled: true },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="选择算法"
        name="selectAlgorithm"
        rules={[{ required: true, message: '请选择' }]}
      >
        <SelectAlgorithm />
      </Form.Item>
      <Form.Item
        label="算法参数映射"
        name="algorithmParamsMap"
        rules={[{ required: true, message: '请选择' }]}
      >
        <AlgorithmParamsMap />
      </Form.Item>
      <Form.Item
        label="选择输出数据源类型"
        name="selectOutputDataOriginType"
        rules={[{ required: true, message: '请选择' }]}
      >
        <Radio.Group
          onChange={(e) => {
            setHotUpdate((pre) => ({
              ...pre,
              selectOutputDataOriginType: e?.target?.value,
            }));
          }}
          options={[
            { label: '写入Tugraph', value: '0' },
            { label: '写入数据文件', value: '1' },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="数据源路径"
        hidden={form.getFieldValue('selectOutputDataOriginType') !== '1'}
        name="dataOriginPath"
        rules={[{ required: true, message: '请输入' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        hidden={form.getFieldValue('selectOutputDataOriginType') !== '0'}
        label={
          <>
            <div className="tName">
              <div className="tLabel">选择图名称</div>
              <Button type="link">新建图名称</Button>
            </div>
          </>
        }
        name="tugrapthName"
        rules={[{ required: true, message: '请选择' }]}
      >
        <Select showSearch></Select>
      </Form.Item>

      <Space>
        <Button
          onClick={() => {
            console.log(form.getFieldsValue(), 'form');
            form.setFieldValue('nodeType', ['Test', 'Dpdata']);
          }}
          type="primary"
        >
          确认
        </Button>
        <Button
          onClick={() => {
            form.resetFields();
          }}
        >
          重置
        </Button>
      </Space>
    </Form>
  );
};

export default ActiveForm;
