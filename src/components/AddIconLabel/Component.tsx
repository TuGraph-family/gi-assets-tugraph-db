import { useContext } from "@antv/gi-sdk";
import { Form, Input, Menu, message, Modal, Radio } from "antd";
import React from "react";
import { useImmer } from "use-immer";
import { deepClone } from "../utils";
import "./index.less";

const Item: any = Menu.Item;

export interface AddIconLabelProps {
  contextmenu: any;
}

export const Colors = ["#7E92B5", "#9661BC", "#7262FD", "#F6BD16", "#F6903D", "#F08BB4"];

const AddIconLabel: React.FunctionComponent<AddIconLabelProps> = (props) => {
  const { contextmenu } = props;
  const { updateContext, graph, data: graphData } = useContext();

  const [labelForm] = Form.useForm();

  const [state, setState] = useImmer<{
    labelModalVisible: boolean;
    labelModalLoading: boolean;
    blacklistModalVisible: boolean;
    blacklistModalLoading: boolean;
  }>({
    labelModalLoading: false,
    labelModalVisible: false,
    blacklistModalLoading: false,
    blacklistModalVisible: false
  });

  const { labelModalLoading, labelModalVisible } = state;

  const currentItem = contextmenu.item
  if (!currentItem) {
    return null
  }

  const handleAddLabel = async () => {
    setState((draft) => {
      draft.labelModalLoading = true;
    });
    try {
      const { content, color } = await labelForm.validateFields();
     
      message.success("添加标签成功！");
      setState((draft) => {
        draft.labelModalLoading = false;
      });
      contextmenu.onClose();

      refreshNodeAttrPanel();

      // 更新数据确保再次展示菜单
      updateContext((draft) => {
        const newData = deepClone(graphData)

        newData.nodes.forEach(d => {
          if (d.id === currentItem.getID()) {
            if (!d.style.badges) {
              d.style.badges = []
            }
            
            // 仅展示一个标签
            d.style.badges = d.style.badges.filter(
              ({ position }) => position !== "LT"
            )
            
            d.style.badges.push({
              position: "LT",
              type: "text",
              value: content,
              size: [content.length * 12, 20],
              color: "#fff",
              fill: color
            });

            // 将节点打标信息存储到 localstorage 中
            const nodeIconMapping = JSON.parse(localStorage.getItem('NODE_ICON_MAPPING') || '{}')
            nodeIconMapping[d.id] = d.style.badges
            localStorage.setItem('NODE_ICON_MAPPING', JSON.stringify(nodeIconMapping))
          }
        })

        draft.data = newData
        draft.source = newData

        setState((draft) => {
          draft.labelModalVisible = false;
        });
      });
    } finally {
      setState((draft) => {
        draft.labelModalLoading = false;
      });
    }
  };

  const refreshNodeAttrPanel = () => {
    // 保持节点选中状态
    setTimeout(() => {
      graph.setItemState(currentItem.getID(), "selected", true);
    }, 300);
  };

  const deleteIconLabel = () => {
    // 更新 localstorage 中对应的值
    contextmenu.onClose();

     const nodeIconMapping = JSON.parse(localStorage.getItem('NODE_ICON_MAPPING') || '{}')
     delete nodeIconMapping[currentItem.getID()]
     localStorage.setItem('NODE_ICON_MAPPING', JSON.stringify(nodeIconMapping))
   

    const model = currentItem.getModel()

    graph.updateItem(currentItem, {
      _initialStyle: {
        ...model.__initialStyle,
        badges: model.style.badges.filter(({ position }) => position !== "LT")
      },
      style: {
        ...model.style,
        badges: model.style.badges.filter(({ position }) => position !== "LT")
      }
    })
  }

  return (
    <>
      {
        JSON.parse(localStorage.getItem('NODE_ICON_MAPPING') || '{}')[currentItem.getID()]
        ?
        <Item
        {...props}
        key='delete-label'
        onClick={deleteIconLabel}
      >
        删除标签
      </Item>
      :
      <Item
        {...props}
        key='add-label'
        onClick={() => {
          setState((draft) => {
            draft.labelModalVisible = true;
          });
        }}
        >
        节点打标
      </Item>
      }
      <Modal
        title='节点打标'
        visible={labelModalVisible}
        destroyOnClose={true}
        okText='添加'
        cancelText='取消'
        onCancel={() => {
          setState((draft) => {
            draft.labelModalVisible = false;
          });
        }}
        onOk={handleAddLabel}
        confirmLoading={labelModalLoading}
      >
        <Form
          form={labelForm}
          layout='vertical'
          initialValues={{
            color: Colors[0]
          }}
        >
          <Form.Item
            label='标签内容'
            name='content'
            rules={[
              {
                required: true,
                message: "请填写标签内容"
              }
            ]}
          >
            <Input showCount={true} maxLength={20} placeholder='请输入' />
          </Form.Item>
          <Form.Item className='tugraph-label-icon-radioItem' name='color' label='标签颜色'>
            <Radio.Group>
              {Colors.map((color) => (
                <Radio key={color} value={color} style={{ background: color }} />
              ))}
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddIconLabel;
