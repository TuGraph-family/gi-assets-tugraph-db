import { getQueryString } from '@/utils';
import { useContext, utils } from '@antv/gi-sdk';
import { Segmented } from 'antd';
import { isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import EdgeConfigurationPanel from './EdgeConfiguration';
import './index.less';
import NodeConfigurationPanel from './NodeConfiguration';

export interface IStyleSetting {
  visible: boolean;
  schemaServiceId: string;
}

const StyleSetting: React.FunctionComponent<IStyleSetting> = (props) => {
  const { schemaServiceId } = props;

  const { services, schemaData } = useContext();

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
      edges: [],
    },
  });

  const graphName = getQueryString('graphName');

  const queryGraphSchema = async () => {
    if (!schemaService || !graphName) {
      return;
    }
    const result = await schemaService(graphName);
    const { data } = result;
    if (!data) {
      // 如果请求失败，则直接 return
      return;
    }

    setState((draft) => {
      draft.schemaList = {
        nodes: data.nodes,
        edges: data.edges,
      };
    });
  };

  useEffect(() => {
    if (!isEmpty(schemaData?.nodes) || !isEmpty(schemaData?.edges)) {
      setState((draft) => {
        draft.schemaList = schemaData;
      });
      return;
    }
    if (graphName) {
      queryGraphSchema();
    }
  }, [graphName, schemaData]);

  const handleChange = (value) => {
    setState((draft) => {
      draft.styleType = value;
    });
  };

  return (
    <div className="style-setting-container">
      <Segmented
        value={state.styleType}
        options={[
          { label: '点样式', value: 'node' },
          { label: '边样式', value: 'edge' },
        ]}
        onChange={handleChange}
      />
      {state.styleType === 'node' ? (
        <NodeConfigurationPanel {...props} schemaData={state.schemaList} />
      ) : (
        <EdgeConfigurationPanel {...props} schemaData={state.schemaList} />
      )}
    </div>
  );
};

export default StyleSetting;
