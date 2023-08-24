import { extra } from '@antv/gi-sdk';
import info from './info';
const { deepClone, GIAC_METAS } = extra;
const metas = deepClone(GIAC_METAS);

metas.GIAC.properties.GIAC.properties.icon.default = info.icon;

export default () => {
  return {
  };
};
