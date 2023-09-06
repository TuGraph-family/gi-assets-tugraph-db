import { CaretRightOutlined } from '@ant-design/icons';
import { findShortestPath } from '@antv/algorithm';
import NodeSelectionWrap from './NodeSelectionMode';
import { useContext } from '@antv/gi-sdk';
import { Button, Col, Collapse, Empty, Form, InputNumber, Row, Space, Switch, Timeline, message } from 'antd';
// import { enableMapSet } from 'immer';
import React, { memo, useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';
import PanelExtra from './PanelExtra';
import SegementFilter from './SegmentFilter';
import './index.less';
import { IHighlightElement, IState } from './typing';
import { getPathByWeight } from './utils';

const { Panel } = Collapse;

export interface IPathAnalysisProps {
  hasDirection: boolean;
  nodeSelectionMode: string[];
  pathNodeLabel: string;
  controlledValues?: {
    source: string;
    target: string;
    direction: string;
  };
  onOpen: () => void;
}

// enableMapSet();

const TuGraphPathQuery: React.FC<IPathAnalysisProps> = props => {
  const { nodeSelectionMode, pathNodeLabel, controlledValues, onOpen = () => {}, hasDirection } = props;
  const { data: graphData, graph, sourceDataMap } = useContext();

  const [state, updateState] = useImmer<IState>({
    allNodePath: [],
    allEdgePath: [],
    nodePath: [],
    edgePath: [],
    highlightPath: new Set<number>(),
    isAnalysis: false,
    filterRule: {
      type: 'All-Path',
    },
    selecting: '',
  });
  let nodeClickListener = e => {};

  // 缓存被高亮的节点和边
  const highlightElementRef = useRef<IHighlightElement>({
    nodes: new Set(),
    edges: new Set(),
  });

  const [form] = Form.useForm();

  const handleResetForm = () => {
    form.resetFields();
    updateState(draft => {
      draft.allNodePath = [];
      draft.allEdgePath = [];
      draft.nodePath = [];
      draft.edgePath = [];
      draft.highlightPath = new Set();
      draft.isAnalysis = false;
      draft.filterRule = {
        type: 'All-Path',
      };
      draft.selecting = '';
    });
    cancelHighlight();
  };

  const handleSearch = () => {
    form.validateFields().then(values => {
      cancelHighlight();
      const { source, target, direction = false } = values;
      try {
        const { allPath: allNodePath, allEdgePath }: any = findShortestPath(graphData, source, target, direction);
        if (!allNodePath?.length) {
          let info ='无符合条件的路径';
          if (direction) {
            info = '{info}，可尝试将“是否有向”设置为“无向”，或改变起点与终点';
          } else {
            info = '{info}，可尝试改变起点与终点';
          }
          message.info(info);

          return;
        }
        const highlightPath = new Set<number>(allNodePath.map((_, index) => index));

        updateState(draft => {
          draft.allNodePath = allNodePath;
          draft.allEdgePath = allEdgePath;
          draft.nodePath = allNodePath;
          draft.edgePath = allEdgePath;
          draft.isAnalysis = true;
          draft.highlightPath = highlightPath;
          draft.filterRule = {
            type: 'All-Path',
          };
          draft.selecting = '';
        });

      } catch (error) {
        console.log(`错误信息：${error}`)
      }
    });
  };

  const onSwitchChange = (pathId: number) => {
    updateState(draft => {
      if (draft.highlightPath.has(pathId)) {
        draft.highlightPath.delete(pathId);
      } else {
        draft.highlightPath.add(pathId);
      }
    });
  };

  // 取消所有节点和边的高亮状态
  const cancelHighlight = () => {
    [...highlightElementRef.current?.nodes].forEach(nodeId => {
      graph.findById(nodeId) && graph.setItemState(nodeId, 'active', false);
    });
    [...highlightElementRef.current.edges].forEach(edgeId => {
      // graph.findById(edgeId) && graph.setItemState(edgeId, 'active', false);
      if (graph.findById(edgeId)) {
        graph.setItemState(edgeId, 'active', false);
        graph.updateItem(edgeId, {
          style: {
            animate: {
              visible: false,
              type: 'circle-running',
              color: 'red',
              repeat: true,
              duration: 1000,
            },
          },
        });
      }
    });
  };

  useEffect(() => {
    for (let i = 0; i < state.nodePath.length; i++) {
      const nodes = state.nodePath[i];
      const edges = state.edgePath[i];

      if (!state.highlightPath.has(i)) {
        nodes.forEach(nodeId => {
          graph.findById(nodeId) && graph.setItemState(nodeId, 'active', false);
          highlightElementRef.current?.nodes.delete(nodeId);
        });

        edges.forEach(edgeId => {
          graph.findById(edgeId) && graph.setItemState(edgeId, 'active', false);
          highlightElementRef.current?.edges.delete(edgeId);
        });
      }
    }

    for (let i = 0; i < state.nodePath.length; i++) {
      const nodes = state.nodePath[i];
      const edges = state.edgePath[i];
      if (state.highlightPath.has(i)) {
        nodes.forEach(nodeId => {
          graph.findById(nodeId) && graph.setItemState(nodeId, 'active', true);
          highlightElementRef.current?.nodes.add(nodeId);
        });
        edges.forEach(edgeId => {
          // graph.findById(edgeId) && graph.setItemState(edgeId, 'active', true);
          if (graph.findById(edgeId)) {
            graph.setItemState(edgeId, 'active', true);
            graph.updateItem(edgeId, {
              style: {
                animate: {
                  visible: true,
                  type: 'circle-running',
                  color: 'red',
                  repeat: true,
                  duration: 1000,
                },
              },
            });
          }
          highlightElementRef.current?.edges.add(edgeId);
        });
      }
    }
  }, [state.highlightPath]);

  // 过滤逻辑副作用
  useEffect(() => {
    cancelHighlight();
    highlightElementRef.current = { nodes: new Set(), edges: new Set() };

    let nodePath: string[][] = [];
    let edgePath: string[][] = [];
    if (state.filterRule.type === 'Shortest-Path') {
      const pathLenMap = {};
      let minLen = Infinity;
      state.allEdgePath.forEach((path, pathId) => {
        const len = state.filterRule.weightPropertyName
          ? getPathByWeight(path, state.filterRule.weightPropertyName, sourceDataMap)
          : path.length;
        minLen = Math.min(minLen, len);
        pathLenMap[pathId] = len;
      });

      nodePath = state.allNodePath.filter((_, pathId) => pathLenMap[pathId] === minLen);
      edgePath = state.allEdgePath.filter((_, pathId) => pathLenMap[pathId] === minLen);
    } else if (state.filterRule.type === 'Edge-Type-Filter' && state.filterRule.edgeType) {
      const validPathId = new Set();
      state.allEdgePath.forEach((path, pathId) => {
        const isMatch = path.every(edgeId => {
          const edgeConfig = sourceDataMap.edges[edgeId];
          return edgeConfig?.edgeType === state.filterRule.edgeType;
        });
        if (isMatch) {
          validPathId.add(pathId);
        }
      });
      nodePath = state.allNodePath.filter((_, pathId) => validPathId.has(pathId));
      edgePath = state.allEdgePath.filter((_, pathId) => validPathId.has(pathId));
    } else {
      nodePath = state.allNodePath;
      edgePath = state.allEdgePath;
    }

    updateState(draft => {
      draft.nodePath = nodePath;
      draft.edgePath = edgePath;
      draft.highlightPath = new Set(nodePath.map((_, index) => index));
    });
  }, [state.allNodePath, state.allEdgePath, state.filterRule]);

  useEffect(() => {
    handleResetForm();
  }, [graphData]);

  /**
   * 外部控制参数变化，进行分析
   * e.g. ChatGPT，历史记录模版等
   */
  useEffect(() => {
    if (controlledValues) {
      const { source, target, direction } = controlledValues;
      onOpen();
      form.setFieldsValue({
        source,
        target,
        direction: direction !== 'false',
      });
      handleSearch();
    }
  }, [controlledValues]);

  const items = [
    { name: 'source', label: '起始节点' },
    {
      name: 'target',
      label: '目标节点',
    },
  ];

  return (
    <div className='tugraph-path-analysis'>
      <div className="tugraph-path-analysis-form">
        <div className="tugraph-path-analysis-container">
          <div className="tugraph-path-analysis-title">
          路径配置
          </div>
          <Form form={form}>
            <NodeSelectionWrap
              graph={graph}
              form={form}
              items={items}
              data={graphData.nodes}
              nodeLabel={pathNodeLabel}
              nodeSelectionMode={nodeSelectionMode}
            />

            {hasDirection && (
              <Form.Item
                wrapperCol={{ span: 24 }}
                labelCol={{ span: 24 }}
                name="direction"
                label='是否有向'
              >
                <Switch
                  checkedChildren='有向'
                  unCheckedChildren='无向'
                  defaultChecked
                />
              </Form.Item>
            )}

            <Form.Item
              name="maxdeep"
              label='最大深度'
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
            >
              <InputNumber min={1} max={50} placeholder='请输入最大深度（上限50）' style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </div>

        {state.nodePath.length > 0 && (
          <div className="tugraph-path-analysis-result-container">
            <div className="tugraph-path-analysis-title">
              <div>查询结果</div>
              <SegementFilter state={state} updateState={updateState} />
            </div>
            <Collapse
              defaultActiveKey={0}
              ghost={true}
              className="tugraph-collapse-container"
              expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            >
              {state.nodePath.map((path, index) => {
                return (
                  <Panel
                    key={index}
                    header={`路径 ${index + 1}`}
                    className="tugraph-collapse-container-panel"
                    // extra={
                    //   <PanelExtra pathId={index} highlightPath={state.highlightPath} onSwitchChange={onSwitchChange} />
                    // }
                  >
                    <Timeline>
                      {path.map(nodeId => {
                        const nodeConfig = sourceDataMap.nodes[nodeId];
                        const data = nodeConfig?.data || {};
                        return <Timeline.Item>{data[pathNodeLabel] || nodeId}</Timeline.Item>;
                      })}
                    </Timeline>
                  </Panel>
                );
              })}
            </Collapse>
          </div>
        )}

        {state.isAnalysis && state.nodePath.length === 0 && <Empty />}
      </div>
      <Space className='path-query-btn-group'>
        <Button onClick={handleResetForm}>
          重置
        </Button>
        <Button type="primary" onClick={handleSearch}>
          查询
        </Button>
      </Space>
    </div>
  );
};

export default memo(TuGraphPathQuery);
