import { EditOutlined } from '@ant-design/icons';
import { Popover, Tooltip, Radio, Tabs, Input } from 'antd';
import React, { useEffect } from 'react';
import { SketchPicker } from 'react-color';
import { useImmer } from 'use-immer';
import { IconGroups } from './Constant';
import CustomIcon from './CustomIcon';
import './index.less';

const advanceColors = ['#cb962a', '#23ad61', '#ff8075', '#07bce0'];

export interface ColorInputProps {
  value?: any;
  defaultValue?: string;
  onChange?: (e: any) => void;
  icon: any;
}

const IconSelectComponent = ({ onChange }) => {
  return (
    <div className="popover-icon-container">
      {/* <Input style={{ marginBottom: 8 }} /> */}
      <Tabs
        tabPosition="left"
        items={IconGroups.map(d => {
          return {
            label: d.label,
            key: d.key,
            children: (
              <div style={{ margin: '16px 0' }}>
                <Radio.Group onChange={onChange}>
                  {d.icons.map((icon: any) => {
                    return (
                      <Radio key={icon.key} value={icon.key} className="custom-ant-radio-wrapper">
                        <CustomIcon
                          type={icon.value}
                          style={{
                            fontSize: 23,
                            cursor: 'pointer',
                            position: 'absolute',
                            bottom: 2,
                            left: 1,
                          }}
                        />
                      </Radio>
                    );
                  })}
                </Radio.Group>
              </div>
            ),
          };
        })}
      />
    </div>
  );
};

const ColorInput: React.FC<ColorInputProps> = ({ onChange, value, defaultValue, icon }) => {
  const [state, setState] = useImmer<{ color?: string }>({ color: defaultValue });
  const { color } = state;
  useEffect(() => {
    setState(draft => {
      draft.color = value;
    });
  }, [value]);

  return (
    <>
      <Popover
        trigger="click"
        overlayClassName="color-input-popover"
        content={<IconSelectComponent onChange={onChange} />}
      >
        <CustomIcon
          type={icon.value}
          style={{
            fontSize: 23,
            cursor: 'pointer',
            position: 'relative',
            top: 4,
          }}
        />
      </Popover>
    </>
  );
};

export default ColorInput;
