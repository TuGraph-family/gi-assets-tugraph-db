import {
  Button,
  Drawer,
  Table,
  Empty,
  Input,
  Space,
  Form,
  InputProps,
  Checkbox,
  CheckboxProps,
  Select,
  Tooltip,
  SelectProps,
  Radio,
} from 'antd';
import { QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';
import type { IGIAC } from '@antv/gi-sdk';
import { extra, useContext } from '@antv/gi-sdk';
import React, { memo, useEffect, useState } from 'react';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import type { ColumnsType } from 'antd/es/table';
const { GIAComponent } = extra;
const CheckboxGroup = Checkbox.Group;
import { selectAlgorithm } from './content';
import './index.less';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

export interface IProps {
  GIAC: IGIAC;
}
export interface Label {
  label: string;
  value: string;
  disabled?: boolean;
  defaultChecked?: boolean;
}
export interface CheckAllRadioProps extends Partial<CheckboxProps> {
  checkAllVisible?: boolean;
  value?: string[];
  defaultValue: any[];
  onChange?: (value: CheckboxValueType[] | CheckboxChangeEvent | Label[]) => void;
}
export interface DescriptionInput extends InputProps {
  description: string;
}
export interface DescriptionSelect extends SelectProps {
  description: string;
}
export interface RootConfig {
  modalOpen: boolean;
  width: number;
  modalTitle: string;
  actionType: string;
}
export interface DataType {
  algorithmId: string;
  name: string;
  algorithmName: string;
  executionStatus: 'running' | 'stop';
  algorithmExecutionTime: string;
  creator: string;
  createTime: string;
}
export interface AlItemProps extends DescriptionInput {
  mT: string;
  sT: string;
  alValue: string | number | undefined;
  onAlChange: (value: any) => void;
}
const SearchItem = ({ name }: { name: string }) => {
  return (
    <div className="searchItem">
      <Input />
      <div className="tool">
        <Button icon={<SearchOutlined color="#fff" />} type="primary" style={{ width: '80px' }}>
          搜索
        </Button>
        <Button style={{ width: '80px' }}>重置</Button>
      </div>
    </div>
  );
};
const DescriptionInput = ({ description, ...other }: Partial<DescriptionInput>) => {
  return (
    <div className="description">
      <div className="input">
        <Input {...other} />
      </div>
      <div className="text">{description}</div>
    </div>
  );
};
const DescriptionSelect = ({ description, ...other }: Partial<DescriptionSelect>) => {
  return (
    <div className="description">
      <div className="input">
        <Select {...other} />
      </div>
      <div className="text">{description}</div>
    </div>
  );
};
const AlItem = ({ mT, sT, alValue, onAlChange, description, ...alOther }: AlItemProps) => {
  return (
    <div className="alItem">
      <div className="alTitle">
        <div className="mT">{mT}</div>
        <div className="sT">{sT}</div>
      </div>
      <DescriptionInput description={description} value={alValue} onChange={onAlChange} {...alOther} />
    </div>
  );
};
const AlgorithmParamsMap = props => {
  return (
    <>
      <AlItem
        mT="src_id"
        sT="(起点ID)"
        alValue={props?.value?.src_id}
        description="同类型ID不能重复"
        onAlChange={(alValue: any) => {
          props?.onChange({ ...props?.value, src_id: alValue?.target?.value });
        }}
      />
      <AlItem
        mT="target_id"
        sT="(目标ID)"
        alValue={props?.map?.target_id}
        description="同类型ID不能重复"
        onAlChange={(alValue: any) => {
          props?.onChange({ ...props?.value, target_id: alValue?.target?.value });
        }}
      />
      <AlItem
        mT="iterations"
        sT="(迭代轮数)"
        alValue={props?.value?.iterations}
        description=""
        onAlChange={(alValue: any) => {
          props?.onChange({ ...props?.value, iterations: alValue?.target?.value });
        }}
      />
    </>
  );
};
const SelectAlgorithm = props => {
  return (
    <Select {...props}>
      {selectAlgorithm.map(item => (
        <Select.Option key={item.value} title={item?.label}>
          <Space>
            <div className="txt">
              {item?.label}({item?.value})
            </div>
            <div className="tip">
              &nbsp; | &nbsp;
              <Tooltip title={item?.tooltip}>
                <span className="lTxt">
                  算法说明 &nbsp;
                  <QuestionCircleOutlined rev={undefined} className="tIc" />
                </span>
              </Tooltip>
            </div>
          </Space>
        </Select.Option>
      ))}
    </Select>
  );
};
const CheckAllRadio = ({ value, defaultValue, onChange, checkAllVisible = true, ...other }: CheckAllRadioProps) => {
  const checkAll = defaultValue?.length === value?.length;
  const indeterminate = value && value?.length > 0 && value?.length < defaultValue?.length;
  return (
    <>
      <Space direction="vertical">
        {checkAllVisible ? (
          <Checkbox
            indeterminate={indeterminate}
            checked={checkAll}
            onChange={(e: CheckboxChangeEvent) => {
              onChange &&
                onChange(e.target.checked ? defaultValue?.map((item: Label | CheckboxValueType) => item?.value) : []);
            }}
          >
            以下全部类型
          </Checkbox>
        ) : null}
        <CheckboxGroup {...other} options={defaultValue} value={value} onChange={onChange} />
      </Space>
    </>
  );
};
const ActiveForm = ({ type, preSet }: { type: string; preSet?: any }) => {
  const [form] = Form.useForm();
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
    >
      <Form.Item label="算法配置名称" name="algorithmName" rules={[{ required: true, message: '请输入' }]}>
        <DescriptionInput description={'由中文、英文数字、下划线组成，50字符以内。'} />
      </Form.Item>
      <Form.Item label="选择节点类型" name="nodeType" rules={[{ required: true, message: '请选择' }]}>
        <CheckAllRadio
          value={['Test']}
          defaultValue={[
            { label: '测试', value: 'Test' },
            { label: '大众点评数据', value: 'Dpdata' },
            { label: '返璞TEst事件1', value: 'FanpuTestEvent1' },
          ]}
        />
      </Form.Item>
      <Form.Item label="选择边类型" name="edgeType" rules={[{ required: true, message: '请选择' }]}>
        <CheckAllRadio
          defaultValue={[
            { label: '测试', value: 'Test' },
            { label: '大众点评数据', value: 'Dpdata' },
            { label: '返璞TEst事件1', value: 'FanpuTestEvent1' },
          ]}
        />
      </Form.Item>
      <Form.Item label="算法配置类型" name="algorithmConfigType" rules={[{ required: true, message: '请选择' }]}>
        <Radio.Group
          options={[
            { label: '内置算法', value: '0' },
            { label: '自定义算法', value: '1', disabled: true },
          ]}
        />
      </Form.Item>
      <Form.Item label="选择算法" name="selectAlgorithm" rules={[{ required: true, message: '请选择' }]}>
        <SelectAlgorithm />
      </Form.Item>
      <Form.Item label="算法参数映射" name="algorithmParamsMap" rules={[{ required: true, message: '请选择' }]}>
        <AlgorithmParamsMap />
      </Form.Item>
      <Form.Item
        label="选择输出数据源类型"
        name="selectOutputDataOriginType"
        rules={[{ required: true, message: '请选择' }]}
      >
        <Radio.Group
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
        <Select></Select>
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
const stop = id => {};
const details = id => {};
const result = id => {};
const List = ({ onAdd }: { onAdd: () => void }) => {
  const [config, setConfig] = useState<{
    list: DataType[];
    loading: boolean;
  }>({
    list: [],
    loading: false,
  });
  const isFullList = config?.list?.length > 0;
  const columns: ColumnsType<DataType> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      filterIcon: (
        <SearchOutlined
          style={{
            fontSize: '16px',
          }}
        />
      ),
      filterDropdown: <SearchItem name="name" />,
      render: (value: string, row: DataType) => {
        return (
          <Button type="link" onClick={() => details(row?.algorithmId)}>
            {value}
          </Button>
        );
      },
    },
    {
      title: '算法名称',
      dataIndex: 'algorithmName',
      key: 'algorithmName',
      filterDropdown: <SearchItem name="algorithmName" />,
    },
    {
      title: '执行状态',
      dataIndex: 'executionStatus',
      key: 'executionStatus',
      filterDropdown: <SearchItem name="executionStatus" />,
    },
    {
      title: '算法执行时间',
      dataIndex: 'algorithmExecutionTime',
      key: 'algorithmExecutionTime',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      filterIcon: (
        <SearchOutlined
          style={{
            fontSize: '16px',
          }}
        />
      ),
      filterDropdown: <SearchItem name="creator" />,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      showSorterTooltip: false,
      sorter: (a: DataType, b: DataType) => a?.createTime - b?.createTime,
    },
    {
      title: '操作',
      render: (value: undefined, row: DataType) => {
        return (
          <Space>
            {row?.executionStatus === 'running' ? (
              <Button type="link" onClick={() => stop(row?.algorithmId)}>
                停止
              </Button>
            ) : (
              <Button type="link" onClick={() => result(row?.algorithmId)}>
                结果查看
              </Button>
            )}
          </Space>
        );
      },
    },
  ];
  return (
    <div className="list">
      <div className="title">
        <div>算法配置列表</div>
        {isFullList ? (
          <Button type="primary" onClick={onAdd}>
            新建算法配置
          </Button>
        ) : null}
      </div>
      <Table className={isFullList ? 'f_table' : 'e_table'} columns={columns} dataSource={config.list} />
      {!isFullList ? (
        <div className="e_node">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            imageStyle={{ width: '64px', height: '40px', textAlign: 'center', display: 'inline-block' }}
            description={
              <>
                <div className="text">暂无数据</div>
                <Button type="primary" onClick={onAdd}>
                  新建算法配置
                </Button>
              </>
            }
          />
        </div>
      ) : null}
    </div>
  );
};

