import React, { useEffect } from 'react';
import { useContext } from '@antv/gi-sdk';
import { useImmer } from 'use-immer';
import { Pie } from '@antv/g2plot';
import './index.less';
import { deepClone, getSetArray } from '../utils';

const reg = /\+[^\+]+\+/g;
const reg1 = /\<[^\<]+\>/g;

const PointEdgeView = () => {
  const { data, graph } = useContext();
  const copyData = deepClone(data);
  if (data) {
    copyData.nodes = getSetArray(data.nodes);
    copyData.edges = getSetArray(data.edges);
  }

  const { nodes, edges } = copyData;
  const typeMap: any = {};
  const [state, setState] = useImmer<{
    visible: boolean;
    viewType: string;
    nodeType: string;
  }>({
    visible: false,
    viewType: 'list',
    nodeType: 'nodes',
  });

  if (nodes.length === 0) {
    return null;
  }

  const nodeTypesSet = (): any[] => {
    const result: any[] = [];
    const keys: string[] = [];
    const num: any = {};
    nodes.forEach((i: any) => {
      if (num[i?.label]) {
        num[i?.label] = num[i?.label] + 1;
      } else {
        num[i?.label] = 1;
      }
    });
    nodes.forEach((item: any) => {
      if (keys.includes(item?.label)) {
        if (typeMap[item?.label]) {
          Array.isArray(typeMap[item?.label]) && typeMap[item?.label].push(item?.id);
        } else {
          typeMap[item?.label] = [item?.id];
        }
      } else {
        keys.push(item?.label);
        result.push({ ...item, num: num[item?.label] || 0 });
      }
    });
    return result;
  };
  const edgesTypesSet = () => {
    const edgesKeys: string[] = [];
    const edgesTypeMap = {};
    edges.forEach((item: any) => {
      const node1: any = nodes.find((i: any) => item?.source === i?.id);
      const node2: any = nodes.find((i: any) => item?.target === i?.id);

      const type = `+${item?.label}+<${node1?.label}=>${node2?.label}>`;
      const map = edgesTypeMap;
      if (map && Array.isArray(map[type])) {
        if (item?.label) map[type].push(item);
      } else {
        if (item?.label) {
          edgesKeys.push(type);
          map[type] = [item];
        }
      }
    });
    return edgesTypeMap;
  };

  const onClickType = type => {
    nodes.forEach((node: any) => {
      const hasMatch = typeMap[type].includes(node?.id);
      if (hasMatch) {
        graph.setItemState(node?.id, 'disabled', false);
        graph.setItemState(node?.id, 'selected', true);
      } else {
        graph.setItemState(node?.id, 'selected', false);
        graph.setItemState(node?.id, 'disabled', true);
      }
    });
  };

  const handleViewCard = () => {
    setState((pre: any) => ({
      ...pre,
      visible: !pre?.visible,
    }));
  };

  const getChartEdges = () => {
    const num: any = {};
    Array.isArray(edges) &&
      edges.forEach((i: any) => {
        if (num[i?.label] || num['other']) {
          num[i?.label] = num[i?.label] + 1;
        } else {
          num[i?.label || 'other'] = 1;
        }
      });

    return Object.keys(num).map((k: string) => ({ label: k, num: num[k], ...num[k], id: k }));
  };

  const PointList = () => {
    return (
      <>
        {nodeTypesSet().map((item: any) => {
          const num = nodes.filter((i: any) => i?.label === item?.label).length || 0;
          return (
            <div className="listItem">
              <div className="left">
                <div className="icon" style={{ backgroundColor: item?.style?.keyshape?.fill }}></div>
                <div className="text">{item?.label}</div>
              </div>
              <div className="right">{num}</div>
            </div>
          );
        })}
      </>
    );
  };
  const EdgesList = () => {
    useEffect(() => {
      edgesTypesSet();
      console.log(edges, nodes);
    }, [edges, nodes]);

    return (
      <>
        {Object.keys(edgesTypesSet()).map(key => {
          let title: string = '';
          let match: RegExpMatchArray | null = key.match(reg);
          if (match && Array.isArray(match)) {
            title = match[0].slice(1, -1);
          }

          let connect: any = '';
          let match1: RegExpMatchArray | null = key.match(reg1);
          if (match1 && Array.isArray(match1)) {
            connect = match1[0].slice(1, -1);
          }
          return (
            <div className="listEdgesItem" key={key} id={key}>
              <div className="top">
                <div className="left">
                  <img
                    className="icon"
                    src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*FNcZS7syqSgAAAAAAAAAAAAADgOBAQ/original"
                  />
                  <div className="text">{title}</div>
                </div>
                <div className="right">{edgesTypesSet()[key]?.length || 0}</div>
              </div>
              <div className="bottom">
                <div className="text">{connect.split('=>')[0]}</div>
                <img
                  className="icon"
                  src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*56j9R7qx258AAAAAAAAAAAAADgOBAQ/original"
                />
                <div className="text">{connect.split('=>')[1]}</div>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  const listMap = {
    nodes: <PointList />,
    edges: <EdgesList />,
  };

  const List = () => {
    return <div className="list">{listMap[state.nodeType]}</div>;
  };

  const Chart = () => {
    const dataMap = {
      nodes: nodeTypesSet(),
      edges: getChartEdges(),
    };
    const labelMap = {
      nodes: {
        angleField: 'num',
        colorField: 'label',
      },
      edges: {
        angleField: 'num',
        colorField: 'label',
      },
    };
    useEffect(() => {
      const piePlot = new Pie('chartContainer', {
        appendPadding: 0,
        data: dataMap[state.nodeType],
        ...labelMap[state.nodeType],
        radius: 0.9,
        autoFit: true,
        height: 200,
        label: {
          type: 'inner',
          offset: '-30%',
          content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
          style: {
            fontSize: 14,
            textAlign: 'center',
          },
        },
        interactions: [{ type: 'element-active' }],
      });

      piePlot.render();
    }, [state.viewType, state.nodeType]);

    return <div className="chart" id="chartContainer"></div>;
  };

  const nodeMap = {
    list: <List />,
    chart: <Chart />,
  };

  return (
    <div className="pointEdgeView">
      {nodeTypesSet().map(item => {
        return (
          <div className="nodesItem" onClick={() => onClickType(item?.label)}>
            <div className="icon" style={{ backgroundColor: item?.style?.keyshape?.fill }}></div>
            <div className="text">{item?.label}</div>
          </div>
        );
      })}
      <div className="openIcon" onClick={handleViewCard}>
        <img src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*PqUJQbFoOEYAAAAAAAAAAAAADgOBAQ/original" />
      </div>
      {state?.visible ? (
        <div className="pointEdgeViewCard">
          <div className="type">
            <div className="nodeType">
              <div
                className={state.nodeType === 'nodes' ? 'typeActive' : 'typeNormal'}
                onClick={() => {
                  setState(pre => {
                    pre.nodeType = 'nodes';
                  });
                }}
              >
                <span className="text">点</span>
                <span className="num">{nodes.length || 0}</span>
              </div>
              <div
                className={state.nodeType === 'edges' ? 'typeActive' : 'typeNormal'}
                onClick={() => {
                  setState(pre => {
                    pre.nodeType = 'edges';
                  });
                }}
              >
                <span className="text">边</span>
                <span className="num">{edges.length || 0}</span>
              </div>
            </div>
            <div className="viewType">
              <div
                className={state.viewType === 'list' ? 'viewTypeActive' : 'viewTypeNormal'}
                onClick={() => {
                  setState(pre => {
                    pre.viewType = 'list';
                  });
                }}
              >
                <img
                  src={
                    state.viewType === 'list'
                      ? 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*ZZnQQbkMOXUAAAAAAAAAAAAADgOBAQ/original'
                      : 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*_1EcSZO-vDYAAAAAAAAAAAAADgOBAQ/original'
                  }
                  className="icon"
                />
              </div>
              <div
                className={state.viewType === 'chart' ? 'viewTypeActive' : 'viewTypeNormal'}
                onClick={() => {
                  setState(pre => {
                    pre.viewType = 'chart';
                  });
                }}
              >
                <img
                  src={
                    state.viewType === 'chart'
                      ? 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*Ch_7QLyu7ZMAAAAAAAAAAAAADgOBAQ/original'
                      : 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*Ch_7QLyu7ZMAAAAAAAAAAAAADgOBAQ/original'
                  }
                  className="icon"
                />
              </div>
            </div>
          </div>
          {nodeMap[state.viewType]}
        </div>
      ) : null}
    </div>
  );
};

export default PointEdgeView;
