import Component from "./Component";
import registerMeta from "./registerMeta";

const info = {
  id: "DoubleClickExpandNode",
  name: "双击扩散节点",
  category: "data-query",
  desc: "双击鼠标左键，自动扩散节点一度关系",
  cover: "http://xxxx.jpg",
  type: "AUTO",
};

export default {
  info,
  component: Component,
  registerMeta
};
