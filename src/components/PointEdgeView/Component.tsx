import React, { useEffect } from 'react';
import { useContext } from '@antv/gi-sdk';
import { useImmer } from 'use-immer';
import './index.less';

const PointEdgeView = () => {
  const {
    data: { nodes, edges },
    graph,
  } = useContext();
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
  const nodeTypesSet = (): any[] => {
    const result: any[] = [];
    const keys: string[] = [];
    nodes.forEach(item => {
      if (keys.includes(item?.nodeType) || item?.nodeType === '-') {
        if (typeMap[item?.nodeType]) {
          Array.isArray(typeMap[item?.nodeType]) && typeMap[item?.nodeType].push(item?.id);
        } else {
          typeMap[item?.nodeType] = [item?.id];
        }
      } else {
        keys.push(item?.nodeType);
        result.push(item);
      }
    });
    return result;
  };
  const edgesTypesSet = () => {
    const edgesKeys: string[] = [];
    const edgesTypeMap = {};
    edges.forEach(item => {
      const node1 = nodes.find(i => item?.source === i?.id);
      const node2 = nodes.find(i => item?.target === i?.id);
      const type = `__${item?.edgeType}__-${node1?.nodeType}=>${node2?.nodeType}-`;
      const map = edgesTypeMap;
      if (map && Array.isArray(map[type])) {
        map[type].push(item);
      } else {
        edgesKeys.push(type);
        map[type] = [item];
      }
    });
    return edgesTypeMap;
  };
  const onClickType = type => {
    nodes.forEach(node => {
      const hasMatch = typeMap[type].includes(node?.id);
      if (hasMatch) {
        graph.setItemState(node.id, 'disabled', false);
        graph.setItemState(node.id, 'selected', true);
      } else {
        graph.setItemState(node.id, 'selected', false);
        graph.setItemState(node.id, 'disabled', true);
      }
    });
  };
  const handleViewCard = () => {};
  const PointList = () => {
    return (
      <>
        {nodeTypesSet().map((item: any) => {
          const num = nodes.filter(i => i?.nodeType === item?.nodeType).length || 0;
          return (
            <div className="listItem">
              <div className="left">
                <div className="icon" style={{ backgroundColor: item?.style?.keyshape?.fill }}></div>
                <div className="text">{item?.nodeType}</div>
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
      console.log(edges, nodes, edgesTypesSet());
    }, [edges, nodes]);
    return (
      <>
        {Object.keys(edgesTypesSet()).map(key => {
          const reg = /\__[^\__]+\__/g;
          const reg1 = /\-[^\-]+\-/g;
          let title: string = '';
          let connect: any = '';
          let match: RegExpMatchArray | null = key.match(reg);
          let match1: RegExpMatchArray | null = key.match(reg1);
          if (match && Array.isArray(match)) {
            title = match[0].slice(2, -2);
          }
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
    useEffect(() => {}, [state.viewType, state.nodeType]);
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
          <div className="nodesItem" onClick={() => onClickType(item?.nodeType)}>
            <div className="icon" style={{ backgroundColor: item?.style?.keyshape?.fill }}></div>
            <div className="text">{item?.nodeType}</div>
          </div>
        );
      })}
      <div className="openIcon" onClick={handleViewCard}></div>
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
    </div>
  );
};

export default PointEdgeView;
