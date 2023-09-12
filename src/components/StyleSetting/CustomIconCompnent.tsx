import { Popover, Radio, Tabs } from "antd";
import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import { IconGroups } from './Constant'
import CustomIcon from './CustomIcon';
import "./index.less";

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
        tabPosition='left'
        items={IconGroups.map((d) => {
          return {
            label: d.label,
            key: d.key,
            children: <div>
              <Radio.Group optionType="button" buttonStyle="solid" onChange={onChange}>
                {d.icons.map((icon: any) => {
                  return (
                    <Radio.Button
                      key={icon.key}
                      value={icon.key}
                      className="custom-ant-radio-wrapper"
                      style={{
                        border: 'none',
                        lineHeight: '25px',
                        padding: '0 1px',
                        width: 25,
                        height: 25,
                      }}
                    >
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
                    </Radio.Button>
                  )
                })}
              </Radio.Group>
            </div>
          };
        })}
      />
    </div>
  )
}

const CustomIconCompnent: React.FC<ColorInputProps> = ({ onChange, value, defaultValue, icon }) => {
  const [state, setState] = useImmer<{ color?: string }>({ color: defaultValue });
  const { color } = state;
  useEffect(() => {
    setState((draft) => {
      draft.color = value;
    });
  }, [value]);
  
  return (
    <div className='custom-icon-container'>
      <Popover
        trigger='click'
        overlayClassName='icon-input-popover-container'
        content={<IconSelectComponent onChange={onChange} />}
      >
        {/* <Radio.Button
          key={icon.key}
          value={icon.key}
          className="custom-ant-radio-wrapper"
          style={{
            border: 'none',
            lineHeight: '25px',
            padding: '0 1px',
            width: 25,
            height: 25,
          }}
        >
          <CustomIcon
            type={icon.value}
            style={{
              fontSize: 23,
              cursor: 'pointer',
            }}
          />
        </Radio.Button> */}
        <CustomIcon
            type={icon.value}
            style={{
              fontSize: 23,
              cursor: 'pointer',
            }}
          />
      </Popover>
    </div>
  );
};

export default CustomIconCompnent;
