import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'ZoomInOut',
  name: 'TuGraph 图例 放大缩小',
  category: 'data-query',
  desc: '图例 放大缩小',
  cover: 'http://xxxx.jpg',
  type: 'AUTO',
};

export default {
  info,
  component: Component,
  registerMeta,
};
