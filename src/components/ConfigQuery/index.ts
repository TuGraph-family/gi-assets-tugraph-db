import Component from "./Component";
import registerMeta from "./registerMeta";

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: "ConfigQuery",
  name: "配置查询",
  category: "data-query",
  desc: "通过查询节点类型、属性类型、过滤条件等配置，查出图数据",
  cover: "http://xxxx.jpg",
  type: "GIAC_CONTENT"
};

export default {
  info,
  component: Component,
  registerMeta
};
