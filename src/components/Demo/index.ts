import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'Demo',
  name: 'demo案例',
  category: 'data-query',
  desc: '通过模版案例，渲染出对应的案例图数据',
  cover: 'http://xxxx.jpg',
  type: 'AUTO',
};

export default {
  info,
  component: Component,
  registerMeta,
};
