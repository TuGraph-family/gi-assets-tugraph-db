import Component from "./Component";
import registerMeta from "./registerMeta";

/**   index.md 中解析得到默认值，也可用户手动修改 */
const info = {
  id: "SimpleQuery",
  name: "简单查询",
  category: "data-query",
  desc: "通过查询节点类型、属性类型、过滤条件等配置，查出图数据",
  cover: "http://xxxx.jpg",
  type: "AUTO",
};

export default {
  info,
  component: Component,
  registerMeta
};
