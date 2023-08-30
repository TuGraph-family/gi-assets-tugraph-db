import { Form, Button, Popconfirm, Modal, DatePicker, Radio, InputNumber } from 'antd';
import React, { useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { cloneDeep } from 'lodash';
import RuleConfigPanel from './RuleConfigPanel'
import { operatorMapping } from '../StyleSetting/Constant';
import './index.less';

const { RangePicker } = DatePicker;

interface AdvanceNeighborsQueryProps {
  visible: boolean;
  close: () => void;
  schemaData: any;
  expandNodeIds: string[];
  languageService: (script: string) => void;
}

const AdvanceNeighborsQueryConfig: React.FC<AdvanceNeighborsQueryProps> = ({ schemaData, visible, close, expandNodeIds, languageService }) => {
  const [form] = Form.useForm();
  const [filterdata, setFilterData] = useState([{ id: Date.now() }]);

  const addPanel = () => {
    const addData = cloneDeep(filterdata);
    addData.push({
      id: Date.now(),
    });
    setFilterData(addData);
  };

  //删除事件
  const handleDelete = id => (
    <Popconfirm
      title="你确定要删除吗?"
      placement="topRight"
      okText="确认"
      cancelText="取消"
      onConfirm={() => {
        const deleteData = filterdata.filter(item => item.id !== id);
        setFilterData(deleteData);
      }}
    >
      <CloseOutlined
        onClick={event => {
          event.stopPropagation();
        }}
      />
    </Popconfirm>
  );

  const transformObject = (params) => {
    const o: any = [];
    for (const key in params) {
      if (key.startsWith("label-")) {
        const labelValue = params[key];
        const rulesKey = `rules-${key.slice(6)}`;
        const rulesValue = params[rulesKey];
        o.push({ label: labelValue, rules: rulesValue || [] });
      }
    }
    return o;
  }

  const generateCypherQuery = (params) => {
    let query = "MATCH p=(n)";

    const { rules, direction, sep, limit } = params
  
    // 边标签
    let labels = rules.map(rule => rule.label).join(" | ");

    // 添加边方向
    if (direction === "out") {
      query += `-[r:${labels} *..${sep}]-> `;
    } else if (direction === "in") {
      query += `<-[r:${labels} *..${sep}]- `;
    } else if (direction === "both") {
      query += `<-[r:${labels} *..${sep}]-> `;
    }
        
    // 添加属性过滤条件
    query += `(m)\nWHERE id(n) in [${expandNodeIds}] `;

    if (rules.length > 0) {
      rules.forEach((rule, index) => {
        rule.rules.forEach((subRule, subIndex) => {
          if (index !== 0 || subIndex !== 0) {
            query += " OR ";
          }
          if (subRule.operator === 'NC') {
            // 不包含
            query += `AND NOT r.${subRule.name} ${operatorMapping[subRule.operator]} "${subRule.value}"`;
          } else {
            query += `AND r.${subRule.name} ${operatorMapping[subRule.operator]} "${subRule.value}"`;
          }
        });
      });
    }
    
    query += "\nRETURN DISTINCT p LIMIT ";
    query += limit;
    
    return query;
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    const { direction, limit = 100, sep = 1,  ...configRules } = values
    const rules = transformObject(configRules)
    
    const params = {
      direction,
      limit,
      sep,
      rules
    }

    const resultCypher = generateCypherQuery(params)

    if (languageService) {
      languageService(resultCypher)
    }
    
  };

  const initFormValue = {
    direction: 'both',
    sep: 2,
    limit: 100
  }

  return (
    <Modal 
      title='扩散高级配置'
      visible={visible}
      onCancel={close}
      okText='确定'
      cancelText='取消'
      bodyStyle={{ padding: '24px 16px', background: '#FBFBFB' }}
      onOk={handleSubmit}>
        <div className='neighbors-attribute-filter-container' >
          <Form form={form} layout="vertical" initialValues={initFormValue}>
            {/* <Form.Item label='数据时间范围' name='dataRange' rules={[
              { type: 'array' as const, required: true, message: 'Please select time!' }
            ]}>
              <RangePicker />
            </Form.Item> */}
            <Form.Item label='边的方向' name='direction' rules={[{
              required: true,
              message: '请选择边的方向'
            }]}>
              <Radio.Group>
                <Radio value='both'>双向</Radio>
                <Radio value='out'>出边</Radio>
                <Radio value='in'>入边</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label='扩散度数' name='sep'>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label='自定义返回节点数量' name='limit'>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            {filterdata.map((item, index) => {
              return <RuleConfigPanel id={item.id} handleDelete={handleDelete} form={form} schemaList={schemaData} />;
            })}
            <Button
              block
              style={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6A6B71',
                height: 94,
                backgroundImage: 'linear-gradient(174deg, rgba(245,248,255,0.38) 11%, rgba(244,247,255,0.55) 96%)',
                border: 'none',
              }}
              onClick={() => {
                addPanel();
              }}
            >
              <img
                src="https://mdn.alipayobjects.com/huamei_xn3ctq/afts/img/A*fHVRTq8rqlMAAAAAAAAAAAAADo6BAQ/original"
                alt=""
              />
              <span>添加筛选组</span>
            </Button>
          </Form>
        </div>
    </Modal>
  );
};

export default AdvanceNeighborsQueryConfig
