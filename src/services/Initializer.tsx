import { utils } from '@antv/gi-sdk';
import { message } from 'antd';
import request from './request';

// import { CypherQuery } from './CypherQuery';
import { refreshToken } from './TuGraphService';

export const GI_SERVICE_INTIAL_GRAPH = {
  name: '初始化查询',
  service: async () => {
    const cypher = utils.searchParamOf('cypher');

    // if (cypher) {
    //   return CypherQuery.service({
    //     value: cypher,
    //     limit: 500,
    //   });
    // }
    return new Promise(resolve => {
      resolve({
        nodes: [],
        edges: [],
      });
    });
  },
};

export const GI_SERVICE_SCHEMA = {
  name: '查询图模型',
  service: async (graphName: string = 'default') => {
    const { HTTP_SERVER_URL, CURRENT_SUBGRAPH } = utils.getServerEngineContext();
    try {
      const result = await request(HTTP_SERVER_URL + `/api/schema/${graphName}`, {
        method: 'get',
      });

      const { success, data, code } = result;

      if (!success) {
        if (code === 401) {
          refreshToken();
        }
        return {
          nodes: [],
          edges: [],
        };
      }
      return data;
    } catch (error) {
      return {
        nodes: [],
        edges: [],
      };
    }
  },
};
