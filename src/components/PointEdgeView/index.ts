import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'PointEdgeView',
  name: '点边数据view',
  category: 'data-query',
  desc: '通过图数据，渲染出对应的案例图数据',
  cover: 'http://xxxx.jpg',
  type: 'AUTO',
};

export default {
  info,
  component: Component,
  registerMeta,
};
