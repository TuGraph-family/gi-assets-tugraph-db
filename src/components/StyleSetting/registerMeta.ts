import { extra } from '@antv/gi-sdk';
const { deepClone, GIAC_CONTENT_METAS } = extra;

const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = '外观';
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default =
  'icon-waiguanyangshi';
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.tooltip.default =
  '根据点上的属性值可指定颜色、大小、形状';
metas.GI_CONTAINER_INDEX.default = -8;

export default (context) => {
  const { services } = context;
  const serviceOptions = services.map((c) => {
    return {
      value: c.id,
      label: c.id,
    };
  });
  return {
    localServiceId: {
      title: '保存样式配置到本地服务',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: serviceOptions,
      },
      default: 'TuGraph-DB/saveElementStyleToLocalService',
    },
    schemaServiceId: {
      title: 'Schema服务',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: serviceOptions,
      },
      default: 'TuGraph-DB/graphSchemaService',
    },
    ...metas,
  };
};
