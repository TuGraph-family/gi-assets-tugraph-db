import React, { useEffect, useState } from 'react';
import { useContext } from '@antv/gi-sdk';
import { useImmer } from 'use-immer';
import { Pie } from '@antv/g2plot';
import './index.less';

const reg = /\+[^\+]+\+/g;
const reg1 = /\<[^\<]+\>/g;

const PointEdgeView = () => {
  const {
    // data: {},
    graph,
  } = useContext();

  const data = {
    nodes: [
      {
        id: 'account_7',
        nodeType: 'account_balance',
        nodeTypeKeyFromProperties: 'icon',
        data: {
          create_date: '2019-01-03T00:00:00',
          icon: 'account_balance',
          id: 'account_7',
          is_different_bank: 0,
          data: {},
          defaultStyle: {},
        },
      },
      {
        id: 'account_20',
        nodeType: 'account_balance',
        nodeTypeKeyFromProperties: 'icon',
        data: {
          create_date: '2019-01-05T00:00:00',
          icon: 'account_balance',
          id: 'account_20',
          is_different_bank: 0,
          data: {},
          defaultStyle: {},
        },
      },
      {
        id: 'account_55',
        nodeType: 'account_balance',
        nodeTypeKeyFromProperties: 'icon',
        data: {
          create_date: '2019-01-07T00:00:00',
          icon: 'account_balance',
          id: 'account_55',
          is_different_bank: 0,
          data: {},
          defaultStyle: {},
        },
      },
      {
        id: 'account_81',
        nodeType: 'account_balance',
        nodeTypeKeyFromProperties: 'icon',
        data: {
          create_date: '2019-01-15T00:00:00',
          icon: 'account_balance',
          id: 'account_81',
          is_different_bank: 0,
          data: {},
          defaultStyle: {},
        },
      },
      {
        id: 'account_103',
        nodeType: 'account_balance',
        nodeTypeKeyFromProperties: 'icon',
        data: {
          create_date: '2019-01-15T00:00:00',
          icon: 'account_balance',
          id: 'account_103',
          is_different_bank: 0,
          data: {},
          defaultStyle: {},
        },
      },
      {
        id: 'account_901',
        nodeType: 'account_balance',
        nodeTypeKeyFromProperties: 'icon',
        data: {
          create_date: '2019-01-03T00:00:00',
          icon: 'account_balance',
          id: 'account_901',
          is_different_bank: 0,
          data: {},
          defaultStyle: {},
        },
      },
      {
        id: 'account_902',
        nodeType: 'account_balance',
        nodeTypeKeyFromProperties: 'icon',
        data: {
          create_date: '2019-01-10T00:00:00',
          icon: 'account_balance',
          id: 'account_902',
          is_different_bank: 0,
          data: {},
          defaultStyle: {},
        },
      },
      {
        id: 'account_903',
        nodeType: 'account_balance',
        nodeTypeKeyFromProperties: 'icon',
        data: {
          create_date: '2019-01-09T00:00:00',
          icon: 'account_balance',
          id: 'account_903',
          is_different_bank: 1,
          data: {},
          defaultStyle: {},
        },
      },
      {
        id: 'account_904',
        nodeType: 'account_balance',
        nodeTypeKeyFromProperties: 'icon',
        data: {
          create_date: '2019-01-08T00:00:00',
          icon: 'account_balance',
          id: 'account_904',
          is_different_bank: 1,
          data: {},
          defaultStyle: {},
        },
      },
      {
        id: 'customer_7',
        nodeType: 'account_box',
        nodeTypeKeyFromProperties: 'icon',
        data: {
          icon: 'account_box',
          id: 'customer_7',
          data: {},
          defaultStyle: {},
          address: '-',
          customer_type: 'retail',
          first_name: '-',
          last_name: '-',
          phone: '-',
          remarks: "high-value IB txn into customer 103's account",
          risk_category: 'medium',
          risk_score: 50,
        },
      },
      {
        id: 'customer_20',
        nodeType: 'account_box',
        nodeTypeKeyFromProperties: 'icon',
        data: {
          icon: 'account_box',
          id: 'customer_20',
          data: {},
          defaultStyle: {},
          address: '-',
          customer_type: 'retail',
          first_name: '-',
          last_name: '-',
          phone: '-',
          remarks: "high-value IB txn into customer 103's account",
          risk_category: 'medium',
          risk_score: 50,
        },
      },
      {
        id: 'customer_55',
        nodeType: 'account_box',
        nodeTypeKeyFromProperties: 'icon',
        data: {
          icon: 'account_box',
          id: 'customer_55',
          data: {},
          defaultStyle: {},
          address: '-',
          customer_type: 'retail',
          first_name: '-',
          last_name: '-',
          phone: '-',
          remarks: "high-value IB txn into customer 103's account",
          risk_category: 'medium',
          risk_score: 50,
        },
      },
      {
        id: 'customer_81',
        nodeType: 'account_box',
        nodeTypeKeyFromProperties: 'icon',
        data: {
          icon: 'account_box',
          id: 'customer_81',
          data: {},
          defaultStyle: {},
          address: '-',
          customer_type: 'retail',
          first_name: '-',
          last_name: '-',
          phone: '-',
          remarks: "high-value IB txn into customer 103's account",
          risk_category: 'medium',
          risk_score: 50,
        },
      },
      {
        id: 'customer_103',
        nodeType: 'account_box',
        nodeTypeKeyFromProperties: 'icon',
        data: {
          icon: 'account_box',
          id: 'customer_103',
          data: {},
          defaultStyle: {},
          address: '103 RD',
          customer_type: 'retail',
          first_name: 'john',
          last_name: 'doe',
          phone: '+65 0000 0103',
          remarks: 'high-value purchases from luxury retailer. source of funds from 4 related accounts',
          risk_category: 'high',
          risk_score: 99,
        },
      },
      {
        id: 'customer_901',
        nodeType: 'account_box',
        nodeTypeKeyFromProperties: 'icon',
        data: {
          icon: 'account_box',
          id: 'customer_901',
          data: {},
          defaultStyle: {},
          address: '901 RD',
          customer_type: 'retail',
          first_name: 'jane',
          last_name: 'doe',
          phone: '+65 0000 0103',
          remarks:
            "source of funds for customer 103's purchase of luxury items. customer has same phone number as customer 103.",
          risk_category: 'medium',
          risk_score: 74,
        },
      },
      {
        id: 'customer_902',
        nodeType: 'account_box',
        nodeTypeKeyFromProperties: 'icon',
        data: {
          icon: 'account_box',
          id: 'customer_902',
          data: {},
          defaultStyle: {},
          address: '103 RD',
          customer_type: 'retail',
          first_name: 'jim',
          last_name: 'smith',
          phone: '+65 0000 0902',
          remarks:
            "source of funds for customer 103's purchase of luxury items. customer has same address as customer 103.",
          risk_category: 'medium',
          risk_score: 74,
        },
      },
      {
        id: 'other_banks',
        nodeType: '-',
        nodeTypeKeyFromProperties: 'icon',
        data: {
          icon: '-',
          id: 'other_banks',
          data: {},
          defaultStyle: {},
          address: '-',
          customer_type: '-',
          first_name: '-',
          last_name: '-',
          phone: '-',
          remarks: 'other banks',
          risk_category: '-',
          risk_score: '-',
        },
      },
    ],
    edges: [
      {
        source: 'account_103',
        target: 'account_904',
        edgeType: 'ib_txn',
        edgeTypeKeyFromProperties: 'category',
        data: {
          amount: 1000000,
          balance: 200000,
          category: 'ib_txn',
          date: '2020-01-01T00:00:00',
          id: 'ib_txn_1',
          is_foreign_source: 0,
          is_foreign_target: 1,
          is_high_risk_source_target_location: 0,
          relation: 'ib_transfer',
          source: 'account_103',
          source_owner: 'customer_103',
          target: 'account_904',
          target_owner: 'other_banks',
          time: '00:00:00',
          data: {},
          defaultStyle: {},
        },
      },
      {
        source: 'account_903',
        target: 'account_103',
        edgeType: 'ib_txn',
        edgeTypeKeyFromProperties: 'category',
        data: {
          amount: 100000,
          balance: null,
          category: 'ib_txn',
          date: '2020-01-02T01:00:00',
          id: 'ib_txn_2',
          is_foreign_source: 1,
          is_foreign_target: 0,
          is_high_risk_source_target_location: 0,
          relation: 'ib_transfer',
          source: 'account_903',
          source_owner: 'other_banks',
          target: 'account_103',
          target_owner: 'customer_103',
          time: '01:00:00',
          data: {},
          defaultStyle: {},
        },
      },
      {
        source: 'account_103',
        target: 'account_904',
        edgeType: 'ib_txn',
        edgeTypeKeyFromProperties: 'category',
        data: {
          amount: 50000,
          balance: 250000,
          category: 'ib_txn',
          date: '2020-01-02T02:00:00',
          id: 'ib_txn_3',
          is_foreign_source: 0,
          is_foreign_target: 1,
          is_high_risk_source_target_location: 0,
          relation: 'ib_transfer',
          source: 'account_103',
          source_owner: 'customer_103',
          target: 'account_904',
          target_owner: 'other_banks',
          time: '02:00:00',
          data: {},
          defaultStyle: {},
        },
      },
      {
        source: 'account_904',
        target: 'account_103',
        edgeType: 'ib_txn',
        edgeTypeKeyFromProperties: 'category',
        data: {
          amount: 2000000,
          balance: null,
          category: 'ib_txn',
          date: '2020-01-01T03:00:00',
          id: 'ib_txn_4',
          is_foreign_source: 1,
          is_foreign_target: 0,
          is_high_risk_source_target_location: 0,
          relation: 'ib_transfer',
          source: 'account_904',
          source_owner: 'other_banks',
          target: 'account_103',
          target_owner: 'customer_103',
          time: '03:00:00',
          data: {},
          defaultStyle: {},
        },
      },
      {
        source: 'account_103',
        target: 'account_903',
        edgeType: 'ib_txn',
        edgeTypeKeyFromProperties: 'category',
        data: {
          amount: 1000000,
          balance: 1250000,
          category: 'ib_txn',
          date: '2020-01-02T04:00:00',
          id: 'ib_txn_5',
          is_foreign_source: 0,
          is_foreign_target: 1,
          is_high_risk_source_target_location: 0,
          relation: 'ib_transfer',
          source: 'account_103',
          source_owner: 'customer_103',
          target: 'account_903',
          target_owner: 'other_banks',
          time: '04:00:00',
          data: {},
          defaultStyle: {},
        },
      },
      {
        source: 'account_103',
        target: 'account_903',
        edgeType: 'ib_txn',
        edgeTypeKeyFromProperties: 'category',
        data: {
          amount: 1000000,
          balance: 250000,
          category: 'ib_txn',
          date: '2020-01-02T05:00:00',
          id: 'ib_txn_6',
          is_foreign_source: 0,
          is_foreign_target: 1,
          is_high_risk_source_target_location: 0,
          relation: 'ib_transfer',
          source: 'account_103',
          source_owner: 'customer_103',
          target: 'account_903',
          target_owner: 'other_banks',
          time: '05:00:00',
          data: {},
          defaultStyle: {},
        },
      },
      {
        source: 'account_901',
        target: 'account_103',
        edgeType: 'ib_txn',
        edgeTypeKeyFromProperties: 'category',
        data: {
          amount: 250000,
          balance: 10000,
          category: 'ib_txn',
          date: '2020-01-01T06:00:00',
          id: 'ib_txn_7',
          is_foreign_source: 0,
          is_foreign_target: 0,
          is_high_risk_source_target_location: 0,
          relation: 'ib_transfer',
          source: 'account_901',
          source_owner: 'customer_901',
          target: 'account_103',
          target_owner: 'customer_103',
          time: '06:00:00',
          data: {},
          defaultStyle: {},
        },
      },
      {
        source: 'account_902',
        target: 'account_103',
        edgeType: 'ib_txn',
        edgeTypeKeyFromProperties: 'category',
        data: {
          amount: 250000,
          balance: 300000,
          category: 'ib_txn',
          date: '2020-01-01T06:30:00',
          id: 'ib_txn_8',
          is_foreign_source: 0,
          is_foreign_target: 0,
          is_high_risk_source_target_location: 0,
          relation: 'ib_transfer',
          source: 'account_902',
          source_owner: 'customer_902',
          target: 'account_103',
          target_owner: 'customer_103',
          time: '06:30:00',
          data: {},
          defaultStyle: {},
        },
      },
      {
        source: 'account_903',
        target: 'account_103',
        edgeType: 'ib_txn',
        edgeTypeKeyFromProperties: 'category',
        data: {
          amount: 250000,
          balance: null,
          category: 'ib_txn',
          date: '2020-01-02T06:00:00',
          id: 'ib_txn_9',
          is_foreign_source: 1,
          is_foreign_target: 0,
          is_high_risk_source_target_location: 0,
          relation: 'ib_transfer',
          source: 'account_903',
          source_owner: 'other_banks',
          target: 'account_103',
          target_owner: 'customer_103',
          time: '06:00:00',
          data: {},
          defaultStyle: {},
        },
      },
      {
        source: 'account_904',
        target: 'account_103',
        edgeType: 'ib_txn',
        edgeTypeKeyFromProperties: 'category',
        data: {
          amount: 250000,
          balance: null,
          category: 'ib_txn',
          date: '2020-01-01T00:00:00',
          id: 'ib_txn_10',
          is_foreign_source: 1,
          is_foreign_target: 0,
          is_high_risk_source_target_location: 0,
          relation: 'ib_transfer',
          source: 'account_904',
          source_owner: 'other_banks',
          target: 'account_103',
          target_owner: 'customer_103',
          time: '00:00:00',
          data: {},
          defaultStyle: {},
        },
      },
      {
        source: 'account_7',
        target: 'account_103',
        edgeType: 'ib_txn',
        edgeTypeKeyFromProperties: 'category',
        data: {
          amount: 125000,
          balance: 225000,
          category: 'ib_txn',
          date: '2020-01-03T22:00:00',
          id: 'ib_txn_72',
          is_foreign_source: 0,
          is_foreign_target: 0,
          is_high_risk_source_target_location: 0,
          relation: 'ib_transfer',
          source: 'account_7',
          source_owner: 'customer_7',
          target: 'account_103',
          target_owner: 'customer_103',
          time: '22:00:00',
          data: {},
          defaultStyle: {},
        },
      },
      {
        source: 'account_55',
        target: 'account_103',
        edgeType: 'ib_txn',
        edgeTypeKeyFromProperties: 'category',
        data: {
          amount: 250000,
          balance: 475000,
          category: 'ib_txn',
          date: '2020-01-03T22:00:00',
          id: 'ib_txn_73',
          is_foreign_source: 0,
          is_foreign_target: 0,
          is_high_risk_source_target_location: 0,
          relation: 'ib_transfer',
          source: 'account_55',
          source_owner: 'customer_55',
          target: 'account_103',
          target_owner: 'customer_103',
          time: '22:00:00',
          data: {},
          defaultStyle: {},
        },
      },
      {
        source: 'account_20',
        target: 'account_103',
        edgeType: 'ib_txn',
        edgeTypeKeyFromProperties: 'category',
        data: {
          amount: 150000,
          balance: 625000,
          category: 'ib_txn',
          date: '2020-01-04T18:00:00',
          id: 'ib_txn_74',
          is_foreign_source: 0,
          is_foreign_target: 0,
          is_high_risk_source_target_location: 0,
          relation: 'ib_transfer',
          source: 'account_20',
          source_owner: 'customer_20',
          target: 'account_103',
          target_owner: 'customer_103',
          time: '18:00:00',
          data: {},
          defaultStyle: {},
        },
      },
      {
        source: 'account_81',
        target: 'account_103',
        edgeType: 'ib_txn',
        edgeTypeKeyFromProperties: 'category',
        data: {
          amount: 300000,
          balance: 925000,
          category: 'ib_txn',
          date: '2020-01-04T18:00:00',
          id: 'ib_txn_75',
          is_foreign_source: 0,
          is_foreign_target: 0,
          is_high_risk_source_target_location: 0,
          relation: 'ib_transfer',
          source: 'account_81',
          source_owner: 'customer_81',
          target: 'account_103',
          target_owner: 'customer_103',
          time: '18:00:00',
          data: {},
          defaultStyle: {},
        },
      },
      {
        source: 'customer_7',
        target: 'account_7',
        edgeType: 'ownership',
        edgeTypeKeyFromProperties: 'category',
        data: {
          category: 'ownership',
          id: 'ownership_210',
          relation: 'owns',
          source: 'customer_7',
          target: 'account_7',
          data: {},
          defaultStyle: {},
        },
      },
      {
        source: 'customer_20',
        target: 'account_20',
        edgeType: 'ownership',
        edgeTypeKeyFromProperties: 'category',
        data: {
          category: 'ownership',
          id: 'ownership_223',
          relation: 'owns',
          source: 'customer_20',
          target: 'account_20',
          data: {},
          defaultStyle: {},
        },
      },
      {
        source: 'customer_55',
        target: 'account_55',
        edgeType: 'ownership',
        edgeTypeKeyFromProperties: 'category',
        data: {
          category: 'ownership',
          id: 'ownership_258',
          relation: 'owns',
          source: 'customer_55',
          target: 'account_55',
          data: {},
          defaultStyle: {},
        },
      },
      {
        source: 'customer_81',
        target: 'account_81',
        edgeType: 'ownership',
        edgeTypeKeyFromProperties: 'category',
        data: {
          category: 'ownership',
          id: 'ownership_284',
          relation: 'owns',
          source: 'customer_81',
          target: 'account_81',
          data: {},
          defaultStyle: {},
        },
      },
      {
        source: 'customer_103',
        target: 'account_103',
        edgeType: 'ownership',
        edgeTypeKeyFromProperties: 'category',
        data: {
          category: 'ownership',
          id: 'ownership_306',
          relation: 'owns',
          source: 'customer_103',
          target: 'account_103',
          data: {},
          defaultStyle: {},
        },
      },
      {
        source: 'customer_901',
        target: 'account_901',
        edgeType: 'ownership',
        edgeTypeKeyFromProperties: 'category',
        data: {
          category: 'ownership',
          id: 'ownership_307',
          relation: 'owns',
          source: 'customer_901',
          target: 'account_901',
          data: {},
          defaultStyle: {},
        },
      },
      {
        source: 'customer_902',
        target: 'account_902',
        edgeType: 'ownership',
        edgeTypeKeyFromProperties: 'category',
        data: {
          category: 'ownership',
          id: 'ownership_308',
          relation: 'owns',
          source: 'customer_902',
          target: 'account_902',
          data: {},
          defaultStyle: {},
        },
      },
      {
        source: 'other_banks',
        target: 'account_903',
        edgeType: 'ownership',
        edgeTypeKeyFromProperties: 'category',
        data: {
          category: 'ownership',
          id: 'ownership_310',
          relation: 'owns',
          source: 'other_banks',
          target: 'account_903',
          data: {},
          defaultStyle: {},
        },
      },
      {
        source: 'other_banks',
        target: 'account_904',
        edgeType: 'ownership',
        edgeTypeKeyFromProperties: 'category',
        data: {
          category: 'ownership',
          id: 'ownership_311',
          relation: 'owns',
          source: 'other_banks',
          target: 'account_904',
          data: {},
          defaultStyle: {},
        },
      },
      {
        source: 'other_banks',
        target: 'account_103',
        edgeTypeKeyFromProperties: 'category',
        data: {
          source: 'other_banks',
          target: 'account_103',
        },
      },
    ],
    combos: [],
  };

  let nodes = data.nodes,
    edges = data.edges;
  const typeMap: any = {};
  const [state, setState] = useImmer<{
    visible: boolean;
    viewType: string;
    nodeType: string;
  }>({
    visible: false,
    viewType: 'list',
    nodeType: 'nodes',
  });
  const nodeTypesSet = (): any[] => {
    const result: any[] = [];
    const keys: string[] = [];
    const num: any = {};
    nodes.forEach((i: any) => {
      if (num[i?.nodeType]) {
        num[i?.nodeType] = num[i?.nodeType] + 1;
      } else {
        num[i?.nodeType] = 1;
      }
    });
    nodes.forEach((item: any) => {
      if (keys.includes(item?.nodeType)) {
        if (typeMap[item?.nodeType]) {
          Array.isArray(typeMap[item?.nodeType]) && typeMap[item?.nodeType].push(item?.id);
        } else {
          typeMap[item?.nodeType] = [item?.id];
        }
      } else {
        keys.push(item?.nodeType);
        result.push({ ...item, num: num[item?.nodeType] || 0 });
      }
    });
    return result;
  };
  const edgesTypesSet = () => {
    const edgesKeys: string[] = [];
    const edgesTypeMap = {};
    edges.forEach((item: any) => {
      const node1: any = nodes.find((i: any) => item?.source === i?.id);
      const node2: any = nodes.find((i: any) => item?.target === i?.id);

      const type = `+${item?.edgeType}+<${node1?.nodeType}=>${node2?.nodeType}>`;
      const map = edgesTypeMap;
      if (map && Array.isArray(map[type])) {
        if (item?.edgeType) map[type].push(item);
      } else {
        if (item?.edgeType) {
          edgesKeys.push(type);
          map[type] = [item];
        }
      }
    });
    return edgesTypeMap;
  };
  const onClickType = type => {
    nodes.forEach((node: any) => {
      const hasMatch = typeMap[type].includes(node?.id);
      if (hasMatch) {
        graph.setItemState(node?.id, 'disabled', false);
        graph.setItemState(node?.id, 'selected', true);
      } else {
        graph.setItemState(node?.id, 'selected', false);
        graph.setItemState(node?.id, 'disabled', true);
      }
    });
  };
  const handleViewCard = () => {
    setState((pre: any) => ({
      ...pre,
      visible: !pre?.visible,
    }));
  };
  const getChartEdges = () => {
    const num: any = {};
    Array.isArray(edges) &&
      edges.forEach((i: any) => {
        if (num[i?.edgeType] || num['other']) {
          num[i?.edgeType] = num[i?.edgeType] + 1;
        } else {
          num[i?.edgeType || 'other'] = 1;
        }
      });
    return Object.keys(num).map((k: string) => ({ edgeType: [k], num: num[k], ...num[k], id: k }));
  };
  const PointList = () => {
    return (
      <>
        {nodeTypesSet().map((item: any) => {
          const num = nodes.filter((i: any) => i?.nodeType === item?.nodeType).length || 0;
          return (
            <div className="listItem">
              <div className="left">
                <div className="icon" style={{ backgroundColor: item?.style?.keyshape?.fill }}></div>
                <div className="text">{item?.nodeType}</div>
              </div>
              <div className="right">{num}</div>
            </div>
          );
        })}
      </>
    );
  };
  const EdgesList = () => {
    useEffect(() => {
      edgesTypesSet();
    }, [edges, nodes]);
    return (
      <>
        {Object.keys(edgesTypesSet()).map(key => {
          let title: string = '';
          let match: RegExpMatchArray | null = key.match(reg);
          if (match && Array.isArray(match)) {
            title = match[0].slice(1, -1);
          }

          let connect: any = '';
          let match1: RegExpMatchArray | null = key.match(reg1);
          if (match1 && Array.isArray(match1)) {
            connect = match1[0].slice(1, -1);
          }
          return (
            <div className="listEdgesItem" key={key} id={key}>
              <div className="top">
                <div className="left">
                  <img
                    className="icon"
                    src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*FNcZS7syqSgAAAAAAAAAAAAADgOBAQ/original"
                  />
                  <div className="text">{title}</div>
                </div>
                <div className="right">{edgesTypesSet()[key]?.length || 0}</div>
              </div>
              <div className="bottom">
                <div className="text">{connect.split('=>')[0]}</div>
                <img
                  className="icon"
                  src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*56j9R7qx258AAAAAAAAAAAAADgOBAQ/original"
                />
                <div className="text">{connect.split('=>')[1]}</div>
              </div>
            </div>
          );
        })}
      </>
    );
  };
  const listMap = {
    nodes: <PointList />,
    edges: <EdgesList />,
  };
  const List = () => {
    return <div className="list">{listMap[state.nodeType]}</div>;
  };
  const Chart = () => {
    const dataMap = {
      nodes: nodeTypesSet(),
      edges: getChartEdges(),
    };
    const labelMap = {
      nodes: {
        angleField: 'num',
        colorField: 'nodeType',
      },
      edges: {
        angleField: 'num',
        colorField: 'edgeType',
      },
    };
    useEffect(() => {
      const piePlot = new Pie('chartContainer', {
        appendPadding: 0,
        data: dataMap[state.nodeType],
        ...labelMap[state.nodeType],
        radius: 0.9,
        autoFit: true,
        height: 200,
        label: {
          type: 'inner',
          offset: '-30%',
          content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
          style: {
            fontSize: 14,
            textAlign: 'center',
          },
        },
        interactions: [{ type: 'element-active' }],
      });

      piePlot.render();
      console.log(nodeTypesSet(), edgesTypesSet(), state.viewType, state.nodeType);
    }, [state.viewType, state.nodeType]);
    return <div className="chart" id="chartContainer"></div>;
  };
  const nodeMap = {
    list: <List />,
    chart: <Chart />,
  };
  return (
    <div className="pointEdgeView">
      {nodeTypesSet().map(item => {
        return (
          <div className="nodesItem" onClick={() => onClickType(item?.nodeType)}>
            <div className="icon" style={{ backgroundColor: item?.style?.keyshape?.fill }}></div>
            <div className="text">{item?.nodeType}</div>
          </div>
        );
      })}
      <div className="openIcon" onClick={handleViewCard}>
        <img src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*PqUJQbFoOEYAAAAAAAAAAAAADgOBAQ/original" />
      </div>
      {state?.visible ? (
        <div className="pointEdgeViewCard">
          <div className="type">
            <div className="nodeType">
              <div
                className={state.nodeType === 'nodes' ? 'typeActive' : 'typeNormal'}
                onClick={() => {
                  setState(pre => {
                    pre.nodeType = 'nodes';
                  });
                }}
              >
                <span className="text">点</span>
                <span className="num">{nodes.length || 0}</span>
              </div>
              <div
                className={state.nodeType === 'edges' ? 'typeActive' : 'typeNormal'}
                onClick={() => {
                  setState(pre => {
                    pre.nodeType = 'edges';
                  });
                }}
              >
                <span className="text">边</span>
                <span className="num">{edges.length || 0}</span>
              </div>
            </div>
            <div className="viewType">
              <div
                className={state.viewType === 'list' ? 'viewTypeActive' : 'viewTypeNormal'}
                onClick={() => {
                  setState(pre => {
                    pre.viewType = 'list';
                  });
                }}
              >
                <img
                  src={
                    state.viewType === 'list'
                      ? 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*ZZnQQbkMOXUAAAAAAAAAAAAADgOBAQ/original'
                      : 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*_1EcSZO-vDYAAAAAAAAAAAAADgOBAQ/original'
                  }
                  className="icon"
                />
              </div>
              <div
                className={state.viewType === 'chart' ? 'viewTypeActive' : 'viewTypeNormal'}
                onClick={() => {
                  setState(pre => {
                    pre.viewType = 'chart';
                  });
                }}
              >
                <img
                  src={
                    state.viewType === 'chart'
                      ? 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*Ch_7QLyu7ZMAAAAAAAAAAAAADgOBAQ/original'
                      : 'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*Ch_7QLyu7ZMAAAAAAAAAAAAADgOBAQ/original'
                  }
                  className="icon"
                />
              </div>
            </div>
          </div>
          {nodeMap[state.viewType]}
        </div>
      ) : null}
    </div>
  );
};

export default PointEdgeView;
