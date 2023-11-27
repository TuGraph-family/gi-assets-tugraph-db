import { defineConfig } from 'dumi';

export default defineConfig({
  themeConfig: {
    name: 'Assets',
  },
  locales: [{ id: 'zh-CN', name: '中文' }],
  resolve: {
    docDirs: ['src'], // 2.0 默认值
  },
  links: [
    {
      href: 'https://gw.alipayobjects.com/os/lib/antd/4.6.6/dist/antd.css',
      rel: 'stylesheet',
    },
  ],
});