const Add = () => {
  return (
    <div className="add">
      <div className="nav">
        <div className="link">算法配置列表</div>
        <div className="normal">新建算法配置</div>
      </div>
      <div className="content">
        <ActiveForm
          type="add"
          preSet={{
            algorithmConfigType: '0',
            algorithmParamsMap: {
              src_id: '',
              target_id: '',
              iterations: 10,
            },
          }}
        />
      </div>
    </div>
  );
};

const AlgorithmConfig: React.FunctionComponent<IProps> = props => {
  const { GIAC } = props;
  const [rootConfig, setRootConfig] = useState<RootConfig>({
    modalOpen: GIAC?.visible || false,
    width: 1200,
    modalTitle: '算法配置',
    actionType: 'list',
  });
  const set = (values: Partial<RootConfig>) => {
    setRootConfig((pre: RootConfig) => ({ ...pre, ...values }));
  };
  const list = () => {
    set({ modalOpen: true, width: 1200, modalTitle: '算法配置列表', actionType: 'list' });
  };
  const add = () => {
    set({ modalOpen: true, width: 1148, modalTitle: '新建算法配置', actionType: 'add' });
  };

  const close = () => {
    set({ modalOpen: false });
  };

  const activeNodeMap = {
    list: <List onAdd={add} />,
    add: <Add />,
  };
  return (
    <>
      <GIAComponent GIAC={GIAC} onClick={list} />
      <Button className="algorithmConfig" onClick={list}>
        算法配置
      </Button>
      <Drawer open={rootConfig?.modalOpen} width={rootConfig?.width} title={rootConfig?.modalTitle} onClose={close}>
        {activeNodeMap[rootConfig?.actionType]}
      </Drawer>
    </>
  );
};

export default AlgorithmConfig;
