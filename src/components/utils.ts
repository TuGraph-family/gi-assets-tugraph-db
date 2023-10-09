
//使用递归的方式实现数组、对象的深拷贝
export const deepClone = (obj: any): any => {
  let objClone = Array.isArray(obj) ? [] : {};
  if (obj && typeof obj === 'object') {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        //判断ojb子元素是否为对象，如果是，递归复制
        if (obj[key] && typeof obj[key] === 'object') {
          objClone[key] = deepClone(obj[key]);
        } else {
          //如果不是，简单复制
          objClone[key] = obj[key];
        }
      }
    }
  }
  return objClone;
};

export const getSetArray = (arr: any[], key = 'id') => {
  const map = new Map();
  if (arr.length) {
    arr.forEach((i: any) => {
      map.set(i[key], i);
    });
    return [...map.values()];
  }
  return [];
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

export const getQueryString = (name: string) => {
  const reg = new RegExp('(^|&|\\?)' + name + '=([^(&|#)]*)', 'i');
  const r = location.href.match(reg);
  if (r !== null) {
    return decodeURIComponent(r[2]);
  }
  return ''
}