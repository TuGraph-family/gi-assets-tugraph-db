import { NodeSelectionMode } from './NodeSelectionMode';
import { extra } from '@antv/gi-sdk';
import info from './info';
const { deepClone, GIAC_CONTENT_METAS } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = info.name;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = info.icon;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.containerWidth.default = '400px';

const nodeSelectionOption = [
  {
    value: NodeSelectionMode.List,
    label: '列表获取',
  },
  {
    value: NodeSelectionMode.Canvas,
    label: '画布拾取',
  },
];

const nodeSelectionDefaultValue = nodeSelectionOption.map(item => item.value);

const registerMeta = ({ schemaData }) => {
  const nodeProperties = schemaData.nodes.reduce((acc, cur) => {
    return {
      ...acc,
      ...cur.properties,
    };
  }, {});
  const options = Object.keys(nodeProperties)
    .filter(key => nodeProperties[key] === 'string')
    .map(e => ({ value: e, label: e }));

  return {
    nodeSelectionMode: {
      title: '获取节点模式',
      type: 'array',
      enum: nodeSelectionOption,
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple',
      },
      default: nodeSelectionDefaultValue,
    },
    pathNodeLabel: {
      title: '标签映射',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: options,
      default: 'id',
    },
    hasDirection: {
      title: '是否有向',
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: false,
    },
    hasMaxDeep: {
      title: '是否有最大深度',
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: false,
    },
    ...metas,
  };
};

export default registerMeta;
