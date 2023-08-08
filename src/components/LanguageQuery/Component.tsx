import { useContext, utils } from "@antv/gi-sdk";
import { Button, Radio, Tooltip, Checkbox } from "antd";
import { FileTextOutlined } from '@ant-design/icons';
import React from "react";
import { useImmer } from "use-immer";
import GraphEditor from "./LanguageEditor/index";
import "./index.less";

export interface ILanguageQueryProps {
  height?: string;
  languageServiceId: string;
}

const LanguageQuery: React.FC<ILanguageQueryProps> = ({ height = "220px", languageServiceId }) => {
  const { transform, updateContext, services, graph } = useContext();

  const languageService = utils.getService(services, languageServiceId);

  const graphName = 'default'

  const [state, setState] = useImmer<{
    languageType: string;
    editorValue: string;
    btnLoading: boolean;
    hasClear: boolean;
  }>({
    languageType: 'Cypher',
    editorValue: "",
    btnLoading: false,
    hasClear: false
  });
  const { languageType, editorValue, btnLoading } = state;

  const handleChangeEditorValue = (value: string) => {
    setState((draft) => {
      draft.editorValue = value;
    });
  };

  const handleClickQuery = async () => {
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
      script: editorValue,
      graphName
    });

    setState((draft) => {
      draft.btnLoading = false;
    });

    const { formatData } = result.data

    // 查询后除了改变画布节点/边数据，还需要保存“初始数据”，供类似 Filter 组件作为初始化数据使用
    if (state.hasClear) {
      // 清空数据
      updateContext((draft) => {
        const res = transform(formatData);
        draft.data = res;
        draft.source = res;
      });
    } else {
      // 在画布上叠加数据
      const originData: any = graph.save()
      const newData = {
        nodes: [...originData.nodes, ...formatData.nodes],
        edges: [...originData.edges, ...formatData.edges]
      }
      updateContext((draft) => {
        const res = transform(newData);
        draft.data = res;
        draft.source = res;
      });
    }

    updateContext((draft) => {
      draft.isLoading = false;
    });
  };

  const handleChange = (e) => {
    setState(draft => {
      draft.hasClear = e.target.checked
    })
  };

  const handleChangeLangageType = (value) => {
    setState((draft) => {
      draft.languageType = value;
    });
  };
  return (
    <>
      <div className='LanguageQueryPanel'>
        <div className={"contentContainer"}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span>查询语言</span>
              <a
                onClick={() => {
                  window.open(
                    "https://yuque.antfin-inc.com/guppiq/ezloha/pgrayyum1dwnpiga?singleDoc#"
                  );
                }}
              >
                <FileTextOutlined />
                语法说明
              </a>
            </div>
       
            <Radio.Group onChange={handleChangeLangageType} value={languageType}>
              <Radio value='Cypher'>Cypher</Radio>
              <Tooltip title='敬请期待'>
                <Radio value='ISOGQL' disabled>ISOGQL</Radio>
              </Tooltip>
            </Radio.Group>
          </div>
          <span style={{ display: 'inline-block', marginBottom: 8 }}>输入语句</span>
          <div className={"blockContainer"}>
            <div
              style={{
                border: "1px solid var(--main-editor-border-color)",
                borderRadius: "2px"
              }}
            >
              <GraphEditor
                initialValue={editorValue}
                height={height}
                onChange={(value) => handleChangeEditorValue(value)}
              />
            </div>
          </div>

          <Checkbox onChange={handleChange}>是否清空画布数据</Checkbox>

        </div>
        <div className={"buttonContainer"}>
          <Button
            className={"queryButton"}
            loading={btnLoading}
            type='primary'
            disabled={!editorValue}
            onClick={handleClickQuery}
          >
            执行查询
          </Button>
        </div>
      </div>
    </>
  );
};

export default LanguageQuery;
