import { useContext } from "@antv/gi-sdk";
import { Menu } from "antd";
import React from "react";
import { icons } from '@antv/gi-sdk'

const Item: any = Menu.Item;

export interface TuGraphLockNodeProps {
  contextmenu: any;
}

const TuGraphLockNode: React.FunctionComponent<TuGraphLockNodeProps> = (props) => {
  const { contextmenu } = props;
  const { graph } = useContext();

  const currentItem = contextmenu.item
  if (!currentItem || currentItem.destroyed) {
    return null
  }

  const handleLockNode = () => {
    const selectedNodes = graph.findAllByState("node", "selected") as any[];
    if (selectedNodes.length === 0) {
      selectedNodes.push(currentItem)
    }

    selectedNodes.forEach((item) => {
      item.lock();
    });

    contextmenu.onClose();

    selectedNodes.forEach((target) => {
      const style = target.getModel().style || { badges: [] };
      const badges = [...(style.badges || [])];
      badges.push({
        position: "LB",
        type: "font" as "font",
        value: icons['loukongsuodingicon'],
        fontFamily: "iconfont",
        size: [20, 20],
        color: "#7e92b5",
      });
      graph.updateItem(target, {
        style: {
          badges
        }
      });
    });

    setTimeout(() => {
      selectedNodes.forEach((node: any) => {
        // 保持选中状态
        graph.setItemState(node.getID(), "selected", true);
      });
    });
  };

  const handleUnLockNode = () => {
    currentItem.unlock()
    contextmenu.onClose();

    const model = currentItem.getModel()

    // 更新badges
    graph.updateItem(currentItem, {
      _initialStyle: {
        ...model.__initialStyle,
        badges: model.style.badges.filter(({ position }) => position !== "LB")
      },
      style: {
        ...model.style,
        badges: model.style.badges.filter(({ position }) => position !== "LB")
      }
    })
  }

  return (
    <>
      {
        currentItem.hasLocked()
        ?
        <Item
          {...props}
          key='unlock-node'
          onClick={handleUnLockNode}
          >
          解锁节点
        </Item>
        :
        <Item
          {...props}
          key='lock-node'
          onClick={handleLockNode}
          >
          锁定节点
        </Item>
      }
    </>
  );
};

export default TuGraphLockNode;
