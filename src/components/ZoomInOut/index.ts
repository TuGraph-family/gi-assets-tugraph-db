import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'ZoomInOut',
  name: 'minimap',
  category: 'data-query',
  desc: '图放大缩小',
  cover: 'http://xxxx.jpg',
  type: 'AUTO',
};

export default {
  info,
  component: Component,
  registerMeta,
};
