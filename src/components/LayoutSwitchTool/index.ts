import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'LayoutSwitchTool',
  name: '高级布局切换',
  category: 'data-query',
  desc: '通过切换布局类型配置，渲染图数据',
  cover: 'http://xxxx.jpg',
  type: 'GIAC',
};

export default {
  info,
  component: Component,
  registerMeta,
};
