import { useContext, utils, extra } from '@antv/gi-sdk';
import type { IGIAC } from '@antv/gi-sdk';
import { Modal, message, Button, Checkbox } from 'antd';
import React, { useState } from 'react';
import { getTransformByTemplate } from '../StyleSetting/utils';
import './index.less';

const { GIAComponent } = extra;
export interface IProps {
  GIAC: IGIAC;
}

const GraphDemo: React.FunctionComponent<IProps> = (props) => {
  const { GIAC } = props;

  const { updateContext, services, schemaData } = useContext();
  const customStyleConfig = localStorage.getItem('CUSTOM_STYLE_CONFIG')
    ? JSON.parse(localStorage.getItem('CUSTOM_STYLE_CONFIG') as string)
    : {};

  const languageService: any = utils.getService(services, 'TuGraph-DB/languageQueryService');
  const isShow = GIAC.visible || !localStorage.getItem('TuGraph_NO_SHOW');
  const [state, setState] = useState({
    visible: isShow ? true : false,
    index: 0,
    graphName: 'Movie',
    loading: false,
  });
  const set = values => {
    setState(pre => {
      return { ...pre, ...values };
    });
  };

  const queryDataByDefaultGraphName = async () => {
    if (!languageService) {
      message.error('没有找到TuGraph-DB/languageQueryService服务，请先注册该服务');
      return;
    }

    setState({
      ...state,
      loading: true,
    });

    // 先跳转到具体子图再执行查询
    const { origin, pathname } = location
    const newURL = `${origin}${pathname}?graphName=${state.graphName}`
    // GI 中测试使用
    // const newURL = `http://dev.alipay.net:8000/#/workspace/d72a7985-292f-4dc5-a9c9-c38f3e3639e5?nav=components&graphName=${state.graphName}`
    location.href = newURL

    setTimeout(async () => {
      const result = await languageService({
        script: 'match p=(n)-[*..1]-(m)  RETURN p LIMIT  50',
        graphName: state.graphName,
      });
  
      setState({
        ...state,
        loading: false,
        visible: false,
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
    }, 10)

  };

  const handleShow = (e) => {
    if (e.target.checked) {
      localStorage.setItem('TuGraph_NO_SHOW', 'true');
    } else {
      localStorage.removeItem('TuGraph_NO_SHOW')
    }
  };

  const showModal = () => {
    setState({
      ...state,
      visible: true
    })
  };

  return (
    <>
      <GIAComponent GIAC={GIAC} onClick={showModal} />
      <Modal
        visible={state.visible}
        confirmLoading={state.loading}
        width={772}
        footer={[
          <>
            <Checkbox className="noShow" style={{ float: 'left' }} onChange={handleShow}>
              下次不再显示
            </Checkbox>
            <Button
              onClick={() => {
                set({ visible: false });
              }}
            >
              取消
            </Button>
            <Button onClick={queryDataByDefaultGraphName} type="primary">
              确定
            </Button>
          </>,
        ]}
        onCancel={() => {
          set({ visible: false });
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
            className={`${state.index === 0 ? 'demoItemSelected' : 'demoItem'}`}
            onClick={() => {
              set({ index: 0, graphName: 'Movie' });
            }}
          >
            <div className="picBox">
              <img src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*fobuSKSyNWwAAAAAAAAAAAAADgOBAQ/original" />
            </div>
            <div className="textBox">
              <div className="demoText">电影关系网络</div>
            </div>
          </div>
          <div
            className={`${state.index === 1 ? 'demoItemSelected' : 'demoItem'}`}
            onClick={() => {
              set({ index: 1, graphName: 'ThreeKingdoms' });
            }}
          >
            <div className="picBox">
              <img src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*fobuSKSyNWwAAAAAAAAAAAAADgOBAQ/original" />
            </div>
            <div className="textBox">
              <div className="demoText">三国人物关系网络</div>
            </div>
          </div>
          <div
            className={`${state.index === 2 ? 'demoItemSelected' : 'demoItem'}`}
            onClick={() => {
              set({ index: 2, graphName: 'WanderingEarth' });
            }}
          >
            <div className="picBox">
              <img src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*fobuSKSyNWwAAAAAAAAAAAAADgOBAQ/original" />
            </div>
            <div className="textBox">
              <div className="demoText">流浪地球关系网络</div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default GraphDemo;
