export const getQueryString = (name: string) => {
  const reg = new RegExp('(^|&|\\?)' + name + '=([^(&|#)]*)', 'i');
  const r = location.href.match(reg);
  if (r !== null) {
    return decodeURIComponent(r[2]);
  }
  return '';
};
