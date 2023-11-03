import { useContext, utils } from '@antv/gi-sdk';
import { Button, Radio, Tooltip, Checkbox, message } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import React, { useRef } from 'react';
import { useImmer } from 'use-immer';
import { getTransformByTemplate } from '../StyleSetting/utils';
import GraphEditor from './LanguageEditor/index';
import { getQueryString } from '../utils';
import './index.less';

export interface ILanguageQueryProps {
  height?: string;
  languageServiceId: string;
}

const LanguageQuery: React.FC<ILanguageQueryProps> = ({
  height = '320px',
  languageServiceId,
}) => {
  const { updateContext, services, graph, schemaData } = useContext();
  const editorRef = useRef<any>(null);
  const languageService = utils.getService(services, languageServiceId);

  const graphName = getQueryString('graphName');

  const [state, setState] = useImmer<{
    languageType: string;
    editorValue: string;
    btnLoading: boolean;
    hasClear: boolean;
  }>({
    languageType: 'Cypher',
    editorValue: 'match p=(n)-[r]-(m) return p limit 6',
    btnLoading: false,
    hasClear: true,
  });
  const { languageType, editorValue, btnLoading } = state;

  const handleChangeEditorValue = (value: string) => {
    setState((draft) => {
      draft.editorValue = value;
    });
  };

  const handleClickQuery = async () => {
    const value = editorRef.current?.codeEditor?.getValue();
    updateContext((draft) => {
      draft.isLoading = true;
    });

    setState((draft) => {
      draft.btnLoading = true;
    });
    if (!languageService) {
      return;
    }
    const result = await languageService({
      script: value,
      graphName,
    });

    setState((draft) => {
      draft.btnLoading = false;
    });

    if (!result.success) {
      // 执行查询失败
      message.error(`执行查询失败: ${result.errorMessage}`);
      return;
    }

    const { formatData } = result.data;

    // 处理 formData，添加 data 字段
    formatData.nodes.forEach((d) => {
      d.data = d.properties;
    });

    formatData.edges.forEach((d) => {
      d.data = d.properties;
    });

    const customStyleConfig = JSON.parse(
      (localStorage.getItem('CUSTOM_STYLE_CONFIG') as string) || '{}'
    );
    const transform = getTransformByTemplate(customStyleConfig, schemaData);

    // 查询后除了改变画布节点/边数据，还需要保存“初始数据”，供类似 Filter 组件作为初始化数据使用
    if (state.hasClear) {
      // 清空数据
      updateContext((draft) => {
        if (transform) {
          draft.transform = transform;
        }

        const res = transform(formatData);
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
      updateContext((draft) => {
        const res = transform(newData);
        // @ts-ignore
        draft.data = res;
        // @ts-ignore
        draft.source = res;
      });
    }

    updateContext((draft) => {
      draft.isLoading = false;
    });
  };

  const handleChange = (e) => {
    setState((draft) => {
      draft.hasClear = e.target.checked;
    });
  };

  const handleChangeLangageType = (value) => {
    setState((draft) => {
      draft.languageType = value;
    });
  };

  const handleResetCypher = () => {
    setState((draft) => {
      draft.editorValue = '';
    });
  };
  return (
    <div className="LanguageQueryPanel">
      <div className={'contentContainer'}>
        <div style={{ marginBottom: 24, marginTop: 16 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
              marginTop: 8,
            }}
          >
            <span>查询语言</span>
            <a
              onClick={() => {
                window.open(
                  'https://tugraph-db.readthedocs.io/zh_CN/latest/5.developer-manual/6.interface/1.query/index.html'
                );
              }}
            >
              <FileTextOutlined />
              语法说明
            </a>
          </div>

          <Radio.Group onChange={handleChangeLangageType} value={languageType}>
            <Radio value="Cypher">Cypher</Radio>
            <Tooltip title="敬请期待">
              <Radio value="ISOGQL" disabled>
                ISOGQL
              </Radio>
            </Tooltip>
          </Radio.Group>
        </div>
        <span style={{ display: 'inline-block', marginBottom: 12 }}>
          输入语句
        </span>
        <div className={'blockContainer'}>
          <div
            style={{
              border: '1px solid var(--main-editor-border-color)',
              borderRadius: '2px',
            }}
          >
            <GraphEditor
              initialValue={editorValue}
              height={height}
              onChange={(value) => handleChangeEditorValue(value)}
            />
          </div>
        </div>

        <Checkbox
          checked={state.hasClear}
          value={state.hasClear}
          onChange={handleChange}
        >
          清空画布数据
        </Checkbox>
      </div>
      <div className={'buttonContainer'}>
        {/* <Button
          className={"queryButton"}
          disabled={!editorValue}
          onClick={handleResetCypher}
        >
          重置
        </Button> */}
        <Button
          className={'queryButton'}
          loading={btnLoading}
          type="primary"
          disabled={!editorValue}
          onClick={handleClickQuery}
        >
          查询
        </Button>
      </div>
    </div>
  );
};

export default LanguageQuery;
