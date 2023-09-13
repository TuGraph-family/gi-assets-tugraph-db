export const data = {
  nodes: [
    {
      id: '某A控股公司',
      nodeType: 'company',
      nodeTypeKeyFromProperties: 'nodeType',
      data: {
        id: '某A控股公司',
        nodeType: 'company',
      },
    },
    {
      id: '某B中国控股公司',
      nodeType: 'company',
      nodeTypeKeyFromProperties: 'nodeType',
      data: {
        id: '某B中国控股公司',
        nodeType: 'company',
      },
    },
    {
      id: 'XX(中国)软件有限公司',
      nodeType: 'company',
      nodeTypeKeyFromProperties: 'nodeType',
      data: {
        id: 'XX(中国)软件有限公司',
        nodeType: 'company',
      },
    },
    {
      id: '陕西XXX网络科技有限公司',
      nodeType: 'company',
      nodeTypeKeyFromProperties: 'nodeType',
      data: {
        id: '陕西XXX网络科技有限公司',
        nodeType: 'company',
      },
    },
    {
      id: 'XXX集团控股有限公司',
      nodeType: 'company',
      nodeTypeKeyFromProperties: 'nodeType',
      data: {
        id: 'XXX集团控股有限公司',
        nodeType: 'company',
      },
    },
    {
      id: 'XXX科技集团股份有限公司',
      nodeType: 'company',
      nodeTypeKeyFromProperties: 'nodeType',
      data: {
        id: 'XXX科技集团股份有限公司',
        nodeType: 'company',
      },
    },
    {
      id: '张某',
      nodeType: 'person',
      nodeTypeKeyFromProperties: 'nodeType',
      data: {
        id: '张某',
        nodeType: 'person',
      },
    },
    {
      id: '王某',
      nodeType: 'person',
      nodeTypeKeyFromProperties: 'nodeType',
      data: {
        id: '王某',
        nodeType: 'person',
      },
    },
    {
      id: '李某',
      nodeType: 'person',
      nodeTypeKeyFromProperties: 'nodeType',
      data: {
        id: '李某',
        nodeType: 'person',
      },
    },
    {
      id: '周某',
      nodeType: 'person',
      nodeTypeKeyFromProperties: 'nodeType',
      data: {
        id: '周某',
        nodeType: 'person',
      },
    },
    {
      id: '罗某',
      nodeType: 'person',
      nodeTypeKeyFromProperties: 'nodeType',
      data: {
        id: '罗某',
        nodeType: 'person',
      },
    },
  ],
  edges: [
    {
      source: '某A控股公司',
      target: '某B中国控股公司',
      edgeType: 'shareHolding',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '某A控股公司',
        target: '某B中国控股公司',
        edgeType: 'shareHolding',
        percent: '100%',
      },
    },
    {
      source: '某B中国控股公司',
      target: 'XX(中国)软件有限公司',
      edgeType: 'shareHolding',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '某B中国控股公司',
        target: 'XX(中国)软件有限公司',
        edgeType: 'shareHolding',
        percent: '100%',
      },
    },
    {
      source: 'XX(中国)软件有限公司',
      target: '陕西XXX网络科技有限公司',
      edgeType: 'shareHolding',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: 'XX(中国)软件有限公司',
        target: '陕西XXX网络科技有限公司',
        edgeType: 'shareHolding',
        percent: '100%',
      },
    },
    {
      source: '陕西XXX网络科技有限公司',
      target: 'XXX科技集团股份有限公司',
      edgeType: 'shareHolding',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '陕西XXX网络科技有限公司',
        target: 'XXX科技集团股份有限公司',
        edgeType: 'shareHolding',
        percent: '32.65',
      },
    },
    {
      source: '周某',
      target: 'XXX集团控股有限公司',
      edgeType: 'manager',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '周某',
        target: 'XXX集团控股有限公司',
        edgeType: 'manager',
        position: '实际控制人(疑似)',
      },
    },
    {
      source: '周某',
      target: 'XXX科技集团股份有限公司',
      edgeType: 'manager',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '周某',
        target: 'XXX科技集团股份有限公司',
        edgeType: 'manager',
        position: '实际控制人',
      },
    },
    {
      source: '罗某',
      target: 'XXX科技集团股份有限公司',
      edgeType: 'manager',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '罗某',
        target: 'XXX科技集团股份有限公司',
        edgeType: 'manager',
        position: '执行董事',
      },
    },
    {
      source: '罗某',
      target: 'XXX集团控股有限公司',
      edgeType: 'manager',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '罗某',
        target: 'XXX集团控股有限公司',
        edgeType: 'manager',
        position: '执行董事',
      },
    },
    {
      source: '张某',
      target: 'XXX集团控股有限公司',
      edgeType: 'manager',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '张某',
        target: 'XXX集团控股有限公司',
        edgeType: 'manager',
        position: 'CEO',
      },
    },
    {
      source: '张某',
      target: 'XX(中国)软件有限公司',
      edgeType: 'manager',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '张某',
        target: 'XX(中国)软件有限公司',
        edgeType: 'manager',
        position: '总经理',
      },
    },
    {
      source: '张某',
      target: '陕西XXX网络科技有限公司',
      edgeType: 'manager',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '张某',
        target: '陕西XXX网络科技有限公司',
        edgeType: 'manager',
        position: '总经理',
      },
    },
    {
      source: '王某',
      target: '陕西XXX网络科技有限公司',
      edgeType: 'manager',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '王某',
        target: '陕西XXX网络科技有限公司',
        edgeType: 'manager',
        position: '董事',
      },
    },
    {
      source: '李某',
      target: '陕西XXX网络科技有限公司',
      edgeType: 'manager',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '李某',
        target: '陕西XXX网络科技有限公司',
        edgeType: 'manager',
        position: '非执行董事',
      },
    },
    {
      source: '李某',
      target: 'XX(中国)软件有限公司',
      edgeType: 'manager',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '李某',
        target: 'XX(中国)软件有限公司',
        edgeType: 'manager',
        position: '董事',
      },
    },
    {
      source: '李某',
      target: '陕西XXX网络科技有限公司',
      edgeType: 'manager',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: '李某',
        target: '陕西XXX网络科技有限公司',
        edgeType: 'manager',
        position: '董事',
      },
    },
    {
      source: 'XXX集团控股有限公司',
      target: '某A控股公司',
      edgeType: 'shareHolding',
      edgeTypeKeyFromProperties: 'edgeType',
      data: {
        source: 'XXX集团控股有限公司',
        target: '某A控股公司',
        edgeType: 'shareHolding',
        percent: '100%',
      },
    },
  ],
  combos: [],
};

