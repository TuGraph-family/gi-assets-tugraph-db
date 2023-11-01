import { useContext, icons } from '@antv/gi-sdk';
import { Form, Input, Menu, message, Modal, Radio, Dropdown } from 'antd';
import React, { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import type { MenuProps } from 'antd';
import { deepClone } from '../../utils';
import './index.less';

const Item: any = Menu.Item;

export const NODE_ICON_HISTORY = 'NODE_ICON_HISTORY';
export const NODE_ICON_MAPPING = 'NODE_ICON_MAPPING';

export interface AddIconLabelProps {
  contextmenu: any;
}
const resetEvent = e => {
  e.stopPropagation();
  e.preventDefault();
};
export const Colors = ['#7E92B5', '#9661BC', '#7262FD', '#F6BD16', '#F6903D', '#F08BB4'];
const defaultLabel = { fill: Colors[0], value: '' };
const getLocalMap = (key = NODE_ICON_MAPPING, origin = {}) => {
  return JSON.parse(`${localStorage.getItem(key)}`) || origin;
};

const setLocalMap = (nodeIconMapping, key = NODE_ICON_MAPPING) => {
  localStorage.setItem(key, JSON.stringify(nodeIconMapping));
};

const AddIconLabel: React.FunctionComponent<AddIconLabelProps> = props => {
  const { contextmenu } = props;
  const { updateContext, graph, data: graphData } = useContext();

  const getSelectNodes = (): any[] => {
    return graph.findAllByState('node', 'selected') as any[];
  };

  const getLabelList = (): any[] => {
    const result: any[] = [];
    const selectNode = getSelectNodes();
    if (selectNode.length) {
      selectNode.forEach((item, index) => {
        const id = item ? item?.getID() : '';
        const localMap = getLocalMap(NODE_ICON_MAPPING, {});
        const currentNodeLabelList: any[] = localMap[id];
        if (currentNodeLabelList?.length) {
          currentNodeLabelList?.forEach(it => {
            result.push({ ...it, parentId: id, actionType: 'get' });
          });
        }
      });
    }
    return result;
  };

  const currentItem = contextmenu.item;
  if (!currentItem || currentItem.destroyed) {
    return null;
  }
  const LabelNodeHistoryEdit = (props: any) => {
    const {
      editNodeState: { fill = Colors[0], value = '', type = 'font', id, parentId },
      onCancel,
      onConfirm,
      originType,
      display = false,
    } = props;
    const [editState, setEditState] = useState<any>({
      fill: fill || Colors[0],
      value,
      type,
      id,
      parentId,
    });
    const isText = originType === 'text';
    const publicNode = (
      <>
        <img
          className="cancelEdit"
          src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*vZ7LRISuzR8AAAAAAAAAAAAADgOBAQ/original"
          onClick={onCancel}
        />
        <img
          className="confirmEdit"
          src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*BRkKSKAzJXsAAAAAAAAAAAAADgOBAQ/original"
          onClick={() => onConfirm(editState)}
        />
      </>
    );
    useEffect(() => {
      setEditState(props.editNodeState);
    }, [props.editNodeState]);
    return (
      <>
        {display ? (
          <div className="labelNodeHistoryEdit">
            {isText ? (
              <div className="labelNodeHistoryEditContent">
                {isText ? (
                  <Input
                    maxLength={20}
                    className="labelNodeHistoryInput"
                    value={editState.value}
                    onChange={e => {
                      setEditState({ ...editState, value: e.target.value });
                    }}
                  />
                ) : null}
                {publicNode}
              </div>
            ) : null}
            <div className="tugraph-label-icon-radioItem">
              <Radio.Group
                value={editState?.fill}
                defaultValue={Colors[0]}
                onChange={e => {
                  setEditState({ ...editState, fill: e.target.value });
                }}
              >
                {Colors.map(color => (
                  <Radio key={color} value={color} style={{ background: color }} />
                ))}
              </Radio.Group>
              {!isText ? publicNode : null}
            </div>
            {getLocalMap(NODE_ICON_HISTORY, []).length && isText ? (
              <div className="labelNodeHistoryList">
                {[...getLocalMap(NODE_ICON_HISTORY, [])].map(item => {
                  return (
                    <div className="labelNodeHistoryListItem" style={{ backgroundColor: item?.color }}>
                      {item?.contents}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}
      </>
    );
  };
  const LabelNode = ({ value, fill, onDeleteLabel, id, onSelectLabel, selectLabel, type }) => {
    return (
      <div className={id === selectLabel?.id ? 'labelNodeSelected' : 'labelNode'} onClick={onSelectLabel}>
        <div
          className="labelNodeContent"
          style={{
            backgroundColor: fill,
          }}
        >
          {type === 'text' ? (
            value
          ) : (
            <div className="iconNode">
              <img
                className="labelIcon"
                src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*FWNgRZOslSwAAAAAAAAAAAAADgOBAQ/original"
              />
            </div>
          )}
        </div>
        <div className="labelNodeContentIcon" onClick={onDeleteLabel}>
          <img
            className="labelNodeContentIcon"
            src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*vZ7LRISuzR8AAAAAAAAAAAAADgOBAQ/original"
          />
        </div>
      </div>
    );
  };
  const AddLabelNode = ({ name, labelList, setType, setDisplay, setSelectLabel, selectLabel, deleteLabel }) => {
    const items: MenuProps['items'] = [
      {
        key: 'text',
        label: (
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setType('text');
              setDisplay(true);
              setSelectLabel({ ...defaultLabel, actionType: 'add', type: 'text', parentId: '' });
            }}
          >
            文本标签
          </a>
        ),
      },
      {
        key: 'font',
        label: (
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setType('font');
              setSelectLabel({ ...defaultLabel, actionType: 'add', type: 'font', parentId: '' });
              setDisplay(true);
            }}
          >
            图标标签
          </a>
        ),
      },
    ];

    return (
      <div className="addLabelNode">
        <div className="addLabelNodeNameList">
          {[...name].map(item => (
            <div className="addLabelNodeName" key={item?.getID()}>
              {item?.getID()}
            </div>
          ))}
        </div>
        <div className="addLabelNodeList">
          {labelList.length
            ? labelList.map(item => (
                <LabelNode
                  value={item?.value}
                  fill={item?.fill}
                  id={item?.id}
                  key={item?.id}
                  type={item?.type}
                  selectLabel={selectLabel}
                  onSelectLabel={() => {
                    const selectedNodes = getSelectNodes();
                    if (selectedNodes.length > 1) return undefined;
                    setSelectLabel({
                      ...item,
                      id: item?.id,
                      parentId: item?.parentId,
                      actionType: 'edit',
                    });
                    setDisplay(true);
                  }}
                  onDeleteLabel={e => {
                    resetEvent(e);
                    deleteLabel(item?.id);
                  }}
                />
              ))
            : null}
          <Dropdown menu={{ items }}>
            <div className="addLabelNodeAdd">
              <img
                className="addLabelNodeAddIcon"
                src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*wjlTQ7ZYZDcAAAAAAAAAAAAADgOBAQ/original"
              />
            </div>
          </Dropdown>
        </div>
      </div>
    );
  };

  const [state, setState] = useImmer<{
    labelModalVisible: boolean;
    labelModalLoading: boolean;
    blacklistModalVisible: boolean;
    blacklistModalLoading: boolean;
    title: string;
    nav: string;
    type: string;
    display: boolean;
    selectLabel: any;
    labelList: any[];
  }>({
    selectLabel: {
      type: 'text',
      fill: Colors[0],
      value: '',
      actionType: 'add',
      parentId: '',
    },
    labelModalLoading: false,
    labelModalVisible: false,
    blacklistModalLoading: false,
    blacklistModalVisible: false,
    title: '节点打标',
    type: 'text',
    nav: '添加/编辑标签',
    display: false,
    labelList: getLabelList(),
  });

  const { labelModalLoading, labelModalVisible } = state;
  // 计算渲染节点的偏移量
  const getOffset = (item, index, labelList: any[]): number[] => {
    const hasFont = labelList.some(i => i?.type === 'font');
    const isFont = item?.type === 'font';
    const y = isFont ? 0 : hasFont ? 10 : 0;
    let x = 0;
    const isFirstFont = labelList[0]?.type === 'font';
    const isFirstText = labelList[0]?.type === 'text';
    const getX = (index): number => {
      const needCalculateList = labelList.slice(0, index + 1);
      let _x = 0;
      if (needCalculateList.length) {
        _x = needCalculateList.reduce((pre, cur, i, arr) => {
          const _isFont = arr[i]?.type === 'font';
          const _isText = arr[i]?.type === 'text';
          if (_isFont) {
            return pre + 20;
          }
          if (_isText) {
            return pre + (cur?.value?.length || 0) * 12;
          }
        }, 0);
        // 节点类型条件触发的强修正
        if (isFirstFont && !isFont) {
          _x = _x + 10;
        }
        if (isFirstText && isFont) {
          _x = _x - 10;
        }
        return _x;
      }
      return 0;
    };
    x = getX(index);
    return [x, y];
  };
  const getBadges = (labelList: any[], node: any): any[] => {
    const result: any[] = [];
    if (labelList.length) {
      return labelList.map((item, index) => {
        const isIcon = item?.type === 'font';
        const offset = getOffset(item, index, labelList);
        return isIcon
          ? {
              position: 'LT',
              fontFamily: 'iconfont',
              type: item?.type,
              value: icons['star-fill'],
              size: [20, 20],
              fontSize: 12,
              color: '#fff',
              fill: item?.fill,
              stroke: item?.fill,
              offset,
            }
          : {
              position: 'LT',
              type: item?.type,
              value: item.value,
              size: [(item?.value?.length || 0) * 12, 20],
              color: '#fff',
              fill: item?.fill,
              offset,
            };
      });
    }
    return result;
  };
  const updateCurrentNode = (node, labelList) => {
    const newData = deepClone(graphData);
    const badges = getBadges(labelList, node);
    updateContext(draft => {
      newData.nodes.forEach(d => {
        if (node?.getID() === d?.id) {
          if (!d.style.badges) {
            d.style.badges = [];
          }
          d.style.badges = badges;
        }
      });
      draft.data = newData;
      draft.source = newData;
    });
    const model = node?.getModel();
    graph.updateItem(node, {
      _initialStyle: {
        ...model.__initialStyle,
        badges: badges,
      },
      style: {
        ...model.style,
        badges: badges,
      },
    });
  };
  const getClassifyNodeLabel = id => {
    return [...state.labelList].filter(item => `${item?.id}`.includes(id) || item?.parentId === id);
  };
  const getAddNodeLabel = id => {
    return [...state.labelList]
      .filter(item => `${item?.id}`.includes('_add_') && item?.actionType === 'add')
      .map((item, index) => ({ ...item, id: id + `${index}`, parentId: id }));
  };
  const confirmSave = async () => {
    const selectedNode = getSelectNodes();
    const copySelectedNode = [...selectedNode];
    const localMap = getLocalMap(NODE_ICON_MAPPING, {});
    selectedNode.forEach(item => {
      const id = item?.getID();
      const addNodeLabelList = getAddNodeLabel(id);
      const nodeLabel = [...getClassifyNodeLabel(id), ...addNodeLabelList];
      localMap[id] = nodeLabel;
      updateCurrentNode(item, nodeLabel);
    });
    setLocalMap(localMap, NODE_ICON_MAPPING);
    setState(draft => {
      draft.labelModalVisible = false;
      draft.display = false;
      draft.selectLabel = defaultLabel;
    });
    setTimeout(() => {
      copySelectedNode.forEach(e => {
        const id = e?.getID();
        graph.setItemState(id, 'selected', true);
        contextmenu.onClose();
      });
    }, 60);
  };

  const updateAddLabel = () => {
    const allNode = graph.findAll('node', () => true);
    const selectedNode = getSelectNodes();
    const copySelectedNode = [...selectedNode];
    const localMap = getLocalMap(NODE_ICON_MAPPING, {});
    allNode.forEach(node => {
      if (localMap[node?.getID()]) {
        updateCurrentNode(node, localMap[node?.getID()]);
      }
    });
    setTimeout(() => {
      copySelectedNode.forEach(e => {
        const id = e?.getID();
        graph.setItemState(id, 'selected', true);
      });
    }, 60);
  };

  useEffect(() => {
    setState(pre => ({ ...pre, labelList: getLabelList() }));
  }, [state.labelModalVisible]);

  useEffect(() => {
    updateAddLabel();
  }, []);
  return (
    <>
      <Item
        {...props}
        key="add-label"
        onClick={() => {
          const selectedList = getSelectNodes();
          if (selectedList.length === 0) {
            return message.error('选择节点为空');
          }
          setState(draft => {
            draft.labelModalVisible = true;
          });
        }}
      >
        节点打标
      </Item>
      <Modal
        title={<div className="addLabelTitle">{state.title}</div>}
        visible={labelModalVisible}
        destroyOnClose={true}
        okText="确认"
        cancelText="取消"
        onCancel={() => {
          setState(draft => {
            draft.labelModalVisible = false;
            draft.display = false;
            draft.selectLabel = defaultLabel;
          });
        }}
        onOk={() => {
          confirmSave();
        }}
        confirmLoading={labelModalLoading}
      >
        <div className="addLabelContent">
          <AddLabelNode
            name={getSelectNodes()}
            labelList={state.labelList}
            deleteLabel={id => {
              setState(pre => ({ ...pre, labelList: pre?.labelList?.filter(item => item?.id !== id) }));
            }}
            selectLabel={state?.selectLabel}
            setSelectLabel={selectLabel => {
              setState(pre => ({ ...pre, selectLabel }));
            }}
            setDisplay={display => {
              setState(pre => ({ ...pre, display }));
            }}
            setType={type => {
              setState(pre => ({ ...pre, type }));
            }}
          />
          <LabelNodeHistoryEdit
            editNodeState={state.selectLabel}
            display={state.display}
            originType={state.type}
            onCancel={() => {
              setState(pre => ({ ...pre, display: false, selectLabel: defaultLabel }));
            }}
            onConfirm={editState => {
              const selectedNode = getSelectNodes();
              setState(pre => {
                return {
                  ...pre,
                  labelList:
                    editState?.actionType === 'edit'
                      ? [
                          ...pre?.labelList.map(item => {
                            if (editState.id === item?.id) {
                              return { ...item, ...editState };
                            }
                            return item;
                          }),
                        ]
                      : [
                          ...pre?.labelList,
                          {
                            ...editState,
                            parentId:
                              selectedNode.length > 1
                                ? '_add_' + Date.now()
                                : editState?.parentId || currentItem?.getID(),
                            id:
                              selectedNode.length > 1
                                ? '_add_' + Date.now()
                                : `${editState?.parentId || currentItem?.getID()}_${pre?.labelList?.length || 0}`,
                          },
                        ],
                };
              });
            }}
          />
        </div>
      </Modal>
    </>
  );
};

export default AddIconLabel;
