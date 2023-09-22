import { InputNumber } from "antd";
import React from 'react'
// eslint-disable-next-line max-lines
import {
  ApartmentOutlined,
  BranchesOutlined,
  CopyrightCircleOutlined,
  DeploymentUnitOutlined,
  GatewayOutlined,
  ShareAltOutlined
} from "@ant-design/icons";
import { Select, Slider, Switch } from "antd";

import TwoInput from "./TwoInput";
import IntegerStep from "../StyleSetting/IntegerStep";

export interface LayoutItem {
  component: any;
  key: string;
  label: string;
  labelZh: string;
  description?: string;
  defaultValue?: string | boolean | number[] | number | null;
  optionsData?: {
    label: string;
    value: string;
  }[];
  isSwitch?: boolean;
  icon?: any;
  [x: string]: any;
}
export interface LayoutConfig {
  title: string;
  type: string;
  items: LayoutItem[];
  icon?: any;
  thumbnail?: any;
}

const radialMarks = {
  10: '最短',
  100: '短',
  300: '中等',
  500: '长',
}

const dagreNodesepMarks = {
  10: '最小',
  50: '小',
  100: '中等',
  200: '最大',
}

const gridWitdhMarks = {
  10: '最小',
  1000: '较宽',
  3000: '中等',
  5000: '宽',
}

const gridHeightMarks = {
  10: '最小',
  1000: '较高',
  3000: '中等',
  5000: '高',
}

