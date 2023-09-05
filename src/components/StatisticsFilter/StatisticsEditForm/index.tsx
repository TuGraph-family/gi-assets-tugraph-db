import {
  BarChartOutlined,
  FieldStringOutlined,
  FieldTimeOutlined,
  PieChartOutlined,
  SelectOutlined,
  FireTwoTone,
  CaretRightOutlined
} from '@ant-design/icons';
import { useContext, utils } from '@antv/gi-sdk';
import { Button, Dropdown, Menu, Select, Row, Col, Collapse, Form, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { ColumnChart, HistogramChart, PieChart, WordCloudChart } from './Charts';
// import HistogramOptions from './Charts/HistogramOptions';
import LineChart from './Charts/LineChart';
import './index.less';
import { IFilterCriteria } from './type';
import { getChartData, getHistogramData } from './utils';
import { typeImg } from '../constants';

const { Panel } = Collapse;
const { OptGroup, Option } = Select;

export const iconMap = {
  boolean: <FieldStringOutlined style={{ color: 'rgb(39, 110, 241)', marginRight: '4px' }} />,
  string: <FieldStringOutlined style={{ color: 'rgb(39, 110, 241)', marginRight: '4px' }} />,
  number: <span style={{ color: 'rgb(255, 192, 67)', marginRight: '4px' }}>123.</span>,
  'int32': <span style={{ color: 'rgb(255, 192, 67)', marginRight: '4px' }}>123.</span>,
  date: <FieldTimeOutlined style={{ color: 'rgb(255, 192, 67)', marginRight: '4px' }} />,
};

const analyzerType2Icon = {
  COLUMN: <BarChartOutlined />,
  PIE: <PieChartOutlined />,
  SELECT: <SelectOutlined />,
};

interface FilterSelectionProps {
  filterCriteria: IFilterCriteria;
  updateFilterCriteria: (id: string, filterCriteria: IFilterCriteria) => void;
  removeFilterCriteria: (id: string) => void;
  defaultKey?: string;
  form?: any;
  schemaList: {
    nodes: any[];
    edges: any[]
  };
}

const FilterSelection: React.FC<FilterSelectionProps> = props => {
  const { propertyGraphData, useIntl, data } = useContext();

  const {
    filterCriteria,
    updateFilterCriteria,
    removeFilterCriteria,
    form,
    schemaList,
  } = props;
  const label = Form.useWatch(`label-${filterCriteria.id}`, form);

  // 对于离散类型的数据支持切换图表类型
  const [enableChangeChartType, setEnableChangeChartType] = useState<boolean>(false);
  const [state, setState] = useState<{
    currentSchema: any;
    currentProperty: any;
  }>({
    currentSchema: {},
    currentProperty: {},
  });

  const handleLabelChange = (value: string) => {
    let schemaArr: any[] = [];
    // 过滤出 schemaType 的值，设置当前的 Schema
    if (value) {
      schemaArr = [...schemaList.nodes, ...schemaList.edges].filter(node => node.labelName === value);
      if (schemaArr.length > 0) {
        setState({ ...state, currentSchema: schemaArr[0] });
      }
    }
  };

  const onSelectChange = value => {
    const id = filterCriteria.id as string;
    const elementType = state.currentSchema.labelType
    
    const elementProps = state.currentSchema.properties;
    let analyzerType;
    
    if (!elementProps) {
      analyzerType = 'NONE';
      updateFilterCriteria(id, {
        ...filterCriteria,
        id,
        isFilterReady: false,
        elementType,
        prop: value,
        analyzerType,
      });
      setEnableChangeChartType(false);
      return
    }

    const current = elementProps.find(d => d.name === value)
    const propertyType = current.type.toLowerCase()
    if (propertyType === 'number' || propertyType === 'int32') {
      analyzerType = 'HISTOGRAM';
      updateFilterCriteria(id, {
        ...filterCriteria,
        id,
        analyzerType,
        isFilterReady: false,
        elementType,
        prop: value,
      });
      setEnableChangeChartType(false);
    } else if (propertyType === 'boolean') {
      analyzerType = 'Column';
      updateFilterCriteria(id, {
        ...filterCriteria,
        id,
        isFilterReady: false,
        elementType,
        prop: value,
        analyzerType,
      });
      setEnableChangeChartType(false);
    } else if (propertyType === 'string') {
      const chartData = getChartData(data as any, value, elementType);
      let selectOptions = [...chartData.keys()].map(key => ({
        value: key,
        label: key,
      }));
      if (chartData.size <= 5) {
        analyzerType = 'PIE';
        //setChartData(valueMap);
      } else if (chartData.size <= 10) {
        analyzerType = 'COLUMN';
        //setChartData(valueMap);
      } else {
        analyzerType = 'SELECT';

        const sorttedValues = utils.getPropertyValueRanks(propertyGraphData, elementType, value);
        selectOptions = selectOptions.map(option => {
          const { value } = option;
          const { rank, isOutlier } = sorttedValues.find(item => item.propertyValue === value) || {};
          return {
            ...option,
            rank,
            isOutlier,
          };
        });
      }
      updateFilterCriteria(id, {
        ...filterCriteria,
        id,
        isFilterReady: false,
        elementType,
        prop: value,
        analyzerType,
        selectOptions,
        chartData,
      });
      setEnableChangeChartType(true);
    } else if (propertyType === 'date') {
      analyzerType = 'DATE';
      updateFilterCriteria(id, {
        ...filterCriteria,
        id,
        isFilterReady: false,
        elementType,
        prop: value,
        analyzerType,
      });
      setEnableChangeChartType(false);
    }
  };

  const onValueSelectChange = value => {
    const id = filterCriteria.id as string;
    const isFilterReady = value.length !== 0;
    updateFilterCriteria(id, {
      ...filterCriteria,
      isFilterReady,
      selectValue: value,
    });
  };

  const changeChartType = ({ key }) => {
    updateFilterCriteria(filterCriteria.id as string, {
      ...filterCriteria,
      analyzerType: key,
    });
  };

  const elementProps = state.currentSchema.properties; // filterCriteria.elementType === 'node' ? nodeProperties : edgeProperties;

  // 初始展示筛选器
  useEffect(() => {
    if (filterCriteria.defaultKey) {
      onSelectChange(filterCriteria.defaultKey);
    }
  }, [filterCriteria.defaultKey]);

  useEffect(() => {
    const { prop, elementType, analyzerType } = filterCriteria;
    if (prop && elementType && analyzerType && ['PIE', 'SELECT', 'WORDCLOUD'].indexOf(analyzerType) !== -1) {
      const chartData = getChartData(data as any, prop, elementType);
      updateFilterCriteria(filterCriteria.id!, {
        ...filterCriteria,
        chartData,
      });
    }

    if (prop && elementType && analyzerType && ['HISTOGRAM'].indexOf(analyzerType) !== -1) {
      const histogramData = getHistogramData(data, prop, elementType);
      updateFilterCriteria(filterCriteria.id!, {
        ...filterCriteria,
        histogramData,
      });
    }
  }, [data, filterCriteria.prop, filterCriteria.elementType, filterCriteria.analyzerType]);

  const menu = (
    // @ts-ignore
    <Menu
      onClick={changeChartType}
      items={[
        {
          key: 'COLUMN',
          label: <BarChartOutlined />,
        },
        {
          key: 'PIE',
          label: <PieChartOutlined />,
        },
        {
          key: 'SELECT',
          label: <SelectOutlined />,
        },
      ]}
    />
  );

  const getPropertyOptions = () => {
    const elementProps = state.currentSchema.properties || []
    return elementProps.map(e => {
      const { name, type  } = e
      // @ts-ignore
      const icon = iconMap[type.toLowerCase()];

      return (
        <Select.Option value={name}>
          <>
            {icon}
            {name}
          </>
        </Select.Option>
      );
    });
  };

  return (
    <div key={filterCriteria.id} id={`panel-${filterCriteria.id}`} className="tugraph-filter-panel-group">
      <Collapse
        defaultActiveKey={['1']}
        style={{
          marginBottom: 16,
          backgroundImage: 'linear-gradient(178deg, rgba(245,248,255,0.38) 11%, rgba(244,247,255,0.55) 96%)',
        }}
        bordered={false}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      >
        <Panel
          header={
            <span>
              {label ? (
                <span>
                  <img src={state.currentSchema.labelType === 'node' ? typeImg.person : typeImg.amount} alt="" className="img" />
                  {label}
                </span>
              ) : (
                '未选择'
              )}
            </span>
          }
          key="1"
          extra={removeFilterCriteria(filterCriteria.id) as any}
        >
          <Form.Item
            label="请选择点/边类型"
            name={`label-${filterCriteria.id}`}
            rules={[{ required: true, message: '请选择点/边类型' }]}
          >
            <Select placeholder="请选择点/边类型" showSearch optionFilterProp="children" onChange={handleLabelChange}>
              <OptGroup label="点">
                {schemaList?.nodes?.map((item: any) => {
                  return (
                    <Option value={item.labelName} key={item.labelName}>
                      <img src={typeImg['person']} alt="" className="img" />
                      {item.labelName}
                    </Option>
                  );
                })}
              </OptGroup>
              <OptGroup label="边">
                {schemaList?.edges?.map((item: any) => {
                  return (
                    <Option value={item.labelName} key={item.labelName}>
                      <img src={typeImg['amount']} alt="" className="img" />
                      {item.labelName}
                    </Option>
                  );
                })}
              </OptGroup>
            </Select>
          </Form.Item>
          <Space style={{ marginBottom: 8, width: '100%' }} align="baseline" className='space-statistic-panel'>
            <Form.Item name='name' label='选择属性' rules={[{ required: true, message: '请选择属性' }]}>
              <Select
                style={{ width: '100%' }}
                onChange={onSelectChange}
                className="tugraph-filter-panel-prop-select"
                placeholder="选择元素属性"
                showSearch
                filterOption={(input, option) => {
                  return (option?.value as string)?.toLowerCase().includes(input.toLowerCase());
                }}
                value={
                  filterCriteria.prop
                    ? `${filterCriteria.prop}`
                    : undefined
                }
              >
                  {getPropertyOptions()}
              </Select>
              {enableChangeChartType && (
                <Dropdown overlay={menu}>
                  <Button icon={analyzerType2Icon[filterCriteria.analyzerType!]} type="text"></Button>
                </Dropdown>
              )}
            </Form.Item>
          </Space>

          <div className="tugraph-filter-panel-value" id={`${filterCriteria.id}-chart-container`}>
            {filterCriteria.analyzerType == 'SELECT' && (
              <Select
                style={{ width: '100%' }}
                onChange={onValueSelectChange}
                mode="tags"
                placeholder="选择筛选值"
                value={filterCriteria.selectValue}
              >
                {filterCriteria.selectOptions?.map(option => {
                  const { rank, label, value } = option;
                  return (
                    <Select.Option value={value}>
                      {rank !== undefined && rank < 3 ? (
                        <Row style={{ width: '100%' }}>
                          <Col span={20}>{label}</Col>
                          <Col span={4}>{new Array(3 - rank).fill(<FireTwoTone twoToneColor="#eb2f96" />)}</Col>
                        </Row>
                      ) : (
                        label
                      )}
                    </Select.Option>
                  );
                })}
              </Select>
            )}

            {filterCriteria.analyzerType === 'PIE' && (
              <PieChart
                filterCriteria={filterCriteria}
                updateFilterCriteria={updateFilterCriteria}
                //chartData={chartData}
              />
            )}

            {filterCriteria.analyzerType === 'WORDCLOUD' && (
              <WordCloudChart
                filterCriteria={filterCriteria}
                updateFilterCriteria={updateFilterCriteria}
                //chartData={chartData}
              />
            )}

            {filterCriteria.analyzerType === 'COLUMN' && (
              <ColumnChart
                filterCriteria={filterCriteria}
                updateFilterCriteria={updateFilterCriteria}
                highlightRank={5}
              />
            )}

            {filterCriteria.analyzerType === 'HISTOGRAM' && (
              <HistogramChart filterCriteria={filterCriteria} updateFilterCriteria={updateFilterCriteria} />
            )}

            {filterCriteria.analyzerType === 'DATE' && (
              <LineChart
                filterCriteria={filterCriteria}
                source={data}
                elementProps={elementProps || {}}
                /* BrushFilter 组件问题，设置不了百分比 */
                width={document.getElementsByClassName('tugraph-filter-panel-prop')[0].clientWidth}
              />
            )}

            {filterCriteria.analyzerType === 'NONE' && <span>请选择合法字段</span>}
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default FilterSelection;
