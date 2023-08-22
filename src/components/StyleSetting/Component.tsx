import { Tabs, Radio } from "antd";
import React, { useEffect } from "react";
import { useImmer } from 'use-immer'
import { useContext, utils } from "@antv/gi-sdk";
import EdgeConfigurationPanel from "./EdgeConfiguration";
import NodeConfigurationPanel from "./NodeConfiguration";
import { getQueryString } from '../utils'
import './index.less'

const { TabPane } = Tabs;
export interface IStyleSetting {
  visible: boolean;
  schemaServiceId: string;
}

const StyleSetting: React.FunctionComponent<IStyleSetting> = (props) => {
  const { schemaServiceId } = props
  
  const {
    services,
  } = useContext();

  const schemaService = utils.getService(services, schemaServiceId);

  const [state, setState] = useImmer<{
    styleType: 'node' | 'edge';
    schemaList: {
      nodes: any[];
      edges: any[];
    };
  }>({
    styleType: 'node',
    schemaList: {
      nodes: [],
      edges: []
    },
  })

  const graphName = getQueryString('graphName')

  const queryGraphSchema = async () => {
    if (!schemaService) {
      return
    }
    const result = await schemaService(graphName)
    const { data } = result
    setState((draft) => {
      draft.schemaList = {
        nodes: data.nodes,
        edges: data.edges
      };
    });
  }
  
  useEffect(() => {
    queryGraphSchema()
  }, [])
  
  const handleChangeRadio = (evt) => {
    setState(draft => {
      draft.styleType = evt.target.value
    })
  }

  return (
    <div className="style-setting-container" style={{ padding: 16 }}>
      <h4>外观样式</h4>
      <Radio.Group className="tab-ant-radio-group" value={state.styleType} buttonStyle="solid" onChange={handleChangeRadio}>
        <Radio.Button className="container-element" value="node">点</Radio.Button>
        <Radio.Button className="container-element" value="edge">边</Radio.Button>
      </Radio.Group>
      {
        state.styleType === 'node'
        ?
        <NodeConfigurationPanel {...props} schemaData={state.schemaList} />
        :
        <EdgeConfigurationPanel {...props}  schemaData={state.schemaList}/>
      }
    </div>
  );
};

export default StyleSetting;
