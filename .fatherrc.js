import { defineConfig } from 'father';
import path from 'path';
export default defineConfig({
  esm: {
    output: 'es',
    input: 'src',
  },
  cjs: {
    output: 'lib',
    input: 'src',
  },
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
});
