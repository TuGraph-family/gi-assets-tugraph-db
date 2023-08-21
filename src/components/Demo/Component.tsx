import { useContext, utils } from '@antv/gi-sdk';
import { Modal, message } from 'antd';
import React, { useState } from 'react';
import { useImmer } from 'use-immer';
import demoData from './data/demo1.json';
import './index.less';
import { getTransformByTemplate } from '../StyleSetting/utils';

export interface ILanguageQueryProps {
  height?: string;
  languageServiceId: string;
}

const Demo: React.FC<ILanguageQueryProps> = ({ languageServiceId }) => {
  const { transform, updateContext, services, schemaData, graph } = useContext();
  const customStyleConfig = localStorage.getItem('CUSTOM_STYLE_CONFIG')
    ? JSON.parse(localStorage.getItem('CUSTOM_STYLE_CONFIG') as string)
    : {};
  console.log(services, languageServiceId, 'services');

  const [state, setState] = useImmer<{
    languageType: string;
    editorValue: string;
    btnLoading: boolean;
    hasClear: boolean;
  }>({
    languageType: 'Cypher',
    editorValue: 'match p=(n)-[*..1]-(m)  RETURN p LIMIT  50',
    btnLoading: false,
    hasClear: false,
  });
  const { languageType, editorValue, btnLoading } = state;
  const languageService: any = utils.getService(services, languageServiceId);
  const graphName = 'default';

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
        // confirmLoading={btnLoading}
        width={772}
        cancelText="取消"
        okText="确定"
        onCancel={() => {
          set({ visible: false });
        }}
        onOk={async () => {
          const data = transform(demoData);
          const result = await languageService({
            script: editorValue,
            graphName,
          });
          if (!result.success) {
            // 执行查询失败
            message.error(`执行查询失败: ${result.errorMessage}`);
            return;
          }
          const { formatData } = result.data;
          // 处理 formData，添加 data 字段
          formatData.nodes.forEach(d => {
            d.data = d.properties;
          });

          formatData.edges.forEach(d => {
            d.data = d.properties;
          });
          const transformData = getTransformByTemplate(customStyleConfig, schemaData);
          console.log(result, 'services');
          if (state.hasClear) {
            // 清空数据
            updateContext(draft => {
              if (transformData) {
                draft.transform = transformData;
              }

              const res = transformData(formatData);
              // @ts-ignore
              draft.data = res;
              // @ts-ignore
              draft.source = res;
            });
          } else {
            // 在画布上叠加数据
            const originData: any = graph.save();
            const newData = {
              nodes: [...originData.nodes, ...formatData.nodes],
              edges: [...originData.edges, ...formatData.edges],
            };
            updateContext(draft => {
              const res = transformData(newData);
              // @ts-ignore
              draft.data = res;
              // @ts-ignore
              draft.source = res;
            });
          }
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
