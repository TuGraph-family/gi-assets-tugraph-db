import {
  Button,
  Drawer,
  Table,
  Empty,
  Space,
  Descriptions,
  Collapse,
} from 'antd';
import {
  CaretDownOutlined,
  CaretUpOutlined,
  SearchOutlined,
} from '@ant-design/icons';

import { extra, useContext, utils } from '@antv/gi-sdk';
import React, { useState } from 'react';
import { data, mockList, mockResultList } from './data';

import type { ColumnsType } from 'antd/es/table';
const { GIAComponent } = extra;
const { Panel } = Collapse;
import { DataType, IProps, LinksFn, RootConfig } from './interface';
import './index.less';
import SearchItem from './components/SearchItem';
import ActiveForm from './components/ActiveForm';

const stop = (id) => {};

const List = ({ goAdd, goList, goDetails, goResult }: LinksFn) => {
  const [config, setConfig] = useState<{
    list: DataType[];
    loading: boolean;
  }>({
    list: mockList,
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
          rev={undefined}
        />
      ),
      filterDropdown: <SearchItem name="name" />,
      render: (value: string, row: DataType) => {
        return (
          <Button
            type="link"
            onClick={() => goDetails && goDetails(row?.algorithmId, row)}
          >
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
          rev={undefined}
        />
      ),
      filterDropdown: <SearchItem name="creator" />,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      showSorterTooltip: false,
      sorter: (a: DataType, b: DataType) =>
        Number(a?.createTime) - Number(b?.createTime),
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
              <Button
                type="link"
                onClick={() => goResult && goResult(row?.algorithmId, row)}
              >
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
          <Button type="primary" onClick={goAdd}>
            新建算法配置
          </Button>
        ) : null}
      </div>
      <Table
        className={isFullList ? 'f_table' : 'e_table'}
        columns={columns}
        dataSource={config.list}
      />
      {!isFullList ? (
        <div className="e_node">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            imageStyle={{
              width: '64px',
              height: '40px',
              textAlign: 'center',
              display: 'inline-block',
            }}
            description={
              <>
                <div className="text">暂无数据</div>
                <Button type="primary" onClick={goAdd}>
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

const Add = ({ goList }: LinksFn) => {
  return (
    <div className="activePage">
      <div className="nav">
        <div
          className="link"
          onClick={() => {
            goList && goList();
          }}
        >
          算法配置列表
        </div>
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

const Edit = ({ goList, goDetails, name, id }: LinksFn) => {
  return (
    <div className="activePage">
      <div className="nav">
        <div
          className="link"
          onClick={() => {
            goList && goList();
          }}
        >
          算法配置列表
        </div>
        <div
          className="link"
          onClick={() => {
            goDetails && goDetails(id || '', {});
          }}
        >
          算法配置详情
        </div>
        <div className="normal">{name}</div>
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

const Detail = ({ goList, name, id, goEdit, goDetails }: LinksFn) => {
  return (
    <div className="activePage">
      <div className="nav">
        <div
          className="link"
          onClick={() => {
            goList && goList();
          }}
        >
          算法配置列表
        </div>

        <div className="normal">{name}</div>
      </div>
      <div className="content">
        <Descriptions
          className="activePageDescription"
          layout="horizontal"
          bordered={false}
          title={
            <div className="detailTitle">
              <div className="text">数据信息</div>
              <Button onClick={() => goEdit && goEdit(id || '', {})}>
                编辑
              </Button>
            </div>
          }
        >
          <Descriptions.Item label="算法配置名称">
            pagerank算法测试
          </Descriptions.Item>
          <Descriptions.Item label="边类型">全部类型</Descriptions.Item>
          <Descriptions.Item label="节点类型">全部类型</Descriptions.Item>
          <Descriptions.Item label="算法配置类型">内置算法</Descriptions.Item>
          <Descriptions.Item label="算法名称">
            广度优先搜索(bfs)
          </Descriptions.Item>
          <Descriptions.Item label="边类型">全部类型</Descriptions.Item>
          <Descriptions.Item label="src_id（起点ID）">
            84573949094205
          </Descriptions.Item>
          <Descriptions.Item label="target_id（目标ID）">
            85609505697-4835
          </Descriptions.Item>
          <Descriptions.Item label="iterations（迭代轮数）">
            10
          </Descriptions.Item>
          <Descriptions.Item label="输出数据源类型">
            写入TuGraph
          </Descriptions.Item>
          <Descriptions.Item label="图名称">会员欺诈分析图谱</Descriptions.Item>
          <Descriptions.Item label="写入到TuGraph的点/边/属性">
            common—_name
          </Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  );
};

const Result = ({ goList, name, id }: LinksFn) => {
  return (
    <div className="activePage">
      <div className="nav">
        <div
          className="link"
          onClick={() => {
            goList && goList();
          }}
        >
          算法配置列表
        </div>
        <div className="normal">{name}</div>
      </div>
      <div className="content">
        <Collapse
          bordered={false}
          className="activePageCollapse"
          defaultActiveKey={['0']}
          expandIcon={(props) => {
            return props?.isActive ? (
              <CaretUpOutlined rev="" style={{ fontSize: '14px' }} />
            ) : (
              <CaretDownOutlined rev="" style={{ fontSize: '14px' }} />
            );
          }}
        >
          {mockResultList.map((item, index) => {
            return (
              <Panel header={item?.algorithmName} key={index}>
                <Table
                  columns={Object.entries(item.data[0]).map(([key, value]) => ({
                    title: key,
                    render: () => value,
                    dataIndex: key,
                    key,
                  }))}
                  pagination={false}
                  dataSource={item?.data}
                />
              </Panel>
            );
          })}
        </Collapse>
      </div>
    </div>
  );
};
const AlgorithmConfig: React.FunctionComponent<IProps> = (props) => {
  const { GIAC } = props;
  const [rootConfig, setRootConfig] = useState<RootConfig>({
    modalOpen: GIAC?.visible || false,
    width: 1200,
    modalTitle: '算法配置',
    actionType: 'list',
    actionId: '',
    actionFormData: null,
  });
  const { updateContext, services, schemaData, graph } = useContext();
  const languageService: any = utils.getService(
    services,
    'GI/GI_SERVICE_SCHEMA'
  );
  languageService()?.then((d) => {
    console.log(d);
  });
  console.log(utils, useContext(), services, 'getSDK');

  const set = (values: Partial<RootConfig>) => {
    setRootConfig((pre: RootConfig) => ({ ...pre, ...values }));
  };
  const goList = () => {
    set({
      modalOpen: true,
      width: 1200,
      modalTitle: '算法配置列表',
      actionType: 'list',
    });
  };
  const goAdd = () => {
    set({
      modalOpen: true,
      width: 1148,
      modalTitle: '新建算法配置',
      actionType: 'add',
    });
  };

  const goDetails = (id: string, other: any) => {
    set({
      modalOpen: true,
      width: 1200,
      modalTitle: other?.name + '算法结果',
      actionType: 'detail',
      actionId: id,
    });
  };
  const goEdit = (id: string, other: any) => {
    set({
      modalOpen: true,
      width: 1148,
      modalTitle: '编辑',
      actionType: 'edit',
      actionId: id,
    });
  };
  const goResult = (id: string, other: any) => {
    set({
      modalOpen: true,
      width: window.document.documentElement.clientWidth,
      modalTitle: other?.name + '算法结果',
      actionType: 'result',
      actionId: id,
    });
  };
  const close = () => {
    set({ modalOpen: false });
  };

  const activeNodeMap = {
    list: (
      <List
        goAdd={goAdd}
        goList={goList}
        goDetails={goDetails}
        goResult={goResult}
      />
    ),
    add: (
      <Add
        goAdd={goAdd}
        goList={goList}
        goDetails={goDetails}
        goResult={goResult}
      />
    ),
    result: (
      <Result
        goAdd={goAdd}
        goList={goList}
        goDetails={goDetails}
        goResult={goResult}
        name={rootConfig?.modalTitle}
        id={rootConfig?.actionId}
      />
    ),
    detail: (
      <Detail
        goAdd={goAdd}
        goList={goList}
        goDetails={goDetails}
        goResult={goResult}
        name={rootConfig?.modalTitle}
        id={rootConfig?.actionId}
        goEdit={goEdit}
      />
    ),
    edit: (
      <Edit
        goAdd={goAdd}
        goList={goList}
        goDetails={goDetails}
        goResult={goResult}
        name={rootConfig?.modalTitle}
        id={rootConfig?.actionId}
        goEdit={goEdit}
      />
    ),
  };
  return (
    <>
      <GIAComponent GIAC={GIAC} onClick={goList} />
      <Button className="algorithmConfig" onClick={goList}>
        算法配置
      </Button>
      <Drawer
        open={rootConfig?.modalOpen}
        width={rootConfig?.width}
        title={rootConfig?.modalTitle}
        onClose={close}
      >
        {activeNodeMap[rootConfig?.actionType]}
      </Drawer>
    </>
  );
};

export default AlgorithmConfig;
