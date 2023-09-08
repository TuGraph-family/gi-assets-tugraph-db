export const getQueryString = (name: string) => {
  const reg = new RegExp('(^|&|\\?)' + name + '=([^(&|#)]*)', 'i');
  const r = location.href.match(reg);
  if (r !== null) {
    return decodeURIComponent(r[2]);
  }
  return '';
};

/**
 * 
 * @param hex 十六进制颜色值
 * @param alpha 透明度
 * @returns 
 */
export const hexToRGBA = (hex, alpha) => {
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
}
