import { GraphinData, IUserEdge, IUserNode, Utils } from "@antv/graphin";
import deepmerge from "deepmerge";
import cloneDeep from "lodash/cloneDeep";
import { iconLoader } from "./icons/iconLoader";

import { Expression, Schema, SchemaItem } from "../ExpressionGroup";

export const cropGraphByNodes = (graphData, targetNodes) => {
  const { edges, nodes } = graphData;
  const ids = targetNodes.map((node) => node.id);
  const newEdges = edges.filter((edge) => {
    const { source, target } = edge;
    if (ids.indexOf(source) !== -1 && ids.indexOf(target) !== -1) {
      return true;
    }
    return false;
  });
  const newNodes = nodes.filter((node) => {
    return ids.indexOf(node.id) !== -1;
  });
  return {
    nodes: newNodes,
    edges: newEdges
  };
};

export const formatProperties = (data: {
  id: string;
  label: string;
  properties?: Record<string, string | number>;
}): Record<string, string | number> => {
  return {
    ...(data.properties
      ? data.properties
      : {
          [data.label]: data.label
        }),
    ID: data.id // 带上 ID
  };
};

/**
 * 根据点边数据基于 Schema 生成统计信息
 * @param schema 原始 Schema
 * @param nodesOrEdges 点边数据
 * @param clearEnum 是否需要清除属性的枚举值
 */
export const generateStaticsForSchema = (schema: Schema, nodesOrEdges: any, clearEnum = true) => {
  const newSchema = cloneDeep(schema);
  // 首先清空计数，枚举值等
  newSchema.items.forEach((item) => {
    item.count = 0;
    if (clearEnum) {
      item.properties.forEach((property) => {
        property.enum = new Set();
      });
    }
  });

  // 图数据通过 label 关联到 schema 上的 nodeType/edgeType
  nodesOrEdges.forEach((node) => {
    const existed = newSchema.items.find(({ label }) => label === node.label);
    if (existed) {
      // 为每个属性添加枚举值
      Object.keys({
        ...node.properties,
        ID: node.id
      }).forEach((key) => {
        const existedProperty = existed.properties.find(({ name }) => name === key);

        // 根据实际数据类型修正 schema 中该字段的类型
        const actualType = key === "ID" ? "string" : typeof node.properties[key]; // string number
        if (existedProperty) {
          if (existedProperty.type !== actualType) {
            existedProperty.type = actualType as "string" | "number";
          }

          existedProperty.enum.add(key === "ID" ? `${node.id}` : `${node.properties[key]}`);
        }
      });
      // 统计出现次数
      existed.count++;
    }
  });
  return newSchema;
};

export const filterByTopRule = (
  data: {
    id: string;
    label: string;
    properties: Record<string, string | number>;
  },
  rule: SchemaItem
): boolean => {
  const { logic, type, expressions } = rule;

  // 未配置规则一律通过
  if (expressions.length === 0) {
    return true;
  }

  return logic === "and"
    ? expressions.every(
        (item) => data.label === type && filterByExpression(formatProperties(data), item)
      )
    : expressions.some(
        (item) => data.label === type && filterByExpression(formatProperties(data), item)
      );
};

const filterByExpression = (
  data: Record<string, string | number>,
  expression: Expression
): boolean => {
  const { name, operator, value } = expression || {};
  let formatted: string | number | boolean = value;

  // 原始数据中 boolean 需要转换成字符串比较
  if (typeof data[name] === "boolean") {
    formatted = value === "true";
  }

  // 原始数据中是 long 类型时候需要转成数字类型比较
  if (typeof data[name] === "number") {
    formatted = parseInt(value as string, 10);
  }

  if (operator === "eql") {
    return data[name] === formatted;
  } else if (operator === "not-eql") {
    return data[name] !== formatted;
  } else if (operator === "contain") {
    return `${data[name]}`.indexOf(`${formatted}`) > -1;
  } else if (operator === "not-contain") {
    return `${data[name]}`.indexOf(`${formatted}`) === -1;
  } else if (operator === "gt") {
    return Number(data[name]) > Number(formatted);
  } else if (operator === "gte") {
    return Number(data[name]) >= Number(formatted);
  } else if (operator === "lt") {
    return Number(data[name]) < Number(formatted);
  } else if (operator === "lte") {
    return Number(data[name]) <= Number(formatted);
  }

  return false;
};


