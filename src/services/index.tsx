import Engine, { ENGINE_ID } from './Engine';
import * as Initializer from './Initializer';
import * as TuGraphBack from './TuGraphBack';

export default {
  id: ENGINE_ID,
  type: 'api',
  name: 'TuGraph-DB',
  desc: 'TuGraph-DB 引擎服务',
  cover: 'https://gw.alipayobjects.com/mdn/rms_3ff49c/afts/img/A*xqsZTKLVHPsAAAAAAAAAAAAAARQnAQ',
  component: Engine,
  services: {
    ...Initializer,
    ...TuGraphBack,
  },
};