export const mockList = [
  {
    algorithmId: 'string',
    name: 'string',
    algorithmName: 'string',
    executionStatus: 'stop',
    algorithmExecutionTime: 'string',
    creator: 'string',
    createTime: '2023-03-27 11:48:38',
    algorithmConfigName: 'string',
    nodeType: 'All',
    edgeType: 'Test',
    algorithmConfigType: '0',
    selectAlgorithm: 'bfs',
    algorithmParamsMap: {
      src_id: 'string',
      target_id: 'string',
      iterations: '10',
    },
    selectOutputDataOriginType: '0',
    tugrapthName: 'string',
    selectWriteTarget: '',
    dataOriginPath: '',
  },
];

export const mockResultList = [
  {
    algorithmName: 'n1',
    data: [
      {
        nodeId: 'string1',
        test1: '1',
        test2: '2',
        test3: '3',
      },
      {
        nodeId: 'string2',
        test1: '4',
        test2: '5',
        test3: '6',
      },
    ],
  },
  {
    algorithmName: 'n2',
    data: [
      {
        nodeId: 'string1',
        test1: '1',
        test2: '2',
        test3: '3',
      },
      {
        nodeId: 'string2',
        test1: '4',
        test2: '5',
        test3: '6',
      },
    ],
  },
];