export interface NodeStyle {
  nodeType: string;
  size: number;
  elementType: "node";
  color: string;
  fontStyle: {
    family: string;
    position: string;
    size: number;
  };
  icon: {
    iconText: string;
    [key: string]: any;
  };
  displyLabel: string;
  advancedColor: string;
  advancedSize: number;
  labelVisible: boolean;
  advancedIds: string[];
  typeAliasVisible: boolean;
  property: Array<{ name: string; operator: string; value: string }>;
  customColor?: string;
  advancedCustomColor?: string;
}
export interface StyleTemplate {
  [key: string]: Partial<NodeStyle | EdgeStyle>;
}
const defaultNodeStyles: NodeStyle = {
  nodeType: "",
  size: 30,
  color: "#1890ff",
  elementType: "node",
  fontStyle: {
    family: "graphin",
    position: "bottom",
    size: 12
  },
  icon: {
    iconText: ""
  },
  displyLabel: "id",
  advancedColor: "#1890ff",
  advancedSize: 30,
  advancedIds: [],
  labelVisible: true,
  typeAliasVisible: false,
  property: []
};

export interface EdgeStyle {
  advancedColor: string;
  advancedLineWidth: number;
  color: string;
  displyLabel: string;
  edgeStrokeType: string;
  edgeType: string;
  elementType: "edge";
  fontStyle: {
    family: string;
    size: number;
  };
  lineWidth: number;
  advancedIds: string[];
  labelVisible: boolean;
  animateVisible: boolean;
  animateType: "line-dash" | "line-growth" | "circle-running";
  typeAliasVisible: boolean;
  property: Array<{ name: string; operator: string; value: string }>;
  customColor?: string;
  advancedCustomColor?: string;
}
const defaultEdgeStyles: EdgeStyle = {
  advancedColor: "",
  advancedLineWidth: 1,
  color: "#87e8de",
  displyLabel: "class",
  edgeStrokeType: "line",
  edgeType: "subject",
  elementType: "edge",
  fontStyle: { family: "system-ui", size: 11 },
  lineWidth: 1,
  advancedIds: [],
  labelVisible: true,
  animateVisible: false,
  animateType: "circle-running",
  typeAliasVisible: false,
  property: []
};
export const getTransformByTemplate = (styles: any = {}, schemaData) => {
  return (data: GraphinData): GraphinData => {
    const { nodes, edges, combos } = data;
    const newNodes = nodes.map((node) => {
      const nodeType = node.label;
      const nodeSchema = schemaData?.nodes?.find(
        (nodeSchema) => nodeSchema.labelName === nodeType
      );
      const nodeCfg = deepmerge(
        defaultNodeStyles,
        styles[nodeType] || styles["allNodes"] || {}
      ) as NodeStyle;
      const {
        displyLabel,
        size: basicSize,
        color: basicColor,
        customColor,
        fontStyle,
        icon,
        advancedColor,
        advancedCustomColor,
        advancedSize,
        labelVisible,
        typeAliasVisible,
        property
      } = nodeCfg;
      let advancedNodes: IUserNode[] = [];
      if (property?.length && nodeType) {
        const filterSchemaData = [
          {
            type: nodeType,
            label: nodeType,
            expressions: property,
            properties: nodeSchema?.properties
          }
        ];
        advancedNodes = nodes.filter((node) =>
          filterByTopRule(node.data, filterSchemaData[0] as any)
        );
      }
      const advancedIds = advancedNodes.map((item) => item.id);
      const hasCurrentId = advancedIds.indexOf(node.id) !== -1;

      const size = hasCurrentId ? advancedSize : basicSize;

      const nodeColor = hasCurrentId
        ? advancedCustomColor || advancedColor || "#1890ff"
        : customColor || basicColor || "#1890ff";

      // 兼容单选数据
      const labelArr = typeof displyLabel === "string" ? [displyLabel] : displyLabel || [];
      let labelValueArr: string[] = [];
      if (typeAliasVisible && nodeSchema && nodeSchema.typeAlias) {
        labelValueArr.push(nodeSchema.typeAlias);
      }
      if (labelVisible) {
        labelArr.forEach((label) => {
          console.log('node' ,node)
          if (node.data) {
            labelValueArr.push(node.data[label] || node.id);  
          } else if (node.properties) {
            labelValueArr.push(node.properties[label] || node.id);
          }
        });
      }
      const labelValue = labelValueArr.join("\n");
      const nodeLabelVisible = typeAliasVisible || labelVisible;
      return {
        ...node,
        type: "graphin-circle",
        style: {
          ...node.style,
          halo: node.style?.halo
            ? {
                ...node.style?.halo,
                stroke: nodeColor
              }
            : undefined,
          label: {
            // 如果设置了显示的属性值，则从 schema 中获取具体的值
            value: labelValue,
            position: fontStyle.position,
            fontSize: fontStyle.size,
            fontFamily: fontStyle.family,
            fill: "#8c8c8c",
            visible: nodeLabelVisible
          },
          icon: {
            type: "font" as "font",
            fontFamily: "iconfont",
            value: iconLoader[icon.iconText],
            fill: nodeColor,
            size: size * 0.7
          },
          keyshape: {
            size: size || 1,
            stroke: nodeColor,
            fill: nodeColor,
            fillOpacity: 0.3,
            strokeOpacity: 1,
            shadowColor: nodeColor,
            shadowBlur: 20,
            lineWidth: 0
          }
        }
      };
    });
    const filteredEdges = edges.map((edge) => {
      const edgeType = edge.label;
      const edgeSchema = schemaData?.edges?.find(
        (edgeSchema) => edgeSchema.labelName === edgeType
      );
      const edgeCfg = deepmerge(
        defaultEdgeStyles,
        styles[edgeType] || styles.allEdges || {}
      ) as EdgeStyle;
      const {
        displyLabel,
        fontStyle,
        color: basicColor,
        lineWidth: baseLineWidth,
        edgeStrokeType,
        advancedLineWidth,
        advancedColor,
        labelVisible,
        animateVisible,
        animateType,
        typeAliasVisible,
        property
      } = edgeCfg;

      let advancedEdges: IUserEdge[] = [];
      if (property?.length && edgeType) {
        const filterSchemaData = [
          {
            type: edgeType,
            label: edgeType,
            expressions: property,
            properties: edgeSchema?.properties
          }
        ];
        advancedEdges = edges.filter((node) =>
          filterByTopRule(node.data, filterSchemaData[0] as any)
        );
      }
      const advancedIds = advancedEdges.map((item) => item.id);

      const isAdvanced = advancedIds.indexOf(edge.id) !== -1;
      const lineWidth = isAdvanced ? advancedLineWidth : baseLineWidth || advancedLineWidth;
      const color = isAdvanced ? advancedColor || basicColor || "#87e8de" : basicColor || "#87e8de";

      // 兼容单选数据
      const labelArr = typeof displyLabel === "string" ? [displyLabel] : displyLabel || [];
      let labelValueArr: string[] = [];
      if (typeAliasVisible && edgeSchema && edgeSchema.typeAlias) {
        labelValueArr.push(edgeSchema.typeAlias);
      }
      if (labelVisible) {
        labelArr.forEach((label) => {
          if (edge.data) {
            labelValueArr.push(edge.data[label] || edge.id);
          } else if (edge.properties) {
            labelValueArr.push(edge.properties[label] || edge.id);
          }
        });
      }
      const labelValue = labelValueArr.join("\n");
      const edgeLabelVisible = typeAliasVisible || labelVisible;

      return {
        ...edge,
        type: "graphin-line",
        style: {
          ...edge.style,
          label: {
            // 如果设置了显示的属性值，则从 schema 中获取具体的值
            value: labelValue,
            fontSize: fontStyle.size || 12,
            fontFamily: fontStyle.family,
            fill: "#8c8c8c",
            visible: edgeLabelVisible
          },
          keyshape: {
            lineWidth: lineWidth,
            stroke: color || "#87e8de",
            lineDash: edgeStrokeType === "line" ? [] : [5, 5]
          },
          animate: {
            visible: animateVisible,
            type: animateType || ("circle-running" as "circle-running"),
            dotColor: color || "#87e8de",
            repeat: true,
            duration: 3000
          }
        }
      };
    });
    const newEdges = Utils.processEdges(cloneDeep(filteredEdges), { poly: 50, loop: 10 });

    return {
      ...data,
      nodes: newNodes,
      edges: newEdges,
      combos: combos
    };
  };
};
