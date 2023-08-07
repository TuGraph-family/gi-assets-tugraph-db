import { utils } from '@antv/gi-sdk';

// import { CypherQuery } from './CypherQuery';

export const TuGraphBack = {
  name: '导航服务',
  service: async () => {
    const { HTTP_SERVICE_URL } = utils.getServerEngineContext();
    return fetch(HTTP_SERVICE_URL)
      .then(res => res.json())
      .then(res => {
        console.log('res', res);
        return {
          //@ts-ignore
          title: res.graphName,
          href: window.origin + '/my-analysis',
        };
      })
      .catch(error => {
        console.log(error);
        return {
          title: 'NOT FOUND',
          href: '',
        };
      });
  },
};
