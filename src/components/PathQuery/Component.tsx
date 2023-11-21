import { CaretRightOutlined } from '@ant-design/icons';
import { findShortestPath } from '@antv/algorithm';
import NodeSelectionWrap from './NodeSelectionMode';
import { useContext } from '@antv/gi-sdk';
import { Button, Collapse, Empty, Form, Space, Switch, message } from 'antd';
import { enableMapSet } from 'immer';
import React, { memo, useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';
// import PanelExtra from './PanelExtra';
// import SegementFilter from './SegmentFilter';
import { IHighlightElement, IState } from './typing';
import { getPathByWeight } from './utils';
import './index.less';

import { StepComponent } from './StepComponent';
import { useState } from 'react';

const { Panel } = Collapse;

export interface IPathAnalysisProps {
  hasDirection: boolean;
  pathNodeLabel: string;
  controlledValues?: {
    source: string;
    target: string;
    direction: string;
  };
  onOpen: () => void;
}

enableMapSet();

const TuGraphPathQuery: React.FC<IPathAnalysisProps> = (props) => {
  const {
    pathNodeLabel,
    controlledValues,
    onOpen = () => {},
    hasDirection,
  } = props;
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
    hasChecked: new Map<number, boolean>(),
  });

  // 缓存被高亮的节点和边
  const highlightElementRef = useRef<IHighlightElement>({
    nodes: new Set(),
    edges: new Set(),
  });

  const [form] = Form.useForm();

  const handleResetForm = () => {
    form.resetFields();
    updateState((draft) => {
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
    form.validateFields().then((values) => {
      cancelHighlight();
      const { source, target, direction = false } = values;
      try {
        const { allPath: allNodePath, allEdgePath }: any = findShortestPath(
          graphData,
          source,
          target,
          direction
        );
        if (!allNodePath?.length) {
          let info = '无符合条件的路径';
          if (direction) {
            info = `${info}，可尝试将“是否有向”设置为“无向”，或改变起点与终点`;
          } else {
            info = `${info}，可尝试改变起点与终点`;
          }
          message.info(info);

          updateState((draft) => {
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

          return;
        }
        const highlightPath = new Set<number>(
          allNodePath.slice(0, 1).map((_, index) => index)
        );
        const defaultChecked = new Map<number, boolean>();
        defaultChecked.set(0, true);

        updateState((draft) => {
          draft.allNodePath = allNodePath;
          draft.allEdgePath = allEdgePath;
          draft.nodePath = allNodePath;
          draft.edgePath = allEdgePath;
          draft.isAnalysis = true;
          draft.highlightPath = highlightPath;
          draft.hasChecked = defaultChecked;
          draft.filterRule = {
            type: 'All-Path',
          };
          draft.selecting = '';
        });
      } catch (error) {
        console.log(`错误信息：${error}`);
      }
    });
  };

  const onSwitchChange = (pathId: number) => {
    const pathSet = new Set<number>(state.highlightPath);
    if (state.highlightPath.has(pathId)) {
      pathSet.delete(pathId);
    } else {
      pathSet.add(pathId);
    }

    updateState((draft) => {
      draft.highlightPath = pathSet;
    });
  };

  // 取消所有节点和边的高亮状态
  const cancelHighlight = () => {
    [...highlightElementRef.current?.nodes].forEach((nodeId) => {
      graph.findById(nodeId) && graph.setItemState(nodeId, 'active', false);
    });
    [...highlightElementRef.current.edges].forEach((edgeId) => {
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
      if (state.edgePath && state.nodePath) {
        const nodes = [...state.nodePath[i]];
        const edges = [...state.edgePath[i]];
        if (nodes.length && edges.length) {
          if (!state?.highlightPath?.has(i)) {
            nodes.forEach((nodeId) => {
              graph.findById(nodeId) &&
                graph.setItemState(nodeId, 'active', false);
              highlightElementRef.current?.nodes?.delete(nodeId);
            });
            edges.forEach((edgeId) => {
              graph.findById(edgeId) &&
                graph.setItemState(edgeId, 'active', false);
              highlightElementRef.current?.edges.delete(edgeId);
              graph.updateItem(edgeId, {
                style: {
                  animate: null,
                },
              });
            });
          }
        }
      }
    }

    for (let i = 0; i < state.nodePath.length; i++) {
      if (state.edgePath && state.nodePath) {
        const nodes = [...state.nodePath[i]];
        const edges = [...state.edgePath[i]];
        if (nodes.length && edges.length) {
          if (state?.highlightPath?.has(i)) {
            nodes.forEach((nodeId) => {
              graph.findById(nodeId) &&
                graph.setItemState(nodeId, 'active', true);
              highlightElementRef.current?.nodes.add(nodeId);
            });
            edges.forEach((edgeId) => {
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
          ? getPathByWeight(
              path,
              state.filterRule.weightPropertyName,
              sourceDataMap
            )
          : path.length;
        minLen = Math.min(minLen, len);
        pathLenMap[pathId] = len;
      });

      nodePath = state.allNodePath.filter(
        (_, pathId) => pathLenMap[pathId] === minLen
      );
      edgePath = state.allEdgePath.filter(
        (_, pathId) => pathLenMap[pathId] === minLen
      );
    } else if (
      state.filterRule.type === 'Edge-Type-Filter' &&
      state.filterRule.edgeType
    ) {
      const validPathId = new Set();
      state.allEdgePath.forEach((path, pathId) => {
        const isMatch = path.every((edgeId) => {
          const edgeConfig = sourceDataMap.edges[edgeId];
          return edgeConfig?.edgeType === state.filterRule.edgeType;
        });
        if (isMatch) {
          validPathId.add(pathId);
        }
      });
      nodePath = state.allNodePath.filter((_, pathId) =>
        validPathId.has(pathId)
      );
      edgePath = state.allEdgePath.filter((_, pathId) =>
        validPathId.has(pathId)
      );
    } else {
      nodePath = state.allNodePath;
      edgePath = state.allEdgePath;
    }

    updateState((draft) => {
      draft.nodePath = nodePath;
      draft.edgePath = edgePath;
      draft.highlightPath = new Set(
        nodePath.slice(0, 1).map((_, index) => index)
      );
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
    {
      name: 'source',
      label: '起始节点',
      autoFocus: true,
    },
    {
      name: 'target',
      label: '目标节点',
    },
  ];

  const handlePanelClick = (index) => {
    const checked = state.highlightPath.has(index);
    const maps = new Map<number, boolean>(state.hasChecked);
    maps.set(index, !checked);

    updateState((draft) => {
      draft.hasChecked = maps;
    });
    onSwitchChange(index);
  };

  return (
    <div className="tugraph-path-analysis">
      <div className="tugraph-path-analysis-form">
        <div className="tugraph-path-analysis-container">
          <div className="tugraph-path-analysis-title">路径配置</div>
          <Form form={form}>
            <NodeSelectionWrap
              graph={graph}
              form={form}
              items={items}
              data={graphData.nodes}
              nodeLabel={pathNodeLabel}
            />

            <Form.Item
              style={{ height: 30, marginBottom: 8 }}
              name="direction"
              label="是否有向"
              colon={false}
            >
              <Switch
                size="small"
                style={{ position: 'absolute', left: 8, top: 8 }}
              />
            </Form.Item>
          </Form>
        </div>

        {state.nodePath.length > 0 && (
          <div className="tugraph-path-analysis-result-container">
            <div className="tugraph-path-analysis-title">
              <div>分析结果</div>
            </div>
            <Collapse
              defaultActiveKey={0}
              ghost={true}
              collapsible="icon"
              className="tugraph-collapse-container"
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
            >
              {state.nodePath.map((path, index) => {
                return (
                  <Panel
                    // @ts-ignore
                    onClick={() => handlePanelClick(index)}
                    key={index}
                    header={`路径 ${index + 1}`}
                    className="tugraph-collapse-container-panel"
                    style={{
                      border: state.hasChecked.get(index)
                        ? '1px solid rgba(22, 80, 255, 1)'
                        : '1px solid rgba(22, 80, 255, 0.2)',
                    }}
                    // extra={
                    //   <PanelExtra pathId={index} highlightPath={state.highlightPath} onSwitchChange={onSwitchChange} />
                    // }
                  >
                    <StepComponent path={path} />
                  </Panel>
                );
              })}
            </Collapse>
          </div>
        )}

        {state.isAnalysis && state.nodePath.length === 0 && <Empty />}
      </div>

      <Space className="path-query-btn-group">
        <Button onClick={handleResetForm}>重置</Button>
        <Button type="primary" onClick={handleSearch}>
          查询
        </Button>
      </Space>
    </div>
  );
};

export default memo(TuGraphPathQuery);
