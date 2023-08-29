import { Form, Button, Popconfirm } from 'antd';
import React, { useState, useEffect } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import FilterSelection from './StatisticsEditForm/index';
import { HistogramOpt } from './StatisticsEditForm/type';
import { nanoid } from 'nanoid';
import { useContext, utils } from '@antv/gi-sdk';
import { filterGraphData, highlightSubGraph } from './StatisticsEditForm/utils';
import { getQueryString } from '../utils';
import './index.less';

export interface StatisticsFilterProps {
  histogramOptions?: HistogramOpt;
  schemaServiceId?: any;
}

const StatisticsFilter: React.FC<StatisticsFilterProps> = ({ histogramOptions, schemaServiceId }) => {
  const id = nanoid();
  const [form] = Form.useForm();
  const [filterdata, setFilterData] = useState({
    [id]: { defaultKey: undefined, histogramOptions: undefined, id, isFilterReady: false },
  });
  const { updateContext, services, graph, data } = useContext();
  const schemaService = utils.getService(services, schemaServiceId);
  const [schemaList, setSchemaList] = useState<{
    nodes: any[];
    edges: any[];
  }>({
    nodes: [],
    edges: []
  });

  const graphName = getQueryString('graphName')

  const queryGraphSchema = async () => {
    if (!schemaService || !graphName) {
      return;
    }
    const result = await schemaService(graphName);
    const { data } = result;
    setSchemaList(data);
  };

  useEffect(() => {
    queryGraphSchema();
  }, [graphName]);

  const addPanel = (defaultKey?: string, filterProps = {}) => {
    const filterCriteria = {
      id,
      defaultKey,
      histogramOptions,
      isFilterReady: false,
      ...filterProps,
    };

    // @ts-ignore
    setFilterData(preState => {
      return {
        ...preState,
        [id]: filterCriteria,
      };
    });

    // 滚动到新增的 panel 位置
    setTimeout(() => {
      const dom = document.getElementById(`panel-${filterCriteria.id}`);
      if (dom) dom.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
    return filterCriteria;
  };

  const handleFilterOptionsChange = (options) => {
    let defaultData = {
      nodes: [],
      edges: [],
    } as any;

    Object.values(options).map(filterCriteria => {
      const newData = filterGraphData(data, filterCriteria as any, true);
      defaultData.nodes = [...defaultData.nodes, ...newData.nodes];
      defaultData.edges = [...defaultData.edges, ...newData.edges];
    });

    // 去重
    defaultData.nodes = utils.uniqueElementsBy(defaultData.nodes, (n1, n2) => n1.id === n2.id);
    defaultData.edges = utils.uniqueElementsBy(defaultData.edges, (e1, e2) => e1.id === e2.id);

    const { isEmpty, isFull } = highlightSubGraph(graph, defaultData);

    updateContext(draft => {
      //@ts-ignore
      draft.persistentHighlight = !isEmpty && !isFull;
    });
  };

  useEffect(() => {
    handleFilterOptionsChange(filterdata);
  }, [filterdata]);

  //删除事件
  const handleDelete = (index: string) => (
    <Popconfirm
      title="你确定要删除吗?"
      placement="topRight"
      okText="确认"
      cancelText="取消"
      onConfirm={() => {
        setFilterData(preState => {
          const newFilterOptions = {};
          for (let key in preState) {
            if (key !== index) {
              newFilterOptions[key] = preState[key];
            }
          }
          return newFilterOptions;
        });
      }}
    >
      <CloseOutlined
        onClick={event => {
          event.stopPropagation();
        }}
      />
    </Popconfirm>
  );

  const updateFilterCriteria = (id: string, filterCriteria: any) => {
    setFilterData(preState => {
      const newFilterOptions = {
        ...preState,
        [id]: filterCriteria,
      };
      return newFilterOptions;
    });
  };

  const handleReset = () => {
    form.resetFields()
    setFilterData(() => {
      const defaultFilterOptions = {
        [id]: { defaultKey: undefined, histogramOptions: undefined, id, isFilterReady: false },
      };
      return defaultFilterOptions;
    });
  }

  return (
    <div className='statictics-filter-container'>
      <Form form={form} layout="vertical">
        {Object.values(filterdata).map((filterCriteria, index) => {
          return (
            <FilterSelection
              filterCriteria={filterCriteria}
              updateFilterCriteria={updateFilterCriteria}
              removeFilterCriteria={handleDelete}
              schemaList={schemaList}
            />
          );
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
            onClick={handleReset}
          >
            重置
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default StatisticsFilter