const graphLayoutConfig: Record<string, LayoutConfig> = {
  "force2": {
    title: "经典力导向布局",
    type: "force2",
    icon: BranchesOutlined,
    thumbnail:
      "https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*m5ABT5ra4w4AAAAAAAAAAABkARQnAQ",
    items: [
      {
        component: TwoInput,
        label: "center",
        labelZh: "布局中心",
        key: "layoutConfig.center",
        inputLabel: ["x", "y"],
        defaultValue: [500, 300],
        description: "布局的中心点，默认为图的中心点"
      }
    ]
  },
  concentric: {
    title: "同心圆布局",
    type: "concentric",
    icon: DeploymentUnitOutlined,
    thumbnail:
      "https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*m5ABT5ra4w4AAAAAAAAAAABkARQnAQ",
    items: [
      {
        component: TwoInput,
        label: "center",
        labelZh: "中心点",
        key: "layoutConfig.center",
        defaultValue: [500, 300],
        description: "布局的中心点，默认值为图的中心"
      },
      {
        component: IntegerStep,
        label: "nodeSize",
        labelZh: "节点大小",
        key: "layoutConfig.nodeSize",
        defaultValue: 50,
        description: "节点的大小（直径），用于防止节点重叠时的碰撞检测"
      },
      {
        component: IntegerStep,
        label: "minNodeSpacing",
        labelZh: "最小间距",
        key: "layoutConfig.minNodeSpacing",
        defaultValue: 10,
        description: "环与环之间的最小间距，用于调整半径，默认值为10"
      },
      {
        component: Switch,
        isSwitch: true,
        label: "preventOverlap",
        labelZh: "是否防止重叠",
        key: "layoutConfig.preventOverlap",
        defaultValue: true,
        size: "small",
        description:
          "是否防止重叠，设置为true后，可以避免节点之间相互重叠，必须配置nodeSize使用，只有当nodeSIze设置为和节点大小一致时，才会进行节点重叠的碰撞检测"
      },
      // {
      //   component: IntegerStep,
      //   label: "sweep",
      //   labelZh: "弧度差",
      //   key: "layoutConfig.sweep",
      //   defaultValue: undefined,
      //   min: 0,
      //   max: 10,
      //   description: "第一个节点和最后一个节点之间的弧度差"
      // },
      {
        component: Switch,
        isSwitch: true,
        label: "equidistant",
        labelZh: "是否等间距",
        key: "layoutConfig.equidistant",
        defaultValue: false,
        size: "small",
        description: "环与环之间的距离是否相等，默认为false，设置为true，在视觉上比较统一"
      },
      // {
      //   component: Slider,
      //   label: "startAngle",
      //   labelZh: "起始弧度",
      //   key: "layoutConfig.startAngle",
      //   defaultValue: (3 / 2) * Math.PI,
      //   min: 0,
      //   max: 2 * Math.PI,
      //   step: 0.1 * Math.PI,
      //   description: "节点的起始弧度值，默认为3 / 2 * Math.PI"
      // },
      // {
      //   component: Switch,
      //   isSwitch: true,
      //   label: "clockwise",
      //   labelZh: "是否顺时针",
      //   key: "layoutConfig.clockwise",
      //   defaultValue: false,
      //   size: "small",
      //   description: "是否按照顺时针方向排列，默认为false"
      // },
      // {
      //   component: Select,
      //   label: "sortBy",
      //   labelZh: "排序依据",
      //   key: "layoutConfig.sortBy",
      //   size: "small",
      //   defaultValue: null,
      //   options: [
      //     { label: null, value: null },
      //     { label: "topology", value: "topology" },
      //     { label: "degree", value: "degree" }
      //   ],
      //   description: "指定排序的依据，即节点的某个属性名，数值越高则该节点被放置的越中心"
      // }
    ]
  },
  circular: {
    title: "圆形布局",
    type: "circular",
    icon: CopyrightCircleOutlined,
    thumbnail:
      "https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*m5ABT5ra4w4AAAAAAAAAAABkARQnAQ",
    items: [
      {
        component: TwoInput,
        label: "center",
        labelZh: "中心点",
        key: "layoutConfig.center",
        defaultValue: [500, 300],
        description: "布局的中心点，默认值为图的中心"
      },
      // {
      //   component: Slider,
      //   label: "radius",
      //   labelZh: "半径",
      //   key: "layoutConfig.radius",
      //   defaultValue: 100,
      //   max: 2500,
      //   min: 1,
      //   description: "圆的半径，默认值为100"
      // },
      // {
      //   component: Slider,
      //   label: "startAngle",
      //   labelZh: "起始角度",
      //   key: "layoutConfig.startAngle",
      //   defaultValue: 0,
      //   max: 2 * Math.PI,
      //   min: 0,
      //   step: 0.1 * Math.PI,
      //   description: "圆环起始的位置对应的角度"
      // },
      // {
      //   component: Slider,
      //   label: "endAngle",
      //   labelZh: "结束角度",
      //   key: "layoutConfig.starAngle",
      //   defaultValue: 2 * Math.PI,
      //   max: 2 * Math.PI,
      //   min: 0,
      //   step: 0.1 * Math.PI,
      //   description: "圆环结束的位置对应的角度"
      // },
      // {
      //   component: Slider,
      //   label: 'startRadius',
      //   labelZh: '起始半径',
      //   key: 'layoutConfig.startRadius',
      // },
      // {
      //   component: Slider,
      //   label: 'endRadius',
      //   key: 'layoutConfig.endRadius',
      // },
      // {
      //   component: Switch,
      //   isSwitch: true,
      //   label: "clockwise",
      //   labelZh: "是否顺时针",
      //   key: "layoutConfig.clockwise",
      //   defaultValue: true,
      //   size: "small",
      //   description: "是否顺时针排列，默认值为true"
      // },
      // {
      //   component: Slider,
      //   label: "divisions",
      //   labelZh: "分段数",
      //   key: "layoutConfig.divisions",
      //   defaultValue: 1,
      //   max: 10,
      //   min: 1,
      //   description: "节点在环上的分段数，设置后将会均匀分布在圆环上"
      // },
      // {
      //   component: Select,
      //   label: "ordering",
      //   labelZh: "排序依据",
      //   key: "layoutConfig.ordering",
      //   size: "small",
      //   defaultValue: null,
      //   options: [
      //     { label: null, value: null },
      //     { label: "topology", value: "topology" },
      //     { label: "degree", value: "degree" }
      //   ],
      //   description:
      //     "节点在环上的排序的依据，默认null代表直接使用数据中的顺序，topology表示按拓扑排序，degree表示按节点度数排序"
      // },
      {
        component: IntegerStep,
        label: "angleRatio",
        labelZh: "间隔",
        key: "layoutConfig.angleRatio",
        defaultValue: 1,
        description: "从第一个节点到最后一个节点之间相隔多少个2*PI，表示节点之间的紧密程度"
      }
    ]
  },
  dagre: {
    title: "Dagre布局",
    type: "dagre",
    icon: ApartmentOutlined,
    thumbnail:
      "https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*m5ABT5ra4w4AAAAAAAAAAABkARQnAQ",
    items: [
      {
        component: TwoInput,
        label: "begin",
        labelZh: "中心点",
        key: "layoutConfig.begin",
        defaultValue: [500, 500],
        description: "布局左上角对齐位置"
      },
      {
        component: Select,
        label: "rankdir",
        labelZh: "布局方向",
        key: "layoutConfig.rankdir",
        defaultValue: "TB",
        size: "small",
        options: [
          { label: "自上而下", value: "TB" },
          { label: "自下而上", value: "BT" },
          { label: "自左而右", value: "LR" },
          { label: "自右而左", value: "RL" }
        ],
        description:
          "布局的方向，默认值TB，即从上至下布局，TB表示从上至下布局，BT表示从下至上布局，LR表示从左至右布局，RL表示从右至左布局"
      },
      {
        component: Select,
        label: "align",
        labelZh: "对齐方式",
        key: "layoutConfig.align",
        defaultValue: undefined,
        size: "small",
        options: [
          { label: "UL", value: "对齐到左上角" },
          { label: "UR", value: "对齐到右上角" },
          { label: "DL", value: "对齐到左下角" },
          { label: "DR", value: "对齐到右下角" }
        ],
        description:
          "节点的对齐方式，默认为UL，即对齐到左上角，UL表示对齐到左上角，UR表示对齐到右下角，DL表示对齐到左下角，DR表示对齐到右下角"
      },
      // {
      //   component: IntegerStep,
      //   label: "nodeSize",
      //   labelZh: "节点占布局空间",
      //   key: "layoutConfig.nodeSize",
      //   defaultValue: 0,
      //   max: 200,
      //   min: 0,
      //   description: "节点参与布局所占的空间大小。若设置为0，将使用节点本身的大小"
      // },
      {
        component: () => <IntegerStep max={200} min={1} defaultValue={10} marks={dagreNodesepMarks} />,
        label: "nodesep",
        labelZh: "节点间距",
        key: "layoutConfig.nodesep",
        defaultValue: 10,
        max: 200,
        min: 1,
        description: "节点的间距，rankdir为TB或BT时是水平间距，rankdir为LR或RL时为垂直方向上的间距"
      },
      {
        component: () => <IntegerStep max={200} min={1} defaultValue={10} marks={dagreNodesepMarks} />,
        label: "ranksep",
        labelZh: "层间距",
        key: "layoutConfig.ranksep",
        size: "small",
        defaultValue: 10,
        max: 200,
        min: 1,
        description:
          "各层之间的间距，rankdir为TB或BT时是垂直方向相邻层之间的间距，rankdir为LR或RL时为水平方向上相邻层之间的间距"
      }
      // 控制点适用于 polyline，目前使用的是 quadratic
      // {
      //   component: Switch,
      //   isSwitch: true,
      //   label: 'controlPoints',
      //   labelZh: '是否保留控制点',
      //   key: 'layoutConfig.controlPoints',
      //   defaultValue: true,
      //   size: 'small',
      //   description: '是否保留布局连线的控制点，默认为true，设置为false后，则连接到节点的中心点'
      // },
    ]
  },
  clusteringDagre: {
    title: "分类Dagre布局",
    type: "clusteringDagre",
    icon: ApartmentOutlined,
    thumbnail:
      "https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*m5ABT5ra4w4AAAAAAAAAAABkARQnAQ",
    items: [
      {
        component: TwoInput,
        label: "begin",
        labelZh: "布局左上角位置",
        key: "layoutConfig.begin",
        defaultValue: [500, 500],
        description: "布局左上角对齐位置"
      },
      {
        component: Select,
        label: "clusterAttr",
        labelZh: "分层依据",
        key: "layoutConfig.clusterAttr",
        defaultValue: "dataType",
        size: "small",
        options: [
          // NOTE: 需要动态从数据中获取，默认是按照数据类型排序的
          { label: "dataType", value: "dataType@@string" }
        ],
        description: "布局分层的依据，选择以数据中的某一属性为依据，同一值的元素排列在同一层"
      },
      {
        component: Select,
        label: "rankdir",
        labelZh: "布局方向",
        key: "layoutConfig.rankdir",
        defaultValue: "TB",
        size: "small",
        options: [
          { label: "自上而下", value: "TB" },
          { label: "自下而上", value: "BT" },
          { label: "自左而右", value: "LR" },
          { label: "自右而左", value: "RL" }
        ],
        description:
          "布局的方向，默认值TB，即从上至下布局，TB表示从上至下布局，BT表示从下至上布局，LR表示从左至右布局，RL表示从右至左布局"
      },
      {
        component: InputNumber,
        label: "wrapThreshold",
        labelZh: "每层节点上限",
        key: "layoutConfig.wrapThreshold",
        defaultValue: 20,
        min: 2,
        max: 100,
        description: "每层能容纳的点的上限，超出则换行"
      },
      {
        component: InputNumber,
        label: "wrapLineHeight",
        labelZh: "换行间距",
        key: "layoutConfig.wrapLineHeight",
        defaultValue: 30,
        min: 1,
        max: 200,
        description: "同层节点多行之间的间距"
      },
      {
        component: Slider,
        label: "width",
        labelZh: "布局宽度",
        key: "layoutConfig.width",
        defaultValue: 200,
        min: 10,
        max: 5000,
        description: "布局的宽度"
      },
      {
        component: Slider,
        label: "height",
        labelZh: "布局高度",
        key: "layoutConfig.height",
        defaultValue: 200,
        min: 10,
        max: 5000,
        description: "布局的高度"
      },
      {
        component: Slider,
        label: "nodesep",
        labelZh: "节点间距",
        key: "layoutConfig.nodesep",
        defaultValue: undefined,
        max: 200,
        min: 1,
        description: "节点的间距，rankdir为TB或BT时是水平间距，rankdir为LR或RL时为垂直方向上的间距"
      },
      {
        component: InputNumber,
        label: "ranksep",
        labelZh: "层间距",
        key: "layoutConfig.ranksep",
        size: "small",
        defaultValue: 80,
        max: 200,
        min: 1,
        description:
          "各层之间的间距，rankdir为TB或BT时是垂直方向相邻层之间的间距，rankdir为LR或RL时为水平方向上相邻层之间的间距"
      },
      {
        component: Switch,
        isSwitch: true,
        label: "radial",
        labelZh: "同心圆化",
        key: "layoutConfig.radial",
        defaultValue: false,
        size: "small",
        description: "是否将水平层次改为同心圆"
      },
      {
        component: Switch,
        isSwitch: true,
        label: "postForce",
        labelZh: "力导后调整",
        key: "layoutConfig.postForce",
        defaultValue: false,
        size: "small",
        description: "是否使用力导向进行后调整，使同层节点不严格水平分布"
      }
    ]
  },
  radial: {
    title: "辐射布局",
    type: "radial",
    icon: ShareAltOutlined,
    thumbnail:
      "https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*m5ABT5ra4w4AAAAAAAAAAABkARQnAQ",
    items: [
      {
        component: TwoInput,
        label: "center",
        labelZh: "中心点",
        key: "layoutConfig.center",
        defaultValue: [500, 300],
        description: "布局的中心点，默认值为图的中心"
      },
      {
        component: () => <IntegerStep marks={radialMarks} min={1} max={500} defaultValue={200} />,
        label: "unitRadius",
        labelZh: "层级距离",
        key: "layoutConfig.unitRadius",
        defaultValue: 200,
        max: 500,
        min: 1,
        description: "每一圈距离上一圈的距离，默认值为200，填充整个画布，即根据图的大小决定"
      },
      // {
      //   component: IntegerStep,
      //   label: "linkDistance",
      //   labelZh: "边长度",
      //   key: "layoutConfig.linkDistance",
      //   defaultValue: 200,
      //   min: 1,
      //   max: 500,
      //   description: "边的长度，默认值50"
      // },
      // {
      //   component: IntegerStep,
      //   label: "maxIteration",
      //   labelZh: "最大迭代次数",
      //   key: "layoutConfig.maxIteration",
      //   defaultValue: 1000,
      //   max: 10000,
      //   min: 1,
      //   description: "最大迭代次数，当迭代达到设定的值时，就会停止迭代"
      // },
      // {
      //   component: Input,
      //   label: "focusNode",
      //   labelZh: "中心节点",
      //   key: "layoutConfig.focusNode",
      //   size: "small",
      //   defaultValue: null,
      //   description: "辐射的中心节点，默认为数据中第一个节点，可以设置为节点的ID"
      // },
      // {
      //   component: IntegerStep,
      //   label: "nodeSize",
      //   labelZh: "节点占布局空间",
      //   key: "layoutConfig.nodeSize",
      //   defaultValue: 20,
      //   min: 0,
      //   max: 200,
      //   description:
      //     "节点在布局计算中所占空间大小（直径），用于防止节点重叠时的碰撞检测。设置为0时，将使用节点本身大小"
      // },
      // {
      //   component: Switch,
      //   isSwitch: true,
      //   label: "preventOverlap",
      //   labelZh: "是否防止重叠",
      //   key: "layoutConfig.preventOverlap",
      //   defaultValue: true,
      //   size: "small",
      //   description:
      //     "是否防止重叠，开启后，可以避免节点之间的相互重叠，必须配置nodeSize使用，只有当设置的nodeSize值与节点大小相同时，才会进行节点重叠的碰撞检测"
      // },
      {
        component: () => <IntegerStep defaultValue={40} min={1} max={100} />,
        label: "nodeSpacing",
        labelZh: "节点间距",
        key: "layoutConfig.nodeSpacing",
        defaultValue: 40,
        min: 1,
        max: 100,
        description: "preventOverlap为true时生效，防止重叠时节点边缘间距的最小值，默认值为10"
      },
      // {
      //   component: IntegerStep,
      //   label: "maxPreventOverlapIteration",
      //   labelZh: "最大重叠迭代",
      //   key: "layoutConfig.maxPreventOverlapIteration",
      //   defaultValue: 200,
      //   max: 1000,
      //   min: 1,
      //   description:
      //     "防止重叠步骤的最大迭代次数，当超过设置的迭代次数后，及时还有节点重叠，也不会再进行迭代调整"
      // },
      // {
      //   component: Switch,
      //   isSwitch: true,
      //   label: "strictRadial",
      //   labelZh: "是否严格",
      //   key: "layoutConfig.strictRadial",
      //   defaultValue: false,
      //   size: "small",
      //   description:
      //     "是否是严格的辐射布局，即每一层的节点严格在一个环上，preventOverlap为true时生效"
      // },
      // {
      //   component: Input,
      //   label: "sortBy",
      //   labelZh: "排序依据",
      //   key: "layoutConfig.sortBy",
      //   size: "small",
      //   defaultValue: undefined,
      //   description:
      //     "同层节点布局后相距远近的依据，默认为undefined，表示根据数据的拓扑结构排序，可以设置为数据中某个字段，根据指定的字段进行排序"
      // },
      // {
      //   component: IntegerStep,
      //   label: "sortStrength",
      //   labelZh: "排序强度",
      //   key: "layoutConfig.sortStrength",
      //   defaultValue: 10,
      //   min: 1,
      //   max: 100,
      //   description:
      //     "同层节点根据sortBy排列的强度，sortBy不为undefined时生效，数值越大，sortBy指定的方式计算出距离越小的越靠近"
      // }
    ]
  },
  grid: {
    title: "网格布局",
    type: "grid",
    icon: GatewayOutlined,
    thumbnail:
      "https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*m5ABT5ra4w4AAAAAAAAAAABkARQnAQ",
    items: [
      {
        component: TwoInput,
        label: "begin",
        labelZh: "起始位置",
        key: "layoutConfig.begin",
        inputLabel: ["x", "y"],
        isPx: false,
        defaultValue: [50, 150],
        description: "网格左上角的位置，默认值为(0, 0)点"
      },
      {
        component: () => <IntegerStep marks={gridWitdhMarks} min={10} max={5000} defaultValue={200} />,
        label: "width",
        labelZh: "布局宽度",
        key: "layoutConfig.width",
        defaultValue: 200,
        min: 10,
        max: 5000,
        description: "布局的宽度"
      },
      {
        component: () => <IntegerStep marks={gridHeightMarks} min={10} max={5000} defaultValue={200} />,
        label: "height",
        labelZh: "布局高度",
        key: "layoutConfig.height",
        defaultValue: 200,
        min: 10,
        max: 5000,
        description: "布局的高度"
      },
      {
        component: Switch,
        isSwitch: true,
        label: "preventOverlap",
        labelZh: "是否避免重叠",
        key: "layoutConfig.preventOverlap",
        defaultValue: false,
        size: "small",
        description:
          "是否防止节点重叠，开启后可以避免节点重叠在一起，必须配合nodeSize属性使用，只有设置了与图中节点大小相同的nodeSize值，才能够进行碰撞检测"
      },
      // {
      //   component: Slider,
      //   label: "preventOverlapPadding",
      //   labelZh: "节点间距",
      //   key: "layoutConfig.preventOverlapPadding",
      //   defaultValue: 10,
      //   min: 1,
      //   max: 100,
      //   description: "避免重叠时节点的间距值，当preventOverlap为true时生效"
      // },
      // {
      //   component: Switch,
      //   isSwitch: true,
      //   label: "condense",
      //   labelZh: "是否压缩",
      //   key: "layoutConfig.condense",
      //   defaultValue: false,
      //   size: "small",
      //   description: "为true时利用最小画布空间，为false时利用所有可用画布大小"
      // },
      // {
      //   component: Slider,
      //   label: "rows",
      //   labelZh: "网格行数",
      //   key: "layoutConfig.rows",
      //   defaultValue: 10,
      //   min: 1,
      //   max: 500,
      //   description: "网格的行数，默认值为10"
      // },
      // {
      //   component: Slider,
      //   label: "cols",
      //   labelZh: "网格列数",
      //   key: "layoutConfig.cols",
      //   defaultValue: 10,
      //   min: 1,
      //   max: 500,
      //   description: "网格的列数，默认值为10"
      // },
      // {
      //   component: Select,
      //   label: "sortBy",
      //   labelZh: "排序依据",
      //   key: "layoutConfig.sortBy",
      //   size: "small",
      //   defaultValue: null,
      //   options: [
      //     { label: null, value: null },
      //     { label: "topology", value: "topology" },
      //     { label: "degree", value: "degree" }
      //   ],
      //   description:
      //     "指定排序的依据，即根据节点的哪个属性进行排序，数值越高则该节点被放置得越中心，如果不指定，则会计算节点的度数，度数越高，节点将被放置得越中心"
      // }
    ]
  }
};

export default graphLayoutConfig;
