import { useContext } from '@antv/gi-sdk';
import { Modal } from 'antd';
import React, { useState } from 'react';
import demoData from './data/demo1.json';
import './index.less';

const Demo = () => {
  const { transform, updateContext, services } = useContext();
  const [config, setConfig] = useState({
    visible: true,
    index: 0,
  });
  const set = values => {
    setConfig(pre => {
      return { ...pre, ...values };
    });
  };
  return (
    <div className="demo">
      <Modal
        visible={config.visible}
        width={772}
        cancelText="取消"
        okText="确定"
        onCancel={() => {
          set({ visible: false });
        }}
        onOk={() => {
          const data = transform(demoData);
          updateContext(draft => {
            draft.data = data;
            draft.source = data;
            draft.isLoading = false;
            set({ visible: false });
          });
        }}
        title={
          <div className="title">
            <div className="iconBox">
              <img
                className="icon"
                src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*LgF_RqTp0TsAAAAAAAAAAAAADgOBAQ/original"
              />
            </div>
            <div className="text">
              <div className="main">Demo示例</div>
              <div className="sub">选择下方的Demo，并填充到画布内体验</div>
            </div>
          </div>
        }
      >
        <div className="demoContent">
          <div
            className={`${config.index === 0 ? 'demoItemSelected' : 'demoItem'}`}
            onClick={() => {
              set({ index: 0 });
            }}
          >
            <div className="picBox">
              <img src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*fobuSKSyNWwAAAAAAAAAAAAADgOBAQ/original" />
            </div>
            <div className="textBox">
              <div className="demoText">反洗钱Demo</div>
            </div>
          </div>
          <div
            className={`${config.index === 1 ? 'demoItemSelected' : 'demoItem'}`}
            onClick={() => {
              set({ index: 1 });
            }}
          >
            <div className="picBox">
              <img src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*fobuSKSyNWwAAAAAAAAAAAAADgOBAQ/original" />
            </div>
            <div className="textBox">
              <div className="demoText">企业关系Demo</div>
            </div>
          </div>
          <div
            className={`${config.index === 2 ? 'demoItemSelected' : 'demoItem'}`}
            onClick={() => {
              set({ index: 2 });
            }}
          >
            <div className="picBox">
              <img src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*fobuSKSyNWwAAAAAAAAAAAAADgOBAQ/original" />
            </div>
            <div className="textBox">
              <div className="demoText">社交网络Demo</div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Demo;
