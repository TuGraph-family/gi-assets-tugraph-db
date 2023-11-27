## PathQuery

```jsx
import * as React from 'react';
import { GISDK_TEST } from '@antv/gi-sdk';
import * as Assets from '@antv/gi-assets-basic';
import Asset from './index.ts';

const { registerMeta, info } = Asset;
const { id } = info;

Assets.components[id] = Asset;

const services = [
  {
    id: 'TuGraph-DB/languageQueryService',
    service: async () => {
      return new Promise((resolve) => {
        resolve({
          success: true,
          data: {
            formatData: {
              nodes: [
                {
                  id: 'node-1',
                },
              ],
              edges: [],
            },
          },
        });
      });
    },
  },
];

const App = () => {
  return (
    <div>
      <GISDK_TEST assets={Assets} activeAssets={[info]} services={services} />
    </div>
  );
};

export default App;
```
