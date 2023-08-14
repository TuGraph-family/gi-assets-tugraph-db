import Graphin from "@antv/graphin";

import fonts from "./iconfont.json";

// 生成iconLoader函数
const iconLoaderFunction = () => {
  return {
    fontFamily: "iconfont",
    glyphs: fonts.glyphs
  };
};

// 注册到 Graphin 中
const ilf = iconLoaderFunction();
export const fontFamily = ilf.fontFamily;
export const iconLoader = Graphin.registerFontFamily(iconLoaderFunction);
