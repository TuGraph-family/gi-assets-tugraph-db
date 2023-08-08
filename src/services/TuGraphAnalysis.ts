import request from './request';
import { utils } from '@antv/gi-sdk';

type StatementParams = {
  graphName: string;
  script?: string;
};

export const languageQueryService = {
  name: '语句查询服务',
  service: async (params: StatementParams) => {
    const { HTTP_SERVER_URL } = utils.getServerEngineContext();
    return request(`${HTTP_SERVER_URL}/api/query/language`, {
      method: 'POST',
      data: {
        ...params,
      },
    });
  }
}

export const graphSchemaService = {
  name: '查询图模型',
  service: async (graphName: string) => {
    const { HTTP_SERVER_URL } = utils.getServerEngineContext();
    return await request(HTTP_SERVER_URL + `/api/schema/${graphName}`, {
      method: 'get'
    });
  },
};
