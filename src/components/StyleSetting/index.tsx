import Component from "./Component";
import registerMeta from "./registerMeta";

/**   index.md 中解析得到默认值，也可用户手动修改 */

const info = {
  id: "TuGraphStyleSetting",
  name: "样式设置",
  category: "system-interaction",
  desc: "样式设置",
  cover: "http://xxxx.jpg",
  type: "GIAC_CONTENT"
};

export default {
  info,
  component: Component,
  registerMeta
};
