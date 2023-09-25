import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'TuGraphDownload',
  name: '下载',
  category: 'data-query',
  desc: '下载',
  cover: 'http://xxxx.jpg',
  type: 'GIAC_CONTENT',
};

export default {
  info,
  component: Component,
  registerMeta,
};
