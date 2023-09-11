export const selectAlgorithm = [
  {
    label: '广度优先搜索',
    value: 'bfs',
    en: 'Breadth-First Search',
    tooltip:
      '广度优先搜索实现了Breadth-first Search算法，从根顶点开始，沿着图的宽度遍历所有可访问顶点。返回结果为遍历顶点个数。算法内容请参考 https://en.wikipedia.org/wiki/Breadth-first_search',
  },
  {
    label: '网页排序',
    value: 'pagerank',
    en: 'Pagerank',
    tooltip:
      '网页排序程序实现了常用的Pagerank算法。该算法根据图中边和边权值计算所有顶点的重要性排名，PageRank值越高，表示该顶点在图中的重要性越高。计算时以顶点数量的倒数为各顶点初始Rank值，然后将顶点的Rank值按照出边平均传递到相邻顶点，重复该传递过程直到满足给定的收敛阈值或达到给定迭代轮数。每轮传递结束后，所有顶点的Rank值会有一定的的比例随机传递到任意顶点上。算法内容请参考 https://en.wikipedia.org/wiki/PageRank。',
  },
  {
    label: '单源最短路径',
    value: 'sssp',
    en: 'Single-Source Shortest Path',
    tooltip:
      '单源最短路径实现了Single Source Shortest Path算法，根据给定的源顶点，计算从该源顶点出发到其他任意顶点的最短路径长度。算法内容请参考 https://en.wikipedia.org/wiki/Shortest_path_problem。',
  },
  {
    label: '弱连通分量',
    value: 'wcc',
    en: 'Weakly Connected Components',
    tooltip:
      '弱连通分量程序实现了Weakly Connected Components算法，该算法会计算图中所有的弱连通分量。弱连通分量是图的一个子图，子图中任意两点之间均存在可达路径。算法内容请参考https://en.wikipedia.org/wiki/Connected_component_(graph_theory)。',
  },
  {
    label: '全对最短路径',
    value: 'apsp',
    en: 'All-Pair Shortest Path',
    tooltip:
      '全对最短路径程序实现了All-Pair Shortest Path算法，计算图中任意两点间的最短路径。返回结果为任意存在路径的顶点对之间的最短路径长度。算法内容请参考https://en.wikipedia.org/wiki/Floyd-Warshall_algorithm',
  },
  {
    label: '介数中心度',
    value: 'bc',
    en: 'Betweenness Centrality',
    tooltip:
      '介数中心度程序实现了Betweenness Centrality算法，估算图中所有顶点的介数中心度值。介数中心度值反映了图中任一最短路径经过该顶点的可能性，值越高表示有越多的最短路径经过了该顶点。计算时需给定抽样点个数，分别以这些抽样点为中心进行计算。算法内容请参考https://en.wikipedia.org/wiki/Betweenness_centrality。',
  },
  {
    label: '置信度传播',
    value: 'bp',
    en: 'Belief Propagation',
    tooltip:
      '置信度传播程序实现了Belief Propagation算法。该算法给定已观测顶点的边缘分布，利用顶点之间相互传递消息的机制来估算未观测顶点的边缘分布。算法内容请参考https://en.wikipedia.org/wiki/Belief_propagation。',
  },
  {
    label: '距离中心度',
    value: 'cc',
    en: 'Closeness Centrality',
    tooltip:
      '距离中心度程序实现了Closeness Centrality算法，估算任意顶点到图中其他顶点的最短路径的平均长度。距离中心度越小，表示该顶点到其他顶点的平均最短距离最小，意味着该顶点从几何角度看更位于图的中心位置。计算时需要给定抽样点个数，分别以这些抽样点为中心进行计算。算法内容请参考https://en.wikipedia.org/wiki/Closeness_centrality。',
  },
  {
    label: '集聚系数',
    value: 'clco',
    en: 'Clustering Coefficient',
    tooltip:
      '集聚系数程序实现了Clustering Coefficient算法，计算图中顶点之间聚集程度的系数。返回结果包括整体集聚系数和顶点集聚系数。整体集聚系数反映了图中整体的集聚程度的评估，顶点集聚系数包括任意顶点的集聚系数，反映了该顶点附近的集聚程度。集聚系数越高，表示集聚程度越高。算法内容请参考https://en.wikipedia.org/wiki/Clustering_coefficient。',
  },
  {
    label: '共同邻居',
    value: 'cn',
    en: 'Common Neighborhood',
    tooltip:
      '共同邻居程序实现了Common Neighborhood算法，计算任意给定相邻顶点对之间的共同邻居数量。计算时给定待查询的若干个顶点对，返回结果为待查询的任意顶点对的共同邻居数量。',
  },
  {
    label: '度数关联度',
    value: 'dc',
    en: 'Degree Correlation',
    tooltip:
      '度数关联度程序实现了Degree Correlation算法，通过计算任意相邻顶点对之间的Pearson关联系数来计算图的度数关联度，可用来表征图中高度数顶点之间关联程度。度数关联度越高，表示图中高度数顶点之间的关联程度越高。算法内容请参考https://en.wikipedia.org/wiki/Pearson_correlation_coefficient',
  },
  {
    label: '直径估计',
    value: 'de',
    en: 'Dimension Estimation',
    tooltip:
      '直径估计程序实现了Dimension Estimation算法。该算法会计算图中最长的最短路径长度，用来表征图的直径大小。算法内容请参考http://mathworld.wolfram.com/GraphDiameter.html。',
  },
  {
    label: 'EgoNet算法',
    value: 'en',
    en: 'EgoNet',
    tooltip:
      'EgoNet算法需要给定根顶点和K值，以根顶点为源顶点进行宽度优先搜索，找出所有K度以内的邻居组成的子图。找到的子图称为根顶点的EgoNet。',
  },

  {
    label: '超链接主题搜索',
    value: 'hits',
    en: 'Hyperlink-Induced Topic Search',
    tooltip:
      '超链接主题搜索算法实现了Hyperlink-Induced Topic Search算法，该算法假定每个顶点具有权威性Authority和枢纽性Hub两个属性，一个好的枢纽顶点应该指向许多高权威性的顶点，而一个良好的权威顶点应该被许多高枢纽型的顶点指向。算法将返回每个顶点的权威性值和枢纽性值。算法内容请参考https://en.wikipedia.org/wiki/HITS_algorithm。',
  },
  {
    label: '杰卡德系数',
    value: 'ji',
    en: 'Jaccard Index',
    tooltip:
      '杰卡德系数程序实现了Jaccard Index算法。该算法计算了给定顶点对之间的Jaccard系数，可用来表示这两个顶点的相似度。Jaccard系数越高，表示顶点对之间的相似程度越高。计算时给定带查询的若干顶点对，返回结果为这些顶点对的Jaccard系数。算法内容请参考https://en.wikipedia.org/wiki/Jaccard_index。',
  },
  {
    label: 'K核算法',
    value: 'kcore',
    en: 'K-core',
    tooltip:
      'k核算法实现了k-core算法。该算法计算所有顶点的核数，或找出图中所有的K核子图。K核子图是一种特殊子图，子图中任意顶点度数都不小于给定K值。算法内容请参考 https://en.wikipedia.org/wiki/Degeneracy_(graph_theory)。',
  },
  {
    label: '鲁汶社区发现',
    value: 'louvain',
    en: 'Louvain',
    tooltip:
      '鲁汶社区发现程序实现了Fast-unfolding算法。该算法是基于模块度的社区发现算法，通过不断合并顶点社区来最大化图的模块度，能够发现层次性的社区结构。算法内容请参考 https://en.wikipedia.org/wiki/Louvain_Modularity。',
  },
  {
    label: '标签传播',
    value: 'lpa',
    en: 'Label Propagation Algorithm',
    tooltip:
      '标签传播算法程序实现了Label Propagation Algorithm算法。该算法是基于标签传播的社区发现算法，计算对象为无权图。在标签传递时，每个顶点对收到的所有标签进行次数累加，在累加和最高的标签中随机选择一个。迭代收敛或执行到给定轮数后算法终止。最终输出结果为每个顶点的标签，标签值相同的顶点视为在同一社区。算法内容请参考 https://en.wikipedia.org/wiki/Label_Propagation_Algorithm。',
  },

  {
    label: '多源最短路径',
    value: 'mssp',
    en: 'Multiple-source Shortest Paths',
    tooltip:
      '多源最短路径程序实现了Multiple-source Shortest Paths算法，根据给定的多个源顶点，从这些源顶点出发，计算到达任意顶点的最短路径值。其中，多个源顶点到某一顶点的最短路径值为分别从每个源顶点出发到达该顶点的最短路径的最小值。算法内容请参考 https://en.wikipedia.org/wiki/Shortest_path_problem。',
  },
  {
    label: '个性化网页排序',
    value: 'ppr',
    en: 'Personalized PageRank',
    tooltip:
      '个性化网页排序程序实现了Personalized PageRank算法。该算法根据给定的源顶点，基于该源顶点个性化计算所有顶点对于源顶点的重要性排名。Rank值越高，表示该顶点对于源顶点越重要。与PageRank不同的是，初始化时源顶点Rank值为1，其余顶点Rank值为0；并且每轮传递结束后，Rank值会有一定的比例随即传递回源顶点。算法内容请参考 https://cs.stanford.edu/people/plofgren/Fast-PPR_KDD_Talk.pdf。',
  },

  {
    label: '强连通分量',
    value: 'scc',
    en: 'Strongly Connected Components',
    tooltip:
      '强连通分量程序实现了Strongly Connected Components算法。该算法计算了图中所有的强连通分量，强连通分量是图的一个子图，子图中可从任意顶点出发到达其他任意顶点。算法内容请参考https://en.wikipedia.org/wiki/Strongly_connected_component。',
  },
  {
    label: '监听标签传播',
    value: 'slpa',
    en: 'PSpeaker-listener Label Propagation Algorithm',
    tooltip:
      '监听标签传播算法程序实现了Speaker-listener Label Propagation Algorithm算法。该算法是基于标签传播和历史标签记录的社区发现算法，是对标签传播算法的扩展。与标签传播算法不同的是，本算法会对所有顶点记录其历史标签，在迭代中对标签进行累加时，会将历史标签也计算在内。最终输出结果为每个顶点的所有历史标签记录。算法内容请参考论文：“SLPA: Uncovering Overlapping Communities in Social Networks via a Speaker-Listener Interaction Dynamic Process”。',
  },

  {
    label: '两点间最短路径',
    value: 'SPSP',
    en: 'Single-Pair Shortest Path',
    tooltip:
      '两点间最短路径程序实现了Bidirectional Breadth-First Search算法，在有向无权图上从起点沿着出边做正向宽度优先搜搜，从终点沿着入边做反向宽度优先搜索，通过起点和终点共同遍历到的顶点来确定从起点到终点的最短路径长度。算法内容请参考https://en.wikipedia.org/wiki/Bidirectional_search。',
  },
  {
    label: '三角计数',
    value: 'triangle',
    en: 'Triangle Counting',
    tooltip:
      '三角计数实现了Triangle-counting算法，计算无向图中的三角形个数，可用来表征图中顶点的关联程度。三角形数越多，表示图中顶点的关联程度越高。算法内容请参考论文：“Finding, Counting and Listing All Triangles in Large Graphs, an Experimental Study” 。',
  },

  {
    label: '信任指数排名',
    value: 'trustrank',
    en: 'Trustrank',
    tooltip:
      '信任指数排名算法实现了Trustrank算法，可以根据给定的白名单，计算任意顶点的信任指数。信任指数越高，表示该顶点为非法顶点的可能性越小。算法内容请参考 https://en.wikipedia.org/wiki/TrustRank。',
  },
  {
    label: '带权重的标签传播',
    value: 'wlpa',
    en: 'Weighted Label Propagation Algorithm',
    tooltip:
      '带权重的标签传播算法程序实现了Weighted Label Propagation Algorithm算法。=与标签传播算法不同的是，标签的传递跟边的权重相关，在标签传递时，每个顶点会根据标签的入边进行权重累加，在累加和最高的标签中随机选择一个。算法内容请参考 https://en.wikipedia.org/wiki/Label_Propagation_Algorithm。',
  },
  {
    label: '带权重的网页排序',
    value: 'wpagerank',
    en: 'Weighted Pagerank Algorithm',
    tooltip:
      '带权重的网页排序算法程序实现了Weighted Pagerank算法。与PageRank算法不同的是，Rank值的传递跟边的权重有关，顶点的Rank值将按照边权重加权传递到相邻顶点。算法内容请参考https://en.wikipedia.org/wiki/PageRank。',
  },
];
