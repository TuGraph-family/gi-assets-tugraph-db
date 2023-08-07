import Component from "./Component";
import registerMeta from "./registerMeta";

/**   index.md 中解析得到默认值，也可用户手动修改 */
export const info = {
  id: "LanguageQuery",
  name: "语句查询",
  category: "data-query",
  desc: "通过写 ISO_GQL 或 Gremlin 语句查询图数据",
  cover: "http://xxxx.jpg",
  type: "GIAC_CONTENT",
};

export default {
  info,
  component: Component,
  registerMeta
};
