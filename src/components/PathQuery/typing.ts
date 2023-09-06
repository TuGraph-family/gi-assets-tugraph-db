export interface IFilterRule{
  type: string;
  weightPropertyName?: string,
  edgeType?: string
}

export interface IState {
  allNodePath: string[][];
  allEdgePath: string[][];
  nodePath: string[][];
  edgePath: string[][];
  highlightPath: Set<number>;
  isAnalysis: boolean;
  filterRule: IFilterRule;
  selecting: string;
}

export interface IHighlightElement{
  nodes: Set<string>;
  edges: Set<string>;
}