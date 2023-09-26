import { Info } from '@antv/gi-sdk';
import Component from './Component';
import registerMeta from './registerMeta';

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: 'AlgorithmConfig',
  name: '算法配置',
  category: 'canvas-interaction',
  desc: '通过算法配置，执行算法处理图数据',
  cover: 'http://xxxx.jpg',
  type: Info.type.COMPONENT_ACTION,
};

export default {
  info,
  component: Component,
  registerMeta,
};
