import { extra } from '@antv/gi-sdk';
const { deepClone, GIAC_METAS } = extra;

const metas = deepClone(GIAC_METAS);
metas.GIAC.properties.GIAC.properties.title.default = '布局';
metas.GIAC.properties.GIAC.properties.icon.default = 'icon-tugraph-layout';

export default () => {
  return {
    ...metas,
  };
};
